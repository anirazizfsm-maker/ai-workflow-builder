@echo off
echo ================================================================
echo   API SUBDOMAIN SETUP ASSISTANT
echo   Configure api.lethimdo.com for your Render.com backend
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - Professional API Setup
echo.

echo This script will guide you through setting up your API subdomain.
echo.

echo ================================================================
echo   STEP 1: GET RENDER.COM CUSTOM DOMAIN DETAILS
echo ================================================================
echo.
echo 1. Go to https://dashboard.render.com
echo 2. Click on your 'lethimdo-backend' service
echo 3. Navigate to 'Settings' tab
echo 4. Scroll to 'Custom Domains' section
echo 5. Click 'Add Custom Domain'
echo 6. Enter: api.lethimdo.com
echo 7. Click 'Add Domain'
echo.
echo After adding the domain, Render.com will show you:
echo - A TXT record for DNS verification
echo - A CNAME record for the domain
echo.
pause

echo ================================================================
echo   STEP 2: ADD DNS RECORDS IN HOSTINGER
echo ================================================================
echo.
echo 1. Login to Hostinger: https://hpanel.hostinger.com
echo 2. Go to 'Domains' -^> 'lethimdo.com' -^> 'Manage' -^> 'DNS Zone'
echo.
echo 2. Add the TXT verification record provided by Render.com:
echo    Type: TXT
echo    Name: _render-api.lethimdo.com
echo    Value: [use the value from Render.com]
echo    TTL: 3600
echo.
echo 3. Add the CNAME record:
echo    Type: CNAME
echo    Name: api.lethimdo.com
echo    Value: [your-app-name].onrender.com
echo    TTL: 3600
echo.
echo 4. Click 'Save' for both records
echo.
pause

echo ================================================================
echo   STEP 3: VERIFY CONFIGURATION
echo ================================================================
echo.
echo 1. Return to Render.com dashboard
echo 2. Go to your service -^> Settings -^> Custom Domains
echo 3. Look for status indicators:
echo    - Green checkmark for 'Verified'
echo    - Green lock icon for SSL certificate
echo.
echo 4. Test your API endpoint:
echo    https://api.lethimdo.com/health
echo.
echo 5. Run our domain checker:
echo    .\check-custom-domain.bat
echo.
pause

echo ================================================================
echo   STEP 4: UPDATE FRONTEND CONFIGURATION
echo ================================================================
echo.
echo 1. Update your frontend environment variables:
echo    In frontend/.env file, change:
echo    VITE_API_BASE_URL=https://api.lethimdo.com
echo.
echo 2. Redeploy your frontend to Netlify:
echo    cd frontend
echo    npm run build
echo    # Then deploy to Netlify
echo.
echo 3. Test the complete frontend-backend integration
echo.
pause

echo ================================================================
echo   SUCCESS INDICATORS
echo ================================================================
echo.
echo You'll know everything is working when:
echo ✅ Render.com shows domain as 'Active'
echo ✅ Green lock icon for SSL certificate
echo ✅ https://api.lethimdo.com/health returns JSON
echo ✅ Frontend successfully communicates with API
echo ✅ No SSL or mixed content warnings
echo.
echo 💰 Professional Benefits for Bangladesh Freelance Agency:
echo ✅ Clean, memorable API URLs
echo ✅ Professional appearance for demos
echo ✅ Better documentation and client communication
echo ✅ Industry-standard API practices
echo.
echo For detailed instructions, see:
echo - [RENDER-API-SUBDOMAIN-GUIDE.md](RENDER-API-SUBDOMAIN-GUIDE.md)
echo - [CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md](CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md)
echo.
echo Press any key to exit...
pause >nul