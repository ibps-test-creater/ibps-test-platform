const API_BASE_URL = window.location.origin + '/api';

export const APIService = {
  async getAllTests() {
    try {
      const response = await fetch(`${API_BASE_URL}/tests`);
      const data = await response.json();
      return data.success ? data.tests : [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async getTestById(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`);
      const data = await response.json();
      return data.success ? data.test : null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  async saveResult(resultData) {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  },

  async getAttemptHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/results/history`);
      const data = await response.json();
      return data.success ? data.history : {};
    } catch (error) {
      console.error('Error:', error);
      return {};
    }
  },

  async initializeData(testsData) {
    try {
      const response = await fetch(`${API_BASE_URL}/init-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tests: testsData })
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: error.message };
    }
  },

  async updateTest(testId, testData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false };
    }
  },

  async deleteTest(testId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { success: false };
    }
  },

  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Server unreachable' };
    }
  }
};

window.APIService = APIService;
