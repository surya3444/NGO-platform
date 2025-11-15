import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Ngo from '../models/ngoModel.js';
import WithdrawalRequest from '../models/withdrawalRequestModel.js'; // <-- 1. Import
import sendEmail from '../utils/sendEmail.js'; // <-- 2. Import

// Helper to generate JWT
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Login for Admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminId = 'ADMIN_USER_001'; 
      res.json({
        _id: adminId,
        name: 'Admin',
        email: email,
        userType: 'Admin',
        token: generateToken(adminId, 'Admin'),
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all users (donors)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all NGOs
// @route   GET /api/admin/ngos
// @access  Private/Admin
const getAllNgos = async (req, res) => {
  try {
    const ngos = await Ngo.find({}).select('-password');
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify an NGO's KYC
// @route   PUT /api/admin/kyc/verify/:id
// @access  Private/Admin
const verifyNgoKyc = async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.params.id);
    if (ngo) {
      ngo.kycStatus = 'Verified';
      const updatedNgo = await ngo.save();
      res.json(updatedNgo);
    } else {
      res.status(404).json({ message: 'NGO not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getWithdrawals = async (req, res) => {
  try {
    const requests = await WithdrawalRequest.find({ status: 'Pending' })
      .populate('ngo', 'email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Approve a withdrawal request
// @route   PUT /api/admin/approve-withdrawal/:id
// @access  Private/Admin
const approveWithdrawal = async (req, res) => {
  try {
    const request = await WithdrawalRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const ngo = await Ngo.findById(request.ngo);
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // 1. Update NGO's total withdrawn amount
    ngo.totalWithdrawn += request.amount;
    await ngo.save();

    // 2. Update request status
    request.status = 'Approved';
    const updatedRequest = await request.save();

    // 3. Send confirmation email
    await sendEmail({
      email: ngo.email,
      subject: 'Withdrawal Request Approved',
      message: `Hello ${ngo.ngoName},\n\nYour withdrawal request for $${request.amount} has been approved and is being processed.\n\nThank you,\nThe NGO Connect Team`,
    });

    res.json(updatedRequest); // Send back the approved request
  } catch (error) {
    console.error('--- ERROR in approveWithdrawal ---:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// --- END OF ADDITION ---

export { loginAdmin, getAllUsers, getAllNgos, verifyNgoKyc, getWithdrawals, approveWithdrawal };