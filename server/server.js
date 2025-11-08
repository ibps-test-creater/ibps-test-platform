// ✅ BACKEND - server/server.js
// Express server with MongoDB connection
// Complete API backend for IBPS Test Platform

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// ==================== DATABASE CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ibps-platform';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ==================== SCHEMAS ====================

// Test Schema - Stores all test questions
const testSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: Number, required: true },
  questions: [{
    id: Number,
    instructions: String,
    instructionImage: String,
    questionEn: String,
    questionHi: String,
    options: [String],
    correctAnswer: Number,
    solution: String,
    solutionImage: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Attempt Schema - Stores test attempt results
const attemptSchema = new mongoose.Schema({
  attemptId: { type: String, required: true, unique: true },
  testId: { type: String, required: true },
  testName: String,
  userId: String,
  totalQuestions: Number,
  correct: Number,
  wrong: Number,
  skipped: Number,
  totalScore: Number,
  percentage: Number,
  totalTime: String,
  answers: mongoose.Schema.Types.Mixed,
  questionTimes: mongoose.Schema.Types.Mixed,
  markedForReview: mongoose.Schema.Types.Mixed,
  completedAt: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', testSchema);
const Attempt = mongoose.model('Attempt', attemptSchema);

// ==================== API ROUTES ====================

// ===== TESTS ROUTES =====

// GET: Get all tests
app.get('/api/tests', async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${tests.length} tests`);
    res.json({ success: true, tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Get single test by ID
app.get('/api/tests/:id', async (req, res) => {
  try {
    const test = await Test.findOne({ id: req.params.id });
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    console.log(`✅ Retrieved test: ${req.params.id}`);
    res.json({ success: true, test });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST: Create new test
app.post('/api/tests', async (req, res) => {
  try {
    const testData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const existingTest = await Test.findOne({ id: testData.id });
    if (existingTest) {
      return res.status(400).json({ success: false, message: 'Test ID already exists' });
    }
    
    const test = new Test(testData);
    await test.save();
    console.log(`✅ Created test: ${testData.id}`);
    res.json({ success: true, test, message: 'Test created successfully' });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT: Update test
app.put('/api/tests/:id', async (req, res) => {
  try {
    const testData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const test = await Test.findOneAndUpdate(
      { id: req.params.id },
      testData,
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    console.log(`✅ Updated test: ${req.params.id}`);
    res.json({ success: true, test, message: 'Test updated successfully' });
  } catch (error) {
    console.error('Error updating test:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: Delete test
app.delete('/api/tests/:id', async (req, res) => {
  try {
    const test = await Test.findOneAndDelete({ id: req.params.id });
    if (!test) {
      return res.status(404).json({ success: false, message: 'Test not found' });
    }
    
    // Also delete all attempts for this test
    await Attempt.deleteMany({ testId: req.params.id });
    console.log(`✅ Deleted test: ${req.params.id}`);
    res.json({ success: true, message: 'Test and related attempts deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== ATTEMPTS ROUTES =====

// POST: Save test attempt
app.post('/api/attempts', async (req, res) => {
  try {
    const attemptData = req.body;
    
    // Generate unique attempt ID
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    attemptData.attemptId = `attempt-${timestamp}-${random}`;
    
    const attempt = new Attempt(attemptData);
    await attempt.save();
    
    console.log(`✅ Saved attempt: ${attemptData.attemptId} for test: ${attemptData.testId}`);
    res.json({ success: true, attempt, message: 'Attempt saved successfully' });
  } catch (error) {
    console.error('Error saving attempt:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Get attempt by ID
app.get('/api/attempts/:attemptId', async (req, res) => {
  try {
    const attempt = await Attempt.findOne({ attemptId: req.params.attemptId });
    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt not found' });
    }
    console.log(`✅ Retrieved attempt: ${req.params.attemptId}`);
    res.json({ success: true, attempt });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Get attempt history for a test
app.get('/api/attempts/test/:testId', async (req, res) => {
  try {
    const attempts = await Attempt.find({ testId: req.params.testId }).sort({ completedAt: -1 });
    
    // Calculate statistics
    let attempts_count = attempts.length;
    let best_score = 0;
    let last_score = 0;
    
    if (attempts.length > 0) {
      const scores = attempts.map(a => a.percentage);
      best_score = Math.max(...scores);
      last_score = attempts.percentage;
    }
    
    const stats = {
      attempts: attempts_count,
      best: best_score,
      last: last_score
    };
    
    console.log(`✅ Retrieved ${attempts.length} attempts for test: ${req.params.testId}`);
    res.json({ success: true, attempts, stats });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Get all attempts (attempt history)
app.get('/api/attempts/history/all', async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ completedAt: -1 });
    
    // Group by testId
    const history = {};
    attempts.forEach(attempt => {
      if (!history[attempt.testId]) {
        history[attempt.testId] = {
          attempts: 0,
          best: 0,
          last: 0,
          lastAttemptId: null
        };
      }
      
      history[attempt.testId].attempts++;
      history[attempt.testId].last = attempt.percentage;
      history[attempt.testId].lastAttemptId = attempt.attemptId;
      
      if (attempt.percentage > history[attempt.testId].best) {
        history[attempt.testId].best = attempt.percentage;
      }
    });
    
    console.log(`✅ Retrieved attempt history for ${Object.keys(history).length} tests`);
    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== UTILITY ROUTES =====

// POST: Initialize database with sample data
app.post('/api/init-data', async (req, res) => {
  try {
    const count = await Test.countDocuments();
    
    if (count === 0 && req.body.tests && req.body.tests.length > 0) {
      await Test.insertMany(req.body.tests);
      console.log(`✅ Initialized database with ${req.body.tests.length} tests`);
      res.json({ 
        success: true, 
        message: `Initialized database with ${req.body.tests.length} tests` 
      });
    } else if (count > 0) {
      console.log(`⚠️ Database already contains ${count} tests`);
      res.json({ 
        success: true, 
        message: `Database already contains ${count} tests` 
      });
    } else {
      res.json({ 
        success: true, 
        message: 'No sample data provided' 
      });
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET: Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════╗');
  console.log('║  IBPS TEST PLATFORM - BACKEND SERVER  ║');
  console.log('╠═══════════════════════════════════════╣');
  console.log(`║  🚀 Server running on port ${PORT}       ║`);
  console.log(`║  📍 Frontend: http://localhost:${PORT}    ║`);
  console.log(`║  🔌 API: http://localhost:${PORT}/api     ║`);
  console.log(`║  ✅ Database: MongoDB connected         ║`);
  console.log('╚═══════════════════════════════════════╝');
});
