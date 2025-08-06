const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static('public'));

// Serve fresh version with all insurance types
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes placeholder
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'active',
        message: 'Oriental Insurance Virtual Office API is running',
        timestamp: new Date().toISOString()
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('🎉 ====================================');
    console.log('🏢 Oriental Insurance Virtual Office');
    console.log('🎉 ====================================');
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log('📁 Serving: index.html');
    console.log('✅ All functionality ready!');
    console.log('🎯 Features:');
    console.log('   🧪 JS Test Button');
    console.log('   🚪 Interactive Door');
    console.log('   📄 Policies Card');
    console.log('   📝 Claims Card (ENHANCED)');
    console.log('   🎧 Support Card');
    console.log('   💬 Chat Bubble');
    console.log('🎉 ====================================');
});
