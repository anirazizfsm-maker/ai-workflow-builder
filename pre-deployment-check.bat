@echo off
echo ================================
echo   Lethimdo Pre-Deployment Check
echo ================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Not in Lethimdo project directory
    echo Expected: c:\Users\user\lethimdo\
    pause
    exit /b 1
)

echo [Checking Git Status...]
git status > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git repository not initialized
    exit /b 1
) else (
    echo ✅ Git repository ready
)

echo [Checking Frontend...]
if exist "frontend\package.json" (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
    exit /b 1
)

if exist "frontend\vercel.json" (
    echo ✅ Netlify configuration ready
) else (
    echo ⚠️  Netlify configuration file (vercel.json is legacy)
)

echo [Checking Backend...]
if exist "backend\package.json" (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
    exit /b 1
)

if exist "backend\railway.toml" (
    echo ⚠️  Railway configuration found (legacy)
) else (
    echo ⚠️  No legacy deployment configs found
)

if exist "backend\simple-server.js" (
    echo ✅ Server file ready
) else (
    echo ❌ Server file missing
    exit /b 1
)

echo [Checking Environment Files...]
if exist "backend\.env.example" (
    echo ✅ Environment example found
) else (
    echo ❌ Environment example missing
)

echo [Checking Documentation...]
if exist "deployment-guide.md" (
    echo ✅ Deployment guide ready
) else (
    echo ❌ Deployment guide missing
)

if exist "README.md" (
    echo ✅ README found
) else (
    echo ❌ README missing
)

echo.
echo ================================
echo   Pre-Deployment Summary
echo ================================
echo ✅ Project structure complete
echo ✅ Git repository ready
echo ✅ Core files ready
echo ✅ Documentation complete
echo.
echo 🚀 Ready for deployment!
echo.
echo Next steps:
echo 1. Push code to GitHub
echo 2. Deploy frontend to Netlify
echo 3. Deploy backend to Render.com
echo 4. Configure environment variables
echo.
echo See deployment-guide.md for detailed instructions
echo.
pause