# Oriental Insurance Virtual Office Startup Script

Write-Host "🚀 Starting Oriental Insurance Virtual Office" -ForegroundColor Green
Write-Host ""

# Stop any existing node processes
Write-Host "🔧 Stopping any existing servers..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Start-Sleep 2

# Start backend server
Write-Host "🌐 Starting Backend Server (Port 5000)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot ""
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; node test-server.js"

# Start frontend server  
Write-Host "🖥️ Starting Frontend Server (Port 3000)..." -ForegroundColor Cyan
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; node serve-virtual-office.js"

# Wait for servers to start
Write-Host "⏳ Waiting for servers to start..." -ForegroundColor Yellow
Start-Sleep 5

# Test connections
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Backend Server: Running (Port 5000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend Server: Failed to start" -ForegroundColor Red
}

try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
    Write-Host "✅ Frontend Server: Running (Port 3000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend Server: Failed to start" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Application URLs:" -ForegroundColor Magenta
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   🔧 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📋 Test Policy Numbers:" -ForegroundColor Magenta
Write-Host "   • HLT/2025/5324 (Test Policy 1)" -ForegroundColor White
Write-Host "   • HLT/2025/6265 (Test Policy 2)" -ForegroundColor White
Write-Host ""

# Open the application
Write-Host "🚀 Opening application in browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✨ Oriental Insurance Virtual Office is ready!" -ForegroundColor Green
Write-Host "Press any key to exit this script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
