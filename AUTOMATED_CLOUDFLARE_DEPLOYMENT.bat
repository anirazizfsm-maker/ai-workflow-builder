@echo off
title Lethimdo Cloudflare Deployment Assistant

echo ====================================================
echo    LETHIMDO CLOUDFLARE DEPLOYMENT ASSISTANT
echo ====================================================
echo.
echo This script will help you deploy your Lethimdo application to Cloudflare Pages.
echo Since you're already logged into Cloudflare in Chrome, this will make the process easier.
echo.

echo 1. First, let's make sure your repository is up to date...
echo.
git add .
git commit -m "Pre-deployment update"
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to update repository. Please check your Git configuration.
    echo.
    pause
    exit /b 1
)

echo.
echo 2. Building the frontend application...
echo.
cd frontend
npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to build the frontend application.
    echo Please check for any errors in your code.
    echo.
    pause
    exit /b 1
)

cd ..

echo.
echo 3. Opening Cloudflare Dashboard in your default browser...
echo.
echo Please log in to Cloudflare if you're not already logged in.
echo.
timeout /t 3 /nobreak >nul

start "" "https://dash.cloudflare.com/"

echo.
echo 4. Creating deployment package...
echo.
powershell Compress-Archive -Path frontend/dist/* -DestinationPath lethimdo-deployment-package.zip -Force

echo.
echo ====================================================
echo    DEPLOYMENT PREPARATION COMPLETE
echo ====================================================
echo.
echo NEXT STEPS (Please follow these instructions):
echo.
echo 1. In your browser, navigate to Cloudflare Dashboard
echo 2. Click on "Pages" in the left sidebar
echo 3. Click "Create a project" or select your existing project
echo 4. Connect to your GitHub repository if not already connected
echo 5. Configure build settings:
echo    - Build command: node ../build-frontend.cjs
echo    - Build output directory: frontend/dist
echo    - Root directory: (leave empty)
echo 6. Add environment variables:
echo    - VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME = Lethimdo
echo 7. Click "Save and Deploy"
echo.
echo Your deployment package is ready at: lethimdo-deployment-package.zip
echo.
echo Press any key to continue...
pause >nul

echo.
echo Opening GitHub repository page...
start "" "https://github.com/anirazizfsm-maker/ai-workflow-builder"

echo.
echo Opening Cloudflare Pages documentation...
start "" "https://developers.cloudflare.com/pages/"

echo.
echo Deployment preparation completed!
echo Please follow the steps above to complete your deployment.
echo.
pause