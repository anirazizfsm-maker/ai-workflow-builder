@echo off
echo ================================================================
echo   CUSTOM DOMAIN CONFIGURATION CHECKER
echo   lethimdo.com and api.lethimdo.com
echo ================================================================
echo.

echo 🇧🇩 Checking custom domain configuration for your Bangladesh freelance agency
echo.

echo ================================================================
echo   CHECKING FRONTEND DOMAIN (lethimdo.com)
echo ================================================================
nslookup lethimdo.com
echo.

echo ================================================================
echo   CHECKING WWW SUBDOMAIN (www.lethimdo.com)
echo ================================================================
nslookup www.lethimdo.com
echo.

echo ================================================================
echo   CHECKING API SUBDOMAIN (api.lethimdo.com)
echo ================================================================
nslookup api.lethimdo.com
echo.

echo ================================================================
echo   CHECKING NAME SERVERS
echo ================================================================
nslookup -type=NS lethimdo.com
echo.

echo ================================================================
echo   EXPECTED CONFIGURATION
echo ================================================================
echo.
echo ✅ Frontend (lethimdo.com) should point to Netlify IP: 75.2.60.5
echo ✅ WWW should be CNAME to: [your-site].netlify.app
echo ✅ API (api.lethimdo.com) should be CNAME to: [your-app].onrender.com
echo.

echo ================================================================
echo   TESTING WEBSITE ACCESS
echo ================================================================
echo.
echo Opening lethimdo.com in browser to test...
start https://lethimdo.com

echo.
echo Opening api.lethimdo.com in browser to test...
start https://api.lethimdo.com/health

echo.
echo ================================================================
echo   DNS PROPAGATION CHECKER
echo ================================================================
echo.
echo Opening online DNS checker for global verification...
start https://dnschecker.org/#A/lethimdo.com
start https://dnschecker.org/#CNAME/api.lethimdo.com

echo.
echo ================================================================
echo   NEXT STEPS IF DOMAINS NOT WORKING
echo ================================================================
echo.
echo 1. If DNS shows wrong IP or not found:
echo    → Update DNS records at your domain registrar (Hostinger)
echo    → Use the guide in CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md
echo.
echo 2. If DNS is correct but site not loading:
echo    → Wait for full DNS propagation (up to 24-48 hours)
echo    → Clear browser cache and try again
echo.
echo 3. If HTTPS not working:
echo    → Wait additional 15-30 minutes after DNS propagation
echo    → Services automatically provision SSL certificates
echo.
echo 💰 Professional Benefits for Bangladesh Freelance Agency:
echo ✅ Custom domains increase client trust
echo ✅ Better for international business cards/marketing
echo ✅ Professional email setup possible (info@lethimdo.com)
echo ✅ SEO benefits for client acquisition
echo.
pause