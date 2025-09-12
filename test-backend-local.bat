@echo off
echo ================================================================
echo   TESTING BACKEND LOCALLY FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 Testing Lethimdo Backend for Client Demonstrations
echo.

echo Checking if Node.js is available...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    goto END
)

echo ✅ Node.js found!
echo.

echo Navigating to backend directory...
cd backend

echo.
echo Installing dependencies (if needed)...
npm install

echo.
echo ================================================================
echo   STARTING BACKEND SERVER
echo ================================================================
echo.

echo Starting backend server for testing...
echo Backend will be available at: http://localhost:3001
echo Health check: http://localhost:3001/health
echo.

echo 🎯 API Endpoints for Client Demo:
echo ✅ GET  /health              - Server status
echo ✅ POST /api/auth/register   - User registration  
echo ✅ POST /api/auth/login      - User authentication
echo ✅ GET  /api/workflows       - Workflow management
echo ✅ POST /api/ai/generate     - AI workflow generation
echo ✅ GET  /api/analytics       - Business analytics
echo.

echo 🚀 Perfect for demonstrating to international clients!
echo.

echo Opening backend in browser...
start http://localhost:3001/health

echo.
echo Starting server (Press Ctrl+C to stop)...
node simple-server.js

echo.
:END
pause