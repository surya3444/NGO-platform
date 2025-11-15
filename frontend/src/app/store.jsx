import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import postReducer from '../features/post/postSlice';
import paymentReducer from '../features/payment/paymentSlice';
import adminReducer from '../features/admin/adminSlice';
import aiReducer from '../features/ai/aiSlice'; // <-- 1. Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    payment: paymentReducer,
    admin: adminReducer,
    ai: aiReducer, // <-- 2. Add
  },
});