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

echo 2. SET UP CUSTOM DOMAINS
echo    ^> Configure www.lethimdo.com in Cloudflare Pages
echo    ^> Set up apex domain (lethimdo.com) redirection
echo.

echo 3. IMPLEMENT MONITORING
echo    ^> Set up Google Analytics or similar service
echo    ^> Configure error tracking (Sentry, Rollbar, etc.)
echo.

echo 4. PREPARE YOUR BANGLADESH FREELANCE AGENCY
echo    ^> Create client intake forms
echo    ^> Develop service packages and pricing
echo    ^> Prepare contracts and agreements
echo.

echo 5. ENSURE SECURITY AND COMPLIANCE
echo    ^> Verify SSL certificate installation
echo    ^> Check CORS and authentication settings
echo    ^> Review data protection compliance
echo.

echo Detailed instructions are in IMMEDIATE_NEXT_STEPS.md
echo.

echo What would you like to do now?
echo.
echo 1. Open IMMEDIATE_NEXT_STEPS.md
echo 2. Run verification script
echo 3. Start local development environment
echo 4. Exit
echo.

choice /c 1234 /m "Enter your choice"

if %errorlevel% == 4 goto :exit
if %errorlevel% == 3 goto :start_dev
if %errorlevel% == 2 goto :verify
if %errorlevel% == 1 goto :open_guide

:open_guide
start "" "IMMEDIATE_NEXT_STEPS.md"
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