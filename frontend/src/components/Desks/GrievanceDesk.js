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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Tabs,
  Tab
} from '@mui/material';
import {
  Support as SupportIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as PendingIcon,
  Assignment as InProgressIcon,
  Star as StarIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';

const DeskContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 100px;
`;

const DeskHeader = styled(Box)`
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 40px 0;
  border-radius: 0 0 30px 30px;
  margin-bottom: 40px;
`;

const GrievanceCard = styled(Card)`
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

const ContactCard = styled(Card)`
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
  border: 2px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
  }
`;

const GrievanceDesk = () => {
  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openNewGrievance, setOpenNewGrievance] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [openGrievanceDetails, setOpenGrievanceDetails] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [rating, setRating] = useState(0);

  const [newGrievanceData, setNewGrievanceData] = useState({
    type: '',
    priority: '',
    subject: '',
    description: '',
    contactMethod: ''
  });

  useEffect(() => {
    // Simulate loading grievances
    setGrievances([
      {
        id: 'GRV001',
        type: 'Claim Delay',
        priority: 'High',
        subject: 'Motor claim processing delay',
        description: 'My motor claim submitted 2 months ago is still pending approval.',
        status: 'In Progress',
        reportedDate: '2024-01-15',
        assignedTo: 'Emily Davis',
        contactNumber: '+91-9876543213',
        email: 'emily.davis@oriental.co.in',
        lastUpdate: '2024-01-28',
        resolution: 'Claim escalated to senior adjuster for review.',
        rating: 0
      },
      {
        id: 'GRV002',
        type: 'Policy Information',
        priority: 'Medium',
        subject: 'Unclear policy terms',
        description: 'Need clarification on health policy coverage terms.',
        status: 'Resolved',
        reportedDate: '2024-01-20',
        assignedTo: 'Robert Kim',
        contactNumber: '+91-9876543214',
        email: 'robert.kim@oriental.co.in',
        lastUpdate: '2024-01-25',
        resolution: 'Policy terms clarified and document sent to customer.',
        rating: 5
      },
      {
        id: 'GRV003',
        type: 'Premium Payment',
        priority: 'Low',
        subject: 'Online payment failure',
        description: 'Unable to make premium payment through online portal.',
        status: 'Pending',
        reportedDate: '2024-01-25',
        assignedTo: 'Technical Support',
        contactNumber: '+91-1800-118-485',
        email: 'techsupport@oriental.co.in',
        lastUpdate: '2024-01-26',
        resolution: 'IT team investigating payment gateway issue.',
        rating: 0
      }
    ]);
  }, []);

  const filteredGrievances = grievances.filter(grievance =>
    grievance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <ResolvedIcon sx={{ color: '#22c55e' }} />;
      case 'In Progress':
        return <InProgressIcon sx={{ color: '#3b82f6' }} />;
      case 'Pending':
        return <PendingIcon sx={{ color: '#f59e0b' }} />;
      default:
        return <SupportIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return '#22c55e';
      case 'In Progress':
        return '#3b82f6';
      case 'Pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#22c55e';
      default:
        return '#64748b';
    }
  };

  const handleViewGrievance = (grievance) => {
    setSelectedGrievance(grievance);
    setOpenGrievanceDetails(true);
  };

  const handleNewGrievanceSubmit = () => {
    // Add new grievance logic here
    console.log('New grievance data:', newGrievanceData);
    setOpenNewGrievance(false);
    // Reset form
    setNewGrievanceData({
      type: '',
      priority: '',
      subject: '',
      description: '',
      contactMethod: ''
    });
  };

  const contactMethods = [
    {
      method: 'phone',
      icon: <PhoneIcon />,
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      contact: '1800-118-485',
      availability: '24/7 Available'
    },
    {
      method: 'email',
      icon: <EmailIcon />,
      title: 'Email Support',
      description: 'Send us your queries via email',
      contact: 'support@oriental.co.in',
      availability: 'Response within 24 hours'
    },
    {
      method: 'chat',
      icon: <ChatIcon />,
      title: 'Live Chat',
      description: 'Chat with our virtual assistant',
      contact: 'Available in Virtual Office',
      availability: 'Instant Response'
    },
    {
      method: 'appointment',
      icon: <ScheduleIcon />,
      title: 'Schedule Meeting',
      description: 'Book a one-on-one session',
      contact: 'Available in nearest branch',
      availability: 'By Appointment'
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
                🎧
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Support & Grievance
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Get help and resolve your concerns
                </Typography>
              </Box>
            </Box>
          </Container>
        </DeskHeader>

        <Box mb={4}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Support Channels" />
            <Tab label="My Grievances" />
            <Tab label="Feedback" />
          </Tabs>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              {contactMethods.map((method, index) => (
                <Grid item xs={12} md={6} key={method.method}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ContactCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <Avatar
                            sx={{
                              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              color: 'white'
                            }}
                          >
                            {method.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {method.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.description}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body1" fontWeight="600" mb={1}>
                          {method.contact}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {method.availability}
                        </Typography>
                        
                        <ActionButton
                          variant="contained"
                          fullWidth
                          sx={{
                            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                            }
                          }}
                        >
                          Contact Now
                        </ActionButton>
                      </CardContent>
                    </ContactCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && (
            <>
              {/* Search and Actions */}
              <Box mb={4}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search grievances..."
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
                        onClick={() => setOpenNewGrievance(true)}
                        sx={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                          }
                        }}
                      >
                        New Grievance
                      </ActionButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Grievances Grid */}
              <Grid container spacing={3}>
                {filteredGrievances.map((grievance, index) => (
                  <Grid item xs={12} md={6} lg={4} key={grievance.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <GrievanceCard>
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box display="flex" alignItems="center" gap={1}>
                              {getStatusIcon(grievance.status)}
                              <Typography variant="h6" fontWeight="bold" noWrap>
                                {grievance.subject}
                              </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" gap={0.5}>
                              <Chip
                                label={grievance.status}
                                size="small"
                                sx={{
                                  background: getStatusColor(grievance.status),
                                  color: 'white',
                                  fontWeight: '600'
                                }}
                              />
                              <Chip
                                label={grievance.priority}
                                size="small"
                                variant="outlined"
                                sx={{
                                  borderColor: getPriorityColor(grievance.priority),
                                  color: getPriorityColor(grievance.priority),
                                  fontWeight: '600'
                                }}
                              />
                            </Box>
                          </Box>

                          <Typography color="text.secondary" gutterBottom>
                            ID: {grievance.id} | Type: {grievance.type}
                          </Typography>

                          <Box mb={2}>
                            <Typography variant="body2" color="text.secondary">
                              Reported: {grievance.reportedDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Assigned to: {grievance.assignedTo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {grievance.description}
                            </Typography>
                          </Box>

                          {grievance.status === 'Resolved' && grievance.rating > 0 && (
                            <Box mb={2}>
                              <Typography variant="body2" color="text.secondary">
                                Your Rating:
                              </Typography>
                              <Rating value={grievance.rating} readOnly size="small" />
                            </Box>
                          )}

                          <Divider sx={{ my: 2 }} />

                          <Box display="flex" gap={1}>
                            <ActionButton
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewGrievance(grievance)}
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
                      </GrievanceCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" mb={3}>
                      Share Your Feedback
                    </Typography>
                    
                    <Box mb={3}>
                      <Typography variant="body1" mb={2}>
                        How would you rate our service?
                      </Typography>
                      <Rating
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                        size="large"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Tell us about your experience..."
                      sx={{ mb: 3 }}
                    />

                    <ActionButton
                      variant="contained"
                      startIcon={<FeedbackIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        }
                      }}
                    >
                      Submit Feedback
                    </ActionButton>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Customer Satisfaction
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Overall Rating
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Rating value={4.5} readOnly size="small" />
                        <Typography variant="h6" fontWeight="bold">
                          4.5/5
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Based on 1,234 reviews
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <Box key={stars} display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography variant="caption">{stars}</Typography>
                          <StarIcon sx={{ fontSize: 14, color: '#fbbf24' }} />
                          <Box 
                            sx={{ 
                              flex: 1, 
                              height: 6, 
                              bgcolor: '#e5e7eb', 
                              borderRadius: 3,
                              overflow: 'hidden'
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: `${(6 - stars) * 20}%`, 
                                height: '100%', 
                                bgcolor: '#fbbf24' 
                              }} 
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* New Grievance Dialog */}
        <Dialog
          open={openNewGrievance}
          onClose={() => setOpenNewGrievance(false)}
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
                Submit New Grievance
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Grievance Type</InputLabel>
                  <Select
                    value={newGrievanceData.type}
                    onChange={(e) => setNewGrievanceData({...newGrievanceData, type: e.target.value})}
                    label="Grievance Type"
                  >
                    <MenuItem value="Claim Delay">Claim Delay</MenuItem>
                    <MenuItem value="Policy Information">Policy Information</MenuItem>
                    <MenuItem value="Premium Payment">Premium Payment</MenuItem>
                    <MenuItem value="Customer Service">Customer Service</MenuItem>
                    <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newGrievanceData.priority}
                    onChange={(e) => setNewGrievanceData({...newGrievanceData, priority: e.target.value})}
                    label="Priority"
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={newGrievanceData.subject}
                  onChange={(e) => setNewGrievanceData({...newGrievanceData, subject: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={newGrievanceData.description}
                  onChange={(e) => setNewGrievanceData({...newGrievanceData, description: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Contact Method</InputLabel>
                  <Select
                    value={newGrievanceData.contactMethod}
                    onChange={(e) => setNewGrievanceData({...newGrievanceData, contactMethod: e.target.value})}
                    label="Preferred Contact Method"
                  >
                    <MenuItem value="phone">Phone</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="chat">Chat</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenNewGrievance(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleNewGrievanceSubmit}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              }}
            >
              Submit Grievance
            </Button>
          </DialogActions>
        </Dialog>

        {/* Grievance Details Dialog */}
        <Dialog
          open={openGrievanceDetails}
          onClose={() => setOpenGrievanceDetails(false)}
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
              <SupportIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Grievance Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedGrievance && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Grievance ID
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedGrievance.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedGrievance.status}
                      sx={{
                        background: getStatusColor(selectedGrievance.status),
                        color: 'white',
                        fontWeight: '600'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedGrievance.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Priority
                    </Typography>
                    <Chip
                      label={selectedGrievance.priority}
                      variant="outlined"
                      sx={{
                        borderColor: getPriorityColor(selectedGrievance.priority),
                        color: getPriorityColor(selectedGrievance.priority),
                        fontWeight: '600'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Subject
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedGrievance.subject}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedGrievance.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Resolution
                    </Typography>
                    <Typography variant="body1" mb={2}>
                      {selectedGrievance.resolution}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Assigned To
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedGrievance.assignedTo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Update
                    </Typography>
                    <Typography variant="body1" fontWeight="600" mb={2}>
                      {selectedGrievance.lastUpdate}
                    </Typography>
                  </Grid>
                </Grid>

                {selectedGrievance.status === 'Resolved' && (
                  <Box mt={3}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Rate Your Experience
                    </Typography>
                    <Rating
                      value={selectedGrievance.rating}
                      onChange={(event, newValue) => {
                        setSelectedGrievance({
                          ...selectedGrievance,
                          rating: newValue
                        });
                      }}
                      size="large"
                    />
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGrievanceDetails(false)}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<PhoneIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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

export default GrievanceDesk;
