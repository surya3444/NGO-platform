import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';
import toast from 'react-hot-toast';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null,
  isVerified: false,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// All thunks
export const registerUser = createAsyncThunk('auth/registerUser', async (userData, thunkAPI) => {
  try {
    return await authService.registerUser(userData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const registerNgo = createAsyncThunk('auth/registerNgo', async (ngoData, thunkAPI) => {
  try {
    return await authService.registerNgo(ngoData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (otpData, thunkAPI) => {
  try {
    return await authService.verifyOtp(otpData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const login = createAsyncThunk('auth/login', async (loginData, thunkAPI) => {
  try {
    return await authService.login(loginData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const loginNgo = createAsyncThunk('auth/loginNgo', async (loginData, thunkAPI) => {
  try {
    return await authService.loginNgo(loginData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});
export const submitKyc = createAsyncThunk('auth/submitKyc', async (kycData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await authService.submitKyc(kycData, token);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (loginData, thunkAPI) => {
  try {
    return await authService.loginAdmin(loginData);
  } catch (error) {
    const message = (error.response?.data?.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// --- ADD THIS NEW THUNK ---
export const getMyProfile = createAsyncThunk(
  'auth/getMyProfile',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.getMyProfile(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// --- END OF ADDITION ---

// --- ADD THIS NEW THUNK ---
export const requestWithdrawal = createAsyncThunk(
  'auth/requestWithdrawal',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.requestWithdrawal(token);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// --- END OF ADDITION ---


// The slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.isVerified = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register (User & NGO)
      .addCase(registerUser.pending, (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(registerNgo.pending, (state) => { state.isLoading = true; })
      .addCase(registerNgo.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.message = action.payload.message;
      })
      .addCase(registerNgo.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.isVerified = true; state.user = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      // Login (User, NGO, Admin)
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      .addCase(loginNgo.pending, (state) => { state.isLoading = true; })
      .addCase(loginNgo.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload;
      })
      .addCase(loginNgo.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      .addCase(loginAdmin.pending, (state) => { state.isLoading = true; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // KYC
      .addCase(submitKyc.pending, (state) => { state.isLoading = true; })
      .addCase(submitKyc.fulfilled, (state, action) => {
        state.isLoading = false; state.isSuccess = true; state.user = action.payload; toast.success('KYC details submitted!');
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload; toast.error(action.payload);
      })
      // --- ADD THESE NEW CASES ---
      .addCase(getMyProfile.pending, (state) => {
        state.isLoading = true;
      })
      // --- THIS IS A BUG FIX ---
      // This reducer must update the *entire* user object
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        const oldUser = JSON.parse(localStorage.getItem('user'));
        
        // Combine old token with new full profile data
        const updatedUser = {
          ...oldUser, // Keep token
          ...action.payload, // Add all new data
          name: action.payload.ngoName, // Standardize 'name'
        };
        state.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
      // --- END OF BUG FIX ---
      .addCase(getMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // --- ADD THESE NEW CASES ---
      .addCase(requestWithdrawal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
        // Manually update kycStatus to show "Pending" status
        if (state.user) {
          state.user.kycStatus = 'Pending';
        }
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload);
      });
    // --- END OF ADDITION ---
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;