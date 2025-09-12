@echo off
title Fix Cloudflare Pages Deployment

echo ====================================
echo CLOUDFLARE PAGES DEPLOYMENT FIX TOOL
echo ====================================
echo.
echo This tool will help you fix the Cloudflare Pages build failure.
echo.

echo Current repository structure:
echo ----------------------------
dir /ad
echo.
echo Frontend directory contents:
echo -------------------------
dir /ad frontend
echo.

echo Solution Options:
echo ----------------
echo 1. Create custom build script (Recommended)
echo 2. Verify current Cloudflare Pages settings
echo 3. Create a build script that works with subdirectories
echo 4. Exit
echo.

set /p choice="Select an option (1-4): "

if "%choice%"=="1" goto create_build_script
if "%choice%"=="2" goto verify_settings
if "%choice%"=="3" goto create_subdir_build
if "%choice%"=="4" goto exit_script

echo Invalid choice. Please try again.
goto :menu

:create_build_script
echo.
echo Creating custom build script for Cloudflare Pages...
echo #!/bin/bash > build.sh
echo cd frontend >> build.sh
echo npm install >> build.sh
echo npm run build >> build.sh
echo.
echo Created build.sh with the following content:
type build.sh
echo.
echo Next steps:
echo 1. Commit this file to your repository
echo 2. In Cloudflare Pages settings, set:
echo    - Build command: bash build.sh
echo    - Build output directory: frontend/dist
echo.
pause
goto menu

:verify_settings
echo.
echo Cloudflare Pages Configuration Instructions:
echo --------------------------------------------
echo 1. Go to your Cloudflare Pages project dashboard
echo 2. Navigate to "Settings" ^> "Build ^& deployments"
echo 3. In the "Build configurations" section, set:
echo    - Build command: cd frontend ^&^& npm run build
echo    - Build output directory: frontend/dist
echo    - Root directory: /frontend (or leave empty)
echo.
echo Environment Variables:
echo -------------------
echo Add these environment variables in the Cloudflare dashboard:
echo VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo VITE_APP_NAME = Lethimdo
echo.
pause
goto menu

:create_subdir_build
echo.
echo Creating alternative build configuration...
echo # Cloudflare Pages Build Configuration > README-CLOUDFLARE.md
echo. >> README-CLOUDFLARE.md
echo This repository contains a frontend application in the /frontend directory. >> README-CLOUDFLARE.md
echo. >> README-CLOUDFLARE.md
echo For Cloudflare Pages deployment: >> README-CLOUDFLARE.md
echo - Set Build command to: cd frontend ^&^& npm run build >> README-CLOUDFLARE.md
echo - Set Build output directory to: frontend/dist >> README-CLOUDFLARE.md
echo - Set Root directory to: /frontend >> README-CLOUDFLARE.md
echo. >> README-CLOUDFLARE.md
echo Required environment variables: >> README-CLOUDFLARE.md
echo - VITE_API_BASE_URL = https://lethimdo-backend.onrender.com >> README-CLOUDFLARE.md
echo - VITE_APP_NAME = Lethimdo >> README-CLOUDFLARE.md
echo.
echo Created README-CLOUDFLARE.md with deployment instructions.
echo.
echo You can also try this alternative approach:
echo 1. In Cloudflare Pages settings:
echo    - Build command: npm run build
echo    - Build output directory: dist
echo    - Root directory: /frontend
echo.
pause
goto menu

:exit_script
echo.
echo Thank you for using the Cloudflare Pages Deployment Fix Tool!
echo.
pause
exit /b 0

:menu
echo.
echo Press any key to return to the menu...
pause >nul
goto :eof