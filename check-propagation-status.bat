@echo off
echo ================================================================
echo   DNS PROPAGATION STATUS CHECKER
echo   Checking if lethimdo.com name servers have propagated
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - Domain Migration Progress
echo.

echo ================================================================
echo   CURRENT NAME SERVER STATUS
echo ================================================================
echo.
echo Checking name servers for lethimdo.com...
echo.
nslookup -type=NS lethimdo.com
echo.

echo ================================================================
echo   HOW TO INTERPRET THE RESULTS
echo ================================================================
echo.
echo ✅ LOOK FOR THESE HOSTINGER NAME SERVERS:
echo    ns1.hostinger.com
echo    ns2.hostinger.com
echo    ns3.hostinger.com
echo    ns4.hostinger.com
echo.
echo ❌ IF YOU SEE THESE PARKING SERVERS, PROPAGATION IS NOT COMPLETE:
echo    ns1.dns-parking.com
echo    ns2.dns-parking.com
echo.
echo ⏰ PROPAGATION TIMELINE:
echo    - Initial propagation: 15-60 minutes
echo    - Most locations: 2-6 hours
echo    - Worldwide complete: 24-48 hours
echo.

echo ================================================================
echo   ADDITIONAL VERIFICATION
echo ================================================================
echo.
echo Checking if domain resolves to Netlify...
nslookup lethimdo.com
echo.
echo Checking www subdomain...
nslookup www.lethimdo.com
echo.

echo ================================================================
echo   NEXT STEPS
echo ================================================================
echo.
if "%ERRORLEVEL%"=="0" (
    echo 🎯 IF YOU SEE HOSTINGER NAME SERVERS ABOVE:
    echo    ✅ Name server propagation is complete
    echo    🔄 Proceed with configuring DNS records in Hostinger
    echo    📋 See HOSTINGER-DNS-CONFIGURATION.md for detailed steps
    echo.
    echo 🎯 IF YOU SEE PARKING SERVERS:
    echo    ❌ Name server propagation is still in progress
    echo    ⏰ Wait longer and check again later
    echo    📚 See DOMAIN-REGISTRAR-UPDATE-GUIDE.md for troubleshooting
) else (
    echo ❌ Unable to check DNS records
    echo 🛠️ Check your internet connection
    echo 📞 Contact support if issue persists
)
echo.
echo 💡 TIP: You can also check propagation online at:
echo    https://dnschecker.org/#NS/lethimdo.com
echo.
pause