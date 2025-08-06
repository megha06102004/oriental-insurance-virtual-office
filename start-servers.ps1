Write-Host "🏢 Oriental Insurance Virtual Office - Starting Servers..." -ForegroundColor Green

# Start Backend Server
Write-Host "🔧 Starting Backend API Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Megha\OneDrive\Desktop\orientel-intern\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server  
Write-Host "🌐 Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Users\Megha\OneDrive\Desktop\orientel-intern\frontend'; npm start"

Write-Host "✅ Both servers are starting!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Cyan
