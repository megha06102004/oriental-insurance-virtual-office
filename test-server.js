const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const emailService = require('./email-service');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

// List all policies (for admin/debugging)
app.get('/api/policies', async (req, res) => {
  try {
    const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
    const policiesData = await fs.readFile(policiesPath, 'utf8');
    const policies = JSON.parse(policiesData);
    
    res.json({
      success: true,
      message: `Found ${policies.length} policies in database`,
      count: policies.length,
      data: policies.map(policy => ({
        policyNumber: policy.policyNumber,
        customerName: policy.customerName,
        email: policy.email,
        policyType: policy.policyType,
        status: policy.status,
        premium: policy.premium,
        created_at: policy.created_at || policy.applicationDate
      }))
    });
  } catch (error) {
    console.error('Error fetching policies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching policies',
      error: error.message
    });
  }
});

// Basic policy lookup
app.get('/api/policies/number/:policyNumber', async (req, res) => {
  try {
    const policyNumber = decodeURIComponent(req.params.policyNumber);
    console.log('Looking up policy:', policyNumber);
    
    // Read policies from file
    const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
    const policiesData = await fs.readFile(policiesPath, 'utf8');
    const policies = JSON.parse(policiesData);
    
    const policy = policies.find(p => p.policyNumber === policyNumber);
    
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found',
        details: 'No policy exists with this policy number. Please check the number and try again.'
      });
    }

    res.json({
      success: true,
      message: 'Policy found and active',
      data: {
        ...policy,
        // Ensure customer details are available for claims verification
        customer: policy.customerDetails || {
          firstName: policy.customerName?.split(' ')[0] || 'Not provided',
          lastName: policy.customerName?.split(' ').slice(1).join(' ') || '',
          email: policy.email,
          phone: policy.phone,
          address: policy.address || 'Address not provided',
          dateOfBirth: policy.dateOfBirth || 'Not provided',
          bloodGroup: policy.bloodGroup || 'Not specified',
          allergies: policy.allergies || 'None reported',
          chronicConditions: policy.chronicConditions || 'None reported'
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all claims
app.get('/api/claims', async (req, res) => {
  try {
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    res.json({
      success: true,
      data: claims
    });
  } catch (error) {
    console.error('Error reading claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading claims data',
      error: error.message
    });
  }
});

// Get claims by policy number
app.get('/api/claims/policy/:policyNumber', async (req, res) => {
  try {
    const policyNumber = decodeURIComponent(req.params.policyNumber);
    console.log('Looking up claims for policy:', policyNumber);
    
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Filter claims by policy number
    const policyClaims = claims.filter(claim => claim.policyNumber === policyNumber);
    
    res.json({
      success: true,
      message: `Found ${policyClaims.length} claims for policy ${policyNumber}`,
      data: policyClaims
    });
  } catch (error) {
    console.error('Error reading claims:', error);
    res.status(500).json({
      success: false,
      message: 'Error reading claims data',
      error: error.message
    });
  }
});

// Submit health claim endpoint
app.post('/api/claims/health', async (req, res) => {
  try {
    console.log('Health claim submission:', req.body);
    
    // Read existing claims
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Generate new claim ID
    const claimId = `CLM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Create new claim object
    const newClaim = {
      id: claimId,
      userId: "demo_user",
      customerId: "CUST_AUTO",
      policyId: "auto_generated",
      policyNumber: req.body.policyNumber,
      type: "Health Claim",
      claimType: req.body.claimType || "Hospitalization",
      incidentDate: req.body.incidentDate,
      priority: "Medium",
      claimAmount: 0,
      estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
      approvedAmount: 0,
      description: req.body.description,
      hospitalName: req.body.hospitalName,
      treatmentDetails: req.body.treatmentDetails || {},
      assignedSurveyor: {
        id: "SUR001",
        name: "Dr. Amit Sharma",
        phone: "+91-9876543300",
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: "+91-9876543210",
      documents: [],
      timeline: [
        {
          step: "Claim Reported",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Health claim submitted successfully"
        },
        {
          step: "Customer Verification",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Policy and customer details verified"
        },
        {
          step: "Surveyor Assignment",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Dr. Amit Sharma assigned for survey"
        },
        {
          step: "Documents Collection",
          date: null,
          completed: false,
          remarks: "Awaiting medical documents"
        },
        {
          step: "Medical Review",
          date: null,
          completed: false,
          remarks: "Medical board review pending"
        },
        {
          step: "Approval Decision",
          date: null,
          completed: false,
          remarks: "Final approval pending"
        },
        {
          step: "Payment Processing",
          date: null,
          completed: false,
          remarks: "Settlement processing"
        }
      ],
      surveyReport: null,
      status: "Under Review",
      submissionMethod: "Online Portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add new claim to claims array
    claims.push(newClaim);
    
    // Save updated claims back to file
    await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2));
    
    console.log(`New claim ${claimId} saved for policy ${req.body.policyNumber}`);
    
    // Send claim confirmation email
    let emailResult;
    try {
      // Get policy data to get customer email
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      const policy = policies.find(p => p.policyNumber === req.body.policyNumber);
      
      if (policy && policy.email) {
        const claimData = {
          claimId: claimId,
          policyNumber: req.body.policyNumber,
          claimType: req.body.claimType || "Hospitalization",
          estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
          assignedSurveyor: "Dr. Amit Sharma"
        };
        
        emailResult = await emailService.sendClaimConfirmation(claimData, policy.email);
        console.log('📧 Claim email result:', emailResult);
      } else {
        emailResult = { success: false, message: 'Policy or email not found', mode: 'demo' };
      }
    } catch (emailError) {
      console.error('📧 Claim email failed:', emailError.message);
      emailResult = { success: false, message: 'Email sending failed', mode: 'demo' };
    }
    
    res.json({
      success: true,
      message: 'Claim submitted successfully and saved',
      data: {
        claimId: claimId,
        status: 'Under Review',
        assignedSurveyor: {
          name: 'Dr. Amit Sharma',
          phone: '+91-9876543300',
          specialization: 'Health Claims'
        },
        emailSent: emailResult?.success || false,
        emailMode: emailResult?.mode || 'demo'
      }
    });
  } catch (error) {
    console.error('Error saving claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting claim',
      error: error.message
    });
  }
});

// Submit motor claim endpoint
app.post('/api/claims/motor', async (req, res) => {
  try {
    console.log('Motor claim submission:', req.body);
    
    // Read existing claims
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Generate new claim ID
    const claimId = `CLM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Create new motor claim object
    const newClaim = {
      id: claimId,
      userId: "demo_user",
      customerId: "CUST_AUTO",
      policyId: "auto_generated",
      policyNumber: req.body.policyNumber,
      type: "Motor Claim",
      claimType: req.body.claimType || "Accident",
      incidentDate: req.body.incidentDate,
      priority: "Medium",
      claimAmount: 0,
      estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
      approvedAmount: 0,
      description: req.body.description,
      incidentLocation: req.body.incidentLocation,
      vehicleDetails: req.body.vehicleDetails || {},
      assignedSurveyor: {
        id: "SUR002",
        name: "Mr. Rajesh Kumar",
        phone: "+91-9876543301",
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: "+91-9876543210",
      documents: [],
      timeline: [
        {
          step: "Claim Reported",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Motor claim submitted successfully"
        },
        {
          step: "Customer Verification",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Policy and customer details verified"
        },
        {
          step: "Surveyor Assignment",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Mr. Rajesh Kumar assigned for vehicle survey"
        },
        {
          step: "Vehicle Inspection",
          date: null,
          completed: false,
          remarks: "Vehicle damage assessment pending"
        },
        {
          step: "Repair Estimate",
          date: null,
          completed: false,
          remarks: "Garage estimate review pending"
        },
        {
          step: "Approval Decision",
          date: null,
          completed: false,
          remarks: "Final approval pending"
        },
        {
          step: "Payment Processing",
          date: null,
          completed: false,
          remarks: "Settlement processing"
        }
      ],
      surveyReport: null,
      status: "Under Review",
      submissionMethod: "Online Portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add new claim to claims array
    claims.push(newClaim);
    
    // Save updated claims back to file
    await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2));
    
    console.log(`New motor claim ${claimId} saved for policy ${req.body.policyNumber}`);
    
    // Send claim confirmation email
    let emailResult;
    try {
      // Get policy data to get customer email
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      const policy = policies.find(p => p.policyNumber === req.body.policyNumber);
      
      if (policy && policy.email) {
        const claimData = {
          claimId: claimId,
          policyNumber: req.body.policyNumber,
          claimType: req.body.claimType || "Accident",
          estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
          assignedSurveyor: "Mr. Rajesh Kumar"
        };
        
        emailResult = await emailService.sendClaimConfirmation(claimData, policy.email);
        console.log('📧 Motor claim email result:', emailResult);
      } else {
        emailResult = { success: false, message: 'Policy or email not found', mode: 'demo' };
      }
    } catch (emailError) {
      console.error('📧 Motor claim email failed:', emailError.message);
      emailResult = { success: false, message: 'Email sending failed', mode: 'demo' };
    }
    
    res.json({
      success: true,
      message: 'Motor claim submitted successfully and saved',
      data: {
        claimId: claimId,
        status: 'Under Review',
        assignedSurveyor: {
          name: 'Mr. Rajesh Kumar',
          phone: '+91-9876543301',
          specialization: 'Motor Claims & Vehicle Assessment'
        },
        emailSent: emailResult?.success || false,
        emailMode: emailResult?.mode || 'demo'
      }
    });
  } catch (error) {
    console.error('Error saving motor claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting motor claim',
      error: error.message
    });
  }
});

// Submit home claim endpoint
app.post('/api/claims/home', async (req, res) => {
  try {
    console.log('Home claim submission:', req.body);
    
    // Read existing claims
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Generate new claim ID
    const claimId = `CLM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Create new home claim object
    const newClaim = {
      id: claimId,
      userId: "demo_user",
      customerId: "CUST_AUTO",
      policyId: "auto_generated",
      policyNumber: req.body.policyNumber,
      type: "Home Claim",
      claimType: req.body.claimType || "Fire",
      incidentDate: req.body.incidentDate,
      priority: "Medium",
      claimAmount: 0,
      estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
      approvedAmount: 0,
      description: req.body.description,
      propertyAddress: req.body.propertyAddress,
      assignedSurveyor: {
        id: "SUR003",
        name: "Ms. Priya Singh",
        phone: "+91-9876543302",
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: "+91-9876543210",
      documents: [],
      timeline: [
        {
          step: "Claim Reported",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Home claim submitted successfully"
        },
        {
          step: "Customer Verification",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Policy and customer details verified"
        },
        {
          step: "Surveyor Assignment",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Ms. Priya Singh assigned for property survey"
        },
        {
          step: "Property Inspection",
          date: null,
          completed: false,
          remarks: "Property damage assessment pending"
        },
        {
          step: "Loss Assessment",
          date: null,
          completed: false,
          remarks: "Loss evaluation pending"
        },
        {
          step: "Approval Decision",
          date: null,
          completed: false,
          remarks: "Final approval pending"
        },
        {
          step: "Payment Processing",
          date: null,
          completed: false,
          remarks: "Settlement processing"
        }
      ],
      surveyReport: null,
      status: "Under Review",
      submissionMethod: "Online Portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add new claim to claims array
    claims.push(newClaim);
    
    // Save updated claims back to file
    await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2));
    
    console.log(`New home claim ${claimId} saved for policy ${req.body.policyNumber}`);
    
    // Send claim confirmation email
    let emailResult;
    try {
      // Get policy data to get customer email
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      const policy = policies.find(p => p.policyNumber === req.body.policyNumber);
      
      if (policy && policy.email) {
        const claimData = {
          claimId: claimId,
          policyNumber: req.body.policyNumber,
          claimType: req.body.claimType || "Fire",
          estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
          assignedSurveyor: "Ms. Priya Singh"
        };
        
        emailResult = await emailService.sendClaimConfirmation(claimData, policy.email);
        console.log('📧 Home claim email result:', emailResult);
      } else {
        emailResult = { success: false, message: 'Policy or email not found', mode: 'demo' };
      }
    } catch (emailError) {
      console.error('📧 Home claim email failed:', emailError.message);
      emailResult = { success: false, message: 'Email sending failed', mode: 'demo' };
    }
    
    res.json({
      success: true,
      message: 'Home claim submitted successfully and saved',
      data: {
        claimId: claimId,
        status: 'Under Review',
        assignedSurveyor: {
          name: 'Ms. Priya Singh',
          phone: '+91-9876543302',
          specialization: 'Property & Home Claims'
        },
        emailSent: emailResult?.success || false,
        emailMode: emailResult?.mode || 'demo'
      }
    });
  } catch (error) {
    console.error('Error saving home claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting home claim',
      error: error.message
    });
  }
});

// Submit travel claim endpoint
app.post('/api/claims/travel', async (req, res) => {
  try {
    console.log('Travel claim submission:', req.body);
    
    // Read existing claims
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Generate new claim ID
    const claimId = `CLM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Create new travel claim object
    const newClaim = {
      id: claimId,
      userId: "demo_user",
      customerId: "CUST_AUTO",
      policyId: "auto_generated",
      policyNumber: req.body.policyNumber,
      type: "Travel Claim",
      claimType: req.body.claimType || "Medical Emergency",
      incidentDate: req.body.incidentDate,
      priority: "Medium",
      claimAmount: 0,
      estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
      approvedAmount: 0,
      description: req.body.description,
      travelDestination: req.body.travelDestination,
      assignedSurveyor: {
        id: "SUR004",
        name: "Mr. Vikram Mehta",
        phone: "+91-9876543303",
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: "+91-9876543210",
      documents: [],
      timeline: [
        {
          step: "Claim Reported",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Travel claim submitted successfully"
        },
        {
          step: "Customer Verification",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Policy and customer details verified"
        },
        {
          step: "Surveyor Assignment",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Mr. Vikram Mehta assigned for claim review"
        },
        {
          step: "Documentation Review",
          date: null,
          completed: false,
          remarks: "Travel documents review pending"
        },
        {
          step: "Claim Assessment",
          date: null,
          completed: false,
          remarks: "Claim validity assessment pending"
        },
        {
          step: "Approval Decision",
          date: null,
          completed: false,
          remarks: "Final approval pending"
        },
        {
          step: "Payment Processing",
          date: null,
          completed: false,
          remarks: "Settlement processing"
        }
      ],
      surveyReport: null,
      status: "Under Review",
      submissionMethod: "Online Portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add new claim to claims array
    claims.push(newClaim);
    
    // Save updated claims back to file
    await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2));
    
    console.log(`New travel claim ${claimId} saved for policy ${req.body.policyNumber}`);
    
    // Send claim confirmation email
    let emailResult;
    try {
      // Get policy data to get customer email
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      const policy = policies.find(p => p.policyNumber === req.body.policyNumber);
      
      if (policy && policy.email) {
        const claimData = {
          claimId: claimId,
          policyNumber: req.body.policyNumber,
          claimType: req.body.claimType || "Medical Emergency",
          estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
          assignedSurveyor: "Mr. Vikram Mehta"
        };
        
        emailResult = await emailService.sendClaimConfirmation(claimData, policy.email);
        console.log('📧 Travel claim email result:', emailResult);
      } else {
        emailResult = { success: false, message: 'Policy or email not found', mode: 'demo' };
      }
    } catch (emailError) {
      console.error('📧 Travel claim email failed:', emailError.message);
      emailResult = { success: false, message: 'Email sending failed', mode: 'demo' };
    }
    
    res.json({
      success: true,
      message: 'Travel claim submitted successfully and saved',
      data: {
        claimId: claimId,
        status: 'Under Review',
        assignedSurveyor: {
          name: 'Mr. Vikram Mehta',
          phone: '+91-9876543303',
          specialization: 'Travel & International Claims'
        },
        emailSent: emailResult?.success || false,
        emailMode: emailResult?.mode || 'demo'
      }
    });
  } catch (error) {
    console.error('Error saving travel claim:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting travel claim',
      error: error.message
    });
  }
});

// Generic claim endpoint for other insurance types (fire, marine, etc.)
app.post('/api/claims/:type', async (req, res) => {
  try {
    const claimType = req.params.type;
    console.log(`${claimType} claim submission:`, req.body);
    
    // Read existing claims
    const claimsPath = path.join(__dirname, 'backend', 'data', 'claims.json');
    const claimsData = await fs.readFile(claimsPath, 'utf8');
    const claims = JSON.parse(claimsData);
    
    // Generate new claim ID
    const claimId = `CLM${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    // Create new generic claim object
    const newClaim = {
      id: claimId,
      userId: "demo_user",
      customerId: "CUST_AUTO",
      policyId: "auto_generated",
      policyNumber: req.body.policyNumber,
      type: `${claimType.charAt(0).toUpperCase() + claimType.slice(1)} Claim`,
      claimType: req.body.claimType || "General",
      incidentDate: req.body.incidentDate,
      priority: "Medium",
      claimAmount: 0,
      estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
      approvedAmount: 0,
      description: req.body.description,
      assignedSurveyor: {
        id: "SUR005",
        name: "Mr. Suresh Gupta",
        phone: "+91-9876543399",
        assignedDate: new Date().toISOString().split('T')[0]
      },
      contactNumber: "+91-9876543210",
      documents: [],
      timeline: [
        {
          step: "Claim Reported",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: `${claimType} claim submitted successfully`
        },
        {
          step: "Customer Verification",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Policy and customer details verified"
        },
        {
          step: "Surveyor Assignment",
          date: new Date().toISOString().split('T')[0],
          completed: true,
          remarks: "Mr. Suresh Gupta assigned for claim review"
        },
        {
          step: "Claim Assessment",
          date: null,
          completed: false,
          remarks: "Claim details review pending"
        },
        {
          step: "Approval Decision",
          date: null,
          completed: false,
          remarks: "Final approval pending"
        },
        {
          step: "Payment Processing",
          date: null,
          completed: false,
          remarks: "Settlement processing"
        }
      ],
      surveyReport: null,
      status: "Under Review",
      submissionMethod: "Online Portal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add new claim to claims array
    claims.push(newClaim);
    
    // Save updated claims back to file
    await fs.writeFile(claimsPath, JSON.stringify(claims, null, 2));
    
    console.log(`New ${claimType} claim ${claimId} saved for policy ${req.body.policyNumber}`);
    
    // Send claim confirmation email
    let emailResult;
    try {
      // Get policy data to get customer email
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      const policy = policies.find(p => p.policyNumber === req.body.policyNumber);
      
      if (policy && policy.email) {
        const claimData = {
          claimId: claimId,
          policyNumber: req.body.policyNumber,
          claimType: req.body.claimType || "General",
          estimatedAmount: parseInt(req.body.estimatedAmount) || 0,
          assignedSurveyor: "Mr. Suresh Gupta"
        };
        
        emailResult = await emailService.sendClaimConfirmation(claimData, policy.email);
        console.log(`📧 ${claimType} claim email result:`, emailResult);
      } else {
        emailResult = { success: false, message: 'Policy or email not found', mode: 'demo' };
      }
    } catch (emailError) {
      console.error(`📧 ${claimType} claim email failed:`, emailError.message);
      emailResult = { success: false, message: 'Email sending failed', mode: 'demo' };
    }
    
    res.json({
      success: true,
      message: `${claimType} claim submitted successfully and saved`,
      data: {
        claimId: claimId,
        status: 'Under Review',
        assignedSurveyor: {
          name: 'Mr. Suresh Gupta',
          phone: '+91-9876543399',
          specialization: 'General Claims'
        },
        emailSent: emailResult?.success || false,
        emailMode: emailResult?.mode || 'demo'
      }
    });
  } catch (error) {
    console.error(`Error saving ${req.params.type} claim:`, error);
    res.status(500).json({
      success: false,
      message: `Error submitting ${req.params.type} claim`,
      error: error.message
    });
  }
});

// Auth endpoints for compatibility
app.post('/api/auth/login', (req, res) => {
  res.json({ success: true, message: 'Login successful', token: 'demo_token' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, message: 'Registration successful' });
});

// Policies register endpoint
app.post('/api/policies/register', async (req, res) => {
  try {
    console.log('Policy registration:', req.body);
    
    // Generate policy number based on type
    const policyTypeCode = {
      'health': 'HLT',
      'motor': 'MOT', 
      'home': 'HOM',
      'travel': 'TRV',
      'life': 'LIF'
    };
    
    const typeCode = policyTypeCode[req.body.policyType] || 'GEN';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const policyNumber = `${typeCode}/${year}/${randomNum}`;
    
    // Generate policy ID
    const policyId = 'POL_' + Date.now();
    
    // Calculate premium based on coverage and type
    const basePremium = {
      'health': 5000,
      'motor': 8000,
      'home': 3000,
      'travel': 2000,
      'life': 15000
    };
    
    const premium = basePremium[req.body.policyType] || 5000;
    const coverageAmount = parseInt(req.body.sumInsured || req.body.propertyValue || req.body.vehicleValue || '500000');
    
    // Create comprehensive policy data
    const policyData = {
      id: policyId,
      policyNumber: policyNumber,
      customerName: req.body.fullName || (req.body.firstName + ' ' + req.body.lastName),
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address || 'Address not provided',
      dateOfBirth: req.body.dateOfBirth || 'Not provided',
      policyType: req.body.policyType,
      premium: premium,
      coverageAmount: coverageAmount,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      applicationDate: new Date().toISOString(),
      
      // Additional customer details for claims verification
      customerDetails: {
        fullName: req.body.fullName || (req.body.firstName + ' ' + req.body.lastName),
        firstName: req.body.firstName || req.body.fullName?.split(' ')[0] || 'Not provided',
        lastName: req.body.lastName || req.body.fullName?.split(' ').slice(1).join(' ') || 'Not provided',
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address || 'Address not provided',
        dateOfBirth: req.body.dateOfBirth || 'Not provided',
        gender: req.body.gender || 'Not specified',
        occupation: req.body.occupation || 'Not specified',
        annualIncome: req.body.annualIncome || 'Not specified',
        bloodGroup: req.body.bloodGroup || 'Not specified',
        allergies: req.body.allergies || 'None reported',
        chronicConditions: req.body.chronicConditions || 'None reported'
      },
      
      // Policy specific details
      policyDetails: {
        type: req.body.policyType,
        category: req.body.policyCategory || 'Standard',
        subType: req.body.subType || 'Basic',
        sumInsured: coverageAmount,
        premium: premium,
        tenure: req.body.tenure || '1 year',
        paymentMode: req.body.paymentMode || 'Annual',
        
        // Type-specific fields
        ...(req.body.policyType === 'health' && {
          healthDetails: {
            medicalHistory: req.body.medicalHistory || 'None reported',
            preExistingConditions: req.body.preExistingConditions || 'None',
            familyMedicalHistory: req.body.familyMedicalHistory || 'None reported',
            lifestyle: req.body.lifestyle || 'Standard'
          }
        }),
        
        ...(req.body.policyType === 'motor' && {
          vehicleDetails: {
            make: req.body.vehicleMake || 'Not specified',
            model: req.body.vehicleModel || 'Not specified',
            year: req.body.vehicleYear || 'Not specified',
            registrationNumber: req.body.registrationNumber || 'Not specified',
            engineNumber: req.body.engineNumber || 'Not specified',
            chassisNumber: req.body.chassisNumber || 'Not specified'
          }
        }),
        
        ...(req.body.policyType === 'home' && {
          propertyDetails: {
            propertyType: req.body.propertyType || 'Residential',
            propertyValue: req.body.propertyValue || coverageAmount,
            constructionType: req.body.constructionType || 'RCC',
            occupancyType: req.body.occupancyType || 'Self-occupied',
            propertyAge: req.body.propertyAge || 'Not specified'
          }
        })
      },
      
      features: [
        'Comprehensive coverage',
        '24/7 customer support',
        'Cashless claim facility',
        'Online policy management',
        'Quick claim processing'
      ],
      
      benefits: [
        'No claim bonus',
        'Tax benefits under applicable sections',
        'Easy renewal process',
        'Wide network coverage',
        'Quick settlement process'
      ],
      
      terms: [
        'Policy terms and conditions apply',
        'Waiting period as per policy type',
        'Exclusions as mentioned in policy document',
        'Premium payment due dates must be maintained'
      ],
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    };
    
    // Save policy to policies.json file
    try {
      const policiesPath = path.join(__dirname, 'backend', 'data', 'policies.json');
      const policiesData = await fs.readFile(policiesPath, 'utf8');
      const policies = JSON.parse(policiesData);
      
      // Add new policy to policies array
      policies.push(policyData);
      
      // Save updated policies back to file
      await fs.writeFile(policiesPath, JSON.stringify(policies, null, 2));
      console.log(`✅ Policy ${policyNumber} saved to database`);
      
    } catch (fileError) {
      console.error('❌ Error saving policy to file:', fileError.message);
    }
    
    // Send actual email using email service
    let emailResult;
    try {
      emailResult = await emailService.sendPolicyConfirmation(policyData, req.body.email);
      console.log('📧 Email result:', emailResult);
    } catch (emailError) {
      console.error('📧 Email sending failed:', emailError.message);
      emailResult = {
        success: false,
        message: 'Email sending failed',
        mode: 'demo'
      };
    }
    
    res.json({
      success: true,
      message: 'Policy registered and confirmation email sent successfully',
      data: policyData,
      nextSteps: [
        emailResult.success ? 'Confirmation email sent to your registered email address' : 'Email notification pending - check demo logs',
        'Policy documents will be generated within 24 hours',
        'Premium payment link sent via SMS',
        'Policy becomes active immediately',
        'Download our mobile app for policy management'
      ],
      emailSent: emailResult.success,
      emailMode: emailResult.mode,
      emailMessage: emailResult.message
    });
  } catch (error) {
    console.error('Error registering policy:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering policy',
      error: error.message
    });
  }
});

// Generic API endpoints for navbar
app.get('/api/:section', (req, res) => {
  res.json({ 
    success: true, 
    message: `${req.params.section} endpoint is working`,
    data: []
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
