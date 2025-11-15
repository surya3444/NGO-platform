import React, { useEffect, useState, useCallback } from 'react'; // <-- 1. Import useCallback
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getPostById,
  clearSelectedPost,
  reset,
  createComment,
  deletePost,
} from '../features/post/postSlice';

import {
  Container, Box, Typography, CircularProgress, Paper, Button,
  Grid, LinearProgress, Alert, TextField, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import DonationModal from '../components/DonationModal';

const API_BASE_URL = 'http://localhost:5000/';

function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { selectedPost, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );

  // --- 2. Wrap function in useCallback ---
  const handleFetchPost = useCallback(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);
  // --- END OF FIX ---

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    handleFetchPost();
    return () => {
      dispatch(clearSelectedPost());
      dispatch(reset());
    };
  // --- 3. Add handleFetchPost to dependencies ---
  }, [user, navigate, dispatch, id, handleFetchPost]);
  // --- END OF FIX ---

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    dispatch(createComment({ postId: id, commentData: { text: commentText } }));
    setCommentText('');
  };

  const onDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await dispatch(deletePost(id));
      navigate('/my-dashboard');
    }
  };
  
  // ... (rest of the file is unchanged) ...
  if (isLoading && !selectedPost) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (isError) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Error: {message}</Alert>
        <Button component={RouterLink} to="/dashboard" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!selectedPost) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning">Post not found.</Alert>
        <Button component={RouterLink} to="/dashboard" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const {
    title, description, image, ngo,
    amountCollected, amountRequired, comments,
  } = selectedPost;

  const isOwner = user && user._id === ngo._id;
  const imageUrl = image ? `${API_BASE_URL}${image.replace(/\\/g, '/')}` : 'https://placehold.co/600x400?text=No+Image';
  const progress = (amountCollected / amountRequired) * 100;

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button component={RouterLink} to="/dashboard" startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        {isOwner && (
          <Button
            variant="contained" color="error" startIcon={<DeleteIcon />}
            onClick={onDeletePost} disabled={isLoading}
          >
            Delete Post
          </Button>
        )}
      </Box>
      
      <Paper elevation={3}>
        <Grid container>
          <Grid item xs={12} md={7}>
            <Box
              component="img" src={imageUrl} alt={title}
              sx={{ width: '100%', height: 'auto', maxHeight: 600, objectFit: 'cover' }}
            />
          </Grid>
          <Grid item xs={12} md={5} sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h3" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              by **{ngo?.ngoName || 'Unknown NGO'}**
            </Typography>
            <Box sx={{ my: 3 }}>
              <Typography variant="h5" color="text.primary">
                ${amountCollected.toLocaleString()} raised of ${amountRequired.toLocaleString()}
              </Typography>
              <LinearProgress
                variant="determinate" value={progress > 100 ? 100 : progress}
                sx={{ height: 12, borderRadius: 5, mt: 1 }}
              />
            </Box>
            <Button size="large" variant="contained" fullWidth sx={{ mb: 3 }} onClick={() => setModalOpen(true)}>
              Donate Now
            </Button>
            <Typography variant="body1" paragraph sx={{ flexGrow: 1 }}>
              {description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Comments Section */}
      <Box mt={4}>
         <Typography variant="h5" gutterBottom>Comments</Typography>
         <Paper elevation={2} sx={{p: 3}}>
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
            <TextField
              label="Write a comment..." fullWidth multiline rows={3}
              value={commentText} onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
            />
            <Button type="submit" variant="contained" sx={{ mt: 1 }} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Post Comment'}
            </Button>
          </Box>
          <Divider />
          <List>
            {comments && comments.length > 0 ? (
              [...comments].reverse().map((comment) => (
                <React.Fragment key={comment._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar><Avatar>{comment.name.substring(0, 1)}</Avatar></ListItemAvatar>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{comment.name}</Typography>}
                      secondary={<Typography variant="body2" color="text.primary">{comment.text}</Typography>}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography sx={{ p: 2 }}>Be the first to comment!</Typography>
            )}
          </List>
         </Paper>
      </Box>

      {/* Donation Modal */}
      {selectedPost && (
        <DonationModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          post={selectedPost}
          onSuccessfulDonation={handleFetchPost} // Re-fetch post data on success
        />
      )}
    </Container>
  );
}

export default PostDetailsPage;