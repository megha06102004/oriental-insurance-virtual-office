@echo off
echo ====================================
echo Starting Backend Server
echo ====================================
echo.

cd /d "c:\Users\Megha\OneDrive\Desktop\orientel-intern\backend"

echo Checking if Node.js is installed...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Installing dependencies (if needed)...
npm install

echo.
echo Starting backend server on port 5000...
echo Press Ctrl+C to stop the server
echo.

npm start

pause
