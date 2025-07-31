import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountCircle as ProfileIcon,
  Notifications as NotificationIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
`;

const Logo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled(Button)`
  color: #1e3a8a !important;
  font-weight: 600 !important;
  text-transform: none !important;
  border-radius: 20px !important;
  padding: 8px 20px !important;
  
  &:hover {
    background: rgba(30, 58, 138, 0.1) !important;
  }
  
  &.active {
    background: rgba(30, 58, 138, 0.1) !important;
    color: #1e3a8a !important;
  }
`;

const Navbar = ({ currentView, setCurrentView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Virtual Office', value: 'office', icon: <HomeIcon /> },
    { label: 'Policies', value: 'policy' },
    { label: 'Claims', value: 'claim' },
    { label: 'Support', value: 'grievance' }
  ];

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Logo>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                  width: 40,
                  height: 40
                }}
              >
                🏢
              </Avatar>
            </motion.div>
            
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e3a8a',
                  fontSize: '1.1rem'
                }}
              >
                Oriental Insurance
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#64748b',
                  fontSize: '0.75rem'
                }}
              >
                Virtual Office Experience
              </Typography>
            </Box>
          </Logo>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navigationItems.map((item) => (
              <motion.div
                key={item.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavButton
                  startIcon={item.icon}
                  onClick={() => setCurrentView(item.value)}
                  className={currentView === item.value ? 'active' : ''}
                >
                  {item.label}
                  {currentView === item.value && (
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        ml: 1,
                        height: 20,
                        fontSize: '0.7rem',
                        background: '#1e3a8a',
                        color: 'white'
                      }}
                    />
                  )}
                </NavButton>
              </motion.div>
            ))}
          </Box>

          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  color: '#1e3a8a',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <NotificationIcon />
              </IconButton>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  color: '#1e3a8a',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <ProfileIcon />
              </IconButton>
            </motion.div>
          </Box>

          {/* Mobile menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              sx={{ color: '#1e3a8a' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ProfileIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          Logout
        </MenuItem>
      </Menu>

      {/* Spacer for fixed navbar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
