import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, resetPosts } from '../features/post/postSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import PostItem from '../components/PostItem';

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (isError) {
      toast.error(message);
    }
    dispatch(getPosts());
    return () => {
      dispatch(resetPosts());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Active Fundraisers
      </Typography>

      {isError && <Alert severity="error">{message}</Alert>}

      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={4}>
              <PostItem post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !isLoading && <Typography variant="body1">No posts found.</Typography>
      )}
    </Box>
  );
}

export default DashboardPage;