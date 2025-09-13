@echo off
title Fix DNS Configuration for Lethimdo

echo ====================================================
echo    Fix DNS Configuration for Lethimdo
echo ====================================================
echo.

echo Based on your DNS records, there are several issues that need to be fixed:
echo 1. WWW CNAME record points to lethimdo.com instead of your Cloudflare Pages domain
echo 2. Root domain A record points to Netlify IP instead of Cloudflare Pages
echo 3. NS records point to parking servers instead of proper nameservers
echo.

echo STEP 1: LOGIN TO CLOUDFLARE DASHBOARD
echo -------------------------------------
echo 1. Go to https://dash.cloudflare.com
echo 2. Sign in with your Cloudflare account credentials
echo.
echo Press any key after you've logged in...
pause >nul

echo.
echo STEP 2: FIND YOUR CLOUDFLARE PAGES DOMAIN
echo ----------------------------------------
echo 1. In the left sidebar, click on "Pages"
echo 2. Find your project (likely named "ai-workflow-builder")
echo 3. Click on the project name
echo 4. Note the domain shown under "Production" (something like [project-name].pages.dev)
echo.
echo Press any key after you've found your Pages domain...
pause >nul

echo.
echo STEP 3: FIX WWW CNAME RECORD
echo ----------------------------
echo 1. In Cloudflare Dashboard, select your domain (lethimdo.com)
echo 2. Click on the "DNS" tab
echo 3. Find the CNAME record for "www"
echo 4. Click the edit button (pencil icon)
echo 5. Change the "Content" field to your Cloudflare Pages domain
echo 6. Make sure "Proxy status" is set to "Proxied" (orange cloud)
echo 7. Click "Save"
echo.
echo Press any key after you've fixed the WWW record...
pause >nul

echo.
echo STEP 4: FIX ROOT DOMAIN A RECORD
echo --------------------------------
echo 1. In the DNS tab, find the A record for "@"
echo 2. Click the edit button (pencil icon)
echo 3. Change the "Content" field to 192.0.2.1
echo 4. Make sure "Proxy status" is set to "Proxied" (orange cloud)
echo 5. Click "Save"
echo.
echo Press any key after you've fixed the root domain record...
pause >nul

echo.
echo STEP 5: FIX NS RECORDS
echo ----------------------
echo You need to choose one option:
echo.
echo Option A: Manage DNS through Hostinger
echo 1. Login to Hostinger hPanel
echo 2. Go to "Domains" ^> "lethimdo.com" ^> "Manage"
echo 3. Click on "DNS Zone" or "DNS Management"
echo 4. Find Hostinger nameservers
echo 5. Update domain nameservers at registrar to Hostinger's
echo.
echo Option B: Manage DNS through Cloudflare
echo 1. In Cloudflare Dashboard, select your domain
echo 2. Click on "DNS" tab
echo 3. Delete NS records pointing to parking servers
echo.
echo Which option would you like to use?
echo 1. Hostinger (recommended if you prefer Hostinger)
echo 2. Cloudflare (recommended for Cloudflare Pages)
echo.
choice /c 12 /m "Enter your choice"

if %errorlevel% == 2 goto :cloudflare
if %errorlevel% == 1 goto :hostinger

:hostinger
echo.
echo You've chosen to manage DNS through Hostinger.
echo Follow the steps above to update your nameservers.
echo.
goto :wait

:cloudflare
echo.
echo You've chosen to manage DNS through Cloudflare.
echo Follow the steps above to fix your NS records.
echo.

:wait
echo.
echo STEP 6: WAIT FOR DNS PROPAGATION
echo --------------------------------
echo DNS changes can take some time to propagate:
echo - Initial processing: 5-15 minutes
echo - Local propagation: 15-30 minutes
echo - Global propagation: 1-4 hours
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 7: TEST YOUR CONFIGURATION
echo -------------------------------
echo After waiting for propagation:
echo 1. Visit https://lethimdo.com
echo 2. Visit https://www.lethimdo.com
echo 3. Both should load your Lethimdo application
echo.
echo Press any key to continue...
pause >nul

echo.
echo TROUBLESHOOTING
echo --------------
echo If domains still don't work:
echo 1. Check that all records have "Proxy status" set to "Proxied"
echo 2. Verify CNAME content matches exactly what Cloudflare Pages provides
echo 3. Check Cloudflare's SSL/TLS tab for certificate issues
echo.
echo If you see "Welcome to Cloudflare" page:
echo 1. This is normal during propagation
echo 2. Wait longer for DNS propagation to complete
echo.
echo Press any key to continue...
pause >nul

echo.
echo ADDITIONAL RESOURCES
echo --------------------
echo For detailed instructions, see:
echo - FIX_DNS_CONFIGURATION.md
echo - HOSTINGER_CLOUDFLARE_DNS_CONFLICT_RESOLUTION.md
echo - CLOUDFLARE_PAGES_CONTENT_SUMMARY.md
echo.
echo Press any key to exit...
pause >nul