import express from 'express';
const router = express.Router();
import {
  registerUser,
  registerNgo,
  verifyOtp,
  login,
  loginNgo, // <-- 1. Import new controller
} from '../controllers/authController.js';

router.post('/register-user', registerUser);
router.post('/register-ngo', registerNgo);
router.post('/verify-otp', verifyOtp);
router.post('/login', login); // <-- This is for Donors
router.post('/login-ngo', loginNgo); // <-- 2. Add new route for NGOs

export default router;