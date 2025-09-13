@echo off
title Get Started with Lethimdo - Next Steps

echo ====================================================
echo    Lethimdo - Immediate Next Steps
echo ====================================================
echo.

echo Congratulations on your successful deployment!
echo.
echo Here are your immediate next steps:
echo.

echo 1. VERIFY YOUR DEPLOYMENT
echo    ^> Double-click VERIFY_DEPLOYMENT.bat to check your setup
echo    ^> Visit your live application and test all functionality
echo.

echo 2. RESOLVE DNS CONFLICT (Hostinger vs Cloudflare)
echo    ^> Run check-current-dns-configuration.bat
echo    ^> Review HOSTINGER_CLOUDFLARE_DNS_CONFLICT_RESOLUTION.md
echo    ^> Decide whether to keep Cloudflare or move to Hostinger
echo.

echo 3. FIX CLOUDFLARE PAGES DNS CONFIGURATION
echo    ^> Run check-cloudflare-pages-setup.bat
echo    ^> Review CLOUDFLARE_PAGES_SETUP_CHECK.md
echo    ^> Fix missing WWW subdomain configuration
echo.

echo 4. SET UP CUSTOM DOMAINS
echo    ^> Configure www.lethimdo.com in Cloudflare Pages
echo    ^> Set up apex domain (lethimdo.com) redirection
echo.

echo 5. IMPLEMENT MONITORING
echo    ^> Set up Google Analytics or similar service
echo    ^> Configure error tracking (Sentry, Rollbar, etc.)
echo.

echo 6. PREPARE YOUR BANGLADESH FREELANCE AGENCY
echo    ^> Create client intake forms
echo    ^> Develop service packages and pricing
echo    ^> Prepare contracts and agreements
echo.

echo 7. ENSURE SECURITY AND COMPLIANCE
echo    ^> Verify SSL certificate installation
echo    ^> Check CORS and authentication settings
echo    ^> Review data protection compliance
echo.

echo Detailed instructions are in IMMEDIATE_NEXT_STEPS.md
echo.

echo What would you like to do now?
echo.
echo 1. Open IMMEDIATE_NEXT_STEPS.md
echo 2. Check Cloudflare Pages setup
echo 3. Check current DNS configuration
echo 4. Run verification script
echo 5. Start local development environment
echo 6. Exit
echo.

choice /c 123456 /m "Enter your choice"

if %errorlevel% == 6 goto :exit
if %errorlevel% == 5 goto :start_dev
if %errorlevel% == 4 goto :verify
if %errorlevel% == 3 goto :check_dns
if %errorlevel% == 2 goto :check_pages
if %errorlevel% == 1 goto :open_guide

:open_guide
start "" "IMMEDIATE_NEXT_STEPS.md"
goto :end

:check_pages
call "check-cloudflare-pages-setup.bat"
goto :end

:check_dns
call "check-current-dns-configuration.bat"
goto :end

:verify
call "VERIFY_DEPLOYMENT.bat"
goto :end

:start_dev
call "DEVELOPMENT_START.bat"
goto :end

:exit
echo Exiting...
goto :end

:end
echo.
echo Press any key to exit...
pause >nul