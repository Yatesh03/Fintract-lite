import Transaction from '../models/Transaction.js';
import Savings from '../models/Savings.js';

export const addTransaction = async (req, res) => {
  try {
    const { amount, type } = req.body;
    
    // Create the transaction
    const transaction = await Transaction.create({ ...req.body, user: req.user.id });
    
    // Apply round-up logic for expenses (any amount not ending in 0)
    if (type === 'Expense' && amount % 10 !== 0) {
      const roundUpAmount = Math.ceil(amount / 10) * 10;
      const savingsAmount = roundUpAmount - amount;
      
      console.log(`Round-up logic: Amount ${amount} -> Round up to ${roundUpAmount}, Savings: ${savingsAmount}`);
      
      // Add to savings
      let savings = await Savings.findOne({ user: req.user.id });
      if (!savings) {
        console.log('Creating new savings record for user:', req.user.id);
        try {
          savings = await Savings.create({ 
            user: req.user.id,
            amount: 0,
            roundUpAmount: savingsAmount,
            totalSaved: savingsAmount,
            monthlyGoal: 0,
            lastUpdated: new Date()
          });
          console.log('New savings record created with round-up:', savings);
        } catch (createError) {
          console.error('Error creating savings record:', createError);
          throw createError;
        }
      } else {
        savings.roundUpAmount += savingsAmount;
        savings.totalSaved += savingsAmount;
        savings.lastUpdated = new Date();
        await savings.save();
        console.log('Updated existing savings record:', savings);
      }
      
      // Add round-up info to transaction response
      transaction.roundUpAmount = savingsAmount;
      transaction.actualAmount = roundUpAmount;
    }
    
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, description } = req.body;
    
    // Find the transaction
    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, type, category, description },
      { new: true }
    );
    
    res.json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the transaction
    const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getMonthlySummary = async (req, res) => {
  try {
    const { year, month } = req.params;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    });

    let income = 0;
    let expense = 0;
    const categorySummary = {};

    // Process each transaction in one loop
    for (const t of transactions) {
      if (t.type === 'Income') {
        income += t.amount;
      } else if (t.type === 'Expense') {
        expense += t.amount;
        categorySummary[t.category] = (categorySummary[t.category] || 0) + t.amount;
      }
    }

    const balance = income - expense;
    const savingRate = income > 0 ? ((balance / income) * 100).toFixed(2) : '0.00';

    const categoryBreakdown = Object.entries(categorySummary).map(([category, amount]) => ({
      name: category,
      //amount,
      value: expense > 0 ? ((amount / expense) * 100) : 0.0
    }));

    res.json({ income, expense, balance, savingRate, categoryBreakdown });

  } catch (error) {
    console.error('Monthly summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getMonthlyIncomeExpenseSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based index

    // Fetch and group transactions by month and type
    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999),
          }
        }
      },
      {
        $project: {
          month: { $month: "$date" }, // 1 - 12
          type: 1,
          amount: 1
        }
      },
      {
        $group: {
          _id: { month: "$month", type: "$type" },
          total: { $sum: "$amount" }
        }
      }
    ]);

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyData = [];

    for (let i = 0; i <= currentMonth; i++) {
      monthlyData.push({
        month: monthLabels[i],
        income: 0,
        expense: 0
      });
    }

    transactions.forEach(entry => {
      const index = entry._id.month - 1;
      if (entry._id.type === 'Income') {
        monthlyData[index].income = entry.total;
      } else if (entry._id.type === 'Expense') {
        monthlyData[index].expense = entry.total;
      }
    });

    res.status(200).json(monthlyData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};