@echo off
title Update Cloudflare Pages Configuration

echo =====================================
echo UPDATE CLOUDFLARE PAGES CONFIGURATION
echo =====================================
echo.
echo This script will guide you through updating your Cloudflare Pages configuration.
echo.

echo IMPORTANT: Make sure you have committed all changes to your GitHub repository.
echo.
pause

:menu
echo Select an option:
echo 1. View current repository structure
echo 2. Check configuration files
echo 3. Get Cloudflare Pages configuration instructions
echo 4. Test build script locally
echo 5. View troubleshooting guide
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto view_structure
if "%choice%"=="2" goto check_config
if "%choice%"=="3" goto config_instructions
if "%choice%"=="4" goto test_build
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
echo Key files:
echo ----------
echo build-frontend.js - Universal build script
echo cloudflare-build-config.js - Cloudflare configuration
echo CLOUDFLARE-BUILD-FAILURE-ULTIMATE-SOLUTION.md - Detailed guide
echo.
pause
goto menu

:check_config
echo.
echo Checking configuration files...
echo -------------------------------
echo.
echo 1. build-frontend.js:
if exist "build-frontend.js" (
    echo Found. This is the recommended build script.
) else (
    echo ERROR: build-frontend.js NOT FOUND
)
echo.
echo 2. cloudflare-build-config.js:
if exist "cloudflare-build-config.js" (
    echo Found. Alternative Cloudflare configuration.
) else (
    echo cloudflare-build-config.js NOT FOUND
)
echo.
echo 3. Conflicting files:
if exist "vercel.json" (
    echo WARNING: vercel.json found in root. Consider removing.
)
if exist "frontend\vercel.json" (
    echo WARNING: vercel.json found in frontend. Consider removing.
)
if exist "wrangler.json" (
    echo WARNING: wrangler.json found. This might cause issues.
)
echo.
pause
goto menu

:config_instructions
echo.
echo Cloudflare Pages Configuration Instructions:
echo ------------------------------------------
echo.
echo 1. Go to your Cloudflare Pages project dashboard
echo 2. Navigate to "Settings" ^> "Build ^& deployments"
echo 3. In the "Build configurations" section, set:
echo    - Build command: node build-frontend.js
echo    - Build output directory: frontend/dist
echo    - Root directory: (Leave as default)
echo.
echo 4. Add Environment Variables:
echo    - VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME = Lethimdo
echo.
echo 5. Save changes and trigger a new deployment
echo.
pause
goto menu

:test_build
echo.
echo Testing build script locally...
echo -------------------------------
echo.
echo This will run the build script from your current directory.
echo Make sure you are in the repository root.
echo.
cd /d "c:\Users\user\lethimdo"
node build-frontend.js
echo.
echo Build script execution completed.
echo.
pause
goto menu

:troubleshooting
echo.
echo Cloudflare Pages Deployment Troubleshooting:
echo ------------------------------------------
echo.
echo If the deployment still fails:
echo.
echo 1. Check that all files are committed to GitHub:
echo    - build-frontend.js
echo    - Your frontend code in /frontend directory
echo.
echo 2. Verify Cloudflare configuration matches instructions
echo.
echo 3. Check build logs for specific error messages
echo.
echo 4. Alternative build commands to try:
echo    - cd frontend ^&^& npm install ^&^& npm run build
echo    - npm run build --prefix frontend
echo.
echo 5. As a last resort, consider restructuring repository
echo    to move frontend files to repository root
echo.
pause
goto menu

:exit_script
echo.
echo Configuration update guide completed!
echo.
echo Remember to:
echo 1. Update your Cloudflare Pages settings as instructed
echo 2. Trigger a new deployment
echo 3. Check the build logs for any errors
echo.
pause
exit /b 0