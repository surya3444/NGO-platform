import express from 'express';
const router = express.Router();
import { 
  loginAdmin,
  getAllUsers,
  getAllNgos,
  verifyNgoKyc,
  getWithdrawals,    // <-- 1. Import
  approveWithdrawal  // <-- 1. Import
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.post('/login', loginAdmin);

// User & NGO Management
router.route('/users').get(protect, isAdmin, getAllUsers);
router.route('/ngos').get(protect, isAdmin, getAllNgos);
router.route('/kyc/verify/:id').put(protect, isAdmin, verifyNgoKyc);

// --- 2. ADD THESE NEW ROUTES ---
router.route('/withdrawals').get(protect, isAdmin, getWithdrawals);
router.route('/approve-withdrawal/:id').put(protect, isAdmin, approveWithdrawal);
// --- END OF ADDITION ---

export default router;