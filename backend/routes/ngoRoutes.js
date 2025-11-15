import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, isNgo } from '../middleware/authMiddleware.js';
import { submitKyc, getNgoProfile, requestWithdrawal } from '../controllers/ngoController.js';

const router = express.Router();

// --- Multer Configuration for KYC Docs ---
const kycStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/kyc'); // Save to 'uploads/kyc'
  },
  filename(req, file, cb) {
    cb(
      null,
      `kyc-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkKycFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // --- THIS IS THE FIX ---
    // Pass a new Error object. This will be caught by the error handler.
    cb(new Error('File type not supported. Please upload PDFs or Images only.'));
    // --- END OF FIX ---
  }
}

const uploadKyc = multer({
  storage: kycStorage,
  fileFilter: function (req, file, cb) {
    checkKycFileType(file, cb);
  },
});
// --- End Multer Configuration ---

// @route   POST /api/ngo/kyc
// @desc    Submit NGO KYC details
// @access  Private/Ngo
router
  .route('/kyc')
  .post(protect, isNgo, uploadKyc.single('document'), submitKyc);
  
// @route   GET /api/ngo/profile
// @desc    Get logged-in NGO's profile (including kycStatus)
// @access  Private/Ngo
router.route('/profile').get(protect, isNgo, getNgoProfile);

// @route   POST /api/ngo/request-withdrawal
// @desc    Request a withdrawal
// @access  Private/Ngo
router.route('/request-withdrawal').post(protect, isNgo, requestWithdrawal);

export default router;