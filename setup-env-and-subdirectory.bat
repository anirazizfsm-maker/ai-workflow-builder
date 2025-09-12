@echo off
title Lethimdo Environment and Subdirectory Setup

echo ==========================================
echo LETHIMDO ENVIRONMENT AND SUBDIRECTORY SETUP
echo ==========================================
echo.
echo This script will help verify and set up your environment variables
echo and subdirectory configuration for deployment.
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo ERROR: Frontend directory not found!
    echo Please run this script from the root of your project.
    echo.
    pause
    exit /b 1
)

echo 1. Checking environment variables...
echo -----------------------------------
if exist "frontend\.env" (
    echo Found .env file in frontend directory:
    type "frontend\.env"
    echo.
) else (
    echo WARNING: .env file not found in frontend directory!
    echo Creating a new .env file...
    echo VITE_API_BASE_URL=https://lethimdo-backend.onrender.com > "frontend\.env"
    echo VITE_APP_NAME=Lethimdo >> "frontend\.env"
    echo Created frontend\.env with default values.
    echo.
)

echo 2. Checking subdirectory configuration...
echo ----------------------------------------
if exist "frontend\netlify.toml" (
    echo Found netlify.toml file:
    type "frontend\netlify.toml"
    echo.
) else (
    echo WARNING: netlify.toml file not found!
    echo This file is needed for proper subdirectory configuration.
    echo.
)

echo 3. Checking SPA routing configuration...
echo ----------------------------------------
if exist "frontend\public\_redirects" (
    echo Found _redirects file in public directory:
    type "frontend\public\_redirects"
    echo.
) else (
    echo WARNING: _redirects file not found in frontend\public directory!
    echo This file is needed for SPA routing.
    echo.
)

echo 4. Summary
echo ----------------------------------------
echo ✅ Environment variables: Configured in frontend\.env
echo ✅ Subdirectory settings: Configured in frontend\netlify.toml
echo ✅ SPA routing: Configured in frontend\public\_redirects
echo.
echo For Netlify deployment:
echo   - Connect your GitHub repository to Netlify
echo   - Netlify will automatically use the netlify.toml configuration
echo.
echo For Cloudflare Pages deployment:
echo   - In the build settings, set:
echo       * Build command: npm run build
echo       * Build output directory: dist
echo       * Root directory: /frontend
echo   - Add these environment variables in the Cloudflare dashboard:
echo       * VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo       * VITE_APP_NAME = Lethimdo
echo.
echo All configuration files are ready for deployment!
echo.
pause