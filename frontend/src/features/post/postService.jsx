import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts/';

// Get all posts
const getPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

// --- ADD THIS FUNCTION ---
// Create a new post
// postData will be FormData
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  };
  const response = await axios.post(API_URL, postData, config);
  return response.data;
};
// --- END OF ADDITION ---

// --- ADD THIS FUNCTION ---
// Get single post by ID
const getPostById = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + postId, config);
  return response.data;
};
// --- END OF ADDITION ---

// --- ADD THIS FUNCTION ---
// Create a new comment
const createComment = async (postId, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // commentData will be { text: '...' }
  const response = await axios.post(
    API_URL + postId + '/comments',
    commentData,
    config
  );
  return response.data; // Returns the new list of comments
};
// --- END OF ADDITION ---

// --- ADD THIS FUNCTION ---
// Delete a post
const deletePost = async (postId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + postId, config);
  return response.data; // Returns { message: '...', id: '...' }
};
// --- END OF ADDITION ---

// --- ADD THIS FUNCTION ---
// Get posts for the logged-in NGO
const getMyPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + 'myposts', config);
  return response.data;
};
// --- END OF ADDITION ---

const postService = {
  getPosts,
  createPost,
  getPostById,
  createComment, // <-- Add to export
  deletePost,   // <-- Add to export
  getMyPosts,   // <-- Add to export
};

export default postService;