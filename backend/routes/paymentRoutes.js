import express from 'express';
const router = express.Router();
import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

// All payment routes should be protected
router.post('/order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);

export default router;