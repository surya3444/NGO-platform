import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, registerNgo, reset } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Link,
  Paper,
} from '@mui/material';

function RegisterPage() {
  const [accountType, setAccountType] = useState('User');
  const [formData, setFormData] = useState({
    name: '',
    ngoName: '',
    email: '',
    password: '',
    password2: '',
    description: '',
    address: '',
  });

  const { name, ngoName, email, password, password2, description, address } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAccountTypeChange = (event, newAccountType) => {
    if (newAccountType !== null) {
      setAccountType(newAccountType);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    if (accountType === 'User') {
      dispatch(registerUser({ name, email, password }));
    } else {
      dispatch(registerNgo({ ngoName, email, password, description, address }));
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && message) {
      toast.success(message);
      navigate(`/verify-otp?email=${email}`);
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch, email]);

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Box sx={{ my: 2, width: '100%' }}>
          <ToggleButtonGroup
            color="primary" value={accountType} exclusive fullWidth
            onChange={handleAccountTypeChange} aria-label="Account Type"
          >
            <ToggleButton value="User">I'm a Donor</ToggleButton>
            <ToggleButton value="Ngo">I'm an NGO</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal" required fullWidth id="email" label="Email Address"
            name="email" autoComplete="email" autoFocus value={email} onChange={onChange}
          />
          <TextField
            margin="normal" required fullWidth name="password" label="Password"
            type="password" id="password" autoComplete="new-password"
            value={password} onChange={onChange}
          />
          <TextField
            margin="normal" required fullWidth name="password2" label="Confirm Password"
            type="password" id="password2" autoComplete="new-password"
            value={password2} onChange={onChange}
          />
          {accountType === 'User' && (
            <TextField
              margin="normal" required fullWidth id="name" label="Full Name"
              name="name" autoComplete="name" value={name} onChange={onChange}
            />
          )}
          {accountType === 'Ngo' && (
            <>
              <TextField
                margin="normal" required fullWidth id="ngoName" label="NGO Name"
                name="ngoName" autoComplete="organization" value={ngoName} onChange={onChange}
              />
              <TextField
                margin="normal" required fullWidth id="description" label="NGO Description"
                name="description" multiline rows={3} value={description} onChange={onChange}
              />
              <TextField
                margin="normal" fullWidth id="address" label="Address (Optional)"
                name="address" value={address} onChange={onChange}
              />
            </>
          )}
          <Button
            type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2, p: 1.5 }} disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}
export default RegisterPage;