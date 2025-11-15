import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payment/';

// Create payment order
const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'order', orderData, config);
  return response.data;
};

// Verify payment
const verifyPayment = async (paymentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'verify', paymentData, config);
  return response.data;
};

const paymentService = {
  createOrder,
  verifyPayment,
};

export default paymentService;