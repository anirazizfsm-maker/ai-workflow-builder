@echo off
title Find Cloudflare Pages URL

echo ====================================================
echo    Find Your Cloudflare Pages Project URL
echo ====================================================
echo.

echo This script will help you find your Cloudflare Pages project and its content URL.
echo.

echo STEP 1: LOGIN TO CLOUDFLARE
echo --------------------------
echo 1. Go to https://dash.cloudflare.com
echo 2. Sign in with your Cloudflare account credentials
echo.
echo Press any key after you've logged in...
pause >nul

echo.
echo STEP 2: NAVIGATE TO PAGES
echo ------------------------
echo 1. In the left sidebar, click on "Pages"
echo.
echo Press any key after you've navigated to Pages...
pause >nul

echo.
echo STEP 3: FIND YOUR PROJECT
echo ------------------------
echo Look for a project with one of these names:
echo - ai-workflow-builder
echo - lethimdo
echo - lethimdo-frontend
echo.
echo If you don't see it, you may need to create a new project.
echo.
echo Press any key after you've found your project...
pause >nul

echo.
echo STEP 4: GET YOUR PAGES.DEV URL
echo ------------------------------
echo 1. Click on your project name
echo 2. Look for the "Production" domain (something like [project-name].pages.dev)
echo 3. This is your temporary URL where your content is currently accessible
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 5: TEST YOUR CONTENT
echo -------------------------
echo 1. Copy the pages.dev URL
echo 2. Open it in your browser
echo 3. Your Lethimdo application should load
echo.
echo Press any key to continue...
pause >nul

echo.
echo WHAT CONTENT YOU'LL SEE
echo ----------------------
echo Your Cloudflare Pages site serves:
echo - A React single-page application
echo - All static assets (HTML, CSS, JS, images)
echo - Proper routing via _redirects file
echo - Environment variables (VITE_API_BASE_URL, VITE_APP_NAME)
echo.
echo Press any key to continue...
pause >nul

echo.
echo ADDITIONAL RESOURCES
echo --------------------
echo For more information about your Cloudflare Pages content, see:
echo - CLOUDFLARE_PAGES_CONTENT_SUMMARY.md
echo - CLOUDFLARE_DEPLOYMENT_GUIDE.md
echo - CLOUDFLARE_PAGES_SETUP_CHECK.md
echo.
echo Press any key to exit...
pause >nul