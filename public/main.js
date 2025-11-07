/**
 * IBPS Test Platform - Main Frontend Logic
 * Integrates with Node.js + MongoDB Backend
 */

// Import API service (make sure api-service.js is loaded first in HTML)
const API = window.APIService;

/**************************** 
 * STATE MANAGEMENT
 ****************************/
const appState = {
  tests: [],
  attemptHistory: {},
  currentTest: null,
  currentAttemptId: null,
  isLoading: false
};

/**************************** 
 * DASHBOARD FUNCTIONALITY
 ****************************/
const dashboardEl = document.getElementById('dashboard');
const testContainerEl = document.getElementById('testContainer');
const resultsModalEl = document.getElementById('resultsModal');
const topBarTitleEl = document.querySelector('.test-title');

// Initialize app
async function initApp() {
  showLoading(true);
  
  // Check server health
  const health = await API.checkHealth();
  if (!health.success) {
    alert('Server is not responding. Please check your connection.');
    return;
  }
  
  // Load tests from backend
  await loadTests();
  
  // Load attempt history
  await loadAttemptHistory();
  
  // Render dashboard
  renderDashboard();
  
  showLoading(false);
}

async function loadTests() {
  appState.tests = await API.getAllTests();
  
  // If no tests exist, initialize with sample data
  if (appState.tests.length === 0) {
    console.log('No tests found, initializing sample data...');
    // Import tests-data.js data
    if (window.testsData && window.testsData.tests) {
      await API.initializeData(window.testsData.tests);
      appState.tests = await API.getAllTests();
    }
  }
}

async function loadAttemptHistory() {
  appState.attemptHistory = await API.getAttemptHistory();
}

function renderDashboard() {
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
  
  // Generate HTML for each subject
  const renderCards = (testList) => testList.map(test => {
    const hist = appState.attemptHistory[test.id] || null;
    const statsHtml = hist 
      ? `<div class="test-stats">Attempts: ${hist.attempts} | Best: ${hist.best}% | Last: ${hist.last}%</div>`
      : '';
    const btnLabel = hist ? 'Retake Test' : 'Take Test';
    
    return `
      <div class="test-card" data-test-id="${test.id}">
        <div class="test-card-header">
          <h3>${test.name}</h3>
          <div class="test-actions">
            <button class="btn-icon" onclick="openRenameModal('${test.id}')" title="Rename">
              ✏️
            </button>
            <button class="btn-icon" onclick="openDeleteModal('${test.id}')" title="Delete">
              🗑️
            </button>
          </div>
        </div>
        <div class="test-info">
          <span>⏱️ ${test.duration} minutes</span>
          <span>📝 ${test.questions.length} questions</span>
        </div>
        ${statsHtml}
        <button class="btn-primary" onclick="startTest('${test.id}')">
          ${btnLabel}
        </button>
      </div>
    `;
  }).join('');
  
  dashboardEl.innerHTML = `
    <div class="dashboard-header">
      <h1>📚 IBPS Test Dashboard</h1>
      <p>Select a test to begin your practice session</p>
    </div>
    
    <div class="subject-section">
      <h2>🔢 Quantitative Aptitude</h2>
      <div class="test-grid">
        ${renderCards(subjects['Quantitative Aptitude'])}
      </div>
    </div>
    
    <div class="subject-section">
      <h2>🧠 Reasoning Ability</h2>
      <div class="test-grid">
        ${renderCards(subjects['Reasoning Ability'])}
      </div>
    </div>
    
    <div class="subject-section">
      <h2>📖 English Language</h2>
      <div class="test-grid">
        ${renderCards(subjects['English Language'])}
      </div>
    </div>
  `;
  
  dashboardEl.style.display = 'block';
  testContainerEl.style.display = 'none';
  resultsModalEl.classList.remove('active');
}

/**************************** 
 * TEST ENGINE
 ****************************/
let questions = [];
const scoringRules = { correct: 1, wrong: -0.25, skipped: 0 };

const testState = {
  currentQuestion: 0,
  answers: {},
  markedForReview: {},
  visited: {},
  timeRemaining: 0,
  questionStartTime: 0,
  questionTimes: {},
  totalQuestions: 0,
  fontSize: 16,
  timerInterval: null,
  questionTimerInterval: null,
  isPaused: false,
  testStartTime: 0,
  isViewingSolution: false
};

async function startTest(testId, viewSolution = false) {
  showLoading(true);
  
  // Fetch test from backend
  const test = await API.getTestById(testId);
  
  if (!test) {
    alert('Test not found!');
    showLoading(false);
    return;
  }
  
  appState.currentTest = test;
  questions = JSON.parse(JSON.stringify(test.questions));
  
  // Reset state
  testState.currentQuestion = 0;
  testState.answers = {};
  testState.markedForReview = {};
  testState.visited = {};
  testState.timeRemaining = test.duration * 60;
  testState.questionStartTime = 0;
  testState.questionTimes = {};
  testState.totalQuestions = questions.length;
  testState.fontSize = 16;
  testState.isPaused = false;
  testState.testStartTime = Date.now();
  testState.isViewingSolution = viewSolution;
  
  // Update UI
  topBarTitleEl.textContent = test.name;
  dashboardEl.style.display = 'none';
  testContainerEl.style.display = 'flex';
  resultsModalEl.classList.remove('active');
  
  // Initialize test interface
  initTest();
  
  showLoading(false);
}

function initTest() {
  renderPalette();
  loadQuestion(0);
  startTimer();
  startQuestionTimer();
  attachEventListeners();
}

function renderPalette() {
  const paletteGrid = document.getElementById('paletteGrid');
  paletteGrid.innerHTML = '';
  
  for (let i = 0; i < testState.totalQuestions; i++) {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i + 1;
    btn.addEventListener('click', () => navigateToQuestion(i));
    paletteGrid.appendChild(btn);
  }
  
  updatePaletteStatus();
}

function loadQuestion(index) {
  if (index < 0 || index >= testState.totalQuestions) return;
  
  // Save time spent on current question
  if (testState.questionStartTime > 0 && !testState.isViewingSolution) {
    const spent = Date.now() - testState.questionStartTime;
    testState.questionTimes[testState.currentQuestion] = 
      (testState.questionTimes[testState.currentQuestion] || 0) + spent;
  }
  
  testState.currentQuestion = index;
  testState.visited[index] = true;
  testState.questionStartTime = Date.now();
  
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
    imageContainer.style.maxHeight = (q.instructionImageHeight || 200) + 'px';
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
    
    // Highlight selected answer
    if (testState.answers[index] === i) {
      optDiv.classList.add('selected');
    }
    
    // In solution view, highlight correct/wrong
    if (testState.isViewingSolution) {
      if (i === q.correctAnswer) {
        optDiv.classList.add('correct-answer');
      }
      if (testState.answers[index] === i && i !== q.correctAnswer) {
        optDiv.classList.add('wrong-answer');
      }
    }
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = i;
    radio.id = `opt${i}`;
    radio.disabled = testState.isViewingSolution;
    if (testState.answers[index] === i) radio.checked = true;
    
    const label = document.createElement('label');
    label.htmlFor = `opt${i}`;
    label.className = 'option-label';
    label.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
    
    optDiv.appendChild(radio);
    optDiv.appendChild(label);
    
    if (!testState.isViewingSolution) {
      optDiv.addEventListener('click', () => {
        radio.checked = true;
        testState.answers[index] = i;
        updateOptionSelection();
        updatePaletteStatus();
      });
    }
    
    optionsContainer.appendChild(optDiv);
  });
  
  // Show solution if in solution view
  if (testState.isViewingSolution && q.solution) {
    const solutionDiv = document.createElement('div');
    solutionDiv.className = 'solution-display';
    solutionDiv.innerHTML = `
      <h4>✅ Solution:</h4>
      <p>${q.solution}</p>
      ${q.solutionImage ? `<img src="${q.solutionImage}" alt="Solution" />` : ''}
    `;
    optionsContainer.appendChild(solutionDiv);
  }
  
  updatePaletteStatus();
  updateQuestionTime();
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

function navigateToQuestion(i) {
  loadQuestion(i);
}

function updatePaletteStatus() {
  const btns = document.querySelectorAll('.palette-btn');
  let answered = 0, notAnswered = 0, notVisited = 0, marked = 0, answeredMarked = 0;
  
  btns.forEach((btn, i) => {
    btn.classList.remove('current', 'answered', 'marked-review', 'answered-marked', 'not-answered');
    
    if (i === testState.currentQuestion) {
      btn.classList.add('current');
    }
    
    const hasAns = testState.answers.hasOwnProperty(i);
    const isMarked = testState.markedForReview[i];
    const isVisited = testState.visited[i];
    
    if (hasAns && isMarked) {
      btn.classList.add('answered-marked');
      answeredMarked++;
    } else if (hasAns) {
      btn.classList.add('answered');
      answered++;
    } else if (isMarked) {
      btn.classList.add('marked-review');
      marked++;
    } else if (isVisited) {
      btn.classList.add('not-answered');
      notAnswered++;
    } else {
      notVisited++;
    }
  });
  
  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('notAnsweredCount').textContent = notAnswered;
  document.getElementById('notVisitedCount').textContent = notVisited;
  document.getElementById('markedReviewCount').textContent = marked;
  document.getElementById('answeredMarkedCount').textContent = answeredMarked;
}

// Timer functions
function startTimer() {
  clearInterval(testState.timerInterval);
  
  if (testState.isViewingSolution) {
    document.getElementById('timerValue').textContent = '--:--';
    return;
  }
  
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
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startQuestionTimer() {
  clearInterval(testState.questionTimerInterval);
  testState.questionTimerInterval = setInterval(updateQuestionTime, 1000);
  updateQuestionTime();
}

function updateQuestionTime() {
  if (testState.isViewingSolution) {
    document.getElementById('questionTime').textContent = '--:--';
    return;
  }
  
  const base = testState.questionTimes[testState.currentQuestion] || 0;
  const add = testState.questionStartTime ? Date.now() - testState.questionStartTime : 0;
  const total = base + add;
  const m = Math.floor(total / 60000);
  const s = Math.floor((total % 60000) / 1000);
  document.getElementById('questionTime').textContent = 
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Button handlers
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
  const instructionsText = document.getElementById('instructionsText');
  const questionEn = document.getElementById('questionEn');
  const questionHi = document.getElementById('questionHi');
  
  if (instructionsText) instructionsText.style.fontSize = testState.fontSize + 'px';
  if (questionEn) questionEn.style.fontSize = testState.fontSize + 'px';
  if (questionHi) questionHi.style.fontSize = testState.fontSize + 'px';
}

function handlePause() {
  testState.isPaused = !testState.isPaused;
  document.getElementById('pauseTestBtn').textContent = 
    testState.isPaused ? 'Resume Test' : 'Pause Test';
}

function handleSubmit() {
  if (confirm('Are you sure you want to submit the test?')) {
    submitTest();
  }
}

// Submit test and save to backend
async function submitTest() {
  clearInterval(testState.timerInterval);
  clearInterval(testState.questionTimerInterval);
  
  // Save final question time
  if (testState.questionStartTime > 0) {
    const spent = Date.now() - testState.questionStartTime;
    testState.questionTimes[testState.currentQuestion] = 
      (testState.questionTimes[testState.currentQuestion] || 0) + spent;
  }
  
  // Calculate results
  let correct = 0, wrong = 0, skipped = 0, totalScore = 0;
  const resultsRows = [];
  
  questions.forEach((q, i) => {
    const ua = testState.answers[i];
    const ca = q.correctAnswer;
    const qTime = testState.questionTimes[i] || 0;
    
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
      time: formatTime(qTime),
      marks: marks.toFixed(2)
    });
  });
  
  const percent = ((totalScore / questions.length) * 100).toFixed(2);
  const totalTime = appState.currentTest.duration * 60 - testState.timeRemaining;
  
  // Save result to backend
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
  
  showLoading(true);
  const response = await API.saveResult(resultData);
  showLoading(false);
  
  if (response.success) {
    appState.currentAttemptId = response.result.attemptId;
    
    // Reload attempt history
    await loadAttemptHistory();
    
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
    alert('Error saving results: ' + response.message);
  }
}

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function displayResults(r) {
  testContainerEl.style.display = 'none';
  
  document.getElementById('scoreValue').textContent = `${r.totalScore}/${r.total}`;
  document.getElementById('scorePercentage').textContent = `${r.percentage}%`;
  document.getElementById('statTotal').textContent = r.total;
  document.getElementById('statCorrect').textContent = r.correct;
  document.getElementById('statWrong').textContent = r.wrong;
  document.getElementById('statSkipped').textContent = r.skipped;
  document.getElementById('statTime').textContent = r.totalTime;
  
  // Populate results table
  const tbody = document.getElementById('resultsTableBody');
  tbody.innerHTML = '';
  
  r.resultsRows.forEach((row, idx) => {
    const tr = document.createElement('tr');
    const statusClass = 
      row.status === 'Correct' ? 'status-correct' :
      row.status === 'Incorrect' ? 'status-incorrect' : 'status-skipped';
    
    const question = questions[idx];
    let solutionHtml = '<div class="solution-cell">';
    if (question.solution) {
      solutionHtml += `<p class="solution-text">${question.solution}</p>`;
    }
    if (question.solutionImage) {
      solutionHtml += `<img src="${question.solutionImage}" class="solution-image" 
        onclick="openImageModal('${question.solutionImage}')" />`;
    }
    if (!question.solution && !question.solutionImage) {
      solutionHtml += '-';
    }
    solutionHtml += '</div>';
    
    tr.innerHTML = `
      <td>${row.questionNo}</td>
      <td>${row.userAnswer}</td>
      <td>${row.correctAnswer}</td>
      <td class="${statusClass}">${row.status}</td>
      <td>${row.time}</td>
      <td>${row.marks}</td>
      <td>${solutionHtml}</td>
    `;
    tbody.appendChild(tr);
  });
  
  resultsModalEl.classList.add('active');
}

// Results page button handlers
async function handleViewSolution() {
  resultsModalEl.classList.remove('active');
  await startTest(appState.currentTest.id, true);
}

function handleGoHome() {
  renderDashboard();
}

async function handleRetakeTest() {
  resultsModalEl.classList.remove('active');
  await startTest(appState.currentTest.id, false);
}

// Modal handlers
async function openRenameModal(testId) {
  const test = await API.getTestById(testId);
  if (!test) return;
  
  const newName = prompt('Enter new name for test:', test.name);
  if (newName && newName.trim() !== '') {
    showLoading(true);
    test.name = newName.trim();
    await API.updateTest(testId, test);
    await loadTests();
    renderDashboard();
    showLoading(false);
  }
}

async function openDeleteModal(testId) {
  if (confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
    showLoading(true);
    await API.deleteTest(testId);
    await loadTests();
    await loadAttemptHistory();
    renderDashboard();
    showLoading(false);
  }
}

function openImageModal(imageSrc) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content modal-image">
      <img src="${imageSrc}" alt="Solution" />
      <button class="btn-close" onclick="this.parentElement.parentElement.remove()">✕</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// Event listeners
function attachEventListeners() {
  // Action buttons
  document.getElementById('saveNextBtn')?.addEventListener('click', handleSaveNext);
  document.getElementById('markReviewBtn')?.addEventListener('click', handleMarkReview);
  document.getElementById('clearBtn')?.addEventListener('click', handleClearResponse);
  document.getElementById('fontIncBtn')?.addEventListener('click', handleFontIncrease);
  document.getElementById('fontDecBtn')?.addEventListener('click', handleFontDecrease);
  document.getElementById('pauseTestBtn')?.addEventListener('click', handlePause);
  document.getElementById('submitTestBtn')?.addEventListener('click', handleSubmit);
  
  // Results buttons
  document.getElementById('viewSolutionBtn')?.addEventListener('click', handleViewSolution);
  document.getElementById('goHomeBtn')?.addEventListener('click', handleGoHome);
  document.getElementById('retakeBtn')?.addEventListener('click', handleRetakeTest);
}

// Loading indicator
function showLoading(show) {
  let loader = document.getElementById('loadingOverlay');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'loadingOverlay';
    loader.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
    document.body.appendChild(loader);
  }
  loader.style.display = show ? 'flex' : 'none';
}

// Make functions globally available
window.startTest = startTest;
window.openRenameModal = openRenameModal;
window.openDeleteModal = openDeleteModal;
window.openImageModal = openImageModal;

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
