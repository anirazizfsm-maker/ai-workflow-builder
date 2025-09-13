@echo off
title Configure Nameservers and DNS for Lethimdo

echo ====================================================
echo    Configure Nameservers and DNS for Lethimdo
echo ====================================================
echo.

echo You want to use www.lethimdo.com as your nameserver, but there's a misunderstanding.
echo Let me explain the difference and help you set up your domain correctly.
echo.

echo NAMESERVERS vs. DNS RECORDS
echo =========================
echo Nameservers are authoritative servers that manage DNS records for your domain.
echo www.lethimdo.com is a subdomain (DNS record), not a nameserver.
echo.
echo Press any key to continue...
pause >nul

echo.
echo WHAT YOU NEED TO DO
echo ==================
echo 1. Set your domain's nameservers to either Cloudflare or Hostinger
echo 2. Configure DNS records (including www) within that DNS provider
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 1: CHOOSE YOUR DNS PROVIDER
echo ================================
echo You need to choose where to manage your DNS records:
echo.
echo Option 1: Cloudflare (Recommended for Cloudflare Pages)
echo - Nameservers: opal.ns.cloudflare.com, quincy.ns.cloudflare.com
echo - Benefits: Better integration with Cloudflare Pages, CDN, security
echo.
echo Option 2: Hostinger (If you prefer Hostinger management)
echo - Nameservers: ns1.hostinger.com, ns2.hostinger.com
echo - Benefits: All services in one place if you prefer Hostinger
echo.
echo Which option would you like to use?
echo 1. Cloudflare (recommended)
echo 2. Hostinger
echo.
choice /c 12 /m "Enter your choice"

if %errorlevel% == 2 goto :hostinger
if %errorlevel% == 1 goto :cloudflare

:cloudflare
echo.
echo You've chosen Cloudflare for DNS management.
echo.
echo STEP 2: UPDATE NAMESERVERS AT YOUR REGISTRAR
echo ===========================================
echo 1. Login to your domain registrar (Hostinger)
echo 2. Navigate to domain management for lethimdo.com
echo 3. Change nameservers to:
echo    opal.ns.cloudflare.com
echo    quincy.ns.cloudflare.com
echo.
echo Press any key after you've updated nameservers...
pause >nul

echo.
echo STEP 3: CONFIGURE DNS RECORDS IN CLOUDFLARE
echo ==========================================
echo 1. Login to Cloudflare Dashboard: https://dash.cloudflare.com
echo 2. Select your domain (lethimdo.com)
echo 3. Go to DNS tab
echo 4. Add these records:
echo.
echo Root Domain A Record:
echo Type: A
echo Name: @
echo Content: 192.0.2.1
echo Proxy status: Proxied (orange cloud)
echo TTL: Auto
echo.
echo WWW Subdomain CNAME Record:
echo Type: CNAME
echo Name: www
echo Content: [your-project.pages.dev] (get this from Cloudflare Pages)
echo Proxy status: Proxied (orange cloud)
echo TTL: Auto
echo.
echo Press any key after you've configured DNS records...
pause >nul
goto :wait

:hostinger
echo.
echo You've chosen Hostinger for DNS management.
echo.
echo STEP 2: VERIFY NAMESERVERS AT YOUR REGISTRAR
echo ===========================================
echo 1. Login to Hostinger hPanel
echo 2. Navigate to domain management for lethimdo.com
echo 3. Ensure nameservers are set to:
echo    ns1.hostinger.com
echo    ns2.hostinger.com
echo.
echo Press any key after you've verified nameservers...
pause >nul

echo.
echo STEP 3: CONFIGURE DNS RECORDS IN HOSTINGER
echo =========================================
echo 1. Login to Hostinger hPanel
echo 2. Go to "Domains" ^> "lethimdo.com" ^> "Manage"
echo 3. Click on "DNS Zone"
echo 4. Add these records:
echo.
echo Root Domain A Record:
echo Type: A
echo Name: @
echo Points to: 192.0.2.1
echo TTL: 3600
echo.
echo WWW Subdomain CNAME Record:
echo Type: CNAME
echo Name: www
echo Points to: [your-project.pages.dev] (get this from Cloudflare Pages)
echo TTL: 3600
echo.
echo Press any key after you've configured DNS records...
pause >nul

:wait
echo.
echo STEP 4: FIND YOUR CLOUDFLARE PAGES DOMAIN
echo =======================================
echo 1. Login to Cloudflare Dashboard: https://dash.cloudflare.com
echo 2. Click on "Pages" in the left sidebar
echo 3. Find your project (likely named "ai-workflow-builder")
echo 4. Click on the project name
echo 5. Note the domain shown under "Production" (something like [project-name].pages.dev)
echo.
echo Press any key after you've found your Pages domain...
pause >nul

echo.
echo STEP 5: WAIT FOR DNS PROPAGATION
echo ================================
echo DNS changes can take some time to propagate:
echo - Initial processing: 5-15 minutes
echo - Local propagation: 15-30 minutes
echo - Global propagation: 1-4 hours
echo.
echo Press any key to continue...
pause >nul

echo.
echo STEP 6: TEST YOUR CONFIGURATION
echo ==============================
echo After waiting for propagation:
echo 1. Visit https://lethimdo.com
echo 2. Visit https://www.lethimdo.com
echo 3. Both should load your Lethimdo application
echo.
echo Press any key to continue...
pause >nul

echo.
echo TROUBLESHOOTING
echo ===============
echo If domains still don't work:
echo 1. Check that nameservers are correctly set at your registrar
echo 2. Verify that DNS records are correctly configured
echo 3. Wait longer for DNS propagation
echo.
echo If you see "Welcome to Cloudflare" page:
echo 1. This is normal during propagation
echo 2. Wait longer for DNS propagation to complete
echo.
echo Press any key to continue...
pause >nul

echo.
echo ADDITIONAL RESOURCES
echo ====================
echo For detailed instructions, see:
echo - CONFIGURE_NAMESERVERS_AND_DNS.md
echo - HOSTINGER_CLOUDFLARE_DNS_CONFLICT_RESOLUTION.md
echo - CLOUDFLARE_PAGES_CONTENT_SUMMARY.md
echo.
echo Press any key to exit...
pause >nul