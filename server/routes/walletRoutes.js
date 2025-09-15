import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getWallet, addToWallet } from '../controllers/walletController.js';

const router = express.Router();

router.get('/', auth, getWallet);
router.post('/add', auth, addToWallet);

export default router;


