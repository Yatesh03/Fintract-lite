import mongoose from 'mongoose';

const SavingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, default: 0 },
  roundUpAmount: { type: Number, required: true, default: 0 }, // Amount saved from round-ups
  totalSaved: { type: Number, required: true, default: 0 }, // Total savings
  lastUpdated: { type: Date, default: Date.now },
  monthlyGoal: { type: Number, default: 0 }, // Optional monthly savings goal
});

export default mongoose.model('Savings', SavingsSchema);
