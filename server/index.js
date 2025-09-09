import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import savingsRoutes from './routes/savingsRoutes.js';
import auth from './middleware/authMiddleware.js';
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', auth, transactionRoutes);
app.use('/api/budgets', auth, budgetRoutes);
app.use('/api/savings', auth, savingsRoutes);

// 🔹 Test route to confirm API is working
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
