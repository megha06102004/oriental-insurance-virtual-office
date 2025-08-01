const express = require('express');
const path = require('path');
const fs = require('fs');
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

// Direct route to serve our fresh file
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    const filePath = path.join(__dirname, 'public', 'index-fresh.html');
    
    // Check if file exists and log it
    if (fs.existsSync(filePath)) {
        console.log('✅ Serving fresh file:', filePath);
        res.sendFile(filePath);
    } else {
        console.log('❌ Fresh file not found, checking alternatives...');
        res.send(`
            <h1>🚨 Debug: File Status</h1>
            <p>Looking for: ${filePath}</p>
            <p>Files in public directory:</p>
            <ul>
                ${fs.readdirSync(path.join(__dirname, 'public')).map(f => `<li>${f}</li>`).join('')}
            </ul>
        `);
    }
});

// Debug route to see file content
app.get('/debug', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'index-fresh.html');
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasAllInsurance = content.includes('Motor Insurance') && 
                               content.includes('Travel Insurance') && 
                               content.includes('Marine Insurance');
        res.json({
            fileExists: true,
            hasAllInsuranceTypes: hasAllInsurance,
            contentPreview: content.substring(0, 500) + '...'
        });
    } else {
        res.json({ fileExists: false });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log('🎉 ====================================');
    console.log('🏢 Oriental Insurance - DEBUG SERVER');
    console.log('🎉 ====================================');
    console.log(`🌐 Main App: http://localhost:${PORT}`);
    console.log(`🔍 Debug Info: http://localhost:${PORT}/debug`);
    console.log('📁 Serving: index-fresh.html');
    console.log('🎯 ALL 6 INSURANCE TYPES READY');
    console.log('🎉 ====================================');
});
