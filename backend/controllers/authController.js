import User from '../models/userModel.js';
import Ngo from '../models/ngoModel.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

// Helper to generate JWT
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new Donor
// @route   POST /api/auth/register-user
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    const ngoExists = await Ngo.findOne({ email });
    if (userExists || ngoExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = new User({ name, email, password, otp, otpExpires });
    await user.save();
    await sendEmail({
      email: user.email,
      subject: 'Email Verification OTP',
      message: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`,
    });
    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new NGO
// @route   POST /api/auth/register-ngo
// @access  Public
const registerNgo = async (req, res) => {
  const { ngoName, email, password, description, address } = req.body;
  try {
    const userExists = await User.findOne({ email });
    const ngoExists = await Ngo.findOne({ email });
    if (userExists || ngoExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const newNgo = new Ngo({
      ngoName,
      email,
      password,
      description,
      address,
      otp,
      otpExpires,
    });
    await newNgo.save();
    await sendEmail({
      email: newNgo.email,
      subject: 'Email Verification OTP',
      message: `Your OTP for verification is: ${otp}. It will expire in 10 minutes.`,
    });
    res.status(201).json({
      message: 'Registration successful. Please check your email for OTP.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify OTP for both User and NGO
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let account = await User.findOne({ email });
    let userType = 'User';
    if (!account) {
      account = await Ngo.findOne({ email });
      userType = 'Ngo';
    }
    if (!account) {
      return res.status(400).json({ message: 'Account not found.' });
    }
    if (account.isVerified) {
      return res.status(400).json({ message: 'Account already verified.' });
    }
    if (account.otp !== otp || account.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    account.isVerified = true;
    account.otp = undefined;
    account.otpExpires = undefined;
    await account.save();

    res.status(200).json({
      _id: account._id,
      email: account.email,
      name: userType === 'User' ? account.name : account.ngoName,
      userType: userType,
      token: generateToken(account._id, userType),
      kycStatus: userType === 'Ngo' ? account.kycStatus : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login for DONORS
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await User.findOne({ email });

    if (account && (await account.matchPassword(password))) {
      if (!account.isVerified) {
        return res.status(400).json({ message: 'Please verify your email first.' });
      }
      
      res.json({
        _id: account._id,
        name: account.name,
        email: account.email,
        userType: 'User',
        token: generateToken(account._id, 'User'),
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login for NGOS
// @route   POST /api/auth/login-ngo
// @access  Public
const loginNgo = async (req, res) => {
  const { email, password } = req.body;
  try {
    const account = await Ngo.findOne({ email });

    if (account && (await account.matchPassword(password))) {
      if (!account.isVerified) {
        return res.status(400).json({ message: 'Please verify your email first.' });
      }

      res.json({
        _id: account._id,
        name: account.ngoName,
        email: account.email,
        userType: 'Ngo',
        token: generateToken(account._id, 'Ngo'),
        kycStatus: account.kycStatus,
      });
    } else {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { registerUser, registerNgo, verifyOtp, login, loginNgo };