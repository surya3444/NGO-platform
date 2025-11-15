import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Icon,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupIcon from '@mui/icons-material/Group';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

function LandingPage() {
  return (
    <Box>
      {/* --- Hero Section --- */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Connect. Empower. Change.
          </Typography>
          <Typography variant="h5" component="p" color="white" sx={{ mb: 4 }}>
            The transparent fundraising platform where your donation creates
            direct, verifiable impact for the causes you care about.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/register"
          >
            Get Started Now
          </Button>
        </Container>
      </Box>

      {/* --- How It Works Section --- */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Icon color="primary" sx={{ fontSize: 60, mb: 2 }}>
                <FindInPageIcon sx={{ fontSize: 60 }} />
              </Icon>
              <Typography variant="h5" gutterBottom>
                1. Find a Cause
              </Typography>
              <Typography>
                Browse verified NGOs, read their stories, and find a fundraiser
                that speaks to you.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Icon color="primary" sx={{ fontSize: 60, mb: 2 }}>
                <VolunteerActivismIcon sx={{ fontSize: 60 }} />
              </Icon>
              <Typography variant="h5" gutterBottom>
                2. Donate Securely
              </Typography>
              <Typography>
                Make a donation with confidence using our secure Razorpay
                payment system.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Icon color="primary" sx={{ fontSize: 60, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />
              </Icon>
              <Typography variant="h5" gutterBottom>
                3. See Your Impact
              </Typography>
              <Typography>
                Receive updates directly from the NGO and see exactly how your
                contribution is making a difference.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* --- Image Section --- */}
      <Box sx={{ p: 4, bgcolor: 'grey.100', textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>
            Real Projects, Real People, Real Change
          </Typography>
          {/* This tag will insert a high-quality, relevant image */}
          
          <Typography variant="body1" sx={{ mt: 2, maxWidth: 'md', mx: 'auto' }}>
            Our platform connects you directly with the people on the ground. No
            middlemen, just direct impact.
          </Typography>
        </Container>
      </Box>

      {/* --- For Donors / For NGOs Section --- */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <GroupIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                For Donors
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Find and support verified NGOs with complete transparency. Follow
                their progress, leave comments, and know that your funds are
                going directly to the cause.
              </Typography>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/dashboard"
              >
                Browse Causes
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <CorporateFareIcon
                color="primary"
                sx={{ fontSize: 40, mb: 2 }}
              />
              <Typography variant="h4" gutterBottom>
                For NGOs
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Get your project funded. Share your story, upload posts, and
                connect with a community of donors. Manage your funds and
                withdraw securely after KYC verification.
              </Typography>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/register"
              >
                Register Your NGO
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- Final CTA Section --- */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            Ready to Make a Difference?
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            Join our community today and be the change you want to see.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/register"
          >
            Join Now
          </Button>
        </Container>
      </Box>

      {/* --- Footer --- */}
      <Box component="footer" sx={{ py: 4, bgcolor: 'grey.200' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} NGO Connect. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;