import mongoose from 'mongoose';
import User from '../models/User.js';
import Savings from '../models/Savings.js';

const getRoundUpBase = () => {
  const parsed = parseInt(process.env.ROUND_UP_BASE || '10', 10);
  return [10, 100].includes(parsed) ? parsed : 10;
};

export const processPayment = async (req, res) => {
  try {
    const { payerId, receiverId, upiId, amount, roundUp, roundUpBase } = req.body;

    if (!payerId || (!receiverId && !upiId) || !amount) {
      return res.status(400).json({ message: 'payerId, (receiverId or upiId) and amount are required' });
    }

    if (String(req.user._id) !== String(payerId)) {
      return res.status(403).json({ message: 'Not authorized to pay on behalf of this user' });
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const payer = await User.findById(payerId);
    let receiver = null;
    if (receiverId) {
      receiver = await User.findById(receiverId);
    } else if (upiId) {
      receiver = await User.findOne({ upiId: upiId });
    }

    if (!payer || !receiver) {
      return res.status(404).json({ message: 'Payer or receiver not found' });
    }

    if (payer.balance < numericAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Perform transfer
    payer.balance -= numericAmount;
    receiver.balance += numericAmount;

    // Apply optional round-up savings for payer if requested
    const applyRoundUp = Boolean(roundUp);
    const allowedBases = [10, 50, 100];
    const baseCandidate = parseInt(roundUpBase, 10);
    const base = allowedBases.includes(baseCandidate) ? baseCandidate : getRoundUpBase();
    const roundedUp = Math.ceil(numericAmount / base) * base;
    const roundUpDiff = applyRoundUp ? Math.max(0, roundedUp - numericAmount) : 0;

    if (roundUpDiff > 0) {
      let savings = await Savings.findOne({ user: payer._id });
      if (!savings) {
        savings = await Savings.create({ user: payer._id, amount: 0, roundUpAmount: 0, totalSaved: 0, history: [] });
      }
      const txnId = new mongoose.Types.ObjectId().toString();
      savings.roundUpAmount += roundUpDiff;
      savings.totalSaved += roundUpDiff;
      savings.lastUpdated = new Date();
      savings.history.push({ txnId, roundUp: roundUpDiff, createdAt: new Date() });
      await savings.save();
    }

    await payer.save();
    await receiver.save();

    return res.status(200).json({
      message: 'Payment successful',
      payer: { id: payer._id, balance: payer.balance },
      receiver: { id: receiver._id, balance: receiver.balance },
      roundUp: {
        base,
        applied: Math.max(0, applyRoundUp ? Math.ceil(numericAmount / base) * base - numericAmount : 0)
      }
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


