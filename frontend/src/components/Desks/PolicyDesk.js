import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Policy as PolicyIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Update as RenewIcon,
  CheckCircle as ActiveIcon,
  Schedule as PendingIcon
} from '@mui/icons-material';

const DeskContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 100px;
`;

const DeskHeader = styled(Box)`
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: white;
  padding: 40px 0;
  border-radius: 0 0 30px 30px;
  margin-bottom: 40px;
`;

const PolicyCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  font-weight: 600;
  padding: 8px 20px;
`;

const PolicyDesk = () => {
  const [policies, setPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Simulate loading policies
    setPolicies([
      {
        id: 'POL001',
        type: 'Motor Insurance',
        vehicle: 'Honda City 2020',
        premium: '₹15,000',
        status: 'Active',
        expiryDate: '2025-03-15',
        coverageAmount: '₹5,00,000'
      },
      {
        id: 'POL002',
        type: 'Health Insurance',
        coverage: 'Family Health Plan',
        premium: '₹25,000',
        status: 'Active',
        expiryDate: '2025-06-20',
        coverageAmount: '₹10,00,000'
      },
      {
        id: 'POL003',
        type: 'Home Insurance',
        property: 'Residential Property',
        premium: '₹8,000',
        status: 'Pending Renewal',
        expiryDate: '2024-12-31',
        coverageAmount: '₹50,00,000'
      }
    ]);
  }, []);

  const filteredPolicies = policies.filter(policy =>
    policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPolicy = (policy) => {
    setSelectedPolicy(policy);
    setOpenDialog(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <ActiveIcon sx={{ color: '#22c55e' }} />;
      case 'Pending Renewal':
        return <PendingIcon sx={{ color: '#f59e0b' }} />;
      default:
        return <PolicyIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return '#22c55e';
      case 'Pending Renewal':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  return (
    <DeskContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container maxWidth="lg">
        <DeskHeader>
          <Container maxWidth="lg">
            <Box display="flex" alignItems="center" gap={3}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '2rem'
                }}
              >
                📋
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Policy Management
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  View, manage, and renew your insurance policies
                </Typography>
              </Box>
            </Box>
          </Container>
        </DeskHeader>

        {/* Search and Actions */}
        <Box mb={4}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <ActionButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                    }
                  }}
                >
                  New Policy
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Policies Grid */}
        <Grid container spacing={3}>
          {filteredPolicies.map((policy, index) => (
            <Grid item xs={12} md={6} lg={4} key={policy.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PolicyCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(policy.status)}
                        <Typography variant="h6" fontWeight="bold">
                          {policy.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={policy.status}
                        size="small"
                        sx={{
                          background: getStatusColor(policy.status),
                          color: 'white',
                          fontWeight: '600'
                        }}
                      />
                    </Box>

                    <Typography color="text.secondary" gutterBottom>
                      Policy ID: {policy.id}
                    </Typography>

                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        {policy.vehicle || policy.coverage || policy.property}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Coverage: {policy.coverageAmount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Premium: {policy.premium}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires: {policy.expiryDate}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" gap={1}>
                      <ActionButton
                        size="small"
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handleViewPolicy(policy)}
                        fullWidth
                      >
                        View
                      </ActionButton>
                      <ActionButton
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Download
                      </ActionButton>
                      {policy.status === 'Pending Renewal' && (
                        <ActionButton
                          size="small"
                          variant="contained"
                          startIcon={<RenewIcon />}
                          sx={{
                            background: '#f59e0b',
                            '&:hover': { background: '#d97706' }
                          }}
                          fullWidth
                        >
                          Renew
                        </ActionButton>
                      )}
                    </Box>
                  </CardContent>
                </PolicyCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Policy Details Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <PolicyIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Policy Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedPolicy && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Policy Type
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedPolicy.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Policy ID
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedPolicy.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Coverage Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedPolicy.coverageAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Annual Premium
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedPolicy.premium}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedPolicy.status}
                      sx={{
                        background: getStatusColor(selectedPolicy.status),
                        color: 'white',
                        fontWeight: '600'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedPolicy.expiryDate}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
              }}
            >
              Download Policy
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DeskContainer>
  );
};

export default PolicyDesk;
