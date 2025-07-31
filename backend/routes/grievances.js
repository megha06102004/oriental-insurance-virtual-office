const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock data for grievances
let grievances = [
  {
    id: 'GRV001',
    userId: 'user1',
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
    rating: 0,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-28'
  }
];

// Get all grievances for authenticated user
router.get('/', (req, res) => {
  try {
    const userGrievances = grievances.filter(grievance => grievance.userId === req.user.id);
    
    res.json({
      success: true,
      data: userGrievances,
      total: userGrievances.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grievances',
      error: error.message
    });
  }
});

// Get grievance by ID
router.get('/:id', (req, res) => {
  try {
    const grievance = grievances.find(g => g.id === req.params.id && g.userId === req.user.id);
    
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    res.json({
      success: true,
      data: grievance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grievance',
      error: error.message
    });
  }
});

// Create new grievance
router.post('/', [
  body('type').notEmpty().withMessage('Grievance type is required'),
  body('priority').isIn(['Low', 'Medium', 'High']).withMessage('Priority must be Low, Medium, or High'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('description').notEmpty().withMessage('Description is required')
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

    const newGrievance = {
      id: `GRV${String(grievances.length + 1).padStart(3, '0')}`,
      userId: req.user.id,
      ...req.body,
      status: 'Pending',
      reportedDate: new Date().toISOString().split('T')[0],
      assignedTo: 'Support Team',
      contactNumber: '+91-1800-118-485',
      email: 'support@oriental.co.in',
      lastUpdate: new Date().toISOString().split('T')[0],
      resolution: 'Grievance received and under review.',
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    grievances.push(newGrievance);

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      data: newGrievance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting grievance',
      error: error.message
    });
  }
});

// Update grievance status
router.put('/:id/status', [
  body('status').isIn(['Pending', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status')
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

    const grievanceIndex = grievances.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    
    if (grievanceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    grievances[grievanceIndex] = {
      ...grievances[grievanceIndex],
      status: req.body.status,
      resolution: req.body.resolution || grievances[grievanceIndex].resolution,
      lastUpdate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Grievance status updated successfully',
      data: grievances[grievanceIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating grievance status',
      error: error.message
    });
  }
});

// Submit rating for resolved grievance
router.post('/:id/rating', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().isString()
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

    const grievanceIndex = grievances.findIndex(g => g.id === req.params.id && g.userId === req.user.id);
    
    if (grievanceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Grievance not found'
      });
    }

    const grievance = grievances[grievanceIndex];
    
    if (grievance.status !== 'Resolved') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate resolved grievances'
      });
    }

    grievances[grievanceIndex] = {
      ...grievance,
      rating: req.body.rating,
      feedback: req.body.feedback,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: grievances[grievanceIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: error.message
    });
  }
});

// Get grievance statistics
router.get('/stats/summary', (req, res) => {
  try {
    const userGrievances = grievances.filter(grievance => grievance.userId === req.user.id);
    
    const stats = {
      total: userGrievances.length,
      pending: userGrievances.filter(g => g.status === 'Pending').length,
      inProgress: userGrievances.filter(g => g.status === 'In Progress').length,
      resolved: userGrievances.filter(g => g.status === 'Resolved').length,
      closed: userGrievances.filter(g => g.status === 'Closed').length,
      averageRating: userGrievances.filter(g => g.rating > 0).reduce((sum, g) => sum + g.rating, 0) / userGrievances.filter(g => g.rating > 0).length || 0,
      averageResolutionTime: '5 days' // Mock data
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching grievance statistics',
      error: error.message
    });
  }
});

// Get support contacts
router.get('/support/contacts', (req, res) => {
  try {
    const contacts = {
      customerCare: {
        phone: '1800-118-485',
        email: 'customercare@orientalinsurance.co.in',
        availability: '24/7'
      },
      motorClaims: {
        phone: '1800-103-3003',
        email: 'motorclaims@orientalinsurance.co.in',
        availability: '24/7'
      },
      healthClaims: {
        phone: '1800-118-485',
        email: 'healthclaims@orientalinsurance.co.in',
        availability: 'Mon-Sat 9AM-6PM'
      },
      generalSupport: {
        phone: '1800-118-485',
        email: 'support@orientalinsurance.co.in',
        availability: 'Mon-Fri 9AM-6PM'
      }
    };

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching support contacts',
      error: error.message
    });
  }
});

module.exports = router;
