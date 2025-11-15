import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography'; // <-- THIS IS THE FIX (Removed)

// Import Components
import Header from './components/Header';

// Import Pages
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NgoLoginPage from './pages/NgoLoginPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailsPage from './pages/PostDetailsPage';
import NgoDashboardPage from './pages/NgoDashboardPage';
import KycPage from './pages/KycPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LandingPage from './pages/LandingPage'; // <-- 1. Import new page

function App() {
  return (
    <Router>
      <CssBaseline />
      <Toaster position="top-right" />
      <Header />

      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* Main Public Route */}
          <Route
            path="/"
            element={<LandingPage />} // Use Dashboard as home
          />

          {/* Auth Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login-ngo" element={<NgoLoginPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {/* App Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/my-dashboard" element={<NgoDashboardPage />} />
          <Route path="/kyc" element={<KycPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;