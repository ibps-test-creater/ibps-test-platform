// ✅ CORRECTED main.js - Updated to work with backend API
// This version connects to your Node.js + MongoDB backend

/**
 * IBPS Test Platform - Frontend with Backend Integration
 * Communicates with server.js via REST API
 */

// ==================== STATE MANAGEMENT ====================
const appState = {
  tests: [],
  attemptHistory: {},
  currentTest: null,
  isLoading: false
};

// ==================== API CALLS ====================

// Fetch all tests from backend
async function fetchTests() {
  try {
    console.log('Fetching tests from backend...');
    const response = await fetch('/api/tests');
    const data = await response.json();
    
    if (data.success) {
      appState.tests = data.tests;
      console.log('Tests loaded:', appState.tests.length);
      return appState.tests;
    } else {
      console.error('Failed to fetch tests:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

// Fetch attempt history
async function fetchAttemptHistory() {
  try {
    console.log('Fetching attempt history...');
    const response = await fetch('/api/results/history');
    const data = await response.json();
    
    if (data.success) {
      appState.attemptHistory = data.history;
      console.log('Attempt history loaded');
      return appState.attemptHistory;
    }
  } catch (error) {
    console.error('Error fetching history:', error);
  }
  return {};
}

// Save test result to backend
async function saveTestResult(resultData) {
  try {
    console.log('Saving result to backend...');
    const response = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Result saved successfully');
      return data.result;
    } else {
      console.error('Failed to save result:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error saving result:', error);
    return null;
  }
}

// ==================== INITIALIZATION ====================

async function initializeApp() {
  console.log('Initializing app...');
  
  try {
    // Show loading
    const dashboard = document.getElementById('dashboard');
    dashboard.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading tests...</p>
      </div>
    `;
    
    // Fetch tests from backend
    const tests = await fetchTests();
    
    // If no tests, try to initialize with sample data
    if (tests.length === 0) {
      console.log('No tests found, initializing sample data...');
      
      // Use tests-data if available
      if (window.testsData && window.testsData.tests) {
        try {
          const response = await fetch('/api/init-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tests: window.testsData.tests })
          });
          const result = await response.json();
          console.log('Init result:', result.message);
          
          // Fetch again
          await fetchTests();
        } catch (error) {
          console.error('Error initializing data:', error);
        }
      }
    }
    
    // Fetch attempt history
    await fetchAttemptHistory();
    
    // Render dashboard
    renderDashboard();
    
  } catch (error) {
    console.error('Initialization error:', error);
    document.getElementById('dashboard').innerHTML = `
      <div class="error-container">
        <h2>Error Loading Tests</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// ==================== DASHBOARD ====================

function renderDashboard() {
  console.log('Rendering dashboard with', appState.tests.length, 'tests');
  
  const dashboard = document.getElementById('dashboard');
  
  // Group tests by subject
  const subjects = {
    'Quantitative Aptitude': [],
    'Reasoning Ability': [],
    'English Language': []
  };
  
  appState.tests.forEach(test => {
    const subject = test.subject || 'Quantitative Aptitude';
    if (subjects[subject]) {
      subjects[subject].push(test);
    }
  });
  
  // Create HTML
  let html = `
    <div class="dashboard-header">
      <h1>📚 IBPS Test Dashboard</h1>
      <p>Select a test to begin</p>
    </div>
  `;
  
  // Add each subject section
  Object.keys(subjects).forEach(subject => {
    const tests = subjects[subject];
    if (tests.length > 0) {
      html += `
        <div class="subject-section">
          <h2>${subject}</h2>
          <div class="test-grid">
            ${tests.map(test => createTestCard(test)).join('')}
          </div>
        </div>
      `;
    }
  });
  
  dashboard.innerHTML = html;
  
  // Show test container
  document.getElementById('testContainer').style.display = 'none';
  dashboard.style.display = 'block';
}

function createTestCard(test) {
  const hist = appState.attemptHistory[test.id];
  const statsHtml = hist 
    ? `<div class="test-stats">Attempts: ${hist.attempts} | Best: ${hist.best}% | Last: ${hist.last}%</div>`
    : '';
  const btnLabel = hist ? 'Retake Test' : 'Take Test';
  
  return `
    <div class="test-card">
      <h3>${test.name}</h3>
      <div class="test-info">
        <span>⏱️ ${test.duration} min</span>
        <span>📝 ${test.questions.length} Q</span>
      </div>
      ${statsHtml}
      <button class="btn-primary" onclick="startTest('${test.id}')">
        ${btnLabel}
      </button>
    </div>
  `;
}

// ==================== TEST ENGINE ====================

let questions = [];
const scoringRules = { correct: 1, wrong: -0.25, skipped: 0 };

const testState = {
  currentQuestion: 0,
  answers: {},
  markedForReview: {},
  timeRemaining: 0,
  questionStartTime: 0,
  questionTimes: {},
  totalQuestions: 0,
  fontSize: 16,
  timerInterval: null,
  isPaused: false,
  testStartTime: 0
};

async function startTest(testId) {
  console.log('Starting test:', testId);
  
  // Find test
  const test = appState.tests.find(t => t.id === testId);
  if (!test) {
    console.error('Test not found:', testId);
    return;
  }
  
  appState.currentTest = test;
  questions = JSON.parse(JSON.stringify(test.questions));
  
  // Reset state
  testState.currentQuestion = 0;
  testState.answers = {};
  testState.markedForReview = {};
  testState.timeRemaining = test.duration * 60;
  testState.questionStartTime = 0;
  testState.questionTimes = {};
  testState.totalQuestions = questions.length;
  testState.fontSize = 16;
  testState.isPaused = false;
  testState.testStartTime = Date.now();
  
  // Update UI
  document.querySelector('.test-title').textContent = test.name;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('testContainer').style.display = 'flex';
  
  // Initialize
  initTest();
}

function initTest() {
  renderPalette();
  loadQuestion(0);
  startTimer();
  attachEventListeners();
}

function renderPalette() {
  const paletteGrid = document.getElementById('paletteGrid');
  paletteGrid.innerHTML = '';
  
  for (let i = 0; i < testState.totalQuestions; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i + 1;
    btn.onclick = () => loadQuestion(i);
    paletteGrid.appendChild(btn);
  }
  
  updatePaletteStatus();
}

function loadQuestion(index) {
  if (index < 0 || index >= testState.totalQuestions) return;
  
  testState.currentQuestion = index;
  const q = questions[index];
  
  // Update question number
  document.getElementById('currentQuestionNum').textContent = index + 1;
  
  // Update instructions
  const instructionsText = document.getElementById('instructionsText');
  instructionsText.textContent = q.instructions || '';
  instructionsText.style.fontSize = testState.fontSize + 'px';
  
  // Handle instruction image
  const imageContainer = document.getElementById('instructionImageContainer');
  const instructionImage = document.getElementById('instructionImage');
  if (q.instructionImage) {
    instructionImage.src = q.instructionImage;
    imageContainer.style.display = 'block';
  } else {
    imageContainer.style.display = 'none';
  }
  
  // Update question text
  const questionEn = document.getElementById('questionEn');
  const questionHi = document.getElementById('questionHi');
  questionEn.textContent = q.questionEn || '';
  questionHi.textContent = q.questionHi || '';
  questionEn.style.fontSize = testState.fontSize + 'px';
  questionHi.style.fontSize = testState.fontSize + 'px';
  
  // Render options
  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = '';
  
  q.options.forEach((opt, i) => {
    const optDiv = document.createElement('div');
    optDiv.className = 'option-item';
    
    if (testState.answers[index] === i) {
      optDiv.classList.add('selected');
    }
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = i;
    radio.id = 'opt' + i;
    if (testState.answers[index] === i) radio.checked = true;
    
    const label = document.createElement('label');
    label.htmlFor = 'opt' + i;
    label.className = 'option-label';
    label.textContent = String.fromCharCode(65 + i) + '. ' + opt;
    
    optDiv.appendChild(radio);
    optDiv.appendChild(label);
    
    optDiv.addEventListener('click', () => {
      radio.checked = true;
      testState.answers[index] = i;
      updateOptionSelection();
      updatePaletteStatus();
    });
    
    optionsContainer.appendChild(optDiv);
  });
  
  updatePaletteStatus();
}

function updateOptionSelection() {
  document.querySelectorAll('.option-item').forEach((div, i) => {
    if (testState.answers[testState.currentQuestion] === i) {
      div.classList.add('selected');
    } else {
      div.classList.remove('selected');
    }
  });
}

function updatePaletteStatus() {
  const btns = document.querySelectorAll('.palette-btn');
  let answered = 0, notAnswered = 0, marked = 0;
  
  btns.forEach((btn, i) => {
    btn.classList.remove('current', 'answered', 'marked-review', 'not-answered');
    
    if (i === testState.currentQuestion) {
      btn.classList.add('current');
    }
    
    const hasAns = testState.answers.hasOwnProperty(i);
    const isMarked = testState.markedForReview[i];
    
    if (hasAns && isMarked) {
      btn.classList.add('answered-marked');
    } else if (hasAns) {
      btn.classList.add('answered');
      answered++;
    } else if (isMarked) {
      btn.classList.add('marked-review');
      marked++;
    } else {
      btn.classList.add('not-answered');
      notAnswered++;
    }
  });
  
  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('notAnsweredCount').textContent = notAnswered;
  document.getElementById('markedReviewCount').textContent = marked;
}

// ==================== TIMER ====================

function startTimer() {
  clearInterval(testState.timerInterval);
  
  testState.timerInterval = setInterval(() => {
    if (!testState.isPaused && testState.timeRemaining > 0) {
      testState.timeRemaining--;
      updateTimerDisplay();
      
      if (testState.timeRemaining === 0) {
        submitTest();
      }
    }
  }, 1000);
  
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const m = Math.floor(testState.timeRemaining / 60);
  const s = testState.timeRemaining % 60;
  document.getElementById('timerValue').textContent = 
    String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ==================== BUTTON HANDLERS ====================

function handleSaveNext() {
  if (testState.currentQuestion < testState.totalQuestions - 1) {
    loadQuestion(testState.currentQuestion + 1);
  }
}

function handleMarkReview() {
  testState.markedForReview[testState.currentQuestion] = true;
  updatePaletteStatus();
  if (testState.currentQuestion < testState.totalQuestions - 1) {
    loadQuestion(testState.currentQuestion + 1);
  }
}

function handleClearResponse() {
  delete testState.answers[testState.currentQuestion];
  updateOptionSelection();
  updatePaletteStatus();
}

function handleFontIncrease() {
  if (testState.fontSize < 24) {
    testState.fontSize += 2;
    applyFontSize();
  }
}

function handleFontDecrease() {
  if (testState.fontSize > 12) {
    testState.fontSize -= 2;
    applyFontSize();
  }
}

function applyFontSize() {
  document.getElementById('instructionsText').style.fontSize = testState.fontSize + 'px';
  document.getElementById('questionEn').style.fontSize = testState.fontSize + 'px';
  document.getElementById('questionHi').style.fontSize = testState.fontSize + 'px';
}

function handlePause() {
  testState.isPaused = !testState.isPaused;
  document.getElementById('pauseTestBtn').textContent = testState.isPaused ? 'Resume Test' : 'Pause Test';
}

function handleSubmit() {
  if (confirm('Submit test?')) {
    submitTest();
  }
}

// ==================== SUBMIT & RESULTS ====================

async function submitTest() {
  clearInterval(testState.timerInterval);
  
  console.log('Submitting test...');
  
  // Calculate results
  let correct = 0, wrong = 0, skipped = 0, totalScore = 0;
  const resultsRows = [];
  
  questions.forEach((q, i) => {
    const ua = testState.answers[i];
    const ca = q.correctAnswer;
    
    let status = 'Skipped';
    let marks = 0;
    
    if (ua !== undefined) {
      if (ua === ca) {
        status = 'Correct';
        correct++;
        marks = scoringRules.correct;
        totalScore += scoringRules.correct;
      } else {
        status = 'Incorrect';
        wrong++;
        marks = scoringRules.wrong;
        totalScore += scoringRules.wrong;
      }
    } else {
      skipped++;
    }
    
    resultsRows.push({
      questionNo: i + 1,
      userAnswer: ua !== undefined ? String.fromCharCode(65 + ua) : '-',
      correctAnswer: String.fromCharCode(65 + ca),
      status,
      marks: marks.toFixed(2)
    });
  });
  
  const percent = ((totalScore / questions.length) * 100).toFixed(2);
  const totalTime = appState.currentTest.duration * 60 - testState.timeRemaining;
  
  // Save to backend
  const resultData = {
    testId: appState.currentTest.id,
    testName: appState.currentTest.name,
    totalQuestions: questions.length,
    correct,
    wrong,
    skipped,
    totalScore: parseFloat(totalScore.toFixed(2)),
    percentage: parseFloat(percent),
    totalTime: formatTime(totalTime * 1000),
    answers: testState.answers,
    questionTimes: testState.questionTimes,
    resultsData: resultsRows
  };
  
  const result = await saveTestResult(resultData);
  
  if (result) {
    // Reload attempt history
    await fetchAttemptHistory();
    
    // Display results
    displayResults({
      totalScore: totalScore.toFixed(2),
      percentage: percent,
      total: questions.length,
      correct,
      wrong,
      skipped,
      totalTime: formatTime(totalTime * 1000),
      resultsRows
    });
  } else {
    alert('Error saving results!');
  }
}

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function displayResults(r) {
  document.getElementById('testContainer').style.display = 'none';
  
  document.getElementById('scoreValue').textContent = r.totalScore + '/' + r.total;
  document.getElementById('scorePercentage').textContent = r.percentage + '%';
  document.getElementById('statTotal').textContent = r.total;
  document.getElementById('statCorrect').textContent = r.correct;
  document.getElementById('statWrong').textContent = r.wrong;
  document.getElementById('statSkipped').textContent = r.skipped;
  document.getElementById('statTime').textContent = r.totalTime;
  
  // Populate table
  const tbody = document.getElementById('resultsTableBody');
  tbody.innerHTML = r.resultsRows.map(row => `
    <tr>
      <td>${row.questionNo}</td>
      <td>${row.userAnswer}</td>
      <td>${row.correctAnswer}</td>
      <td class="${row.status === 'Correct' ? 'status-correct' : row.status === 'Incorrect' ? 'status-incorrect' : 'status-skipped'}">
        ${row.status}
      </td>
      <td>${row.marks}</td>
    </tr>
  `).join('');
  
  document.getElementById('resultsModal').classList.add('active');
}

// ==================== MODAL HANDLERS ====================

function handleRetake() {
  document.getElementById('resultsModal').classList.remove('active');
  startTest(appState.currentTest.id);
}

function handleGoHome() {
  document.getElementById('resultsModal').classList.remove('active');
  renderDashboard();
}

// ==================== EVENT LISTENERS ====================

function attachEventListeners() {
  document.getElementById('saveNextBtn')?.addEventListener('click', handleSaveNext);
  document.getElementById('markReviewBtn')?.addEventListener('click', handleMarkReview);
  document.getElementById('clearBtn')?.addEventListener('click', handleClearResponse);
  document.getElementById('fontIncBtn')?.addEventListener('click', handleFontIncrease);
  document.getElementById('fontDecBtn')?.addEventListener('click', handleFontDecrease);
  document.getElementById('pauseTestBtn')?.addEventListener('click', handlePause);
  document.getElementById('submitTestBtn')?.addEventListener('click', handleSubmit);
  
  document.getElementById('retakeBtn')?.addEventListener('click', handleRetake);
  document.getElementById('goHomeBtn')?.addEventListener('click', handleGoHome);
}

// ==================== INIT ====================

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

// Make functions available globally
window.startTest = startTest;

