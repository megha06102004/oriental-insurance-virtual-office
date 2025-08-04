const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const fileStorage = require('../utils/fileStorage');
const emailService = require('../utils/emailService');

// Initialize file storage on module load
fileStorage.initializeDataFiles().catch(console.error);

// Policy creation with comprehensive data collection, email sending, and approval workflow
router.post('/register', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('policyType').notEmpty().withMessage('Policy type is required'),
  body('address').optional()
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

    console.log('📋 Creating new policy with data:', req.body);

    // Create or get user
    const userData = {
      email: req.body.email,
      name: req.body.fullName,
      phone: req.body.phone,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      annualIncome: req.body.annualIncome
    };
    
    const user = await fileStorage.createUser(userData);
    console.log('👤 User created/found:', user.id);
    
    // Create policy with initial pending status
    const policyData = {
      userId: user.id,
      ...req.body,
      vehicleDetails: req.body.vehicleDetails,
      healthDetails: req.body.healthDetails,
      homeDetails: req.body.homeDetails,
      travelDetails: req.body.travelDetails,
      applicationDate: new Date().toISOString().split('T')[0],
      userAgent: req.get('User-Agent'),
      referenceId: `WEB_${Date.now()}`,
      status: 'pending' // Start with pending status
    };
    
    const policy = await fileStorage.createPolicy(policyData);
    console.log('📄 Policy created:', policy.policyNumber);

    // Auto-approve policy if enabled
    if (process.env.POLICY_AUTO_APPROVAL === 'true') {
      const approvedPolicy = await fileStorage.updatePolicyStatus(policy.id, 'approved');
      console.log('✅ Policy auto-approved:', approvedPolicy.policyNumber);
      
      // Send approval email if real email sending is enabled
      if (process.env.SEND_REAL_EMAILS === 'true') {
        try {
          const emailResult = await emailService.sendPolicyApprovalEmail(approvedPolicy);
          console.log('📧 Approval email sent:', emailResult.success);
        } catch (emailError) {
          console.error('📧 Email sending failed:', emailError.message);
          // Don't fail the policy creation if email fails
        }
      }
      
      res.status(201).json({
        success: true,
        message: 'Policy created and approved successfully',
        data: {
          policyNumber: approvedPolicy.policyNumber,
          status: approvedPolicy.status,
          premium: approvedPolicy.premium,
          coverageAmount: approvedPolicy.coverageAmount,
          startDate: approvedPolicy.startDate,
          endDate: approvedPolicy.endDate,
          customerName: approvedPolicy.fullName,
          email: approvedPolicy.email,
          emailSent: process.env.SEND_REAL_EMAILS === 'true'
        }
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'Policy created and pending approval',
        data: {
          policyNumber: policy.policyNumber,
          status: policy.status,
          premium: policy.premium,
          coverageAmount: policy.coverageAmount,
          customerName: policy.fullName,
          email: policy.email
        }
      });
    }

  } catch (error) {
    console.error('❌ Policy creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating policy',
      error: error.message
    });
  }
});

// Policy lookup by policy number (for claims section)
router.get('/number/:policyNumber', async (req, res) => {
  try {
    const policyNumber = req.params.policyNumber;
    console.log('🔍 Looking up policy:', policyNumber);
    
    const policy = await fileStorage.getPolicyByNumber(policyNumber);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
        details: 'No policy exists with this policy number. Please check the number and try again.'
      });
    }

    // Check if policy is approved/active
    if (policy.status !== 'approved' && policy.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Policy not active',
        details: `Policy status is '${policy.status}'. Only approved/active policies are eligible for claims.`,
        data: {
          policyNumber: policy.policyNumber,
          status: policy.status,
          customerName: policy.customerName || policy.fullName
        }
      });
    }

    // Return policy details for claims processing
    res.json({
      success: true,
      message: 'Policy found and active',
      data: {
        policyNumber: policy.policyNumber,
        customerName: policy.customerName || policy.fullName,
        email: policy.email,
        phone: policy.phone,
        policyType: policy.policyType,
        premium: policy.premium,
        coverageAmount: policy.coverageAmount,
        startDate: policy.startDate,
        endDate: policy.endDate,
        status: policy.status,
        features: policy.features,
        benefits: policy.benefits
      }
    });

  } catch (error) {
    console.error('❌ Policy lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error looking up policy',
      error: error.message
    });
  }
});

// Manual policy approval endpoint
router.post('/:id/approve', async (req, res) => {
  try {
    const policyId = req.params.id;
    console.log('✅ Manually approving policy:', policyId);
    
    const approvedPolicy = await fileStorage.updatePolicyStatus(policyId, 'approved');
    
    if (!approvedPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    // Send approval email
    if (process.env.SEND_REAL_EMAILS === 'true') {
      try {
        const emailResult = await emailService.sendPolicyApprovalEmail(approvedPolicy);
        console.log('📧 Approval email sent:', emailResult.success);
      } catch (emailError) {
        console.error('📧 Email sending failed:', emailError.message);
      }
    }

    res.json({
      success: true,
      message: 'Policy approved successfully',
      data: {
        policyNumber: approvedPolicy.policyNumber,
        status: approvedPolicy.status,
        approvedAt: approvedPolicy.approvedAt,
        customerName: approvedPolicy.fullName,
        email: approvedPolicy.email,
        emailSent: process.env.SEND_REAL_EMAILS === 'true'
      }
    });

  } catch (error) {
    console.error('❌ Policy approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving policy',
      error: error.message
    });
  }
});

// Get all policies
router.get('/', async (req, res) => {
  try {
    const policies = await fileStorage.getPolicies();
    res.json({
      success: true,
      data: policies,
      total: policies.length
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
router.get('/:id', async (req, res) => {
  try {
    const policy = await fileStorage.getPolicyById(req.params.id);
    
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

// Test email functionality
router.post('/test-email', async (req, res) => {
  try {
    const { email, type = 'test' } = req.body;
    
    let result;
    if (type === 'approval') {
      // Test approval email with mock policy data
      const mockPolicy = {
        policyNumber: 'TEST/2025/0001',
        fullName: 'Test Customer',
        email: email || 'test@example.com',
        policyType: 'health',
        premium: 25000,
        coverageAmount: 1000000
      };
      result = await emailService.sendPolicyApprovalEmail(mockPolicy);
    } else {
      // Test welcome email
      result = await emailService.sendWelcomeEmail(email || 'test@example.com', 'Test Customer');
    }
    
    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      data: result
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
});

module.exports = router;
