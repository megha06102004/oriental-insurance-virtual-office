@echo off
echo 🚀 Starting Oriental Insurance Virtual Office
echo.
echo 🔧 Stopping any existing servers...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo 🌐 Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d %~dp0 && node test-server.js"

echo.
 echo 🖥️ Starting Frontend Server (Port 3001)...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && node serve-virtual-office.js"

echo.
echo ⏳ Waiting for servers to start...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Servers started! Opening application...
echo.
echo 🌐 Frontend: http://localhost:3001
echo 🔧 Backend:  http://localhost:5000
echo.
echo 📋 Test with these policy numbers:
echo    • HLT/2025/5324
echo    • HLT/2025/6265
echo    • HOM/2025/7518
echo.

start "" "http://localhost:3001"

echo Press any key to close this window...
pause >nul
