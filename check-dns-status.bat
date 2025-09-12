@echo off
echo ================================================================
echo   DNS STATUS CHECKER FOR LETHIMDO.COM
echo ================================================================
echo.

echo 🇧🇩 Checking DNS configuration for your Bangladesh freelance agency domain
echo.

echo Checking current DNS status for lethimdo.com...
echo.

echo ================================================================
echo   CHECKING A RECORD (Root Domain)
echo ================================================================
nslookup lethimdo.com
echo.

echo ================================================================
echo   CHECKING WWW SUBDOMAIN
echo ================================================================
nslookup www.lethimdo.com
echo.

echo ================================================================
echo   CHECKING NAME SERVERS
echo ================================================================
nslookup -type=NS lethimdo.com
echo.

echo ================================================================
echo   EXPECTED NETLIFY CONFIGURATION
echo ================================================================
echo.
echo ✅ A Record should point to: 75.2.60.5
echo ✅ WWW should be CNAME to: [your-site].netlify.app
echo ✅ Or Name Servers should be Netlify's:
echo    - dns1.p01.nsone.net
echo    - dns2.p01.nsone.net  
echo    - dns3.p01.nsone.net
echo    - dns4.p01.nsone.net
echo.

echo ================================================================
echo   TESTING WEBSITE ACCESS
echo ================================================================
echo.
echo Opening lethimdo.com in browser to test...
start https://lethimdo.com

echo.
echo Opening www.lethimdo.com in browser to test...
start https://www.lethimdo.com

echo.
echo ================================================================
echo   DNS PROPAGATION CHECKER
echo ================================================================
echo.
echo Opening online DNS checker for global verification...
start https://dnschecker.org/#A/lethimdo.com

echo.
echo ================================================================
echo   🎯 NEXT STEPS IF DOMAIN NOT WORKING
echo ================================================================
echo.
echo 1. If DNS shows wrong IP or not found:
echo    → Update DNS records at your domain registrar
echo    → Use the guide in NETLIFY-CUSTOM-DOMAIN-SETUP.md
echo.
echo 2. If DNS is correct but site not loading:
echo    → Wait for full DNS propagation (up to 24-48 hours)
echo    → Clear browser cache and try again
echo.
echo 3. If HTTPS not working:
echo    → Wait additional 15-30 minutes after DNS propagation
echo    → Netlify automatically provisions SSL certificates
echo.
echo 💰 Professional Benefits for Bangladesh Freelance Agency:
echo ✅ Custom domain increases client trust
echo ✅ Better for international business cards/marketing
echo ✅ Professional email setup possible (info@lethimdo.com)
echo ✅ SEO benefits for client acquisition
echo.
pause