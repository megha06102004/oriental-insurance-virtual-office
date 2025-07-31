const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock data for claims
let claims = [
  {
    id: 'CLM001',
    userId: 'user1',
    policyId: 'POL001',
    type: 'Motor Claim',
    incidentDate: '2024-01-15',
    reportedDate: '2024-01-16',
    status: 'Processing',
    claimAmount: 0,
    estimatedAmount: 50000,
    description: 'Vehicle accident - Front bumper damage',
    assignedTo: 'John Smith',
    contactNumber: '+91-9876543210',
    documents: [],
    timeline: [
      { step: 'Claim Reported', date: '2024-01-16', completed: true },
      { step: 'Documents Verified', date: '2024-01-18', completed: true },
      { step: 'Survey Scheduled', date: '2024-01-20', completed: true },
      { step: 'Assessment Complete', date: null, completed: false },
      { step: 'Approval Pending', date: null, completed: false },
      { step: 'Payment Processing', date: null, completed: false }
    ],
    createdAt: '2024-01-16',
    updatedAt: '2024-01-28'
  }
];

// Get all claims for authenticated user
router.get('/', (req, res) => {
  try {
    const userClaims = claims.filter(claim => claim.userId === req.user.id);
    
    res.json({
      success: true,
      data: userClaims,
      total: userClaims.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claims',
      error: error.message
    });
  }
});

// Get claim by ID
router.get('/:id', (req, res) => {
  try {
    const claim = claims.find(c => c.id === req.params.id && c.userId === req.user.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claim',
      error: error.message
    });
  }
});

// Create new claim
router.post('/', [
  body('policyId').notEmpty().withMessage('Policy ID is required'),
  body('type').notEmpty().withMessage('Claim type is required'),
  body('incidentDate').notEmpty().withMessage('Incident date is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('estimatedAmount').isNumeric().withMessage('Estimated amount must be a number')
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

    const newClaim = {
      id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
      userId: req.user.id,
      ...req.body,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      claimAmount: 0,
      assignedTo: 'Support Team',
      contactNumber: '+91-1800-118-485',
      documents: [],
      timeline: [
        { step: 'Claim Reported', date: new Date().toISOString().split('T')[0], completed: true },
        { step: 'Documents Verification', date: null, completed: false },
        { step: 'Survey Scheduled', date: null, completed: false },
        { step: 'Assessment Complete', date: null, completed: false },
        { step: 'Approval Pending', date: null, completed: false },
        { step: 'Payment Processing', date: null, completed: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    claims.push(newClaim);

    res.status(201).json({
      success: true,
      message: 'Claim registered successfully',
      data: newClaim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering claim',
      error: error.message
    });
  }
});

// Update claim status
router.put('/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
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

    const claimIndex = claims.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
    
    if (claimIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    claims[claimIndex] = {
      ...claims[claimIndex],
      status: req.body.status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Claim status updated successfully',
      data: claims[claimIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating claim status',
      error: error.message
    });
  }
});

// Upload claim documents
router.post('/:id/documents', (req, res) => {
  try {
    const claimIndex = claims.findIndex(c => c.id === req.params.id && c.userId === req.user.id);
    
    if (claimIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    // In a real application, this would handle file uploads
    const newDocument = {
      id: `DOC${Date.now()}`,
      name: req.body.documentName || 'Document',
      type: req.body.documentType || 'application/pdf',
      url: `/uploads/claim_${req.params.id}_${Date.now()}.pdf`,
      uploadedAt: new Date().toISOString()
    };

    claims[claimIndex].documents.push(newDocument);
    claims[claimIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
});

// Get claim timeline
router.get('/:id/timeline', (req, res) => {
  try {
    const claim = claims.find(c => c.id === req.params.id && c.userId === req.user.id);
    
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.json({
      success: true,
      data: claim.timeline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claim timeline',
      error: error.message
    });
  }
});

// Get claim statistics
router.get('/stats/summary', (req, res) => {
  try {
    const userClaims = claims.filter(claim => claim.userId === req.user.id);
    
    const stats = {
      total: userClaims.length,
      pending: userClaims.filter(c => c.status === 'Pending').length,
      processing: userClaims.filter(c => c.status === 'Processing').length,
      approved: userClaims.filter(c => c.status === 'Approved').length,
      rejected: userClaims.filter(c => c.status === 'Rejected').length,
      totalClaimAmount: userClaims.reduce((sum, c) => sum + c.claimAmount, 0),
      averageProcessingTime: '15 days' // Mock data
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching claim statistics',
      error: error.message
    });
  }
});

module.exports = router;
