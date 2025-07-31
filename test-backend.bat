@echo off
echo Testing Oriental Insurance Backend Server...
echo.

cd /d "c:\Users\Megha\OneDrive\Desktop\orientel-intern\backend"

echo Checking if Node.js is available...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo Checking if package.json exists...
if not exist "package.json" (
    echo ERROR: package.json not found
    pause
    exit /b 1
)

echo.
echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Checking if .env file exists...
if not exist ".env" (
    echo ERROR: .env file not found
    echo Creating .env file from .env.example...
    copy ".env.example" ".env"
)

echo.
echo Starting backend server...
echo ====================================
echo Oriental Insurance Backend Server
echo ====================================
echo Port: 5000
echo URL: http://localhost:5000
echo Health Check: http://localhost:5000/health
echo ====================================
echo.

node server.js

pause
