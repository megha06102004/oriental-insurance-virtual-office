import React from 'react';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Language as WebsiteIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

const SupportContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 100px;
`;

const SupportHeader = styled(Box)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 40px 0;
  border-radius: 0 0 30px 30px;
  margin-bottom: 40px;
`;

const ContactCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
`;

const SupportCenter = () => {
  const contactMethods = [
    {
      title: 'Customer Care Helpline',
      icon: <PhoneIcon />,
      primary: '1800-118-485',
      secondary: 'Toll Free - Available 24/7',
      description: 'For general inquiries and immediate assistance',
      color: '#3b82f6'
    },
    {
      title: 'Motor Claim Helpline',
      icon: <PhoneIcon />,
      primary: '1800-103-3003',
      secondary: 'Toll Free - 24/7 Emergency',
      description: 'For motor accident claims and roadside assistance',
      color: '#ef4444'
    },
    {
      title: 'Email Support',
      icon: <EmailIcon />,
      primary: 'customercare@orientalinsurance.co.in',
      secondary: 'Response within 24 hours',
      description: 'For detailed queries and documentation',
      color: '#8b5cf6'
    },
    {
      title: 'Website',
      icon: <WebsiteIcon />,
      primary: 'www.orientalinsurance.co.in',
      secondary: 'Online Services Available',
      description: 'Access your account and self-service options',
      color: '#f59e0b'
    }
  ];

  const officeHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Emergency Claims', hours: '24/7 Available' }
  ];

  const quickLinks = [
    'Download Claim Forms',
    'Policy Document',
    'Premium Calculator',
    'Branch Locator',
    'Cashless Network Hospitals',
    'Authorized Garages',
    'FAQ Section',
    'Complaint Registration'
  ];

  return (
    <SupportContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Container maxWidth="lg">
        <SupportHeader>
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
                  Support Center
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  We're here to help you with all your insurance needs
                </Typography>
              </Box>
            </Box>
          </Container>
        </SupportHeader>

        <Grid container spacing={4}>
          {/* Contact Methods */}
          <Grid item xs={12} lg={8}>
            <Typography variant="h4" fontWeight="bold" mb={3}>
              Contact Us
            </Typography>
            
            <Grid container spacing={3}>
              {contactMethods.map((method, index) => (
                <Grid item xs={12} sm={6} key={index}>
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
                              background: method.color,
                              color: 'white'
                            }}
                          >
                            {method.icon}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold">
                            {method.title}
                          </Typography>
                        </Box>
                        
                        <Typography variant="h6" color={method.color} fontWeight="bold" mb={1}>
                          {method.primary}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                          {method.secondary}
                        </Typography>
                        <Typography variant="body2" mb={3}>
                          {method.description}
                        </Typography>
                        
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            background: method.color,
                            '&:hover': {
                              background: method.color,
                              filter: 'brightness(0.9)',
                            }
                          }}
                        >
                          Contact Now
                        </Button>
                      </CardContent>
                    </ContactCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Office Information */}
            <Box mt={5}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Head Office Address
              </Typography>
              <ContactCard>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      sx={{
                        background: '#22c55e',
                        color: 'white'
                      }}
                    >
                      <LocationIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Oriental Insurance Company Ltd.
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" mb={2}>
                    Oriental House, A-25/27, Asaf Ali Road,<br />
                    New Delhi - 110002, India
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<LocationIcon />}
                    sx={{ borderRadius: '20px' }}
                  >
                    View on Map
                  </Button>
                </CardContent>
              </ContactCard>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Office Hours */}
            <Card sx={{ borderRadius: '16px', mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    sx={{
                      background: '#f59e0b',
                      color: 'white'
                    }}
                  >
                    <ScheduleIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Office Hours
                  </Typography>
                </Box>
                
                <List>
                  {officeHours.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={item.day}
                        secondary={item.hours}
                        primaryTypographyProps={{ fontWeight: '600' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card sx={{ borderRadius: '16px' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Quick Links
                </Typography>
                
                <List>
                  {quickLinks.map((link, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        px: 0, 
                        cursor: 'pointer',
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: '8px'
                        }
                      }}
                    >
                      <ListItemText
                        primary={link}
                        primaryTypographyProps={{ 
                          color: '#3b82f6',
                          fontWeight: '500',
                          fontSize: '0.9rem'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Emergency Notice */}
        <Box mt={5}>
          <Card 
            sx={{ 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
              border: '2px solid #f59e0b'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                  sx={{
                    background: '#f59e0b',
                    color: 'white'
                  }}
                >
                  ⚠️
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color="#92400e">
                  Emergency Contact Information
                </Typography>
              </Box>
              
              <Typography variant="body1" color="#92400e" mb={2}>
                For urgent claims and emergencies, please contact our 24/7 helpline:
              </Typography>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  sx={{
                    background: '#f59e0b',
                    '&:hover': { background: '#d97706' }
                  }}
                >
                  1800-118-485
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  sx={{
                    background: '#3b82f6',
                    '&:hover': { background: '#2563eb' }
                  }}
                >
                  Live Chat
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </SupportContainer>
  );
};

export default SupportCenter;
