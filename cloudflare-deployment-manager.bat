@echo off
title Cloudflare Pages Deployment Manager

echo ========================================
echo CLOUDFLARE PAGES DEPLOYMENT MANAGER V2
echo ========================================
echo.
echo This tool will help you manage your Cloudflare Pages deployment.
echo.

:menu
echo Select an option:
echo 1. View current repository structure
echo 2. Check Cloudflare Pages configuration files
echo 3. Update Cloudflare Pages settings instructions
echo 4. Create custom build script
echo 5. View deployment troubleshooting guide
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto view_structure
if "%choice%"=="2" goto check_config
if "%choice%"=="3" goto update_settings
if "%choice%"=="4" goto create_script
if "%choice%"=="5" goto troubleshooting
if "%choice%"=="6" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:view_structure
echo.
echo Current repository structure:
echo ----------------------------
cd /d "c:\Users\user\lethimdo"
dir /a:d
echo.
echo Frontend directory contents:
echo -------------------------
dir /a:d frontend
echo.
pause
goto menu

:check_config
echo.
echo Checking Cloudflare Pages configuration files...
echo ------------------------------------------------
echo.
echo 1. wrangler.json (Cloudflare configuration):
if exist "wrangler.json" (
    type "wrangler.json"
) else (
    echo wrangler.json NOT FOUND
)
echo.
echo 2. vercel.json (root directory):
if exist "vercel.json" (
    echo Found. This might interfere with Cloudflare deployment.
    echo Consider removing or renaming this file.
    type "vercel.json"
) else (
    echo vercel.json NOT FOUND in root
)
echo.
echo 3. frontend/vercel.json:
if exist "frontend\vercel.json" (
    echo Found. This might interfere with Cloudflare deployment.
    echo Consider removing or renaming this file.
    type "frontend\vercel.json"
) else (
    echo frontend\vercel.json NOT FOUND
)
echo.
pause
goto menu

:update_settings
echo.
echo Cloudflare Pages Configuration Instructions (Updated):
echo -----------------------------------------------------
echo.
echo 1. Go to your Cloudflare Pages project dashboard
echo 2. Navigate to "Settings" ^> "Build ^& deployments"
echo 3. In the "Build configurations" section, you can try these options:
echo.
echo OPTION A (Using wrangler.json):
echo    - Build command: (Leave empty - will use wrangler.json)
echo    - Build output directory: dist
echo.
echo OPTION B (Manual configuration):
echo    - Build command: cd frontend ^&^& npm install ^&^& npm run build
echo    - Build output directory: frontend/dist
echo.
echo 4. Environment Variables:
echo    Add these in the Cloudflare dashboard:
echo    - VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME = Lethimdo
echo.
echo 5. After making changes, trigger a new deployment
echo.
pause
goto menu

:create_script
echo.
echo Creating custom build script for Cloudflare Pages...
echo.
echo #!/bin/bash > build-cloudflare.sh
echo echo "Starting Cloudflare Pages build..." >> build-cloudflare.sh
echo echo "Current directory: $(pwd)" >> build-cloudflare.sh
echo echo "Contents:" >> build-cloudflare.sh
echo ls -la >> build-cloudflare.sh
echo. >> build-cloudflare.sh
echo if [ -d "frontend" ]; then >> build-cloudflare.sh
echo     echo "Entering frontend directory..." >> build-cloudflare.sh
echo     cd frontend >> build-cloudflare.sh
echo     echo "Current directory: $(pwd)" >> build-cloudflare.sh >> build-cloudflare.sh
echo. >> build-cloudflare.sh
echo     echo "Installing dependencies..." >> build-cloudflare.sh
echo     npm install >> build-cloudflare.sh
echo. >> build-cloudflare.sh
echo     echo "Building application..." >> build-cloudflare.sh
echo     npm run build >> build-cloudflare.sh
echo. >> build-cloudflare.sh
echo     echo "Build successful!" >> build-cloudflare.sh
echo     echo "Dist contents:" >> build-cloudflare.sh
echo     ls -la dist/ >> build-cloudflare.sh
echo else >> build-cloudflare.sh
echo     echo "ERROR: frontend directory not found!" >> build-cloudflare.sh
echo     echo "Available directories:" >> build-cloudflare.sh
echo     find . -maxdepth 2 -type d >> build-cloudflare.sh
echo     exit 1 >> build-cloudflare.sh
echo fi >> build-cloudflare.sh
echo.
echo Created build-cloudflare.sh
echo.
echo To use this script:
echo 1. In Cloudflare Pages settings:
echo    - Build command: bash build-cloudflare.sh
echo    - Build output directory: frontend/dist
echo.
pause
goto menu

:troubleshooting
echo.
echo Cloudflare Pages Deployment Troubleshooting:
echo ------------------------------------------
echo.
echo COMMON ISSUES AND SOLUTIONS:
echo.
echo 1. "Cannot find cwd" error:
echo    - Ensure wrangler.json is in repository root
echo    - Check that frontend directory exists
echo    - Verify directory structure in GitHub repository
echo.
echo 2. Build command failing:
echo    - Try manual build command: cd frontend ^&^& npm install ^&^& npm run build
echo    - Check that package.json exists in frontend directory
echo.
echo 3. Environment variables not working:
echo    - Verify variables are set in Cloudflare dashboard
echo    - Ensure variable names start with VITE_
echo    - Trigger new deployment after changes
echo.
echo 4. Conflicting configuration files:
echo    - Consider removing or renaming vercel.json files
echo    - Only one deployment platform configuration should be active
echo.
echo 5. Still not working:
echo    - Check Cloudflare build logs for specific error messages
echo    - Verify repository structure in GitHub
echo    - Contact Cloudflare support with build log details
echo.
pause
goto menu

:exit_script
echo.
echo Thank you for using the Cloudflare Pages Deployment Manager!
echo.
echo Remember to:
echo 1. Check that your GitHub repository has the correct structure
echo 2. Verify Cloudflare Pages settings match the recommendations
echo 3. Monitor the build logs after deployment
echo.
pause
exit /b 0