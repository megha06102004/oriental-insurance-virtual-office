@echo off
echo Starting Oriental Insurance Virtual Office...
echo.

echo Checking backend configuration...
if not exist "backend\.env" (
    echo Creating .env file for backend...
    copy "backend\.env.example" "backend\.env"
)

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d c:\Users\Megha\OneDrive\Desktop\orientel-intern\backend && npm start"

timeout /t 5

echo Starting Frontend Server (Port 3001)...
start "Frontend Server" cmd /k "cd /d c:\Users\Megha\OneDrive\Desktop\orientel-intern\frontend && node simple-server.js"

timeout /t 2

echo.
echo ====================================
echo Oriental Insurance Virtual Office
echo ====================================
echo Frontend: http://localhost:3001
echo Backend API: http://localhost:5000
echo ====================================
echo.
echo Both servers are starting...
echo You can now test the real authentication system!
echo.

pause
