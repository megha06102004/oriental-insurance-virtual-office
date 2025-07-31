const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Mock user data (In production, this would be in a database)
let users = [
  {
    id: 'user1',
    email: 'demo@oriental.co.in',
    name: 'Demo User',
    phone: '+91-9876543210',
    role: 'customer',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    policies: ['POL001', 'POL002'],
    claims: ['CLM001'],
    preferences: {
      language: 'English',
      notifications: true,
      newsletter: true
    },
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15'
  }
];

// Get user profile
router.get('/profile', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userProfile = { ...user };
    delete userProfile.password; // Don't send password

    res.json({
      success: true,
      data: { user: userProfile }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
  body('address').optional().isObject().withMessage('Address must be an object')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, phone, address, preferences } = req.body;
    
    // Update user data
    if (name) users[userIndex].name = name;
    if (phone) users[userIndex].phone = phone;
    if (address) users[userIndex].address = { ...users[userIndex].address, ...address };
    if (preferences) users[userIndex].preferences = { ...users[userIndex].preferences, ...preferences };

    const updatedUser = { ...users[userIndex] };
    delete updatedUser.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Get user dashboard data
router.get('/dashboard', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Mock dashboard data
    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      statistics: {
        activePolicies: user.policies?.length || 0,
        pendingClaims: user.claims?.filter(claim => claim.status === 'pending').length || 0,
        totalClaims: user.claims?.length || 0,
        lastLogin: user.lastLogin
      },
      recentActivity: [
        {
          id: 'act1',
          type: 'policy_renewal',
          message: 'Motor Insurance Policy renewed',
          date: '2024-01-10',
          status: 'completed'
        },
        {
          id: 'act2',
          type: 'claim_submitted',
          message: 'Health claim submitted for review',
          date: '2024-01-08',
          status: 'pending'
        }
      ],
      notifications: [
        {
          id: 'not1',
          title: 'Policy Renewal Reminder',
          message: 'Your Motor Insurance policy expires in 30 days',
          type: 'warning',
          date: '2024-01-15',
          read: false
        },
        {
          id: 'not2',
          title: 'Claim Update',
          message: 'Your health claim has been approved',
          type: 'success',
          date: '2024-01-12',
          read: false
        }
      ]
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Get user preferences
router.get('/preferences', auth, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { preferences: user.preferences || {} }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message
    });
  }
});

// Update user preferences
router.put('/preferences', auth, [
  body('preferences').isObject().withMessage('Preferences must be an object')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { preferences } = req.body;
    users[userIndex].preferences = { ...users[userIndex].preferences, ...preferences };

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: users[userIndex].preferences }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For demo purposes, accept any current password
    // In production, verify the current password with bcrypt
    
    const bcrypt = require('bcryptjs');
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedNewPassword;

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/account', auth, (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    users.splice(userIndex, 1);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting account',
      error: error.message
    });
  }
});

module.exports = router;
