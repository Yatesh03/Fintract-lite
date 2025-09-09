import Savings from '../models/Savings.js';

export const getSavings = async (req, res) => {
  try {
    console.log('Getting savings for user:', req.user.id);
    
    // First, try to find existing savings record
    let savings = await Savings.findOne({ user: req.user.id });
    
    if (!savings) {
      console.log('No savings record found, creating new one');
      // Create savings record if it doesn't exist
      try {
        savings = await Savings.create({ 
          user: req.user.id,
          amount: 0,
          roundUpAmount: 0,
          totalSaved: 0,
          monthlyGoal: 0,
          lastUpdated: new Date()
        });
        console.log('New savings record created:', savings);
      } catch (createError) {
        console.error('Error creating savings record:', createError);
        throw createError;
      }
    }
    
    console.log('Savings data retrieved:', savings);
    res.json(savings);
  } catch (err) {
    console.error('Error in getSavings:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const addRoundUpSavings = async (req, res) => {
  try {
    const { amount } = req.body;
    
    let savings = await Savings.findOne({ user: req.user.id });
    
    if (!savings) {
      savings = await Savings.create({ user: req.user.id });
    }
    
    savings.roundUpAmount += amount;
    savings.totalSaved += amount;
    savings.lastUpdated = new Date();
    
    await savings.save();
    
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateSavingsGoal = async (req, res) => {
  try {
    const { monthlyGoal } = req.body;
    console.log('Updating savings goal for user:', req.user.id, 'Goal:', monthlyGoal);
    
    let savings = await Savings.findOne({ user: req.user.id });
    
    if (!savings) {
      console.log('No savings record found, creating new one');
      try {
        savings = await Savings.create({ 
          user: req.user.id,
          amount: 0,
          roundUpAmount: 0,
          totalSaved: 0,
          monthlyGoal: monthlyGoal,
          lastUpdated: new Date()
        });
        console.log('New savings record created with goal:', savings);
      } catch (createError) {
        console.error('Error creating savings record:', createError);
        throw createError;
      }
    } else {
      savings.monthlyGoal = monthlyGoal;
      savings.lastUpdated = new Date();
      await savings.save();
      console.log('Updated existing savings record:', savings);
    }
    
    res.json(savings);
  } catch (err) {
    console.error('Error in updateSavingsGoal:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

export const withdrawSavings = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const savings = await Savings.findOne({ user: req.user.id });
    
    if (!savings) {
      return res.status(404).json({ message: 'Savings account not found' });
    }
    
    if (savings.totalSaved < amount) {
      return res.status(400).json({ message: 'Insufficient savings balance' });
    }
    
    savings.totalSaved -= amount;
    savings.lastUpdated = new Date();
    
    await savings.save();
    
    res.json(savings);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
