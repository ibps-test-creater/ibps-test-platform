// ✅ IBPS Test Platform - Main Application Logic
// This file contains all frontend logic for dashboard, test interface, results, and solutions

// ==================== GLOBAL STATE ====================
let appState = {
  currentView: 'dashboard',
  currentTest: null,
  currentQuestionIndex: 0,
  testAnswers: {},
  questionTimes: {},
  questionStartTime: null,
  markedForReview: {},
  testStartTime: null,
  testPaused: false,
  attemptHistory: {},
  currentAttemptId: null,
  timerInterval: null,
  currentFontSize: 16
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App loaded - Initializing...');
  
  try {
    if (!window.StorageService) {
      console.warn('StorageService not loaded, using sample data');
    }
    
    await initializeApp();
    renderDashboard();
    setupEventListeners();
    console.log('✅ App initialized successfully');
  } catch (error) {
    console.error('Error during initialization:', error);
  }
});

async function initializeApp() {
  try {
    console.log('📡 Loading from StorageService...');
    
    if (window.StorageService) {
      const history = await StorageService.getAttemptHistory();
      appState.attemptHistory = history || {};
      console.log('✅ Attempt history loaded');
    } else {
      appState.attemptHistory = {};
    }
  } catch (error) {
    console.error('Error initializing:', error);
    appState.attemptHistory = {};
  }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  document.querySelectorAll('.create-column-test-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showTestMaker(e.target.dataset.subject);
    });
  });

  const fontDecBtn = document.getElementById('fontDecreaseBtn');
  const fontIncBtn = document.getElementById('fontIncreaseBtn');
  if (fontDecBtn) fontDecBtn.addEventListener('click', decreaseFont);
  if (fontIncBtn) fontIncBtn.addEventListener('click', increaseFont);

  const markReviewBtn = document.getElementById('markReviewBtn');
  if (markReviewBtn) markReviewBtn.addEventListener('click', markForReview);

  const clearBtn = document.getElementById('clearResponseBtn');
  if (clearBtn) clearBtn.addEventListener('click', clearResponse);

  const saveNextBtn = document.getElementById('saveNextBtn');
  if (saveNextBtn) saveNextBtn.addEventListener('click', saveAndNext);

  const pauseBtn = document.getElementById('pauseTestBtn');
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTest);

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.addEventListener('click', submitTest);

  const addQuestionBtn = document.getElementById('addQuestionBtn');
  if (addQuestionBtn) addQuestionBtn.addEventListener('click', addQuestion);

  const saveTestBtn = document.getElementById('saveTestBtn');
  if (saveTestBtn) saveTestBtn.addEventListener('click', saveTest);

  const cancelMakerBtn = document.getElementById('cancelMakerBtn');
  if (cancelMakerBtn) cancelMakerBtn.addEventListener('click', cancelTestMaker);

  const goHomeBtn = document.getElementById('goHomeBtn');
  if (goHomeBtn) goHomeBtn.addEventListener('click', goHome);

  const retakeBtn = document.getElementById('retakeBtn');
  if (retakeBtn) retakeBtn.addEventListener('click', retakeTest);

  const viewSolutionsBtn = document.getElementById('viewSolutionsBtn');
  if (viewSolutionsBtn) viewSolutionsBtn.addEventListener('click', viewSolutions);

  const solutionPrevBtn = document.getElementById('solutionPrevBtn');
  const solutionNextBtn = document.getElementById('solutionNextBtn');
  const solutionHomeBtn = document.getElementById('solutionHomeBtn');

  if (solutionPrevBtn) solutionPrevBtn.addEventListener('click', previousSolution);
  if (solutionNextBtn) solutionNextBtn.addEventListener('click', nextSolution);
  if (solutionHomeBtn) solutionHomeBtn.addEventListener('click', goHome);
}

// ==================== DASHBOARD ====================
async function renderDashboard() {
  const dashboardEl = document.getElementById('dashboard');
  if (!dashboardEl) return;

  try {
    // Hide all other views
    document.getElementById('testMaker').style.display = 'none';
    document.getElementById('testContainer').style.display = 'none';
    document.getElementById('solutionView').style.display = 'none';
    document.getElementById('resultsModal').style.display = 'none';
    dashboardEl.style.display = 'block';

    // Load tests from backend API, or fallback to local sample data
    let tests = [];
    if (window.StorageService) {
      try {
        tests = await StorageService.getAllTests();
      } catch (err) {
        console.warn("API offline, using sample data.");
        tests = [];
      }
    }
    if (!tests || tests.length === 0) {
      if (typeof window.default !== 'undefined' && window.default.tests) {
        tests = window.default.tests;
        console.log('Using sample tests:', tests.length);
      }
    }

    // Render test columns
    const subjects = {
      "Quantitative Aptitude": [],
      "Reasoning Ability": [],
      "English Language": []
    };
    tests.forEach(test => {
      const subject = test.subject || "Quantitative Aptitude";
      if (!subjects[subject]) subjects[subject] = [];
      subjects[subject].push(test);
    });
    const columnMap = {
      "Quantitative Aptitude": "qaContent",
      "Reasoning Ability": "reasoningContent",
      "English Language": "englishContent"
    };
    Object.keys(columnMap).forEach(subject => {
      const contentEl = document.getElementById(columnMap[subject]);
      if (!contentEl) return;
      contentEl.innerHTML = '';
      const subjectTests = subjects[subject] || [];
      subjectTests.forEach(test => {
        const attemptStats = appState.attemptHistory[test.id] || { attempts: 0, best: 0, last: 0 };
        const testCard = document.createElement('div');
        testCard.className = 'test-card';
        testCard.innerHTML = `
          <h3>${test.name}</h3>
          <div class="test-meta"><span>⏱️ ${test.duration} min</span>
          <span>📝 ${test.questions ? test.questions.length : 0} Q</span></div>
          ${attemptStats.attempts > 0 ? `<div class="attempt-stats">
              <small>Attempts: ${attemptStats.attempts}</small>
              <small>Best: ${attemptStats.best.toFixed(1)}%</small>
              <small>Last: ${attemptStats.last.toFixed(1)}%</small>
            </div>` : ""}
          <button class="take-test-btn" data-test-id="${test.id}">
            ${attemptStats.attempts > 0 ? 'Retake Test' : 'Take Test'}
          </button>
        `;
        testCard.querySelector('.take-test-btn').addEventListener('click', () => startTest(test.id));
        contentEl.appendChild(testCard);
      });
    });
  } catch (error) {
    console.error('Error rendering dashboard:', error);
  }
}


// ==================== TEST MAKER ====================
function showTestMaker(subject) {
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('testMaker').style.display = 'block';
  appState.currentView = 'testMaker';

  const subjectInput = document.getElementById('testSubject');
  if (subjectInput) subjectInput.value = subject;

  document.getElementById('testId').value = '';
  document.getElementById('testName').value = '';
  document.getElementById('testDuration').value = '30';
  document.getElementById('questionsContainer').innerHTML = '';
  
  addQuestion();
}

function addQuestion() {
  const container = document.getElementById('questionsContainer');
  const questionCount = container ? container.children.length : 0;
  
  const questionEl = document.createElement('div');
  questionEl.className = 'question-item';
  questionEl.id = `question-${questionCount}`;
  
  questionEl.innerHTML = `
    <div class="question-form">
      <div class="form-group">
        <label>Instructions</label>
        <textarea id="question-${questionCount}-instructions" class="form-control" placeholder="Enter question instructions"></textarea>
      </div>
      
      <div class="form-group">
        <label>Question (English)</label>
        <textarea id="question-${questionCount}-en" class="form-control" placeholder="Enter question in English"></textarea>
      </div>
      
      <div class="form-group">
        <label>Question (Hindi)</label>
        <textarea id="question-${questionCount}-hi" class="form-control" placeholder="Enter question in Hindi"></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Option A</label>
          <input type="text" id="question-${questionCount}-opt-0" class="form-control" placeholder="Option A">
        </div>
        <div class="form-group">
          <label>Option B</label>
          <input type="text" id="question-${questionCount}-opt-1" class="form-control" placeholder="Option B">
        </div>
        <div class="form-group">
          <label>Option C</label>
          <input type="text" id="question-${questionCount}-opt-2" class="form-control" placeholder="Option C">
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Option D</label>
          <input type="text" id="question-${questionCount}-opt-3" class="form-control" placeholder="Option D">
        </div>
        <div class="form-group">
          <label>Option E</label>
          <input type="text" id="question-${questionCount}-opt-4" class="form-control" placeholder="Option E">
        </div>
        <div class="form-group">
          <label>Correct Answer</label>
          <select id="question-${questionCount}-correct" class="form-control">
            <option value="0">A</option>
            <option value="1">B</option>
            <option value="2">C</option>
            <option value="3">D</option>
            <option value="4">E</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Solution</label>
        <textarea id="question-${questionCount}-solution" class="form-control" placeholder="Enter solution"></textarea>
      </div>
      
      <button type="button" class="btn-remove" onclick="removeQuestion(${questionCount})">Remove Question</button>
    </div>
  `;
  
  if (container) container.appendChild(questionEl);
}

function removeQuestion(index) {
  const questionEl = document.getElementById(`question-${index}`);
  if (questionEl) questionEl.remove();
}

function cancelTestMaker() {
  document.getElementById('testMaker').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  appState.currentView = 'dashboard';
}

async function saveTest() {
  try {
    const testId = document.getElementById('testId').value.trim();
    const testName = document.getElementById('testName').value.trim();
    const subject = document.getElementById('testSubject').value.trim();
    const duration = parseInt(document.getElementById('testDuration').value);

    if (!testId || !testName || !subject || !duration) {
      alert('Please fill all required fields');
      return;
    }

    const questionElements = document.querySelectorAll('.question-item');
    const questions = [];
    questionElements.forEach((el, index) => {
      const options = [];
      for (let i = 0; i < 5; i++) {
        const optInput = document.getElementById(`question-${index}-opt-${i}`);
        options.push(optInput ? optInput.value : '');
      }
      questions.push({
        id: index + 1,
        instructions: document.getElementById(`question-${index}-instructions`)?.value || '',
        instructionImage: '',
        questionEn: document.getElementById(`question-${index}-en`)?.value || '',
        questionHi: document.getElementById(`question-${index}-hi`)?.value || '',
        options,
        correctAnswer: parseInt(document.getElementById(`question-${index}-correct`)?.value || 0),
        solution: document.getElementById(`question-${index}-solution`)?.value || '',
        solutionImage: ''
      });
    });

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const testData = {
      id: testId,
      name: testName,
      subject: subject,
      duration: duration,
      questions: questions
    };

    if (window.StorageService) {
      const result = await StorageService.saveTest(testData);
      if (result) {
        alert('✅ Test saved successfully!');
        cancelTestMaker();
        await renderDashboard();
      } else {
        alert('❌ Error saving test');
      }
    } else {
      alert('Storage service not available');
    }
  } catch (error) {
    console.error('Error saving test:', error);
    alert('Error saving test: ' + error.message);
  }
}

// ==================== TEST INTERFACE ====================
async function startTest(testId) {
  try {
    console.log(`🎯 Starting test: ${testId}`);

    let test = null;
    
    if (window.StorageService) {
      test = await StorageService.getTestById(testId);
    }

    if (!test) {
      console.warn('Test not found in backend, searching in sample data');
      if (typeof default !== 'undefined' && default.tests) {
        test = default.tests.find(t => t.id === testId);
      }
    }
    
    if (!test) {
      alert('Test not found');
      return;
    }

    appState.currentTest = test;
    appState.currentQuestionIndex = 0;
    appState.testAnswers = {};
    appState.questionTimes = {};
    appState.markedForReview = {};
    appState.testStartTime = Date.now();
    appState.questionStartTime = Date.now();

    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('testContainer').style.display = 'flex';
    document.getElementById('resultsModal').style.display = 'none';
    appState.currentView = 'testInterface';

    const titleEl = document.getElementById('testTitle');
    if (titleEl) titleEl.textContent = test.name;

    startTimer(test.duration * 60);
    renderQuestion(0);

  } catch (error) {
    console.error('Error starting test:', error);
    alert('Error loading test: ' + error.message);
  }
}

function renderQuestion(index) {
  if (!appState.currentTest) return;

  const questions = appState.currentTest.questions;
  if (!questions || !questions[index]) return;

  const question = questions[index];

  const qNumEl = document.getElementById('currentQuestionNum');
  if (qNumEl) qNumEl.textContent = index + 1;

  const instEl = document.getElementById('instructionsText');
  if (instEl) instEl.textContent = question.instructions;

  const qEnEl = document.getElementById('questionEn');
  const qHiEl = document.getElementById('questionHi');
  if (qEnEl) qEnEl.textContent = question.questionEn;
  if (qHiEl) qHiEl.textContent = question.questionHi;

  const optionsContainer = document.getElementById('optionsContainer');
  if (optionsContainer) {
    optionsContainer.innerHTML = '';

    question.options.forEach((option, idx) => {
      const label = String.fromCharCode(65 + idx);
      const optionEl = document.createElement('label');
      optionEl.className = 'option-item';
      
      const isChecked = appState.testAnswers[index] === idx;
      
      optionEl.innerHTML = `
        <input type="radio" name="answer" value="${idx}" ${isChecked ? 'checked' : ''}>
        <span class="option-label">${label}. ${option}</span>
      `;

      optionEl.addEventListener('change', () => {
        appState.testAnswers[index] = idx;
        updateQuestionPalette(index);
      });

      optionsContainer.appendChild(optionEl);
    });
  }

  updateQuestionPalette(index);
  appState.questionStartTime = Date.now();
}

function markForReview() {
  const index = appState.currentQuestionIndex;
  appState.markedForReview[index] = !appState.markedForReview[index];
  updateQuestionPalette(index);
  console.log('Marked for review:', index);
}

function clearResponse() {
  const index = appState.currentQuestionIndex;
  delete appState.testAnswers[index];
  
  const inputs = document.querySelectorAll('input[name="answer"]');
  inputs.forEach(el => el.checked = false);
  
  updateQuestionPalette(index);
}

function saveAndNext() {
  const index = appState.currentQuestionIndex;
  
  if (appState.questionStartTime) {
    const timeSpent = Date.now() - appState.questionStartTime;
    appState.questionTimes[index] = timeSpent;
  }

  if (index < appState.currentTest.questions.length - 1) {
    appState.currentQuestionIndex++;
    renderQuestion(appState.currentQuestionIndex);
  } else {
    alert('This is the last question');
  }
}

function updateQuestionPalette(currentIndex) {
  const paletteGrid = document.getElementById('paletteGrid');
  if (!paletteGrid || !appState.currentTest) return;

  paletteGrid.innerHTML = '';

  const questions = appState.currentTest.questions || [];
  
  questions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = idx + 1;

    if (idx === currentIndex) {
      btn.classList.add('current');
    } else if (appState.markedForReview[idx]) {
      btn.classList.add('marked-review');
    } else if (appState.testAnswers[idx] !== undefined) {
      btn.classList.add('answered');
    } else {
      btn.classList.add('not-answered');
    }

    btn.addEventListener('click', () => {
      if (appState.questionStartTime) {
        appState.questionTimes[appState.currentQuestionIndex] = Date.now() - appState.questionStartTime;
      }
      appState.currentQuestionIndex = idx;
      renderQuestion(idx);
    });

    paletteGrid.appendChild(btn);
  });

  let answered = 0, notAnswered = 0, visited = 0, marked = 0;
  
  questions.forEach((q, idx) => {
    if (appState.markedForReview[idx]) {
      marked++;
    } else if (appState.testAnswers[idx] !== undefined) {
      answered++;
    } else if (appState.questionTimes[idx] !== undefined) {
      visited++;
    } else {
      notAnswered++;
    }
  });

  document.getElementById('answeredCount').textContent = answered;
  document.getElementById('notAnsweredCount').textContent = notAnswered;
  document.getElementById('notVisitedCount').textContent = questions.length - visited;
  document.getElementById('markedReviewCount').textContent = marked;
}

// ==================== TIMER ====================
function startTimer(seconds) {
  let remaining = seconds;

  if (appState.timerInterval) clearInterval(appState.timerInterval);

  appState.timerInterval = setInterval(() => {
    if (!appState.testPaused) {
      remaining--;

      const minutes = Math.floor(remaining / 60);
      const secs = remaining % 60;
      const timeString = `${minutes}:${secs.toString().padStart(2, '0')}`;

      const timerEl = document.getElementById('timerValue');
      if (timerEl) timerEl.textContent = timeString;

      if (remaining <= 0) {
        clearInterval(appState.timerInterval);
        submitTest();
      }
    }
  }, 1000);
}

function pauseTest() {
  appState.testPaused = !appState.testPaused;
  const pauseBtn = document.getElementById('pauseTestBtn');
  if (pauseBtn) {
    pauseBtn.textContent = appState.testPaused ? 'Resume Test' : 'Pause Test';
  }
}

// ==================== SUBMIT TEST ====================
async function submitTest() {
  if (appState.currentView !== 'testInterface') {
    console.log('Not in test interface');
    return;
  }

  if (appState.currentView === 'testInterface' && !confirm('Are you sure you want to submit the test?')) return;

  try {
    clearInterval(appState.timerInterval);

    if (appState.questionStartTime) {
      appState.questionTimes[appState.currentQuestionIndex] = Date.now() - appState.questionStartTime;
    }

    const testData = appState.currentTest;
    const totalTime = Date.now() - appState.testStartTime;

    let correct = 0, wrong = 0, skipped = 0;
    
    testData.questions.forEach((q, idx) => {
      if (appState.testAnswers[idx] === q.correctAnswer) {
        correct++;
      } else if (appState.testAnswers[idx] !== undefined) {
        wrong++;
      } else {
        skipped++;
      }
    });

    const score = (correct * 1) + (wrong * -0.25);
    const percentage = (score / testData.questions.length) * 100;

    const attemptData = {
      testId: testData.id,
      testName: testData.name,
      totalQuestions: testData.questions.length,
      correct: correct,
      wrong: wrong,
      skipped: skipped,
      totalScore: score,
      percentage: percentage,
      totalTime: formatTime(totalTime),
      answers: appState.testAnswers,
      questionTimes: appState.questionTimes,
      markedForReview: appState.markedForReview
    };

    console.log('📡 Saving attempt...');
    
    if (window.StorageService) {
      const result = await StorageService.saveAttempt(attemptData);
      
      if (result) {
        appState.currentAttemptId = result.attemptId;
        
        appState.attemptHistory[testData.id] = {
          attempts: (appState.attemptHistory[testData.id]?.attempts || 0) + 1,
          best: Math.max((appState.attemptHistory[testData.id]?.best || 0), percentage),
          last: percentage,
          lastAttemptId: result.attemptId
        };
        
        console.log('✅ Attempt saved:', result.attemptId);
        showResults(attemptData);
      } else {
        alert('Error saving attempt');
      }
    } else {
      appState.currentAttemptId = 'local-' + Date.now();
      appState.attemptHistory[testData.id] = {
        attempts: (appState.attemptHistory[testData.id]?.attempts || 0) + 1,
        best: Math.max((appState.attemptHistory[testData.id]?.best || 0), percentage),
        last: percentage,
        lastAttemptId: appState.currentAttemptId
      };
      showResults(attemptData);
    }

  } catch (error) {
    console.error('Error submitting test:', error);
    alert('Error: ' + error.message);
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ==================== RESULTS & SOLUTIONS ====================

function showResults(attemptData) {
  // ✅ HIDE TEST CONTAINER, SHOW RESULTS MODAL
  const testContainerEl = document.getElementById('testContainer');
  const resultsModalEl = document.getElementById('resultsModal');
  const dashboardEl = document.getElementById('dashboard');
  
  if (testContainerEl) testContainerEl.style.display = 'none';
  if (dashboardEl) dashboardEl.style.display = 'none';
  if (resultsModalEl) resultsModalEl.style.display = 'flex';

  const scoreEl = document.getElementById('scoreValue');
  const percentageEl = document.getElementById('scorePercentage');
  if (scoreEl) scoreEl.textContent = `${attemptData.correct}/${attemptData.totalQuestions}`;
  if (percentageEl) percentageEl.textContent = `${attemptData.percentage.toFixed(1)}%`;

  document.getElementById('statTotal').textContent = attemptData.totalQuestions;
  document.getElementById('statCorrect').textContent = attemptData.correct;
  document.getElementById('statWrong').textContent = attemptData.wrong;
  document.getElementById('statSkipped').textContent = attemptData.skipped;
  document.getElementById('statTime').textContent = attemptData.totalTime;

  const tbody = document.getElementById('resultsTableBody');
  if (tbody) {
    tbody.innerHTML = '';

    appState.currentTest.questions.forEach((q, idx) => {
      const userAnswer = appState.testAnswers[idx];
      const correctAnswer = q.correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      const isSkipped = userAnswer === undefined;
      const timeSpent = appState.questionTimes[idx] ? formatTime(appState.questionTimes[idx]) : '0:00';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${userAnswer !== undefined ? String.fromCharCode(65 + userAnswer) : '-'}</td>
        <td>${String.fromCharCode(65 + correctAnswer)}</td>
        <td class="${isCorrect ? 'status-correct' : isSkipped ? 'status-skipped' : 'status-incorrect'}">
          ${isCorrect ? '✓ Correct' : isSkipped ? 'Skipped' : '✗ Wrong'}
        </td>
        <td>${timeSpent}</td>
        <td>${isCorrect ? '+1.00' : isSkipped ? '0.00' : '-0.25'}</td>
      `;
      tbody.appendChild(row);
    });
  }
}


function goHome() {
  // ✅ HIDE ALL OTHER VIEWS
  const resultsModal = document.getElementById('resultsModal');
  const solutionView = document.getElementById('solutionView');
  const testContainer = document.getElementById('testContainer');
  const dashboard = document.getElementById('dashboard');

  if (resultsModal) resultsModal.style.display = 'none';
  if (solutionView) solutionView.style.display = 'none';
  if (testContainer) testContainer.style.display = 'none';

  // ✅ SHOW DASHBOARD
  if (dashboard) dashboard.style.display = 'block';

  appState.currentTest = null;
  appState.currentAttemptId = null;
  appState.currentView = 'dashboard';

  renderDashboard();
}


function retakeTest() {
  if (!appState.currentTest) return;
  
  const resultsModalEl = document.getElementById('resultsModal');
  if (resultsModalEl) resultsModalEl.style.display = 'none';
  startTest(appState.currentTest.id);
}

function viewSolutions() {
  if (!appState.currentAttemptId && !appState.currentTest) {
    console.error('No attempt or test data');
    return;
  }

  // ✅ HIDE RESULTS, SHOW SOLUTION VIEW
  const resultsModalEl = document.getElementById('resultsModal');
  const solutionViewEl = document.getElementById('solutionView');

  if (resultsModalEl) resultsModalEl.style.display = 'none';
  if (solutionViewEl) solutionViewEl.style.display = 'flex';

  renderSolution(appState.currentQuestionIndex || 0);
}


function renderSolution(index) {
  if (!appState.currentTest) return;

  const questions = appState.currentTest.questions;
  if (!questions || !questions[index]) return;

  const question = questions[index];

  const qNumEl = document.getElementById('solutionQuestionNum');
  if (qNumEl) qNumEl.textContent = index + 1;

  const instEl = document.getElementById('solutionInstructionsText');
  if (instEl) instEl.textContent = question.instructions;

  const qEnEl = document.getElementById('solutionQuestionEn');
  const qHiEl = document.getElementById('solutionQuestionHi');
  if (qEnEl) qEnEl.textContent = question.questionEn;
  if (qHiEl) qHiEl.textContent = question.questionHi;

  const optionsContainer = document.getElementById('solutionOptionsContainer');
  if (optionsContainer) {
    optionsContainer.innerHTML = '';

    question.options.forEach((option, idx) => {
      const label = String.fromCharCode(65 + idx);
      const userAnswered = appState.testAnswers[index] === idx;
      const isCorrect = idx === question.correctAnswer;

      const optionEl = document.createElement('div');
      optionEl.className = 'solution-option';
      
      let statusClass = '';
      let statusText = '';
      
      if (userAnswered && isCorrect) {
        statusClass = 'correct';
        statusText = '✓ Correct';
      } else if (userAnswered && !isCorrect) {
        statusClass = 'incorrect';
        statusText = '✗ Your answer';
      } else if (isCorrect) {
        statusClass = 'correct';
        statusText = '✓ Correct';
      } else {
        statusClass = '';
        statusText = '';
      }

      optionEl.innerHTML = `
        <span class="option-label">${label}. ${option}</span>
        ${statusText ? `<span class="status ${statusClass}">${statusText}</span>` : ''}
      `;

      optionsContainer.appendChild(optionEl);
    });
  }

  const solEl = document.getElementById('solutionText');
  if (solEl) solEl.textContent = question.solution;

  const timeTaken = appState.questionTimes[index] ? formatTime(appState.questionTimes[index]) : '0:00';
  console.log(`Time for Q${index + 1}: ${timeTaken}`);

  updateSolutionPalette(index);
}

function updateSolutionPalette(currentIndex) {
  const paletteGrid = document.getElementById('solutionPaletteGrid');
  if (!paletteGrid || !appState.currentTest) return;

  paletteGrid.innerHTML = '';

  const questions = appState.currentTest.questions || [];
  
  questions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = idx + 1;

    const userAnswer = appState.testAnswers[idx];
    const isCorrect = userAnswer === q.correctAnswer;
    const isSkipped = userAnswer === undefined;

    if (idx === currentIndex) {
      btn.classList.add('current');
    } else if (isCorrect) {
      btn.classList.add('answered');
    } else if (isSkipped) {
      btn.classList.add('not-answered');
    } else {
      btn.classList.add('marked-review');
    }

    btn.addEventListener('click', () => {
      appState.currentQuestionIndex = idx;
      renderSolution(idx);
    });

    paletteGrid.appendChild(btn);
  });
}

function previousSolution() {
  if (appState.currentQuestionIndex > 0) {
    appState.currentQuestionIndex--;
    renderSolution(appState.currentQuestionIndex);
  }
}

function nextSolution() {
  const questions = appState.currentTest ? appState.currentTest.questions : [];
  if (appState.currentQuestionIndex < questions.length - 1) {
    appState.currentQuestionIndex++;
    renderSolution(appState.currentQuestionIndex);
  }
}

// ==================== FONT SIZE ====================
function increaseFont() {
  appState.currentFontSize += 2;
  applyFontSize();
}

function decreaseFont() {
  if (appState.currentFontSize > 12) {
    appState.currentFontSize -= 2;
    applyFontSize();
  }
}

function applyFontSize() {
  document.querySelectorAll('.question-text, .option-label, .solution-text').forEach(el => {
    el.style.fontSize = appState.currentFontSize + 'px';
  });
}

// ==================== END OF MAIN.JS ==================== 
console.log('✅ main.js loaded successfully');




