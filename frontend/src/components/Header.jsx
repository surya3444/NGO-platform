import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

// MUI Components
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = async () => {
    try {
      await dispatch(logout()).unwrap(); 
      dispatch(reset()); 
      navigate('/login'); 
    } catch (error) {
      console.error('Failed to log out:', error);
      dispatch(reset());
      navigate('/login');
    }
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* --- Logo / Home Link --- */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          
          {/* --- THIS IS THE FIX --- */}
          {/* Added fontSize to give the SVG a specific size */}
          <VolunteerActivismIcon
            sx={{ mr: 1, color: 'white' }}
            fontSize="large" 
          />
          {/* --- END OF FIX --- */}

          <Typography
            variant="h6"
            component={RouterLink}
            to={user ? '/dashboard' : '/'}
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            NGO Connect
          </Typography>
        </Box>

        {/* --- Auth Links --- */}
        {user ? (
          // --- Links for LOGGED-IN users ---
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user.userType === 'Ngo' && (
              <>
                <Button
                  component={RouterLink}
                  to="/my-dashboard"
                  color="inherit"
                  startIcon={<DashboardIcon />}
                >
                  My Dashboard
                </Button>
                <Button
                  component={RouterLink}
                  to="/create-post"
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  sx={{ mr: 2, ml: 1 }}
                >
                  Create Post
                </Button>
              </>
            )}

            {user.userType === 'Admin' && (
              <Button
                component={RouterLink}
                to="/admin/dashboard"
                color="inherit"
                startIcon={<DashboardIcon />}
              >
                Admin Panel
              </Button>
            )}
            <Button component={RouterLink} to="./FEATURESPAGE.html" color="inherit">
              features
            </Button>
            <Button component={RouterLink} to="./CHAT.html" color="inherit">
              Chat with AI
            </Button>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Hi, {user.name}
            </Typography>
            <Button color="inherit" onClick={onLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          // --- Links for LOGGED-OUT users ---
          <Box>
            <Button component={RouterLink} to="/login" color="inherit">
              Donor Login
            </Button>
            <Button component={RouterLink} to="/login-ngo" color="inherit">
              NGO Login
            </Button>
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white', ml: 1 }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
