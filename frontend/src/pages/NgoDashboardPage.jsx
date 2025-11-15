import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMyPosts, resetPosts } from '../features/post/postSlice';
import { getMyProfile, requestWithdrawal } from '../features/auth/authSlice';
import { getTips, reset as resetAi } from '../features/ai/aiSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import PostItem from '../components/PostItem';

// Recharts Components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// MUI Components
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import WarningIcon from '@mui/icons-material/Warning';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // AI Icon

function NgoDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Get Auth state
  const { user, isLoading: authLoading, isError: authError, message: authMessage } = useSelector(
    (state) => state.auth
  );
  // Get Post state
  const { posts, isLoading: postsLoading, isError: postsError, message: postsMessage } = useSelector(
    (state) => state.posts
  );
  // Get AI state
  const { tips, isLoading: aiLoading } = useSelector((state) => state.ai);

  // Get user info, with defaults
  const kycStatus = user?.kycStatus || 'None';
  const totalWithdrawn = user?.totalWithdrawn || 0;

  // Effect 1: Handle auth and navigation
  useEffect(() => {
    if (!user || user.userType !== 'Ngo') {
      navigate('/login');
    }
  }, [user, navigate]);

  // Effect 2: Handle data fetching on mount
  useEffect(() => {
    // We get the fresh profile *and* the posts on load
    dispatch(getMyProfile());
    dispatch(getMyPosts());

    return () => {
      dispatch(resetPosts());
    };
  }, [dispatch]);

  // Effect 3: Handle errors from *all* slices
  useEffect(() => {
    if (postsError) {
      toast.error(postsMessage);
    }
    if (authError) {
      toast.error(authMessage);
    }
  }, [postsError, postsMessage, authError, authMessage]);

  // --- Calculations ---
  const totalCollected = posts.reduce(
    (acc, post) => acc + post.amountCollected,
    0
  );
  
  const availableBalance = totalCollected - totalWithdrawn;
  
  // A request is "pending" if their KYC status is "Pending" (after submitting a request)
  const hasPendingRequest = kycStatus === 'Pending';

  // Prepare chart data
  const chartData = posts.slice(0, 5).map((post) => ({
    name: post.title.substring(0, 15) + '...',
    Collected: post.amountCollected,
    Required: post.amountRequired,
  }));

  // --- Handlers ---
  const onWithdraw = () => {
    if (hasPendingRequest) {
      toast.error('You already have a withdrawal pending review.');
      return;
    }
    if (availableBalance <= 0) {
      toast.error('No available funds to withdraw.');
      return;
    }
    if (window.confirm(`You are about to request a withdrawal of $${availableBalance.toLocaleString()}. Proceed?`)) {
      dispatch(requestWithdrawal());
    }
  };

  const handleOpenAiModal = () => {
    dispatch(getTips());
    setIsAiModalOpen(true);
  };
  
  const handleCloseAiModal = () => {
    setIsAiModalOpen(false);
    dispatch(resetAi());
  };

  // --- Render Functions ---
  const renderKycStatus = () => {
    switch (kycStatus) {
      case 'Verified':
        return (
          <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
            KYC Verified. Withdrawals are enabled.
          </Alert>
        );
      case 'Pending':
        return (
          <Alert severity="info" icon={<PendingIcon fontSize="inherit" />}>
            Your KYC submission or Withdrawal Request is pending review.
          </Alert>
        );
      case 'Rejected':
        return (
          <Alert severity="error" icon={<WarningIcon fontSize="inherit" />}>
            KYC submission was rejected. Please resubmit.
            <Button 
              component={RouterLink} 
              to="/kyc" 
              variant="outlined" 
              size="small" 
              sx={{ ml: 2 }}
            >
              Resubmit KYC
            </Button>
          </Alert>
        );
      case 'None':
      default:
        return (
          <Alert severity="warning" icon={<WarningIcon fontSize="inherit" />}>
            You must complete KYC verification to enable withdrawals.
            <Button 
              component={RouterLink} 
              to="/kyc" 
              variant="contained" 
              size="small" 
              sx={{ ml: 2 }}
            >
              Complete KYC Now
            </Button>
          </Alert>
        );
    }
  };

  const isLoading = authLoading || postsLoading;
  if (isLoading && posts.length === 0 && !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My NGO Dashboard
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<AutoAwesomeIcon />}
          onClick={handleOpenAiModal}
        >
          Get AI Fundraising Tips
        </Button>
      </Box>

      {/* KYC Status Bar */}
      <Box mb={4}>
        {renderKycStatus()}
      </Box>

      {/* Stats & Chart Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Stats Text */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>
              My Stats
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary">
              ${availableBalance.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Available for Withdrawal
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${totalCollected.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Total Collected
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ${totalWithdrawn.toLocaleString()}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Total Withdrawn
            </Typography>
            
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={onWithdraw}
              disabled={kycStatus !== 'Verified' || availableBalance <= 0 || hasPendingRequest || isLoading}
            >
              {hasPendingRequest ? 'Withdrawal Pending' : `Withdraw $${availableBalance.toLocaleString()}`}
            </Button>
          </Grid>
          
          {/* Chart */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Top 5 Fundraisers
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Collected" fill="#8884d8" />
                <Bar dataKey="Required" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Paper>

      {/* --- My Posts List --- */}
      <Typography variant="h5" gutterBottom>
        My Posts
      </Typography>
      
      {postsError && <Alert severity="error">{postsMessage}</Alert>}

      {posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item key={post._id} xs={12} sm={6} md={4}>
              <PostItem post={post} />
            </Grid>
          ))}
        </Grid>
      ) : (
        !isLoading && <Typography variant="body1">
          You have not created any posts yet.
        </Typography>
      )}

      {/* --- AI Modal Component --- */}
      <Dialog open={isAiModalOpen} onClose={handleCloseAiModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoAwesomeIcon sx={{ mr: 1 }} /> AI Fundraising Coach
        </DialogTitle>
        <DialogContent dividers>
          {aiLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {tips.map((tip) => (
                <ListItem key={tip.id} divider>
                  <ListItemText
                    primary={tip.title}
                    secondary={tip.tip}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAiModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NgoDashboardPage;