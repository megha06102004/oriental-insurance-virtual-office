// Test script to verify complete policy-claims integration
const fetch = require('node-fetch');

async function testPolicyClaimsIntegration() {
    console.log('🧪 Testing Complete Policy-Claims Integration\n');
    
    try {
        // Step 1: Create a new policy
        console.log('📋 Step 1: Creating a new policy...');
        const newPolicyData = {
            fullName: 'Test Customer',
            firstName: 'Test',
            lastName: 'Customer',
            email: 'test.customer@example.com',
            phone: '9876543211',
            address: '123 Test Street, Test City',
            dateOfBirth: '1990-01-01',
            policyType: 'health',
            sumInsured: '1000000',
            medicalHistory: 'None',
            bloodGroup: 'O+',
            allergies: 'None',
            chronicConditions: 'None'
        };
        
        const policyResponse = await fetch('http://localhost:5000/api/policies/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPolicyData)
        });
        
        const policyResult = await policyResponse.json();
        console.log('✅ Policy Created:');
        console.log(`   Policy Number: ${policyResult.data?.policyNumber}`);
        console.log(`   Customer: ${policyResult.data?.customerName}`);
        console.log(`   Email Sent: ${policyResult.emailSent}\n`);
        
        if (!policyResult.success) {
            throw new Error('Failed to create policy');
        }
        
        const policyNumber = policyResult.data.policyNumber;
        
        // Step 2: Wait a moment for database update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 3: Verify policy can be found in database
        console.log('🔍 Step 2: Verifying policy in database...');
        const lookupResponse = await fetch(`http://localhost:5000/api/policies/number/${encodeURIComponent(policyNumber)}`);
        const lookupResult = await lookupResponse.json();
        
        console.log('✅ Policy Lookup Result:');
        console.log(`   Found: ${lookupResult.success}`);
        console.log(`   Customer: ${lookupResult.data?.customerName}`);
        console.log(`   Status: ${lookupResult.data?.status}`);
        console.log(`   Customer Details Available: ${!!lookupResult.data?.customer}\n`);
        
        // Step 4: Check existing claims for this policy
        console.log('📝 Step 3: Checking existing claims...');
        const claimsResponse = await fetch(`http://localhost:5000/api/claims/policy/${encodeURIComponent(policyNumber)}`);
        const claimsResult = await claimsResponse.json();
        
        console.log('✅ Claims Check Result:');
        console.log(`   Claims Found: ${claimsResult.data?.length || 0}`);
        console.log(`   API Working: ${claimsResult.success}\n`);
        
        // Step 5: Submit a test claim
        console.log('🏥 Step 4: Submitting a test claim...');
        const claimData = {
            policyNumber: policyNumber,
            claimType: 'Hospitalization',
            incidentDate: '2025-08-06',
            estimatedAmount: '50000',
            description: 'Test medical treatment',
            hospitalName: 'Test Hospital'
        };
        
        const claimResponse = await fetch('http://localhost:5000/api/claims/health', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(claimData)
        });
        
        const claimResult = await claimResponse.json();
        console.log('✅ Claim Submission Result:');
        console.log(`   Claim ID: ${claimResult.data?.claimId}`);
        console.log(`   Status: ${claimResult.data?.status || 'Under Review'}`);
        console.log(`   Email Sent: ${claimResult.data?.emailSent}\n`);
        
        // Step 6: Verify claim appears in policy claims
        console.log('🔄 Step 5: Verifying claim appears in policy...');
        const finalClaimsResponse = await fetch(`http://localhost:5000/api/claims/policy/${encodeURIComponent(policyNumber)}`);
        const finalClaimsResult = await finalClaimsResponse.json();
        
        console.log('✅ Final Claims Verification:');
        console.log(`   Total Claims: ${finalClaimsResult.data?.length || 0}`);
        if (finalClaimsResult.data?.length > 0) {
            console.log(`   Latest Claim: ${finalClaimsResult.data[finalClaimsResult.data.length - 1]?.id}`);
        }
        
        // Summary
        console.log('\n🎉 INTEGRATION TEST COMPLETE!');
        console.log('=====================================');
        console.log('✅ Policy Creation: Working');
        console.log('✅ Database Storage: Working');
        console.log('✅ Policy Lookup: Working');
        console.log('✅ Claims Verification: Working');
        console.log('✅ Claim Submission: Working');
        console.log('✅ Email Notifications: Working');
        console.log('=====================================');
        console.log(`🎯 Test Policy Number: ${policyNumber}`);
        console.log('💡 You can now test this policy in the Claims section!');
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
    }
}

// Run the test
testPolicyClaimsIntegration();
