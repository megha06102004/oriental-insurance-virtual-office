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
      status: 'pending_approval' // Initial status
    };
    
    const newPolicy = await fileStorage.createPolicy(policyData);
    console.log('📄 Policy created with pending status:', newPolicy.policyNumber);
    
    // Auto-approval process (simulating underwriting)
    const autoApproval = process.env.POLICY_AUTO_APPROVAL === 'true';
    
    if (autoApproval) {
      console.log('🔄 Processing auto-approval...');
      
      // Simulate approval delay (1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Approve the policy
      newPolicy.status = 'approved';
      newPolicy.approvedAt = new Date().toISOString();
      newPolicy.approvedBy = 'AUTO_UNDERWRITING_SYSTEM';
      
      // Update policy in storage
      await fileStorage.updatePolicyStatus(newPolicy.id, 'approved');
      
      console.log('✅ Policy auto-approved:', newPolicy.policyNumber);
      
      // Send real email if configured
      if (process.env.SEND_REAL_EMAILS === 'true') {
        console.log('📧 Sending approval email...');
        
        try {
          // Send welcome email
          const welcomeResult = await emailService.sendWelcomeEmail(userData, newPolicy);
          
          // Send policy approval email
          const approvalResult = await emailService.sendPolicyApprovalEmail(newPolicy);
          
          newPolicy.emailStatus = {
            welcomeEmailSent: welcomeResult.success,
            approvalEmailSent: approvalResult.success,
            sentAt: new Date().toISOString()
          };
          
          console.log('✅ Emails sent successfully');
          
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
          newPolicy.emailStatus = {
            welcomeEmailSent: false,
            approvalEmailSent: false,
            error: emailError.message,
            attemptedAt: new Date().toISOString()
          };
        }
      }
    }
    
    res.status(201).json({
      success: true,
      message: autoApproval ? 
        'Policy created and approved successfully! Welcome to Oriental Insurance family. Check your email for policy documents.' :
        'Policy application submitted successfully! Our underwriting team will review and approve within 24 hours.',
      data: newPolicy,
      nextSteps: autoApproval ? [
        '✅ Policy approved and activated immediately',
        '📧 Welcome and approval emails sent to your registered email',
        '💳 Premium payment link will be sent via SMS',
        '📱 Digital policy card available in customer portal',
        '📞 Claim support available 24/7 at 1800-XXX-XXXX',
        '🔍 Use your policy number for claims and customer service'
      ] : [
        'Policy under review by underwriting team',
        'Approval notification will be sent within 24 hours',
        'Premium payment instructions will follow post-approval',
        'Track application status in customer portal'
      ]
    });

  } catch (error) {
    console.error('Policy creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating policy',
      error: error.message
    });
  }
});

// Get policy by policy number (for claims section)
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
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        customerName: policy.customerName || policy.fullName,
        email: policy.email,
        phone: policy.phone,
        policyType: policy.policyType,
        coverageAmount: policy.coverageAmount,
        premium: policy.premium,
        startDate: policy.startDate,
        endDate: policy.endDate,
        status: policy.status,
        features: policy.features,
        vehicleDetails: policy.vehicleDetails,
        healthDetails: policy.healthDetails,
        homeDetails: policy.homeDetails,
        travelDetails: policy.travelDetails
      }
    });
    
  } catch (error) {
    console.error('Policy lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving policy',
      error: error.message
    });
  }
});

// Manual policy approval (for admin use)
router.post('/:id/approve', async (req, res) => {
  try {
    const policyId = req.params.id;
    const { approvedBy = 'MANUAL_APPROVAL' } = req.body;
    
    const policy = await fileStorage.getPolicyById(policyId);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }
    
    if (policy.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Policy is already approved'
      });
    }
    
    // Approve the policy
    await fileStorage.updatePolicyStatus(policyId, 'approved');
    
    // Send approval email
    if (process.env.SEND_REAL_EMAILS === 'true') {
      await emailService.sendPolicyApprovalEmail(policy);
    }
    
    res.json({
      success: true,
      message: 'Policy approved successfully',
      data: {
        policyId,
        policyNumber: policy.policyNumber,
        status: 'approved',
        approvedAt: new Date().toISOString(),
        approvedBy
      }
    });
    
  } catch (error) {
    console.error('Policy approval error:', error);
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
    const { email = 'test@example.com' } = req.body;
    
    const testPolicy = {
      policyNumber: 'TEST/2025/0001',
      customerName: 'Test Customer',
      fullName: 'Test Customer',
      email: email,
      policyType: 'health',
      premium: 25000,
      coverageAmount: 1000000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      features: ['Test Feature 1', 'Test Feature 2']
    };
    
    const result = await emailService.sendPolicyApprovalEmail(testPolicy);
    
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

// Mock data for backward compatibility
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
  },
  {
    id: 'POL003',
    userId: 'user1',
    type: 'Home Insurance',
    policyNumber: 'HOM/2024/001',
    coverage: 'Comprehensive Home Protection',
    premium: 20000,
    coverageAmount: 2000000,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'POL004',
    userId: 'user1',
    type: 'Travel Insurance',
    policyNumber: 'TRV/2024/001',
    coverage: 'International Travel Plan',
    premium: 5000,
    coverageAmount: 500000,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'POL005',
    userId: 'user1',
    type: 'Marine Insurance',
    policyNumber: 'MAR/2024/001',
    coverage: 'Cargo Transit Insurance',
    premium: 30000,
    coverageAmount: 5000000,
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: 'POL006',
    userId: 'user1',
    type: 'Fire Insurance',
    policyNumber: 'FIR/2024/001',
    coverage: 'Commercial Fire Protection',
    premium: 18000,
    coverageAmount: 3000000,
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
