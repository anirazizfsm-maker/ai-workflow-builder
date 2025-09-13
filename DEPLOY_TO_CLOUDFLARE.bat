@echo off
title Cloudflare Pages Deployment Helper

echo ====================================================
echo    Lethimdo - Cloudflare Pages Deployment Helper
echo ====================================================
echo.

echo This script will help you prepare for Cloudflare Pages deployment.
echo.

echo 1. Checking if frontend builds correctly...
echo.

cd frontend
if %errorlevel% neq 0 (
    echo ERROR: Could not change to frontend directory
    pause
    exit /b 1
)

echo Building frontend application...
echo.

npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.

cd ..
echo 2. Checking for required files...
echo.

if exist "wrangler.json" (
    echo [OK] wrangler.json found
) else (
    echo [ERROR] wrangler.json not found
    pause
    exit /b 1
)

if exist "build-frontend.cjs" (
    echo [OK] build-frontend.cjs found
) else (
    echo [ERROR] build-frontend.cjs not found
    pause
    exit /b 1
)

if exist "build-frontend.sh" (
    echo [OK] build-frontend.sh found
) else (
    echo [ERROR] build-frontend.sh not found
    pause
    exit /b 1
)

if exist "frontend/dist" (
    echo [OK] dist directory found
) else (
    echo [WARNING] dist directory not found
)

echo.
echo 3. Deployment Instructions:
echo.
echo To deploy to Cloudflare Pages:
echo 1. Go to https://dash.cloudflare.com/
echo 2. Navigate to Pages ^> Create a project
echo 3. Connect to your Git repository
echo 4. Use these build settings:
echo    - Build command: bash build-frontend.sh
echo    - Build output directory: frontend/dist
echo 5. Add environment variables:
echo    - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME=Lethimdo
echo 6. Click "Save and Deploy"
echo.

echo For detailed instructions, see CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md
echo.

echo Press any key to open the deployment guide...
pause >nul

if exist "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md" (
    start "" "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md"
)

echo.
echo Deployment preparation completed!
echo.
pause