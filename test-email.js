const fetch = require('node-fetch');

async function testEmailService() {
    console.log('🧪 Testing Email Service Integration...\n');
    
    try {
        // Test 1: Policy Registration
        console.log('📋 Test 1: Policy Registration Email');
        const policyResponse = await fetch('http://localhost:5000/api/policies/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '9876543210',
                policyType: 'health',
                sumInsured: '500000'
            })
        });
        
        const policyResult = await policyResponse.json();
        console.log('✅ Policy Registration Response:');
        console.log(`   - Success: ${policyResult.success}`);
        console.log(`   - Policy Number: ${policyResult.data?.policyNumber}`);
        console.log(`   - Email Sent: ${policyResult.emailSent}`);
        console.log(`   - Email Mode: ${policyResult.emailMode}`);
        console.log(`   - Email Message: ${policyResult.emailMessage}\n`);
        
        // Test 2: Claim Submission
        console.log('📝 Test 2: Claim Submission Email');
        const claimResponse = await fetch('http://localhost:5000/api/claims/health', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                policyNumber: policyResult.data?.policyNumber || 'HLT/2025/5324',
                claimType: 'Hospitalization',
                incidentDate: '2025-08-01',
                estimatedAmount: '75000',
                description: 'Emergency medical treatment',
                hospitalName: 'City General Hospital'
            })
        });
        
        const claimResult = await claimResponse.json();
        console.log('✅ Claim Submission Response:');
        console.log(`   - Success: ${claimResult.success}`);
        console.log(`   - Claim ID: ${claimResult.data?.claimId}`);
        console.log(`   - Email Sent: ${claimResult.data?.emailSent}`);
        console.log(`   - Email Mode: ${claimResult.data?.emailMode}\n`);
        
        // Summary
        console.log('📊 Email Service Test Summary:');
        console.log('=====================================');
        if (policyResult.emailMode === 'demo' && claimResult.data?.emailMode === 'demo') {
            console.log('🟡 Status: DEMO MODE');
            console.log('📧 Emails are being logged to console');
            console.log('💡 To enable real emails:');
            console.log('   1. Update .env file with your email credentials');
            console.log('   2. For Gmail: Enable 2FA and use App Password');
            console.log('   3. Restart the server');
        } else {
            console.log('🟢 Status: LIVE MODE');
            console.log('📧 Emails are being sent successfully');
        }
        console.log('=====================================');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testEmailService();
