@echo off
title Check Cloudflare Pages Setup

echo ====================================================
echo    Check Cloudflare Pages Setup for Lethimdo
echo ====================================================
echo.

echo 1. Opening Cloudflare Dashboard...
echo.
start "" "https://dash.cloudflare.com"

echo 2. Opening Cloudflare Pages Documentation...
echo.
start "" "https://developers.cloudflare.com/pages/"

echo 3. Checking local project files...
echo.
cd c:\Users\user\lethimdo
dir wrangler.json
dir build-frontend.cjs
dir build-frontend.sh
echo.

echo 4. Checking frontend directory...
echo.
cd c:\Users\user\lethimdo\frontend
if exist "dist" (
    echo [OK] Frontend build directory exists
    echo Files in dist:
    dir /b dist | findstr /v "node_modules" | findstr /v ".git"
) else (
    echo [INFO] Frontend build directory not found
)
echo.

echo 5. Checking environment variables...
echo.
cd c:\Users\user\lethimdo\frontend
if exist ".env" (
    echo [INFO] .env file found:
    type .env
) else (
    echo [INFO] No local .env file found
)
echo.

echo ====================================================
echo    Next Steps:
echo ====================================================
echo.
echo 1. Login to Cloudflare Dashboard
echo 2. Navigate to Pages section
echo 3. Find your project (ai-workflow-builder)
echo 4. Check Custom Domains settings
echo 5. Verify DNS records in DNS tab
echo.

echo Common issues and solutions:
echo.
echo Issue 1: www.lethimdo.com not working
echo Solution: Add CNAME record in DNS tab
echo.
echo Issue 2: Root domain not pointing to Pages
echo Solution: Add A record or CNAME flattening
echo.
echo Issue 3: SSL certificate issues
echo Solution: Ensure proxy status is "Proxied" (orange cloud)
echo.

pause