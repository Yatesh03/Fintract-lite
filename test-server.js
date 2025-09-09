// Simple test script to verify server is working
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import transactionRoutes from './server/routes/transactionRoutes.js';
import budgetRoutes from './server/routes/budgetRoutes.js';
import savingsRoutes from './server/routes/savingsRoutes.js';
import auth from './server/middleware/authMiddleware.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://personal-finance-manager-nine.vercel.app'
    ],
    credentials: true,
  })
);

app.use(express.json());

// Import models to ensure they are registered with Mongoose
import './server/models/User.js';
import './server/models/Transaction.js';
import './server/models/Budget.js';
import './server/models/Savings.js';

// Routes
console.log('Registering API routes...');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');
app.use('/api/transactions', auth, transactionRoutes);
console.log('✓ Transaction routes registered');
app.use('/api/budgets', auth, budgetRoutes);
console.log('✓ Budget routes registered');
app.use('/api/savings', auth, savingsRoutes);
console.log('✓ Savings routes registered');

// Test route to verify savings routes are registered
app.get('/api/test-savings', (req, res) => {
  res.json({ message: 'Savings routes are registered!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the savings API at: http://localhost:${PORT}/api/test-savings`);
});
