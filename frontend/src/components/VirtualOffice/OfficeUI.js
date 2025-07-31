import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import {
  Button,
  IconButton,
  Fab,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip
} from '@mui/material';
import {
  Policy as PolicyIcon,
  Assignment as ClaimIcon,
  Support as SupportIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const UIContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const TopBar = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  pointer-events: auto;
`;

const BottomControls = styled(motion.div)`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  pointer-events: auto;
`;

const SidePanel = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 30px;
  transform: translateY(-50%);
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  pointer-events: auto;
`;

const FloatingCard = styled(Card)`
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
`;

const GlassButton = styled(Button)`
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #1e3a8a !important;
  font-weight: 600 !important;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const OfficeUI = ({ 
  currentView, 
  setCurrentView, 
  selectedDesk, 
  setSelectedDesk,
  onAssistantClick 
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handleDeskNavigation = (deskType) => {
    setSelectedDesk(deskType);
    setCurrentView(deskType);
  };

  const handleHomeClick = () => {
    setSelectedDesk(null);
    setCurrentView('office');
  };

  const deskButtons = [
    {
      id: 'policy',
      label: 'Policies',
      icon: <PolicyIcon />,
      color: '#ef4444',
      description: 'View and manage your insurance policies'
    },
    {
      id: 'claim',
      label: 'Claims',
      icon: <ClaimIcon />,
      color: '#3b82f6',
      description: 'Register new claims and track existing ones'
    },
    {
      id: 'grievance',
      label: 'Support',
      icon: <SupportIcon />,
      color: '#8b5cf6',
      description: 'Get help and resolve grievances'
    }
  ];

  return (
    <UIContainer>
      {/* Top Navigation Bar */}
      <TopBar
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <GlassButton
          startIcon={<HomeIcon />}
          onClick={handleHomeClick}
          variant="outlined"
        >
          Virtual Office
        </GlassButton>
        
        <IconButton
          onClick={() => setShowInfo(!showInfo)}
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#1e3a8a',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <InfoIcon />
        </IconButton>
      </TopBar>

      {/* Bottom Controls */}
      <BottomControls
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        {deskButtons.map((desk, index) => (
          <motion.div
            key={desk.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
          >
            <Fab
              onClick={() => handleDeskNavigation(desk.id)}
              sx={{
                background: selectedDesk === desk.id 
                  ? desk.color 
                  : 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: selectedDesk === desk.id ? 'white' : '#1e3a8a',
                '&:hover': {
                  background: desk.color,
                  color: 'white',
                  transform: 'translateY(-4px)',
                },
                transition: 'all 0.3s ease',
                width: 64,
                height: 64,
              }}
            >
              {desk.icon}
            </Fab>
          </motion.div>
        ))}

        {/* Chat Assistant Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <Fab
            onClick={onAssistantClick}
            sx={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                transform: 'translateY(-4px)',
              },
              transition: 'all 0.3s ease',
              width: 64,
              height: 64,
            }}
          >
            <ChatIcon />
          </Fab>
        </motion.div>
      </BottomControls>

      {/* Information Panel */}
      <AnimatePresence>
        {showInfo && (
          <SidePanel
            initial={{ x: -350, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -350, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FloatingCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Virtual Office Guide
                  </Typography>
                  <IconButton onClick={() => setShowInfo(false)} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Box mb={3}>
                  <Avatar
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto',
                      background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
                    }}
                  >
                    <Typography variant="h4">🏢</Typography>
                  </Avatar>
                  <Typography variant="body2" textAlign="center" mt={1} color="text.secondary">
                    Welcome to Oriental Insurance Virtual Office
                  </Typography>
                </Box>

                <Typography variant="subtitle2" color="primary" mb={1}>
                  Available Services:
                </Typography>

                {deskButtons.map((desk) => (
                  <Box key={desk.id} mb={2}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Box sx={{ color: desk.color }}>{desk.icon}</Box>
                      <Typography variant="body2" fontWeight="600">
                        {desk.label}
                      </Typography>
                      {selectedDesk === desk.id && (
                        <Chip label="Active" size="small" color="primary" />
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {desk.description}
                    </Typography>
                  </Box>
                ))}

                <Box mt={3} p={2} bgcolor="rgba(30, 58, 138, 0.05)" borderRadius={2}>
                  <Typography variant="caption" color="text.secondary">
                    💡 <strong>Tip:</strong> Click on the desks in the 3D environment or use the buttons below to navigate between services.
                  </Typography>
                </Box>
              </CardContent>
            </FloatingCard>
          </SidePanel>
        )}
      </AnimatePresence>

      {/* Current View Indicator */}
      {selectedDesk && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            top: '100px',
            right: '30px',
            pointerEvents: 'auto'
          }}
        >
          <FloatingCard>
            <CardContent sx={{ padding: '16px !important' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box sx={{ 
                  color: deskButtons.find(d => d.id === selectedDesk)?.color 
                }}>
                  {deskButtons.find(d => d.id === selectedDesk)?.icon}
                </Box>
                <Typography variant="body2" fontWeight="600">
                  {deskButtons.find(d => d.id === selectedDesk)?.label} Active
                </Typography>
              </Box>
            </CardContent>
          </FloatingCard>
        </motion.div>
      )}
    </UIContainer>
  );
};

export default OfficeUI;
