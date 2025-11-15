import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/';

// We need the token for all admin routes
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all users (donors)
const getAllUsers = async (token) => {
  const response = await axios.get(API_URL + 'users', getConfig(token));
  return response.data;
};

// Get all NGOs
const getAllNgos = async (token) => {
  const response = await axios.get(API_URL + 'ngos', getConfig(token));
  return response.data;
};

// Verify an NGO's KYC
const verifyNgoKyc = async (ngoId, token) => {
  const response = await axios.put(
    API_URL + `kyc/verify/${ngoId}`,
    {}, // Empty body
    getConfig(token)
  );
  return response.data; // Returns the updated NGO
};

// --- ADD THESE NEW FUNCTIONS ---
// Get all withdrawal requests
const getWithdrawals = async (token) => {
  const response = await axios.get(API_URL + 'withdrawals', getConfig(token));
  return response.data;
};

// Approve a withdrawal
const approveWithdrawal = async (requestId, token) => {
  const response = await axios.put(
    API_URL + `approve-withdrawal/${requestId}`,
    {},
    getConfig(token)
  );
  return response.data; // Returns the approved request
};
// --- END OF ADDITION ---

const adminService = {
  getAllUsers,
  getAllNgos,
  verifyNgoKyc,
  getWithdrawals,    // <-- Add to export
  approveWithdrawal, // <-- Add to export
};

export default adminService;