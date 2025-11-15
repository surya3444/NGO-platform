import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  LinearProgress,
} from '@mui/material';
import DonationModal from './DonationModal';

const API_BASE_URL = 'http://localhost:5000/';

function PostItem({ post }) {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const imageUrl = post.image
    ? `${API_BASE_URL}${post.image.replace(/\\/g, '/')}`
    : 'https://placehold.co/300x200?text=No+Image';
    
  const progress = (post.amountCollected / post.amountRequired) * 100;

  return (
    <> 
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={post.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            by **{post.ngo?.ngoName || 'Unknown NGO'}**
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.description.substring(0, 150)}...
          </Typography>

          <Box sx={{ mt: 3, mb: 1 }}>
            <Typography variant="body2" color="text.primary">
              ${post.amountCollected.toLocaleString()} raised of $
              {post.amountRequired.toLocaleString()}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress > 100 ? 100 : progress}
              sx={{ height: 10, borderRadius: 5, mt: 1 }}
            />
          </Box>
        </CardContent>
        <Box sx={{ p: 2, pt: 0 }}>
          <Button 
            size="small" 
            variant="outlined"
            component={RouterLink}
            to={`/post/${post._id}`}
          >
            View Details
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            sx={{ ml: 1 }}
            onClick={handleOpen}
          >
            Donate Now
          </Button>
        </Box>
      </Card>
      
      {post && (
        <DonationModal 
          open={modalOpen} 
          handleClose={handleClose} 
          post={post} 
        />
      )}
    </>
  );
}

export default PostItem;