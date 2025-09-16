import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { processPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', auth, processPayment);

export default router;


