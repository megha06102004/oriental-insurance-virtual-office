const express = require('express');
const path = require('path');
const app = express();

// Serve static files with no cache
app.use(express.static('public', {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));

// Serve the enhanced index.html
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('🎉 ====================================');
    console.log('🏢 Oriental Insurance Virtual Office');
    console.log('🎉 ====================================');
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log('📁 Serving: Enhanced index.html');
    console.log('✅ ALL 6 INSURANCE TYPES READY!');
    console.log('🎯 Features:');
    console.log('   🏥 Health Insurance Claims');
    console.log('   🚗 Motor Insurance Claims');
    console.log('   🏠 Home Insurance Claims');
    console.log('   ✈️ Travel Insurance Claims');
    console.log('   🚢 Marine Insurance Claims');
    console.log('   🔥 Fire Insurance Claims');
    console.log('🎉 ====================================');
});
