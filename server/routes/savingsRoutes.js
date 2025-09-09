import express from 'express';
import { getSavings, addRoundUpSavings, updateSavingsGoal, withdrawSavings } from '../controllers/savingsController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Simple test route without auth first
router.get('/ping', (req, res) => {
  res.json({ message: 'Savings routes are working!' });
});

router.get('/', auth, getSavings);
router.post('/roundup', auth, addRoundUpSavings);
router.put('/goal', auth, updateSavingsGoal);
router.post('/withdraw', auth, withdrawSavings);

// Test endpoint to verify savings functionality
router.get('/test', auth, (req, res) => {
  res.json({ 
    message: 'Savings API is working!', 
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });
});

// Initialize savings record for user
router.post('/init', auth, async (req, res) => {
  try {
    const Savings = (await import('../models/Savings.js')).default;
    
    let savings = await Savings.findOne({ user: req.user.id });
    
    if (!savings) {
      savings = await Savings.create({ 
        user: req.user.id,
        amount: 0,
        roundUpAmount: 0,
        totalSaved: 0,
        monthlyGoal: 0,
        lastUpdated: new Date()
      });
      res.json({ message: 'Savings record initialized', savings });
    } else {
      res.json({ message: 'Savings record already exists', savings });
    }
  } catch (error) {
    console.error('Error initializing savings:', error);
    res.status(500).json({ message: 'Error initializing savings', error: error.message });
  }
});

export default router;
