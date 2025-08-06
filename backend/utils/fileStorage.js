const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// File-based storage paths
const DATA_DIR = path.join(__dirname, '../data');
const POLICIES_FILE = path.join(DATA_DIR, 'policies.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CLAIMS_FILE = path.join(DATA_DIR, 'claims.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize data files with sample data
async function initializeDataFiles() {
  await ensureDataDirectory();
  
  // Initialize users file
  try {
    await fs.access(USERS_FILE);
  } catch {
    const sampleUsers = [
      {
        id: uuidv4(),
        email: 'demo@orientalinsurance.com',
        name: 'Demo Customer',
        phone: '+91-9876543210',
        role: 'customer',
        created_at: new Date().toISOString()
      }
    ];
    await fs.writeFile(USERS_FILE, JSON.stringify(sampleUsers, null, 2));
  }
  
  // Initialize policies file
  try {
    await fs.access(POLICIES_FILE);
  } catch {
    const samplePolicies = [
      {
        id: uuidv4(),
        policyNumber: 'HLT/2024/DEMO001',
        customerName: 'Demo Customer',
        email: 'demo@orientalinsurance.com',
        phone: '+91-9876543210',
        policyType: 'health',
        premium: 25000,
        coverageAmount: 1000000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'active',
        created_at: new Date().toISOString()
      }
    ];
    await fs.writeFile(POLICIES_FILE, JSON.stringify(samplePolicies, null, 2));
  }
  
  // Initialize claims file
  try {
    await fs.access(CLAIMS_FILE);
  } catch {
    await fs.writeFile(CLAIMS_FILE, JSON.stringify([], null, 2));
  }
}

// Generic file operations
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

// Policy operations
async function createPolicy(policyData) {
  const policies = await readFile(POLICIES_FILE);
  
  // Generate policy number
  const policyTypePrefix = {
    'motor': 'MOT',
    'health': 'HLT',
    'home': 'HOM',
    'travel': 'TRV'
  };
  
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const policyNumber = `${policyTypePrefix[policyData.policyType]}/${year}/${randomNum}`;
  
  // Calculate premium and coverage
  const policyDetails = calculatePolicyDetails(policyData.policyType);
  
  const newPolicy = {
    id: uuidv4(),
    policyNumber,
    ...policyData,
    premium: policyDetails.premium,
    coverageAmount: policyDetails.coverage,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: policyData.status || 'approved', // Default to approved if not specified
    features: policyDetails.features,
    benefits: policyDetails.benefits,
    terms: policyDetails.terms,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  policies.push(newPolicy);
  await writeFile(POLICIES_FILE, policies);
  
  return newPolicy;
}

async function getPolicies() {
  return await readFile(POLICIES_FILE);
}

async function getPolicyById(id) {
  const policies = await readFile(POLICIES_FILE);
  return policies.find(p => p.id === id);
}

async function getPolicyByNumber(policyNumber) {
  const policies = await readFile(POLICIES_FILE);
  return policies.find(p => p.policyNumber === policyNumber);
}

async function updatePolicyStatus(policyId, newStatus) {
  const policies = await readFile(POLICIES_FILE);
  const policyIndex = policies.findIndex(p => p.id === policyId);
  
  if (policyIndex !== -1) {
    policies[policyIndex].status = newStatus;
    policies[policyIndex].updated_at = new Date().toISOString();
    
    if (newStatus === 'approved') {
      policies[policyIndex].approvedAt = new Date().toISOString();
    }
    
    await writeFile(POLICIES_FILE, policies);
    return policies[policyIndex];
  }
  
  return null;
}

// User operations
async function createUser(userData) {
  const users = await readFile(USERS_FILE);
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return existingUser;
  }
  
  const newUser = {
    id: uuidv4(),
    ...userData,
    role: 'customer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  users.push(newUser);
  await writeFile(USERS_FILE, users);
  
  return newUser;
}

async function getUserByEmail(email) {
  const users = await readFile(USERS_FILE);
  return users.find(u => u.email === email);
}

// Helper function to calculate policy details
function calculatePolicyDetails(policyType) {
  const policyConfig = {
    motor: {
      premium: Math.floor(Math.random() * 10000) + 15000,
      coverage: 500000,
      features: [
        'Third Party Liability Coverage',
        'Own Damage Protection',
        'Personal Accident Cover',
        'Zero Depreciation (Optional)',
        'Roadside Assistance',
        'No Claim Bonus up to 50%'
      ],
      benefits: [
        'Cashless garage network of 4000+ garages',
        'Quick claim settlement',
        'Online renewal facility',
        '24/7 customer support'
      ],
      terms: [
        'Policy valid for 12 months',
        'Premium payment within 30 days',
        'Immediate coverage upon payment',
        'Grace period for renewal: 90 days'
      ]
    },
    health: {
      premium: Math.floor(Math.random() * 15000) + 20000,
      coverage: 1000000,
      features: [
        'Hospitalization Coverage',
        'Pre & Post Hospitalization',
        'Daycare Procedures',
        'Ambulance Charges',
        'Health Check-up',
        'Maternity Benefits (after 3 years)'
      ],
      benefits: [
        'Cashless treatment at 8000+ hospitals',
        'No pre-medical check-up up to 45 years',
        'Cumulative bonus for claim-free years',
        'Tax benefits under Section 80D'
      ],
      terms: [
        'Waiting period: 30 days for illness',
        'Pre-existing diseases: 4 years waiting',
        'Maternity: 3 years waiting period',
        'Room rent limit: 1% of sum insured'
      ]
    },
    home: {
      premium: Math.floor(Math.random() * 8000) + 12000,
      coverage: 2000000,
      features: [
        'Building Structure Protection',
        'Contents Coverage',
        'Earthquake & Flood Cover',
        'Theft & Burglary Protection',
        'Public Liability',
        'Temporary Accommodation'
      ],
      benefits: [
        'Quick claim processing',
        'Expert loss assessment',
        'Replacement cost coverage',
        'Add-on covers available'
      ],
      terms: [
        'Policy period: 1/2/3 years available',
        'Sum insured based on property value',
        'Geographical area restrictions apply',
        'Security measures mandatory'
      ]
    },
    travel: {
      premium: Math.floor(Math.random() * 3000) + 2000,
      coverage: 200000,
      features: [
        'Medical Emergency Coverage',
        'Trip Cancellation',
        'Baggage Loss/Delay',
        'Flight Delay Compensation',
        'Emergency Evacuation',
        'Personal Liability'
      ],
      benefits: [
        'Worldwide coverage',
        '24/7 assistance helpline',
        'Cashless medical treatment',
        'Multi-trip options available'
      ],
      terms: [
        'Coverage from departure to return',
        'Age limit: Up to 70 years',
        'Pre-existing medical disclosure required',
        'Adventure sports exclusions apply'
      ]
    }
  };
  
  return policyConfig[policyType] || policyConfig.health;
}

// Claim operations
async function createClaim(claimData) {
  const claims = await readFile(CLAIMS_FILE);
  
  const newClaim = {
    id: `CLM${String(claims.length + 1).padStart(3, '0')}`,
    ...claimData,
    status: claimData.status || 'Under Review',
    reportedDate: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  claims.push(newClaim);
  await writeFile(CLAIMS_FILE, claims);
  
  return newClaim;
}

async function getClaims() {
  return await readFile(CLAIMS_FILE);
}

async function getClaimById(id) {
  const claims = await readFile(CLAIMS_FILE);
  return claims.find(c => c.id === id);
}

async function getClaimsByPolicyNumber(policyNumber) {
  const claims = await readFile(CLAIMS_FILE);
  return claims.filter(c => c.policyNumber === policyNumber);
}

async function getClaimsByUserId(userId) {
  const claims = await readFile(CLAIMS_FILE);
  return claims.filter(c => c.userId === userId);
}

async function updateClaimStatus(claimId, newStatus, remarks = null) {
  const claims = await readFile(CLAIMS_FILE);
  const claimIndex = claims.findIndex(c => c.id === claimId);
  
  if (claimIndex !== -1) {
    claims[claimIndex].status = newStatus;
    claims[claimIndex].updated_at = new Date().toISOString();
    
    if (remarks) {
      claims[claimIndex].remarks = remarks;
    }
    
    // Update timeline if it exists
    if (claims[claimIndex].timeline) {
      const currentStep = claims[claimIndex].timeline.find(t => !t.completed);
      if (currentStep) {
        currentStep.completed = true;
        currentStep.date = new Date().toISOString().split('T')[0];
        if (remarks) {
          currentStep.remarks = remarks;
        }
      }
    }
    
    await writeFile(CLAIMS_FILE, claims);
    return claims[claimIndex];
  }
  
  return null;
}

module.exports = {
  initializeDataFiles,
  createPolicy,
  getPolicies,
  getPolicyById,
  getPolicyByNumber,
  updatePolicyStatus,
  createUser,
  getUserByEmail,
  calculatePolicyDetails,
  createClaim,
  getClaims,
  getClaimById,
  getClaimsByPolicyNumber,
  getClaimsByUserId,
  updateClaimStatus
};
