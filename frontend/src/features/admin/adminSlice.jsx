import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';
import toast from 'react-hot-toast';

const initialState = {
  users: [],
  ngos: [],
  withdrawalRequests: [], // <-- 1. Add new state
  isLoading: false,
  isError: false,
  message: '',
};

// Get all users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.getAllUsers(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all NGOs
export const getAllNgos = createAsyncThunk(
  'admin/getAllNgos',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.getAllNgos(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify NGO KYC
export const verifyNgoKyc = createAsyncThunk(
  'admin/verifyKyc',
  async (ngoId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.verifyNgoKyc(ngoId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// --- 2. ADD NEW THUNKS ---
export const getWithdrawals = createAsyncThunk(
  'admin/getWithdrawals',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.getWithdrawals(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveWithdrawal = createAsyncThunk(
  'admin/approveWithdrawal',
  async (requestId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.approveWithdrawal(requestId, token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// --- END OF ADDITION ---

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false; state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Get NGOs
      .addCase(getAllNgos.pending, (state) => { state.isLoading = true; })
      .addCase(getAllNgos.fulfilled, (state, action) => {
        state.isLoading = false; state.ngos = action.payload;
      })
      .addCase(getAllNgos.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Verify KYC
      .addCase(verifyNgoKyc.pending, (state) => { state.isLoading = true; })
      .addCase(verifyNgoKyc.fulfilled, (state, action) => {
        state.isLoading = false; toast.success('KYC Verified!');
        const index = state.ngos.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.ngos[index] = action.payload;
        }
      })
      .addCase(verifyNgoKyc.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; toast.error(action.payload);
      })
      // --- 3. ADD NEW CASES ---
      .addCase(getWithdrawals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWithdrawals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.withdrawalRequests = action.payload;
      })
      .addCase(getWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(approveWithdrawal.pending, (state) => {
        // Don't set global loading, just for the button
      })
      .addCase(approveWithdrawal.fulfilled, (state, action) => {
        toast.success('Withdrawal Approved!');
        // Remove the request from the list
        state.withdrawalRequests = state.withdrawalRequests.filter(
          (req) => req._id !== action.payload._id
        );
      })
      .addCase(approveWithdrawal.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
    // --- END OF ADDITION ---
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;