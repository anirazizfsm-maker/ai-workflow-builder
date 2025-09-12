@echo off
echo ================================
echo   Lethimdo Platform Quick Start
echo ================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this script from the Lethimdo project root directory
    echo Expected: c:\Users\user\lethimdo\
    pause
    exit /b 1
)

echo [1/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Frontend dependency installation failed
    pause
    exit /b 1
)

echo [2/4] Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Backend dependency installation failed
    pause
    exit /b 1
)

echo [3/4] Starting backend server...
start "Lethimdo Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak > nul

echo [4/4] Starting frontend development server...
cd ..\frontend
start "Lethimdo Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ================================
echo   Lethimdo Platform Starting...
echo ================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5174
echo Health:   http://localhost:3001/health
echo.
echo Press any key to continue...
pause > nul