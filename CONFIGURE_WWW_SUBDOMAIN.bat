@echo off
title Configure WWW Subdomain for Lethimdo

echo ====================================================
echo    Configure WWW Subdomain for Lethimdo
echo ====================================================
echo.

echo This script will guide you through configuring the WWW subdomain for your Lethimdo application.
echo.

echo STEP 1: LOGIN TO CLOUDFLARE
echo --------------------------
echo 1. Go to https://dash.cloudflare.com
echo 2. Sign in with your Cloudflare account credentials
echo.
echo Press any key after you've logged in...
pause >nul

echo.
echo STEP 2: FIND YOUR CLOUDFLARE PAGES PROJECT
echo ----------------------------------------
echo 1. In the left sidebar, click on "Pages"
echo 2. Look for your project (likely named "ai-workflow-builder")
echo 3. Click on the project name
echo.
echo Press any key after you've found your project...
pause >nul

echo.
echo STEP 3: ADD CUSTOM DOMAIN FOR WWW
echo ---------------------------------
echo 1. In your Pages project, click on "Settings" tab
echo 2. Scroll down to "Custom domains" section
echo 3. Click "Add custom domain"
echo 4. Enter: www.lethimdo.com
echo 5. Click "Continue"
echo 6. Note the DNS record details that Cloudflare provides
echo.
echo Press any key after you've added the custom domain...
pause >nul

echo.
echo STEP 4: ADD DNS RECORD IN CLOUDFLARE
echo ------------------------------------
echo 1. In Cloudflare Dashboard, select your domain (lethimdo.com)
echo 2. Click on the "DNS" tab
echo 3. Click "Add record"
echo 4. Fill in the details:
echo    Type: CNAME
echo    Name: www
echo    Content: [your-project.pages.dev] (use the exact value from Step 3)
echo    Proxy status: Proxied (orange cloud)
echo    TTL: Auto
echo 5. Click "Save"
echo.
echo Press any key after you've added the DNS record...
pause >nul

echo.
echo STEP 5: WAIT FOR DNS PROPAGATION
echo --------------------------------
echo DNS changes can take some time to propagate:
echo - Initial processing: 5-15 minutes
echo - Local propagation: 15-30 minutes
echo - Global propagation: 1-4 hours
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 6: TEST YOUR CONFIGURATION
echo -------------------------------
echo After waiting for propagation:
echo 1. Visit https://www.lethimdo.com
echo 2. Both https://lethimdo.com and https://www.lethimdo.com should load your Lethimdo application
echo.
echo Press any key to continue...
pause >nul

echo.
echo ADDITIONAL RESOURCES
echo --------------------
echo For detailed instructions, see:
echo - FIX_WWW_SUBDOMAIN_CONFIGURATION.md
echo - CLOUDFLARE_PAGES_SETUP_CHECK.md
echo - HOSTINGER_CLOUDFLARE_DNS_CONFLICT_RESOLUTION.md
echo.
echo For troubleshooting, see:
echo - IMMEDIATE_NEXT_STEPS.md
echo.
echo Press any key to exit...
pause >nul