const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'active', 
        service: 'Oriental Insurance Backend API',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/policies', (req, res) => {
    res.json({
        policies: [
            { id: 1, type: 'Health', status: 'Active', premium: 25000 },
            { id: 2, type: 'Motor', status: 'Active', premium: 15000 },
            { id: 3, type: 'Home', status: 'Pending', premium: 20000 }
        ]
    });
});

app.post('/api/claims', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Claim submitted successfully',
        claimId: 'CLM' + Date.now()
    });
});

app.get('/api/support', (req, res) => {
    res.json({
        support: {
            phone: '1800-118-485',
            email: 'support@orientalinsurance.co.in',
            hours: '9 AM - 6 PM (Mon-Sat)'
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log('🔧 ====================================');
    console.log('🏢 Oriental Insurance Backend API');
    console.log('🔧 ====================================');
    console.log(`🌐 API Server: http://localhost:${PORT}`);
    console.log('📡 Endpoints:');
    console.log('   GET  /api/status');
    console.log('   GET  /api/policies');
    console.log('   POST /api/claims');
    console.log('   GET  /api/support');
    console.log('🔧 ====================================');
});
