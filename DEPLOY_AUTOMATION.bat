@echo off
title Lethimdo Deployment Automation

echo ====================================================
echo    Lethimdo - Deployment Automation Helper
echo ====================================================
echo.

echo This script will help you deploy your Lethimdo application.
echo.

:menu
echo Please select your deployment method:
echo.
echo 1. Prepare for GitHub Integration (Recommended)
echo 2. Manual Deployment using Wrangler
echo 3. Create Deployment Package
echo 4. View Deployment Instructions
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto github_integration
if "%choice%"=="2" goto manual_deployment
if "%choice%"=="3" goto create_package
if "%choice%"=="4" goto view_instructions
if "%choice%"=="5" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:github_integration
echo.
echo Preparing for GitHub Integration...
echo.

echo 1. Committing changes to local repository...
git add .
git commit -m "Add Cloudflare deployment configuration and files"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    pause
    goto menu
)

echo.
echo 2. Pushing changes to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push changes to GitHub
    echo Please check your internet connection and GitHub credentials
    pause
    goto menu
)

echo.
echo Successfully pushed changes to GitHub!
echo.
echo Next steps:
echo 1. Go to https://dash.cloudflare.com/
echo 2. Navigate to Pages ^> Create a project
echo 3. Connect to your GitHub repository
echo 4. Use these build settings:
echo    - Build command: node ../build-frontend.cjs
echo    - Build output directory: frontend/dist
echo 5. Add environment variables:
echo    - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME=Lethimdo
echo 6. Click "Save and Deploy"
echo.
echo For detailed instructions, see AUTOMATED_DEPLOYMENT_HELPER.md
echo.
pause
goto menu

:manual_deployment
echo.
echo Manual Deployment using Wrangler
echo.

echo 1. Logging in to Cloudflare...
echo Please complete the login process in your browser
wrangler login
if %errorlevel% neq 0 (
    echo ERROR: Failed to log in to Cloudflare
    echo If the browser didn't open, copy the URL from the terminal and open it manually
    pause
    goto menu
)

echo.
echo 2. Building the application...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    cd ..
    pause
    goto menu
)

echo.
echo 3. Deploying to Cloudflare Pages...
cd ..
wrangler pages deploy frontend/dist
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    goto menu
)

echo.
echo Deployment completed successfully!
echo.
pause
goto menu

:create_package
echo.
echo Creating Deployment Package...
echo.

echo 1. Building the application...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    cd ..
    pause
    goto menu
)

echo.
echo 2. Creating ZIP package...
cd ..
powershell Compress-Archive -Path frontend/dist/* -DestinationPath lethimdo-deployment-package.zip -Force
if %errorlevel% neq 0 (
    echo ERROR: Failed to create ZIP package
    pause
    goto menu
)

echo.
echo Deployment package created: lethimdo-deployment-package.zip
echo.
pause
goto menu

:view_instructions
echo.
echo Opening deployment instructions...
start "" "AUTOMATED_DEPLOYMENT_HELPER.md"
echo.
pause
goto menu

:exit_script
echo.
echo Thank you for using Lethimdo Deployment Automation!
echo.
pause
exit /b 0