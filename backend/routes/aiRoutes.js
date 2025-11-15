import express from 'express';
const router = express.Router();
import { getFundraisingTips } from '../controllers/aiController.js';
import { protect, isNgo } from '../middleware/authMiddleware.js';

// This route is protected and can only be accessed by a logged-in NGO
router.route('/fundraising-tips').get(protect, isNgo, getFundraisingTips);

export default router;