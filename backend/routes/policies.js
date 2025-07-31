const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock data for policies
let policies = [
  {
    id: 'POL001',
    userId: 'user1',
    type: 'Motor Insurance',
    policyNumber: 'MOT/2024/001',
    vehicle: 'Honda City 2020',
    premium: 15000,
    coverageAmount: 500000,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'POL002',
    userId: 'user1',
    type: 'Health Insurance',
    policyNumber: 'HLT/2024/002',
    coverage: 'Family Health Plan',
    premium: 25000,
    coverageAmount: 1000000,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Get all policies for authenticated user
router.get('/', (req, res) => {
  try {
    const userPolicies = policies.filter(policy => policy.userId === req.user.id);
    
    res.json({
      success: true,
      data: userPolicies,
      total: userPolicies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching policies',
      error: error.message
    });
  }
});

// Get policy by ID
router.get('/:id', (req, res) => {
  try {
    const policy = policies.find(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching policy',
      error: error.message
    });
  }
});

// Create new policy
router.post('/', [
  body('type').notEmpty().withMessage('Policy type is required'),
  body('premium').isNumeric().withMessage('Premium must be a number'),
  body('coverageAmount').isNumeric().withMessage('Coverage amount must be a number')
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

    const newPolicy = {
      id: `POL${String(policies.length + 1).padStart(3, '0')}`,
      userId: req.user.id,
      ...req.body,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    policies.push(newPolicy);

    res.status(201).json({
      success: true,
      message: 'Policy created successfully',
      data: newPolicy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating policy',
      error: error.message
    });
  }
});

// Update policy
router.put('/:id', (req, res) => {
  try {
    const policyIndex = policies.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (policyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    policies[policyIndex] = {
      ...policies[policyIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Policy updated successfully',
      data: policies[policyIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating policy',
      error: error.message
    });
  }
});

// Renew policy
router.post('/:id/renew', (req, res) => {
  try {
    const policyIndex = policies.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (policyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    const policy = policies[policyIndex];
    const currentEndDate = new Date(policy.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setFullYear(currentEndDate.getFullYear() + 1);

    policies[policyIndex] = {
      ...policy,
      status: 'Active',
      endDate: newEndDate.toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Policy renewed successfully',
      data: policies[policyIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error renewing policy',
      error: error.message
    });
  }
});

// Get policy document
router.get('/:id/document', (req, res) => {
  try {
    const policy = policies.find(p => p.id === req.params.id && p.userId === req.user.id);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    // In a real application, this would generate/serve the actual document
    res.json({
      success: true,
      message: 'Policy document generated',
      data: {
        documentUrl: `/documents/policy_${policy.id}.pdf`,
        documentType: 'application/pdf',
        documentSize: '2.5 MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating policy document',
      error: error.message
    });
  }
});

module.exports = router;
