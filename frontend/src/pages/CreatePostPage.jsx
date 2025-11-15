import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, reset } from '../features/post/postSlice';
import toast from 'react-hot-toast';

import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';

function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amountRequired: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { title, description, amountRequired } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isCreated, isError, message } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (!user || user.userType !== 'Ngo') {
      toast.error('You must be logged in as an NGO to create a post.');
      navigate('/login');
    }
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isCreated) {
      navigate('/my-dashboard'); // Go to NGO dash
    }
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isCreated, isError, message, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload an image');
      return;
    }
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    postData.append('amountRequired', amountRequired);
    postData.append('image', image);
    dispatch(createPost(postData));
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Create New Fundraiser
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal" required fullWidth id="title" label="Post Title"
            name="title" autoFocus value={title} onChange={onChange}
          />
          <TextField
            margin="normal" required fullWidth id="description" label="Description"
            name="description" multiline rows={6} value={description} onChange={onChange}
          />
          <TextField
            margin="normal" required fullWidth id="amountRequired" label="Amount Required ($)"
            name="amountRequired" type="number" value={amountRequired} onChange={onChange}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden onChange={onFileChange} />
          </Button>
          {imagePreview && (
            <Box sx={{ mt: 2, border: '1px dashed grey', p: 1 }}>
              <Typography variant="body2" gutterBottom>Image Preview:</Typography>
              <img
                src={imagePreview} alt="Preview"
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
              />
            </Box>
          )}
          <Button
            type="submit" fullWidth variant="contained" size="large"
            sx={{ mt: 3, mb: 2, p: 1.5 }} disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Post'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default CreatePostPage;