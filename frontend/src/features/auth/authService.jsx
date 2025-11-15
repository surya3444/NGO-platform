import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';
const NGO_API_URL = 'http://localhost:5000/api/ngo/';
const ADMIN_API_URL = 'http://localhost:5000/api/admin/';

// Register a User (Donor)
const registerUser = async (userData) => {
  const response = await axios.post(API_URL + 'register-user', userData);
  return response.data;
};

// Register an NGO
const registerNgo = async (ngoData) => {
  const response = await axios.post(API_URL + 'register-ngo', ngoData);
  return response.data;
};

// Verify OTP
const verifyOtp = async (otpData) => {
  const response = await axios.post(API_URL + 'verify-otp', otpData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login (for Donors)
const login = async (loginData) => {
  const response = await axios.post(API_URL + 'login', loginData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login for NGOs
const loginNgo = async (loginData) => {
  const response = await axios.post(API_URL + 'login-ngo', loginData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
};

// Submit NGO KYC
const submitKyc = async (kycData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(NGO_API_URL + 'kyc', kycData, config);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login as Admin
const loginAdmin = async (loginData) => {
  const response = await axios.post(ADMIN_API_URL + 'login', loginData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// --- ADD THIS NEW FUNCTION ---
// Get the currently logged-in NGO's profile
const getMyProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // This route already exists in your backend
  const response = await axios.get(NGO_API_URL + 'profile', config);
  return response.data;
};
// --- END OF ADDITION --

// --- ADD THIS NEW FUNCTION ---
// Request a withdrawal
const requestWithdrawal = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // No body is needed, amount is calculated on backend
  const response = await axios.post(NGO_API_URL + 'request-withdrawal', {}, config);
  return response.data;
};
// --- END OF ADDITION ---

const authService = {
  registerUser,
  registerNgo,
  verifyOtp,
  login,
  loginNgo,
  logout,
  submitKyc,
  loginAdmin,
  getMyProfile, // <-- Add to export
  requestWithdrawal, // <-- Add to export
};

export default authService; 