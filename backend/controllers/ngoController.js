import Ngo from '../models/ngoModel.js';
import Post from '../models/postModel.js';
import WithdrawalRequest from '../models/withdrawalRequestModel.js';

// @desc    Submit NGO KYC details
// @route   POST /api/ngo/kyc
// @access  Private/Ngo
const submitKyc = async (req, res) => {
  const { accountHolderName, accountNumber, ifscCode, documentType } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Document file is required' });
  }

  try {
    const ngo = await Ngo.findById(req.user._id);

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    // Update KYC details
    ngo.kycDetails = {
      accountHolderName,
      accountNumber,
      ifscCode,
      documentType,
      documentUrl: req.file.path,
    };
    ngo.kycStatus = 'Pending'; // Set status to Pending for review

    const updatedNgo = await ngo.save();

    // Return the updated user info (like in authController)
    res.json({
      _id: updatedNgo._id,
      name: updatedNgo.ngoName,
      email: updatedNgo.email,
      userType: 'Ngo',
      token: req.headers.authorization.split(' ')[1], // Send back the same token
      kycStatus: updatedNgo.kycStatus,
      totalWithdrawn: updatedNgo.totalWithdrawn, // Send all fields
    });
  } catch (error) {
    console.error('--- ERROR in submitKyc ---:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- THIS IS THE FIX ---
// @desc    Get logged-in NGO's profile
// @route   GET /api/ngo/profile
// @access  Private/Ngo
const getNgoProfile = async (req, res) => {
  // The 'protect' middleware already fetched the user and put it in req.user.
  // We just need to send it back. This avoids a redundant database call.
  // We're also querying the DB one more time just to get the absolute freshest data.
  try {
    const ngo = await Ngo.findById(req.user._id).select('-password');
    if (ngo) {
      res.json(ngo);
    } else {
      res.status(404).json({ message: 'NGO not found' });
    }
  } catch (error) {
    console.error('--- ERROR in getNgoProfile ---:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// --- END OF FIX ---

// @desc    Request a withdrawal
// @route   POST /api/ngo/request-withdrawal
// @access  Private/Ngo
const requestWithdrawal = async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.user._id);

    // 1. Check all conditions
    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }
    if (ngo.kycStatus !== 'Verified') {
      return res.status(400).json({ message: 'KYC must be verified to withdraw' });
    }
    
    // 2. Check for an existing pending request
    const existingRequest = await WithdrawalRequest.findOne({
      ngo: req.user._id,
      status: 'Pending',
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending withdrawal request' });
    }

    // 3. Calculate available balance
    const posts = await Post.find({ ngo: req.user._id });
    const totalCollected = posts.reduce(
      (acc, post) => acc + post.amountCollected,
      0
    );
    const availableBalance = totalCollected - ngo.totalWithdrawn;

    if (availableBalance <= 0) {
      return res.status(400).json({ message: 'No available funds to withdraw' });
    }

    // 4. Create the withdrawal request
    const withdrawalRequest = new WithdrawalRequest({
      ngo: req.user._id,
      ngoName: ngo.ngoName,
      amount: availableBalance,
      status: 'Pending',
      bankDetails: ngo.kycDetails,
    });

    await withdrawalRequest.save();

    res.status(201).json({ message: 'Withdrawal request submitted successfully' });

  } catch (error) {
    console.error('--- ERROR in requestWithdrawal ---:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { submitKyc, getNgoProfile, requestWithdrawal };