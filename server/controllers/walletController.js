import Savings from '../models/Savings.js';

export const getWallet = async (req, res) => {
  try {
    let savings = await Savings.findOne({ user: req.user._id });
    if (!savings) {
      savings = await Savings.create({ user: req.user._id, amount: 0, roundUpAmount: 0, totalSaved: 0, history: [] });
    }
    return res.status(200).json(savings);
  } catch (error) {
    console.error('Get wallet error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const addToWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    let savings = await Savings.findOne({ user: req.user._id });
    if (!savings) {
      savings = await Savings.create({ user: req.user._id, amount: 0, roundUpAmount: 0, totalSaved: 0, history: [] });
    }
    savings.totalSaved += numericAmount;
    savings.lastUpdated = new Date();
    await savings.save();
    return res.status(200).json(savings);
  } catch (error) {
    console.error('Add to wallet error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


