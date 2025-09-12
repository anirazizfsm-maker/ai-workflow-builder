@echo off
echo ================================================================
echo   HOSTINGER DNS QUICK SETUP FOR LETHIMDO.COM
echo ================================================================
echo.

echo 🇧🇩 HOSTINGER DNS CONFIGURATION FOR BANGLADESH FREELANCE AGENCY
echo.

echo Your current DNS status:
nslookup lethimdo.com
echo.

echo ================================================================
echo   REQUIRED HOSTINGER DNS CHANGES
echo ================================================================
echo.

echo ✅ LOGIN TO HOSTINGER:
echo    https://hpanel.hostinger.com
echo.

echo ✅ NAVIGATE TO:
echo    Domains → lethimdo.com → DNS Zone
echo.

echo ✅ EDIT A RECORD:
echo    Type: A
echo    Name: @ (or lethimdo.com)
echo    Points to: 75.2.60.5
echo    TTL: 3600
echo.

echo ✅ EDIT CNAME RECORD:
echo    Type: CNAME
echo    Name: www
echo    Points to: [YOUR-NETLIFY-SITE].netlify.app
echo    TTL: 3600
echo.

echo ================================================================
echo   GET YOUR NETLIFY SITE NAME
echo ================================================================
echo.

echo 1. Login to Netlify: https://app.netlify.com
echo 2. Go to your deployed site
echo 3. Find site name (like: wonderful-pasteur-123456)
echo 4. Use: wonderful-pasteur-123456.netlify.app
echo.

echo Opening Netlify to get your site name...
start https://app.netlify.com
echo.

echo Opening Hostinger control panel...
start https://hpanel.hostinger.com
echo.

echo ================================================================
echo   CURRENT VS REQUIRED DNS
echo ================================================================
echo.

echo CURRENT (WRONG):
echo lethimdo.com → 84.32.84.32
echo.

echo REQUIRED (CORRECT):
echo lethimdo.com → 75.2.60.5 (Netlify IP)
echo www.lethimdo.com → [your-site].netlify.app
echo.

echo ================================================================
echo   TESTING TOOLS
echo ================================================================
echo.

echo After making changes, test with:
echo 1. Run this script again to check DNS
echo 2. Visit: https://lethimdo.com
echo 3. Online checker: https://dnschecker.org
echo.

echo Opening DNS checker...
start https://dnschecker.org/#A/lethimdo.com
echo.

echo ================================================================
echo   TIMELINE EXPECTATIONS
echo ================================================================
echo.

echo ⏰ Hostinger DNS Changes: 5-15 minutes
echo ⏰ Local Propagation: 15-30 minutes  
echo ⏰ Global Propagation: 1-4 hours
echo ⏰ HTTPS Certificate: Auto after DNS propagates
echo.

echo 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS:
echo ✅ Professional domain for international clients
echo ✅ Hostinger - good support for Bangladesh users
echo ✅ Fast DNS propagation in South Asia region
echo ✅ Ready for USD client acquisition
echo.

echo ================================================================
echo   NEXT STEPS AFTER DNS UPDATE
echo ================================================================
echo.

echo 1. ✅ Test domain: https://lethimdo.com
echo 2. ✅ Update GitHub repository with live demo
echo 3. ✅ Add to business cards and portfolios  
echo 4. ✅ Set up professional email (optional)
echo 5. ✅ Start client acquisition campaigns
echo.

echo Press any key to continue monitoring DNS status...
pause

echo.
echo Checking DNS status every 5 minutes...
echo Press Ctrl+C to stop monitoring
echo.

:MONITOR
echo ================================================================
echo   DNS STATUS CHECK - %TIME%
echo ================================================================
nslookup lethimdo.com
echo.

echo Waiting 5 minutes for next check...
timeout /t 300 /nobreak
goto MONITOR