import express from 'express';
import auth from '../middleware/authMiddleware.js'
import { register, login, getCurrentUser, logout, updateProfile, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

export default router;