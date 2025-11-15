import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from './postService';
import toast from 'react-hot-toast';

const initialState = {
  posts: [],
  selectedPost: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  isCreated: false,
  message: '',
};

// Get all posts thunk
export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getPosts(token);
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

// Create new post
export const createPost = createAsyncThunk(
  'posts/create',
  async (postData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.createPost(postData, token);
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

// Get single post by ID
export const getPostById = createAsyncThunk(
  'posts/getOne',
  async (postId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getPostById(postId, token);
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

// --- 1. ADD THIS THUNK ---
// Create new comment
export const createComment = createAsyncThunk(
  'posts/createComment',
  async ({ postId, commentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.createComment(postId, commentData, token);
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

// Delete post
export const deletePost = createAsyncThunk(
  'posts/delete',
  async (postId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.deletePost(postId, token);
    } catch (error) {
      // ... (error handling)
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

// --- ADD THIS THUNK ---
// Get my posts
export const getMyPosts = createAsyncThunk(
  'posts/getMyPosts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getMyPosts(token);
    } catch (error) {
      // ... (error handling)
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

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.isCreated = false;
      state.message = '';
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
    resetPosts: (state) => {
       state.posts = [];
       state.isError = false;
       state.isSuccess = false;
       state.isLoading = false;
       state.isCreated = false;
       state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCreated = true;
        state.posts.push(action.payload);
        toast.success('Post created successfully!');
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // --- THIS IS THE FIX ---
      .addCase(getPostById.pending, (state) => {
        state.isLoading = true;
        // state.selectedPost = null; // <-- REMOVED THIS LINE
      })
      // --- END OF FIX ---
      .addCase(getPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedPost = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.selectedPost = null; // Keep this one for real errors
      })
      // --- 2. ADD THESE CASES ---
      .addCase(createComment.pending, (state) => {
        state.isLoading = true; // Use main loading flag
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success('Comment added!');
        if (state.selectedPost) {
          state.selectedPost.comments = action.payload; // Update comments
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // --- ADD THESE CASES ---
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message);
        // Remove from posts array if it exists
        state.posts = state.posts.filter((p) => p._id !== action.payload.id);
        state.selectedPost = null; // Clear selected post
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // --- ADD THESE CASES ---
      .addCase(getMyPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload; // Set posts array to *my* posts
      })
      .addCase(getMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
    // --- END OF ADDITION ---
  },
});

export const { reset, resetPosts, clearSelectedPost } = postSlice.actions; 
export default postSlice.reducer;