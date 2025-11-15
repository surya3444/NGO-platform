import React, { useState, useEffect } from 'react';
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, reset } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  Paper,
} from '@mui/material';

function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isVerified, message } = useSelector(
    (state) => state.auth
  );

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error('Email or OTP is missing.');
      return;
    }
    dispatch(verifyOtp({ email, otp }));
  };

  useEffect(() => {
    if (!email) {
      toast.error('No email found. Please register again.');
      navigate('/register');
    }
    if (isError) {
      toast.error(message);
    }
    // Only redirect if OTP verification was successful
    if (isVerified && user) {
      toast.success('Verification successful! Welcome.');
      if (user.userType === 'Ngo') navigate('/my-dashboard');
      else navigate('/dashboard');
    }
    // Reset flags on unmount
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isVerified, message, navigate, dispatch, email]);

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Verify Your Email
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          An OTP has been sent to **{email}**. Please enter it below.
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal" required fullWidth id="otp" label="6-Digit OTP"
            name="otp" autoFocus value={otp}
            onChange={(e) => setOtp(e.target.value)}
            inputProps={{ maxLength: 6 }}
          />
          <Button
            type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2, p: 1.5 }} disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify Account'}
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            {'Already verified? Sign In'}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default VerifyOtpPage;