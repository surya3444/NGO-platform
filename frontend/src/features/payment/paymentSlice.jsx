import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from './paymentService';

const initialState = {
  order: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const createOrder = createAsyncThunk('payment/createOrder', async (orderData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await paymentService.createOrder(orderData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const verifyPayment = createAsyncThunk('payment/verifyPayment', async (paymentData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await paymentService.verifyPayment(paymentData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => { state.isLoading = true; })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = action.payload.message;
        state.order = null; // <-- Critical fix
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      });
  },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;