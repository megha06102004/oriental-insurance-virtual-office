const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Mock data for customers with detailed health policy information
let customers = [
  {
    id: 'CUST001',
    userId: 'user1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    address: {
      street: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India'
    },
    emergencyContact: {
      name: 'Priya Kumar',
      relationship: 'Wife',
      phone: '+91-9876543211'
    },
    medicalHistory: {
      bloodGroup: 'O+',
      allergies: ['Penicillin'],
      chronicConditions: ['Diabetes Type 2'],
      previousSurgeries: [],
      currentMedications: ['Metformin 500mg']
    },
    policies: ['POL002']
  }
];

// Mock data for surveyors
let surveyors = [
  {
    id: 'SUR001',
    name: 'Dr. Amit Sharma',
    specialization: 'Health Claims',
    experience: '8 years',
    location: 'Mumbai',
    phone: '+91-9876543300',
    email: 'amit.sharma@orientalinsurance.com',
    currentCases: 3,
    maxCases: 10,
    rating: 4.8,
    status: 'Available'
  },
  {
    id: 'SUR002',
    name: 'Dr. Sneha Patel',
    specialization: 'Health Claims',
    experience: '6 years',
    location: 'Mumbai',
    phone: '+91-9876543301',
    email: 'sneha.patel@orientalinsurance.com',
    currentCases: 5,
    maxCases: 12,
    rating: 4.9,
    status: 'Available'
  },
  {
    id: 'SUR003',
    name: 'Dr. Vikram Singh',
    specialization: 'Motor Claims',
    experience: '10 years',
    location: 'Delhi',
    phone: '+91-9876543302',
    email: 'vikram.singh@orientalinsurance.com',
    currentCases: 7,
    maxCases: 15,
    rating: 4.7,
    status: 'Busy'
  }
];

// Mock data for enhanced claims with surveyor integration
let claims = [
  {
    id: 'CLM001',
    userId: 'user1',
    customerId: 'CUST001',
    policyId: 'POL002',
    policyNumber: 'HLT/2024/002',
    type: 'Health Claim',
    claimType: 'Hospitalization',
    incidentDate: '2024-07-25',
    reportedDate: '2024-07-26',
    status: 'Under Survey',
    priority: 'High',
    claimAmount: 0,
    estimatedAmount: 150000,
    approvedAmount: 0,
    description: 'Emergency cardiac surgery - Angioplasty procedure',
    hospitalName: 'Lilavati Hospital, Mumbai',
    treatmentDetails: {
      diagnosis: 'Acute Myocardial Infarction',
      procedure: 'Percutaneous Coronary Intervention (PCI)',
      doctorName: 'Dr. Ramesh Gupta',
      admissionDate: '2024-07-25',
      dischargeDate: '2024-07-28',
      roomType: 'ICU'
    },
    assignedSurveyor: {
      id: 'SUR001',
      name: 'Dr. Amit Sharma',
      phone: '+91-9876543300',
      assignedDate: '2024-07-27'
    },
    contactNumber: '+91-9876543210',
    documents: [
      { type: 'Medical Reports', status: 'Submitted', uploadDate: '2024-07-26' },
      { type: 'Hospital Bills', status: 'Submitted', uploadDate: '2024-07-26' },
      { type: 'Discharge Summary', status: 'Pending', uploadDate: null }
    ],
    timeline: [
      { step: 'Claim Reported', date: '2024-07-26', completed: true, remarks: 'Initial claim submission received' },
      { step: 'Customer Verification', date: '2024-07-26', completed: true, remarks: 'Policy and customer details verified' },
      { step: 'Documents Collection', date: '2024-07-26', completed: true, remarks: 'Medical reports and bills submitted' },
      { step: 'Surveyor Assigned', date: '2024-07-27', completed: true, remarks: 'Dr. Amit Sharma assigned for survey' },
      { step: 'Survey In Progress', date: '2024-07-27', completed: false, remarks: 'Hospital visit scheduled' },
      { step: 'Survey Report', date: null, completed: false, remarks: 'Awaiting surveyor report' },
      { step: 'Medical Review', date: null, completed: false, remarks: 'Medical board review pending' },
      { step: 'Approval Decision', date: null, completed: false, remarks: 'Final approval pending' },
      { step: 'Payment Processing', date: null, completed: false, remarks: 'Settlement processing' }
    ],
    surveyReport: null,
    createdAt: '2024-07-26',
    updatedAt: '2024-07-27'
  }
];

// Get customer details by policy number
router.get('/customer/:policyNumber', (req, res) => {
  try {
    const { policyNumber } = req.params;
    
    // Find policy by number
    const policy = require('./policies').policies?.find(p => p.policyNumber === policyNumber);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    // Find customer by policy
    const customer = customers.find(c => c.policies.includes(policy.id));
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found for this policy'
      });
    }

    // Return customer details with policy information
    res.json({
      success: true,
      data: {
        customer: customer,
        policy: policy,
        eligibleForClaim: policy.status === 'Active'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching customer details',
      error: error.message
    });
  }
});

// Get available surveyors for claim assignment
router.get('/surveyors/available', (req, res) => {
  try {
    const { claimType, location } = req.query;
    
    let availableSurveyors = surveyors.filter(surveyor => 
      surveyor.status === 'Available' && 
      surveyor.currentCases < surveyor.maxCases
    );

    // Filter by specialization if claim type provided
    if (claimType) {
      if (claimType.toLowerCase().includes('health')) {
        availableSurveyors = availableSurveyors.filter(s => 
          s.specialization === 'Health Claims'
        );
      } else if (claimType.toLowerCase().includes('motor')) {
        availableSurveyors = availableSurveyors.filter(s => 
          s.specialization === 'Motor Claims'
        );
      }
    }

    // Sort by rating and current case load
    availableSurveyors.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
      return a.currentCases - b.currentCases;
    });

    res.json({
      success: true,
      data: availableSurveyors,
      total: availableSurveyors.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available surveyors',
      error: error.message
    });
  }
});

// Create new health claim with customer verification
router.post('/health', [
  body('policyNumber').notEmpty().withMessage('Policy number is required'),
  body('claimType').notEmpty().withMessage('Claim type is required'),
  body('incidentDate').isISO8601().withMessage('Valid incident date is required'),
  body('estimatedAmount').isNumeric().withMessage('Estimated amount must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('hospitalName').notEmpty().withMessage('Hospital name is required'),
  body('treatmentDetails.diagnosis').notEmpty().withMessage('Diagnosis is required'),
  body('treatmentDetails.procedure').notEmpty().withMessage('Procedure is required'),
  body('treatmentDetails.doctorName').notEmpty().withMessage('Doctor name is required')
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

    const { policyNumber, claimType, incidentDate, estimatedAmount, description, 
            hospitalName, treatmentDetails } = req.body;

    // Verify customer and policy
    const policy = require('./policies').policies?.find(p => p.policyNumber === policyNumber);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    const customer = customers.find(c => c.policies.includes(policy.id));
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found for this policy'
      });
    }

    // Auto-assign best available surveyor
    const availableSurveyors = surveyors.filter(s => 
      s.status === 'Available' && 
      s.specialization === 'Health Claims' && 
      s.currentCases < s.maxCases
    ).sort((a, b) => b.rating - a.rating);

    if (availableSurveyors.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No surveyors available at the moment. Please try again later.'
      });
    }

    const assignedSurveyor = availableSurveyors[0];
    
    // Update surveyor's case load
    const surveyorIndex = surveyors.findIndex(s => s.id === assignedSurveyor.id);
    surveyors[surveyorIndex].currentCases += 1;

    // Create new claim
    const newClaim = {
      id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
      userId: req.user.id,
      customerId: customer.id,
      policyId: policy.id,
      policyNumber: policyNumber,
      type: 'Health Claim',
      claimType: claimType,
      incidentDate: incidentDate,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      priority: estimatedAmount > 100000 ? 'High' : estimatedAmount > 50000 ? 'Medium' : 'Low',
      claimAmount: 0,
      estimatedAmount: parseFloat(estimatedAmount),
      approvedAmount: 0,
      description: description,
      hospitalName: hospitalName,
      treatmentDetails: treatmentDetails,
      assignedSurveyor: {
        id: assignedSurveyor.id,
        name: assignedSurveyor.name,
        phone: assignedSurveyor.phone,
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: customer.phone,
      documents: [],
      timeline: [
        { step: 'Claim Reported', date: new Date().toISOString().split('T')[0], completed: true, remarks: 'Health claim submitted successfully' },
        { step: 'Customer Verification', date: new Date().toISOString().split('T')[0], completed: true, remarks: 'Policy and customer details verified' },
        { step: 'Surveyor Assignment', date: new Date().toISOString().split('T')[0], completed: true, remarks: `${assignedSurveyor.name} assigned for survey` },
        { step: 'Documents Collection', date: null, completed: false, remarks: 'Awaiting medical documents' },
        { step: 'Survey In Progress', date: null, completed: false, remarks: 'Hospital visit to be scheduled' },
        { step: 'Survey Report', date: null, completed: false, remarks: 'Awaiting surveyor report' },
        { step: 'Medical Review', date: null, completed: false, remarks: 'Medical board review pending' },
        { step: 'Approval Decision', date: null, completed: false, remarks: 'Final approval pending' },
        { step: 'Payment Processing', date: null, completed: false, remarks: 'Settlement processing' }
      ],
      surveyReport: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    claims.push(newClaim);

    res.status(201).json({
      success: true,
      message: 'Health claim registered successfully',
      data: {
        claim: newClaim,
        customer: {
          name: `${customer.firstName} ${customer.lastName}`,
          phone: customer.phone,
          email: customer.email
        },
        assignedSurveyor: assignedSurveyor
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering health claim',
      error: error.message
    });
  }
});

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

// Submit surveyor report
router.post('/:id/surveyor-report', [
  body('surveyorId').notEmpty().withMessage('Surveyor ID is required'),
  body('findings').notEmpty().withMessage('Survey findings are required'),
  body('recommendation').notEmpty().withMessage('Recommendation is required'),
  body('estimatedSettlement').isNumeric().withMessage('Estimated settlement must be a number'),
  body('medicalValidation').isBoolean().withMessage('Medical validation must be boolean'),
  body('documentVerification').isBoolean().withMessage('Document verification must be boolean')
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

    const claimIndex = claims.findIndex(c => c.id === req.params.id);
    
    if (claimIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    const claim = claims[claimIndex];
    const { surveyorId, findings, recommendation, estimatedSettlement, 
            medicalValidation, documentVerification, additionalNotes } = req.body;

    // Verify surveyor is assigned to this claim
    if (claim.assignedSurveyor.id !== surveyorId) {
      return res.status(403).json({
        success: false,
        message: 'Surveyor not authorized for this claim'
      });
    }

    // Create survey report
    const surveyReport = {
      surveyorId: surveyorId,
      surveyorName: claim.assignedSurveyor.name,
      submissionDate: new Date().toISOString(),
      findings: findings,
      recommendation: recommendation,
      estimatedSettlement: parseFloat(estimatedSettlement),
      medicalValidation: medicalValidation,
      documentVerification: documentVerification,
      additionalNotes: additionalNotes || '',
      reportStatus: 'Submitted',
      hospitalVisitDate: new Date().toISOString().split('T')[0],
      documentsReviewed: [
        'Medical Reports',
        'Hospital Bills',
        'Discharge Summary',
        'Treatment Records',
        'Doctor Prescriptions'
      ]
    };

    // Update claim with survey report
    claims[claimIndex].surveyReport = surveyReport;
    claims[claimIndex].status = 'Under Medical Review';
    claims[claimIndex].updatedAt = new Date().toISOString();

    // Update timeline
    const timelineUpdate = claims[claimIndex].timeline;
    
    // Mark survey as completed
    const surveyInProgressIndex = timelineUpdate.findIndex(t => t.step === 'Survey In Progress');
    if (surveyInProgressIndex !== -1) {
      timelineUpdate[surveyInProgressIndex].completed = true;
      timelineUpdate[surveyInProgressIndex].date = new Date().toISOString().split('T')[0];
      timelineUpdate[surveyInProgressIndex].remarks = 'Hospital visit completed';
    }

    // Mark survey report as completed
    const surveyReportIndex = timelineUpdate.findIndex(t => t.step === 'Survey Report');
    if (surveyReportIndex !== -1) {
      timelineUpdate[surveyReportIndex].completed = true;
      timelineUpdate[surveyReportIndex].date = new Date().toISOString().split('T')[0];
      timelineUpdate[surveyReportIndex].remarks = 'Surveyor report submitted';
    }

    // Update surveyor's case load
    const surveyorIndex = surveyors.findIndex(s => s.id === surveyorId);
    if (surveyorIndex !== -1) {
      surveyors[surveyorIndex].currentCases -= 1;
    }

    res.json({
      success: true,
      message: 'Survey report submitted successfully',
      data: {
        claim: claims[claimIndex],
        surveyReport: surveyReport
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting survey report',
      error: error.message
    });
  }
});

// Process claim approval/rejection based on survey report
router.put('/:id/process', [
  body('decision').isIn(['approved', 'rejected', 'pending']).withMessage('Invalid decision'),
  body('approvedAmount').optional().isNumeric().withMessage('Approved amount must be a number'),
  body('remarks').notEmpty().withMessage('Processing remarks are required')
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

    const claimIndex = claims.findIndex(c => c.id === req.params.id);
    
    if (claimIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    const claim = claims[claimIndex];
    const { decision, approvedAmount, remarks } = req.body;

    // Check if survey report exists
    if (!claim.surveyReport) {
      return res.status(400).json({
        success: false,
        message: 'Survey report required before processing claim'
      });
    }

    // Update claim based on decision
    if (decision === 'approved') {
      claims[claimIndex].status = 'Approved';
      claims[claimIndex].approvedAmount = approvedAmount ? parseFloat(approvedAmount) : claim.estimatedAmount;
      
      // Update timeline for approval
      const timelineUpdate = claims[claimIndex].timeline;
      
      const medicalReviewIndex = timelineUpdate.findIndex(t => t.step === 'Medical Review');
      if (medicalReviewIndex !== -1) {
        timelineUpdate[medicalReviewIndex].completed = true;
        timelineUpdate[medicalReviewIndex].date = new Date().toISOString().split('T')[0];
        timelineUpdate[medicalReviewIndex].remarks = 'Medical review completed - Approved';
      }

      const approvalIndex = timelineUpdate.findIndex(t => t.step === 'Approval Decision');
      if (approvalIndex !== -1) {
        timelineUpdate[approvalIndex].completed = true;
        timelineUpdate[approvalIndex].date = new Date().toISOString().split('T')[0];
        timelineUpdate[approvalIndex].remarks = `Claim approved for ₹${claims[claimIndex].approvedAmount}`;
      }

    } else if (decision === 'rejected') {
      claims[claimIndex].status = 'Rejected';
      claims[claimIndex].approvedAmount = 0;
      
      // Update timeline for rejection
      const timelineUpdate = claims[claimIndex].timeline;
      
      const medicalReviewIndex = timelineUpdate.findIndex(t => t.step === 'Medical Review');
      if (medicalReviewIndex !== -1) {
        timelineUpdate[medicalReviewIndex].completed = true;
        timelineUpdate[medicalReviewIndex].date = new Date().toISOString().split('T')[0];
        timelineUpdate[medicalReviewIndex].remarks = 'Medical review completed - Issues found';
      }

      const approvalIndex = timelineUpdate.findIndex(t => t.step === 'Approval Decision');
      if (approvalIndex !== -1) {
        timelineUpdate[approvalIndex].completed = true;
        timelineUpdate[approvalIndex].date = new Date().toISOString().split('T')[0];
        timelineUpdate[approvalIndex].remarks = `Claim rejected - ${remarks}`;
      }
    }

    claims[claimIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: `Claim ${decision} successfully`,
      data: claims[claimIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing claim',
      error: error.message
    });
  }
});

// Initiate payment for approved claims
router.post('/:id/payment', (req, res) => {
  try {
    const claimIndex = claims.findIndex(c => c.id === req.params.id);
    
    if (claimIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    const claim = claims[claimIndex];

    if (claim.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Claim must be approved before payment'
      });
    }

    // Update claim status to payment processing
    claims[claimIndex].status = 'Payment Processing';
    claims[claimIndex].claimAmount = claim.approvedAmount;
    claims[claimIndex].updatedAt = new Date().toISOString();

    // Update timeline
    const timelineUpdate = claims[claimIndex].timeline;
    const paymentIndex = timelineUpdate.findIndex(t => t.step === 'Payment Processing');
    if (paymentIndex !== -1) {
      timelineUpdate[paymentIndex].completed = true;
      timelineUpdate[paymentIndex].date = new Date().toISOString().split('T')[0];
      timelineUpdate[paymentIndex].remarks = `Payment of ₹${claim.approvedAmount} initiated`;
    }

    // Simulate payment processing (in real implementation, integrate with payment gateway)
    setTimeout(() => {
      const finalClaimIndex = claims.findIndex(c => c.id === req.params.id);
      if (finalClaimIndex !== -1) {
        claims[finalClaimIndex].status = 'Settled';
        claims[finalClaimIndex].updatedAt = new Date().toISOString();
      }
    }, 5000); // Simulate 5 second processing time

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        claim: claims[claimIndex],
        paymentDetails: {
          amount: claim.approvedAmount,
          method: 'Bank Transfer',
          estimatedProcessingTime: '1-2 business days',
          referenceNumber: `PAY${Date.now()}`
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initiating payment',
      error: error.message
    });
  }
});

module.exports = router;
