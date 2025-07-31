const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`📝 ${req.method} ${req.url}`);
  
  // Proxy API requests to backend
  if (req.url.startsWith('/api/')) {
    const backendUrl = 'http://localhost:5000' + req.url;
    
    const proxyReq = http.request(backendUrl, {
      method: req.method,
      headers: {
        ...req.headers,
        'host': 'localhost:5000'
      }
    }, (proxyRes) => {
      // Set CORS headers
      res.writeHead(proxyRes.statusCode, {
        ...proxyRes.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      });
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Backend service unavailable. Please make sure the backend server is running on port 5000.'
      }));
    });

    if (req.method === 'POST' || req.method === 'PUT') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
    return;
  }
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  // Get the file path - serve index.html for root
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file doesn't exist, serve index.html (for SPA routing)
      filePath = path.join(__dirname, 'public', 'index.html');
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }
      
      // Set content type based on file extension
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      
      switch(ext) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.ico': contentType = 'image/x-icon'; break;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🌐 Frontend running on http://localhost:${PORT}`);
  console.log(`🏢 Oriental Insurance Virtual Office Frontend Ready!`);
  console.log(`📂 Serving files from: ${path.join(__dirname, 'public')}`);
});
