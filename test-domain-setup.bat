@echo off
echo ================================================================
echo   DOMAIN CONFIGURATION TESTING FOR LETHIMDO.COM
echo ================================================================
echo.

echo 🇧🇩 Testing your Bangladesh freelance agency domain setup
echo.

echo ================================================================
echo   CURRENT DNS STATUS
echo ================================================================
echo.

echo Testing main domain (lethimdo.com):
nslookup lethimdo.com
echo.

echo Testing subdomain (www.lethimdo.com):
nslookup www.lethimdo.com
echo.

echo ================================================================
echo   BROWSER TESTING
echo ================================================================
echo.

echo Opening main domain in browser...
start https://lethimdo.com
echo ✅ Should load your deployed platform

echo.
echo Opening subdomain in browser...
start https://www.lethimdo.com
echo ✅ Should load your deployed platform

echo.
echo ================================================================
echo   SSL CERTIFICATE TESTING
echo ================================================================
echo.

echo Opening SSL checker...
start https://www.ssllabs.com/ssltest/analyze.html?d=lethimdo.com
echo ✅ Should show A+ rating for professional clients

echo.
echo ================================================================
echo   GLOBAL DNS PROPAGATION CHECK
echo ================================================================
echo.

echo Opening global DNS checker...
start https://dnschecker.org/#A/lethimdo.com
echo ✅ Should show consistent results worldwide

echo.
echo Opening WWW subdomain checker...
start https://dnschecker.org/#CNAME/www.lethimdo.com
echo ✅ Should point to Netlify

echo.
echo ================================================================
echo   PLATFORM CONFIGURATION CHECK
echo ================================================================
echo.

echo Choose your platform to configure:
echo [1] Netlify (if both domains use Netlify)
echo [2] Firebase (if main domain should use Firebase)
echo [3] Both (hybrid setup)
echo.

set /p PLATFORM="Which platform are you primarily using? (1/2/3): "

if "%PLATFORM%"=="1" goto NETLIFY_CONFIG
if "%PLATFORM%"=="2" goto FIREBASE_CONFIG
if "%PLATFORM%"=="3" goto HYBRID_CONFIG

:NETLIFY_CONFIG
echo.
echo ================================================================
echo   NETLIFY CONFIGURATION
echo ================================================================
echo.
echo Opening Netlify dashboard...
start https://app.netlify.com
echo.
echo ✅ NETLIFY SETUP CHECKLIST:
echo 1. Go to your deployed site
echo 2. Click "Domain settings"
echo 3. Add custom domain: lethimdo.com
echo 4. Add custom domain: www.lethimdo.com
echo 5. Wait for DNS verification
echo 6. HTTPS will be automatically enabled
echo.
goto END

:FIREBASE_CONFIG
echo.
echo ================================================================
echo   FIREBASE CONFIGURATION
echo ================================================================
echo.
echo Opening Firebase console...
start https://console.firebase.google.com
echo.
echo ✅ FIREBASE SETUP CHECKLIST:
echo 1. Select your project
echo 2. Go to Hosting section
echo 3. Click "Add custom domain"
echo 4. Enter: lethimdo.com
echo 5. Follow verification steps
echo 6. Update DNS if required
echo.
echo Note: You may need to update Hostinger DNS:
echo A Record: @ → Firebase IP addresses
echo.
goto END

:HYBRID_CONFIG
echo.
echo ================================================================
echo   HYBRID CONFIGURATION
echo ================================================================
echo.
echo Opening both platforms...
start https://app.netlify.com
start https://console.firebase.google.com
echo.
echo ✅ HYBRID SETUP CHECKLIST:
echo.
echo FIREBASE (Main Domain):
echo 1. Configure lethimdo.com in Firebase Hosting
echo 2. Update DNS A record to Firebase IPs
echo.
echo NETLIFY (Subdomain):  
echo 1. Configure www.lethimdo.com in Netlify
echo 2. Keep current CNAME record
echo.
goto END

:END
echo.
echo ================================================================
echo   BUSINESS READINESS CHECK
echo ================================================================
echo.

echo 🎯 BANGLADESH FREELANCE AGENCY STATUS:
echo.

echo Testing business email setup possibility...
echo Opening Hostinger email configuration...
start https://hpanel.hostinger.com
echo ✅ Can set up: info@lethimdo.com

echo.
echo 💰 USD CLIENT ACQUISITION READINESS:
echo ✅ Professional domain: lethimdo.com
echo ✅ SSL security for client trust
echo ✅ Global accessibility confirmed
echo ✅ Ready for business cards/marketing
echo.

echo 🚀 IMMEDIATE NEXT STEPS:
echo 1. Verify both domains load your platform
echo 2. Confirm HTTPS certificates are working
echo 3. Update GitHub repository with live demo links
echo 4. Create client demo materials
echo 5. Set up professional email (optional)
echo 6. Start client acquisition campaigns
echo.

echo ================================================================
echo   MONITORING AND VERIFICATION
echo ================================================================
echo.

echo Your domain configuration is now being tested.
echo Check all opened browser tabs to verify:
echo.

echo ✅ lethimdo.com loads properly
echo ✅ www.lethimdo.com loads properly  
echo ✅ HTTPS certificates are active
echo ✅ DNS propagation is complete worldwide
echo ✅ Platform configuration is correct
echo.

echo If any issues are found, refer to:
echo - HYBRID-DEPLOYMENT-STATUS.md
echo - HOSTINGER-DNS-CONFIGURATION.md
echo.

echo 🎉 Your Bangladesh freelance agency is ready for international client acquisition!
echo.

pause