import Razorpay from 'razorpay';
import crypto from 'crypto';
import Post from '../models/postModel.js';

// --- THIS IS THE FIX ---
// Use your hardcoded keys
const RAZORPAY_KEY_ID = "rzp_test_RuzkZ02TUr9toa";
const RAZORPAY_KEY_SECRET = "GTJZ9nGgLsXastcTPq7XwyQX";
// --- END OF FIX ---

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/payment/order
// @access  Private
const createPaymentOrder = async (req, res) => {
  const { amount, postId } = req.body; // Amount in INR

  if (!amount || !postId) {
    return res.status(400).json({ message: 'Amount and Post ID are required' });
  }

  const options = {
    amount: Number(amount) * 100,
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
      postId: postId,
      userId: req.user._id, // From 'protect' middleware
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
};

// @desc    Verify payment and update post
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    postId,
    amount, // Amount in INR
  } = req.body;

  try {
    // --- Verification Logic ---
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // --- THIS IS THE FIX ---
    // Use the hardcoded key from above, not process.env
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET) 
      .update(body.toString())
      .digest('hex');
    // --- END OF FIX ---

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Payment is successful
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newDonation = {
        user: req.user._id,
        amount: Number(amount),
        paymentId: razorpay_payment_id,
      };

      post.donations.push(newDonation);
      post.amountCollected = post.amountCollected + Number(amount);

      await post.save();

      res.status(200).json({
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      // Payment verification failed
      res.status(400).json({ message: 'Invalid signature, payment failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { createPaymentOrder, verifyPayment };
