import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  verifyPayment,
  reset,
} from '../features/payment/paymentSlice';
import { getPosts, getMyPosts } from '../features/post/postSlice';
import toast from 'react-hot-toast';

// MUI Components
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function DonationModal({ open, handleClose, post, onSuccessfulDonation }) {
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth); // This will be null on logout
  const { order, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.payment
  );

  const handleCloseModal = useCallback(() => {
    dispatch(reset());
    setAmount('');
    handleClose();
  }, [dispatch, handleClose]);

  const openRazorpayCheckout = useCallback((order) => {
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'NGO Connect',
      description: `Donation for ${post.title}`,
      order_id: order.id,
      handler: async (response) => {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          postId: post._id,
          amount: amount,
        };
        dispatch(verifyPayment(paymentData));
      },
      // --- FIX: Make prefill null-safe ---
      // Check if user exists before trying to access its properties
      prefill: {
        name: user ? user.name : '',
        email: user ? user.email : '',
      },
      // --- END OF FIX ---
      theme: {
        color: '#3399cc',
      },
      modal: {
        ondismiss: () => {
          handleCloseModal();
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  // --- FIX: Change dependencies from user.name/user.email to just user ---
  }, [dispatch, post._id, post.title, user, amount, handleCloseModal]);
  // --- END OF FIX ---

  const onDonateSubmit = (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    const orderData = {
      amount: Number(amount),
      postId: post._id,
    };
    dispatch(createOrder(orderData));
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && order) {
      openRazorpayCheckout(order);
    }
    
    if (isSuccess && message === 'Payment verified successfully') {
       toast.success('Donation successful! Thank you.');
       
       dispatch(getPosts());

       if (user && user.userType === 'Ngo') {
         dispatch(getMyPosts());
       }

       if (onSuccessfulDonation) {
         onSuccessfulDonation();
       }
       handleCloseModal();
    }
  }, [order, isSuccess, isError, message, dispatch, handleCloseModal, openRazorpayCheckout, onSuccessfulDonation, user]);

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Box sx={modalStyle}>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Donate to {post?.title}
        </Typography>

        <Box component="form" onSubmit={onDonateSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount ($)"
            name="amount"
            type="number"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, p: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : `Donate $${amount || 0}`}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DonationModal;