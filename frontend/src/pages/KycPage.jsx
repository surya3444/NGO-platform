import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { submitKyc, reset } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

// MUI Components
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  MenuItem,
} from '@mui/material';

function KycPage() {
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    documentType: 'PAN',
  });
  const [document, setDocument] = useState(null);
  const [fileName, setFileName] = useState('');

  const { accountHolderName, accountNumber, ifscCode, documentType } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  // --- THIS IS THE FIX ---
  // We separate the redirect logic from the error handling
  useEffect(() => {
    // Redirect if not an NGO
    if (user && user.userType !== 'Ngo') {
      navigate('/login');
    }
    
    // Redirect on SUCCESS
    if (isSuccess && user && user.kycStatus === 'Pending') {
      navigate('/my-dashboard');
    }

    // Show error on FAILURE
    if (isError) {
      toast.error(message);
    }

    // Reset flags on mount/unmount
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isSuccess, isError, message, dispatch]);
  // --- END OF FIX ---

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocument(file);
      setFileName(file.name);
    } else {
      setDocument(null);
      setFileName('');
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!document) {
      toast.error('Please upload a document file.');
      return;
    }

    const kycData = new FormData();
    kycData.append('accountHolderName', accountHolderName);
    kycData.append('accountNumber', accountNumber);
    kycData.append('ifscCode', ifscCode);
    kycData.append('documentType', documentType);
    kycData.append('document', document); // The file

    dispatch(submitKyc(kycData));
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Submit KYC for Verification
        </Typography>
        <Typography align="center" gutterBottom>
          Please provide your bank details for withdrawals and a verification document.
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="accountHolderName"
            label="Account Holder Name"
            name="accountHolderName"
            autoFocus
            value={accountHolderName}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="accountNumber"
            label="Bank Account Number"
            name="accountNumber"
            value={accountNumber}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="ifscCode"
            label="IFSC Code"
            name="ifscCode"
            value={ifscCode}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            id="documentType"
            label="Document Type"
            name="documentType"
            value={documentType}
            onChange={onChange}
          >
            <MenuItem value="PAN">PAN Card</MenuItem>
            <MenuItem value="Certificate">Certificate of Incorporation</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          
          <Button variant="contained" component="label" sx={{ mt: 2, mb: 1 }}>
            Upload Document (PDF, JPG, PNG)
            <input type="file" hidden onChange={onFileChange} accept=".jpg,.jpeg,.png,.pdf" />
          </Button>
          {fileName && <Typography variant="body2" sx={{display: 'inline-block', ml: 2}}>{fileName}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, p: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit for Review'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default KycPage;