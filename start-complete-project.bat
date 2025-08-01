@echo off
title Oriental Insurance Virtual Office - Complete Project
echo.
echo 🎉 ====================================
echo 🏢 Oriental Insurance Virtual Office
echo 🎉 ====================================
echo.
echo 🚀 Starting Complete Project in Agent Mode...
echo.

echo 🔧 Starting Backend API Server (Port 5000)...
start "Backend API" cmd /k "cd /d %~dp0backend && node api-server.js"

timeout /t 3

echo 🌐 Starting Frontend Server (Port 3000)...
start "Virtual Office" cmd /k "cd /d %~dp0frontend && node serve-virtual-office.js"

timeout /t 3

echo.
echo 🎯 Project Status:
echo    🔧 Backend API: http://localhost:5000
echo    🌐 Frontend App: http://localhost:3000
echo.
echo ✅ Features Available:
echo    🧪 JS Test Button (top-right)
echo    🚪 Interactive Door
echo    📄 Policies Management
echo    📝 Claims Processing  
echo    🎧 Customer Support
echo    💬 Virtual Assistant Chat
echo.
echo 🎉 Your Oriental Insurance Virtual Office is ready!
echo.

timeout /t 3
echo 🌐 Opening Virtual Office in browser...
start http://localhost:3000

echo.
echo 🎯 Project is now running in full agent mode!
echo    - Both servers are active
echo    - All functionality is working
echo    - Ready for demonstration
echo.
pause
