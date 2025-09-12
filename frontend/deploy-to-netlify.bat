@echo off
REM Frontend Deployment Script for Lethimdo Bangladesh Freelance Agency
REM This script builds and deploys the frontend to Netlify

echo 🚀 Starting Lethimdo Frontend Deployment...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from your frontend directory.
    exit /b 1
)

echo ✅ Found package.json - in correct directory
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Build the project
echo 🔧 Building project for production...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error: Build failed
    exit /b 1
)
echo ✅ Build completed successfully
echo.

REM Check if Netlify CLI is installed
echo 🔍 Checking for Netlify CLI...
npm list -g netlify-cli >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Netlify CLI not found. Installing...
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo ❌ Error: Failed to install Netlify CLI
        exit /b 1
    )
    echo ✅ Netlify CLI installed successfully
) else (
    echo ✅ Netlify CLI already installed
)
echo.

REM Deploy to Netlify
echo ☁️  Deploying to Netlify...
netlify deploy --prod --dir=dist
if %errorlevel% neq 0 (
    echo ❌ Error: Deployment failed
    exit /b 1
)
echo ✅ Deployment completed successfully
echo.

echo 🎉 Frontend deployed successfully to Netlify!
echo.
echo 📝 Next steps:
echo 1. Visit your deployed site using the URL provided above
echo 2. Configure your custom domain in Netlify dashboard
echo 3. Set environment variables in Netlify if needed
echo 4. Test the connection to your Render.com backend
echo.
echo 💡 Your frontend is now live and connected to your backend at:
echo    https://lethimdo-backend.onrender.com
echo.
pause