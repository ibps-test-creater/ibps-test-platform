// ✅ FRONTEND - public/storage-service.js
// API Service Layer - Connects frontend to backend
// All functions return promises for async operations

const API_BASE_URL = window.location.origin + '/api';

console.log('✅ Storage Service initializing - API Base URL:', API_BASE_URL);

// ==================== TESTS API ====================

/**
 * Get all tests from database
 * @returns {Promise<Array>} Array of test objects
 */
async function getAllTests() {
  try {
    console.log('📡 Fetching all tests...');
    const response = await fetch(`${API_BASE_URL}/tests`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Retrieved ${data.tests.length} tests`);
      return data.tests;
    } else {
      console.error('❌ Failed to fetch tests:', data.message);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching tests:', error);
    return [];
  }
}

/**
 * Get single test by ID
 * @param {String} testId - Test ID to fetch
 * @returns {Promise<Object>} Test object or null
 */
async function getTestById(testId) {
  try {
    console.log(`📡 Fetching test: ${testId}`);
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Retrieved test: ${testId}`);
      return data.test;
    } else {
      console.error(`❌ Test not found: ${testId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching test ${testId}:`, error);
    return null;
  }
}

/**
 * Create or update test
 * @param {Object} testData - Test object with all fields
 * @returns {Promise<Object>} Saved test object
 */
async function saveTest(testData) {
  try {
    console.log('📡 Saving test:', testData.id);
    
    // Check if test exists
    const existingTest = await getTestById(testData.id);
    
    if (existingTest) {
      // Update existing test
      const response = await fetch(`${API_BASE_URL}/tests/${testData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Updated test: ${testData.id}`);
        return data.test;
      } else {
        console.error('❌ Failed to update test:', data.message);
        return null;
      }
    } else {
      // Create new test
      const response = await fetch(`${API_BASE_URL}/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Created test: ${testData.id}`);
        return data.test;
      } else {
        console.error('❌ Failed to create test:', data.message);
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Error saving test:', error);
    return null;
  }
}

/**
 * Delete test by ID
 * @param {String} testId - Test ID to delete
 * @returns {Promise<Boolean>} Success status
 */
async function deleteTest(testId) {
  try {
    console.log(`📡 Deleting test: ${testId}`);
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Deleted test: ${testId}`);
      return true;
    } else {
      console.error('❌ Failed to delete test:', data.message);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting test ${testId}:`, error);
    return false;
  }
}

// ==================== ATTEMPTS API ====================

/**
 * Save test attempt (after test submission)
 * @param {Object} attemptData - Attempt object with scores, answers, times
 * @returns {Promise<Object>} Saved attempt object
 */
async function saveAttempt(attemptData) {
  try {
    console.log('📡 Saving attempt for test:', attemptData.testId);
    
    const response = await fetch(`${API_BASE_URL}/attempts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attemptData)
    });
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Saved attempt: ${data.attempt.attemptId}`);
      return data.attempt;
    } else {
      console.error('❌ Failed to save attempt:', data.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Error saving attempt:', error);
    return null;
  }
}

/**
 * Get attempt by ID (for viewing solutions)
 * @param {String} attemptId - Attempt ID to fetch
 * @returns {Promise<Object>} Attempt object or null
 */
async function getAttemptById(attemptId) {
  try {
    console.log(`📡 Fetching attempt: ${attemptId}`);
    const response = await fetch(`${API_BASE_URL}/attempts/${attemptId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Retrieved attempt: ${attemptId}`);
      return data.attempt;
    } else {
      console.error(`❌ Attempt not found: ${attemptId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching attempt ${attemptId}:`, error);
    return null;
  }
}

/**
 * Get attempt history for specific test
 * @param {String} testId - Test ID
 * @returns {Promise<Object>} Object with attempts array and stats
 */
async function getTestAttemptHistory(testId) {
  try {
    console.log(`📡 Fetching attempt history for test: ${testId}`);
    const response = await fetch(`${API_BASE_URL}/attempts/test/${testId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Retrieved ${data.attempts.length} attempts for test: ${testId}`);
      return data;
    } else {
      console.error('❌ Failed to fetch history:', data.message);
      return { attempts: [], stats: { attempts: 0, best: 0, last: 0 } };
    }
  } catch (error) {
    console.error(`❌ Error fetching history for test ${testId}:`, error);
    return { attempts: [], stats: { attempts: 0, best: 0, last: 0 } };
  }
}

/**
 * Get complete attempt history (for all tests)
 * @returns {Promise<Object>} History object grouped by testId
 */
async function getAttemptHistory() {
  try {
    console.log('📡 Fetching complete attempt history...');
    const response = await fetch(`${API_BASE_URL}/attempts/history/all`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Retrieved history for ${Object.keys(data.history).length} tests`);
      return data.history;
    } else {
      console.error('❌ Failed to fetch history:', data.message);
      return {};
    }
  } catch (error) {
    console.error('❌ Error fetching attempt history:', error);
    return {};
  }
}

// ==================== UTILITY API ====================

/**
 * Initialize database with sample data
 * @param {Array} testsData - Array of test objects to initialize
 * @returns {Promise<Object>} Initialization result
 */
async function initializeData(testsData) {
  try {
    console.log(`📡 Initializing database with ${testsData.length} tests...`);
    const response = await fetch(`${API_BASE_URL}/init-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tests: testsData })
    });
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Database initialized: ${data.message}`);
      return data;
    } else {
      console.error('❌ Initialization failed:', data.message);
      return data;
    }
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Check backend health
 * @returns {Promise<Object>} Health status
 */
async function checkHealth() {
  try {
    console.log('📡 Checking server health...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Server healthy - Database:', data.database);
      return data;
    } else {
      console.error('❌ Server error');
      return data;
    }
  } catch (error) {
    console.error('❌ Error checking health:', error);
    return { success: false, message: 'Server unreachable' };
  }
}

// ==================== EXPORT FOR BROWSER ====================

// Make available globally on window object
window.StorageService = {
  getAllTests,
  getTestById,
  saveTest,
  deleteTest,
  saveAttempt,
  getAttemptById,
  getTestAttemptHistory,
  getAttemptHistory,
  initializeData,
  checkHealth
};

console.log('✅ Storage Service loaded - All API methods available');
