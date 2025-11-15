import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getAllUsers, 
  getAllNgos, 
  verifyNgoKyc, 
  getWithdrawals,
  approveWithdrawal,
  reset 
} from '../features/admin/adminSlice';
import { Container, Typography, Paper, Box, CircularProgress, Alert, Tabs, Tab, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import toast from 'react-hot-toast';

// Helper component for Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AdminDashboardPage() {
  const [tab, setTab] = React.useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { users, ngos, withdrawalRequests, isLoading, isError, message } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    // Protect this route
    if (!user || user.userType !== 'Admin') {
      navigate('/admin/login');
    }

    if (isError) {
      toast.error(message);
    }

    // Fetch all data
    dispatch(getAllUsers());
    dispatch(getAllNgos());
    dispatch(getWithdrawals());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleVerifyKyc = (id) => {
    if (window.confirm('Are you sure you want to approve this NGO?')) {
      dispatch(verifyNgoKyc(id));
    }
  };

  const handleApproveWithdrawal = (id) => {
    if (window.confirm('This will mark the request as paid and send an email. Proceed?')) {
      dispatch(approveWithdrawal(id));
    }
  };

  // --- DataGrid Columns ---
  const userColumns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'isVerified', headerName: 'Email Verified', width: 150, type: 'boolean' },
    { 
      field: 'createdAt', 
      headerName: 'Joined', 
      width: 200, 
      valueFormatter: (value) => {
        return value ? new Date(value).toLocaleString() : 'N/A';
      }
    },
  ];

  const ngoColumns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'ngoName', headerName: 'NGO Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'kycStatus', headerName: 'KYC Status', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        return (
          params.row.kycStatus === 'Pending' && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleVerifyKyc(params.row._id)}
            >
              Verify KYC
            </Button>
          )
        );
      },
    },
  ];

  const withdrawalColumns = [
    { field: '_id', headerName: 'Request ID', width: 220 },
    { field: 'ngoName', headerName: 'NGO Name', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 130,
      renderCell: (params) => `$${params.value.toLocaleString()}`
    },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'bankDetails', headerName: 'Bank Info', width: 250,
      valueGetter: (value) => `${value.accountHolderName} - ${value.accountNumber}`,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleApproveWithdrawal(params.row._id)}
        >
          Approve
        </Button>
      ),
    },
  ];
  // --- End of Columns ---

  if (isLoading && users.length === 0 && ngos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        {isError && <Alert severity="error">{message}</Alert>}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={handleTabChange} aria-label="admin tabs">
            <Tab label={`NGOs (${ngos.length})`} />
            <Tab label={`Donors (${users.length})`} />
            <Tab label={`Withdrawals (${withdrawalRequests.length})`} />
          </Tabs>
        </Box>

        {/* NGOs Tab */}
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom>Manage NGOs</Typography>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={ngos}
              columns={ngoColumns}
              getRowId={(row) => row._id}
              loading={isLoading}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </TabPanel>

        {/* Donors Tab */}
        <TabPanel value={tab} index={1}>
          <Typography variant="h6" gutterBottom>Manage Donors (Users)</Typography>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={users}
              columns={userColumns}
              getRowId={(row) => row._id}
              loading={isLoading}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </TabPanel>
        
        {/* Withdrawals Tab */}
        <TabPanel value={tab} index={2}>
          <Typography variant="h6" gutterBottom>Manage Withdrawal Requests</Typography>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={withdrawalRequests}
              columns={withdrawalColumns}
              getRowId={(row) => row._id}
              loading={isLoading}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
            />
          </Box>
        </TabPanel>

      </Paper>
    </Container>
  );
}

export default AdminDashboardPage;