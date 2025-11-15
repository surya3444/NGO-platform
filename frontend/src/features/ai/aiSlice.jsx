import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from './aiService';
import toast from 'react-hot-toast';

const initialState = {
  tips: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get AI tips
export const getTips = createAsyncThunk(
  'ai/getTips',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await aiService.getFundraisingTips(token);
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

export const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tips = action.payload;
      })
      .addCase(getTips.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { reset } = aiSlice.actions;
export default aiSlice.reducer;