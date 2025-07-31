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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Assignment as ClaimIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  HourglassEmpty as ProcessingIcon,
  Cancel as RejectedIcon,
  AttachFile as AttachIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

const DeskContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 100px;
`;

const DeskHeader = styled(Box)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 40px 0;
  border-radius: 0 0 30px 30px;
  margin-bottom: 40px;
`;

const ClaimCard = styled(Card)`
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

const ClaimDesk = () => {
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openNewClaim, setOpenNewClaim] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [openClaimDetails, setOpenClaimDetails] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [newClaimData, setNewClaimData] = useState({
    type: '',
    policyId: '',
    incidentDate: '',
    description: '',
    estimatedAmount: '',
    documents: []
  });

  useEffect(() => {
    // Simulate loading claims
    setClaims([
      {
        id: 'CLM001',
        type: 'Motor Claim',
        policyId: 'POL001',
        incidentDate: '2024-01-15',
        reportedDate: '2024-01-16',
        status: 'Processing',
        amount: '₹45,000',
        estimatedAmount: '₹50,000',
        description: 'Vehicle accident - Front bumper damage',
        assignedTo: 'John Smith',
        contactNumber: '+91-9876543210',
        steps: [
          { label: 'Claim Reported', completed: true },
          { label: 'Documents Verified', completed: true },
          { label: 'Survey Scheduled', completed: true },
          { label: 'Assessment Complete', completed: false },
          { label: 'Approval Pending', completed: false },
          { label: 'Payment Processing', completed: false }
        ]
      },
      {
        id: 'CLM002',
        type: 'Health Claim',
        policyId: 'POL002',
        incidentDate: '2024-01-20',
        reportedDate: '2024-01-21',
        status: 'Approved',
        amount: '₹1,20,000',
        estimatedAmount: '₹1,20,000',
        description: 'Hospitalization - Emergency surgery',
        assignedTo: 'Sarah Johnson',
        contactNumber: '+91-9876543211',
        steps: [
          { label: 'Claim Reported', completed: true },
          { label: 'Documents Verified', completed: true },
          { label: 'Medical Review', completed: true },
          { label: 'Assessment Complete', completed: true },
          { label: 'Approved', completed: true },
          { label: 'Payment Processing', completed: false }
        ]
      },
      {
        id: 'CLM003',
        type: 'Home Claim',
        policyId: 'POL003',
        incidentDate: '2024-01-10',
        reportedDate: '2024-01-11',
        status: 'Pending',
        amount: '₹0',
        estimatedAmount: '₹75,000',
        description: 'Water damage due to pipe burst',
        assignedTo: 'Mike Wilson',
        contactNumber: '+91-9876543212',
        steps: [
          { label: 'Claim Reported', completed: true },
          { label: 'Documents Verified', completed: false },
          { label: 'Survey Scheduled', completed: false },
          { label: 'Assessment Complete', completed: false },
          { label: 'Approval Pending', completed: false },
          { label: 'Payment Processing', completed: false }
        ]
      }
    ]);
  }, []);

  const filteredClaims = claims.filter(claim =>
    claim.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.policyId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CompletedIcon sx={{ color: '#22c55e' }} />;
      case 'Processing':
        return <ProcessingIcon sx={{ color: '#3b82f6' }} />;
      case 'Pending':
        return <PendingIcon sx={{ color: '#f59e0b' }} />;
      case 'Rejected':
        return <RejectedIcon sx={{ color: '#ef4444' }} />;
      default:
        return <ClaimIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#22c55e';
      case 'Processing':
        return '#3b82f6';
      case 'Pending':
        return '#f59e0b';
      case 'Rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setOpenClaimDetails(true);
  };

  const handleNewClaimSubmit = () => {
    // Add new claim logic here
    console.log('New claim data:', newClaimData);
    setOpenNewClaim(false);
    // Reset form
    setNewClaimData({
      type: '',
      policyId: '',
      incidentDate: '',
      description: '',
      estimatedAmount: '',
      documents: []
    });
  };

  const newClaimSteps = [
    {
      label: 'Claim Information',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Claim Type</InputLabel>
              <Select
                value={newClaimData.type}
                onChange={(e) => setNewClaimData({...newClaimData, type: e.target.value})}
                label="Claim Type"
              >
                <MenuItem value="Motor Claim">Motor Claim</MenuItem>
                <MenuItem value="Health Claim">Health Claim</MenuItem>
                <MenuItem value="Home Claim">Home Claim</MenuItem>
                <MenuItem value="Travel Claim">Travel Claim</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Policy ID"
              value={newClaimData.policyId}
              onChange={(e) => setNewClaimData({...newClaimData, policyId: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Incident Date"
              type="date"
              value={newClaimData.incidentDate}
              onChange={(e) => setNewClaimData({...newClaimData, incidentDate: e.target.value})}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Amount"
              value={newClaimData.estimatedAmount}
              onChange={(e) => setNewClaimData({...newClaimData, estimatedAmount: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newClaimData.description}
              onChange={(e) => setNewClaimData({...newClaimData, description: e.target.value})}
            />
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Upload Documents',
      content: (
        <Box>
          <Typography variant="body1" gutterBottom>
            Please upload the required documents for your claim:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><AttachIcon /></ListItemIcon>
              <ListItemText primary="Claim Form (Filled and Signed)" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachIcon /></ListItemIcon>
              <ListItemText primary="Policy Copy" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachIcon /></ListItemIcon>
              <ListItemText primary="Incident Photos/Reports" />
            </ListItem>
            <ListItem>
              <ListItemIcon><AttachIcon /></ListItemIcon>
              <ListItemText primary="Bills/Receipts" />
            </ListItem>
          </List>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ mt: 2 }}
          >
            Upload Documents
          </Button>
        </Box>
      )
    },
    {
      label: 'Review & Submit',
      content: (
        <Box>
          <Typography variant="h6" gutterBottom>
            Review Your Claim Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Claim Type
              </Typography>
              <Typography variant="body1">
                {newClaimData.type}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Policy ID
              </Typography>
              <Typography variant="body1">
                {newClaimData.policyId}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Incident Date
              </Typography>
              <Typography variant="body1">
                {newClaimData.incidentDate}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Estimated Amount
              </Typography>
              <Typography variant="body1">
                ₹{newClaimData.estimatedAmount}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography variant="body1">
                {newClaimData.description}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )
    }
  ];

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
                📝
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Claim Registration
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Register new claims and track existing ones
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
                placeholder="Search claims..."
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
                  onClick={() => setOpenNewClaim(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                    }
                  }}
                >
                  New Claim
                </ActionButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Claims Grid */}
        <Grid container spacing={3}>
          {filteredClaims.map((claim, index) => (
            <Grid item xs={12} md={6} lg={4} key={claim.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ClaimCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getStatusIcon(claim.status)}
                        <Typography variant="h6" fontWeight="bold">
                          {claim.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={claim.status}
                        size="small"
                        sx={{
                          background: getStatusColor(claim.status),
                          color: 'white',
                          fontWeight: '600'
                        }}
                      />
                    </Box>

                    <Typography color="text.secondary" gutterBottom>
                      Claim ID: {claim.id}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      Policy: {claim.policyId}
                    </Typography>

                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Incident Date: {claim.incidentDate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount: {claim.amount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {claim.description}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" gap={1}>
                      <ActionButton
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewClaim(claim)}
                        fullWidth
                      >
                        View Details
                      </ActionButton>
                      <ActionButton
                        size="small"
                        variant="outlined"
                        startIcon={<PhoneIcon />}
                        fullWidth
                      >
                        Contact
                      </ActionButton>
                    </Box>
                  </CardContent>
                </ClaimCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* New Claim Dialog */}
        <Dialog
          open={openNewClaim}
          onClose={() => setOpenNewClaim(false)}
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
              <AddIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Register New Claim
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} orientation="vertical">
              {newClaimSteps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Box sx={{ mt: 2 }}>
                      {step.content}
                      <Box sx={{ mt: 3 }}>
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (index === newClaimSteps.length - 1) {
                              handleNewClaimSubmit();
                            } else {
                              setActiveStep(activeStep + 1);
                            }
                          }}
                          sx={{ mr: 1 }}
                        >
                          {index === newClaimSteps.length - 1 ? 'Submit Claim' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={() => setActiveStep(activeStep - 1)}
                        >
                          Back
                        </Button>
                      </Box>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewClaim(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Claim Details Dialog */}
        <Dialog
          open={openClaimDetails}
          onClose={() => setOpenClaimDetails(false)}
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
              <ClaimIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Claim Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedClaim && (
              <Box>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Claim ID
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedClaim.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedClaim.status}
                      sx={{
                        background: getStatusColor(selectedClaim.status),
                        color: 'white',
                        fontWeight: '600'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedClaim.assignedTo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {selectedClaim.contactNumber}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Claim Progress
                </Typography>
                <Stepper orientation="vertical">
                  {selectedClaim.steps.map((step, index) => (
                    <Step key={step.label} active={true} completed={step.completed}>
                      <StepLabel>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenClaimDetails(false)}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              }}
            >
              Contact Agent
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DeskContainer>
  );
};

export default ClaimDesk;
