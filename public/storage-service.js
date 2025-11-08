// public/storage-service.js
const API_BASE_URL = window.location.origin + '/api';

window.StorageService = {
  async getAllTests() {
    try {
      const response = await fetch(`${API_BASE_URL}/tests`);
      const data = await response.json();
      if (data.success && Array.isArray(data.tests)) {
        return data.tests;
      }
      return [];
    } catch (e) {
      console.error('Failed to fetch tests', e);
      return [];
    }
  },

  async getTestById(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`);
      const data = await response.json();
      if (data.success && data.test) {
        return data.test;
      }
      return null;
    } catch (e) {
      console.error('Failed to fetch test by ID', e);
      return null;
    }
  },

  async saveTest(testData) {
    try {
      // Check if test exists to decide POST or PUT
      const existingTest = await this.getTestById(testData.id);
      const url = existingTest ? `${API_BASE_URL}/tests/${testData.id}` : `${API_BASE_URL}/tests`;
      const method = existingTest ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      const data = await response.json();
      if (data.success) {
        return data.test;
      }
      return null;
    } catch (e) {
      console.error('Failed to save test', e);
      return null;
    }
  },

  // Implement other APIs similarly (saveAttempt, getAttemptHistory etc.) if needed based on previous code
};
