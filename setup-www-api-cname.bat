@echo off
echo ================================================================
echo   SETUP CNAME RECORD FOR WWW.API.LETHIMDO.COM
echo ================================================================
echo.
echo This script will guide you through setting up a CNAME record for
echo www.api.lethimdo.com that points to lethimdo-backend.onrender.com
echo.
echo PREREQUISITES:
echo 1. Access to your Hostinger account
echo 2. Domain management permissions for lethimdo.com
echo.
pause
echo.
echo STEP 1: LOGIN TO HOSTINGER
echo ==========================
echo 1. Go to https://hpanel.hostinger.com
echo 2. Login with your credentials
echo.
echo STEP 2: NAVIGATE TO DNS ZONE EDITOR
echo ====================================
echo 1. Select your domain (lethimdo.com)
echo 2. Click on "Manage"
echo 3. Find and click "DNS Zone" or "DNS Records"
echo.
pause
echo.
echo STEP 3: ADD NEW CNAME RECORD
echo ===========================
echo Create a new CNAME record with the following details:
echo.
echo Type: CNAME
echo Name/Host: www.api
echo Value/Points to: lethimdo-backend.onrender.com
echo TTL: 3600 (1 hour) or Auto
echo.
echo Click "Add Record" or "Save Changes" to apply the new DNS record.
echo.
pause
echo.
echo STEP 4: CONFIGURE RENDER.COM
echo ==========================
echo 1. Go to https://dashboard.render.com
echo 2. Select your lethimdo-backend service
echo 3. Go to "Settings" ^> "Custom Domains"
echo 4. Add "www.api.lethimdo.com" as a new custom domain
echo 5. Follow the verification process
echo.
pause
echo.
echo STEP 5: VERIFICATION (AFTER DNS PROPAGATION)
echo ============================================
echo DNS changes can take 5-48 hours to propagate globally.
echo.
echo Once propagation is complete, test with:
echo.
echo curl https://www.api.lethimdo.com/health
echo.
echo You should see the same response as:
echo curl https://api.lethimdo.com/health
echo.
echo For detailed instructions, see:
echo ADD-WWW-API-CNAME-RECORD.md
echo.
echo SETUP COMPLETE!
echo ================
echo.
pause