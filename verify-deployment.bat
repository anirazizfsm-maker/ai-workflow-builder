@echo off
echo ================================================================
echo   LETHIMDO DEPLOYMENT VERIFICATION SCRIPT
echo ================================================================
echo.
echo This script will verify that all components of your Lethimdo
echo platform are working correctly.
echo.

echo [1/5] Testing Frontend Accessibility...
echo.
powershell "Invoke-WebRequest -Uri https://lethimdo.netlify.app -Method HEAD | Select-Object StatusCode, StatusDescription"
echo.

echo [2/5] Testing API Health Endpoint...
echo.
powershell "Invoke-WebRequest -Uri https://api.lethimdo.com/health -Method GET | Select-Object StatusCode, StatusDescription"
echo.

echo [3/5] Testing API Base Endpoint...
echo.
powershell "Invoke-WebRequest -Uri https://api.lethimdo.com/ -Method GET | Select-Object StatusCode, StatusDescription"
echo.

echo [4/5] Testing WWW.API Endpoint (if configured)...
echo.
powershell "Invoke-WebRequest -Uri https://www.api.lethimdo.com/health -Method GET | Select-Object StatusCode, StatusDescription" 2>nul || echo "www.api.lethimdo.com not configured or not propagated yet"
echo.

echo [5/5] Running Node.js Connection Test...
echo.
node test-api-connection.js
echo.

echo ================================================================
echo   DEPLOYMENT VERIFICATION COMPLETE
echo ================================================================
echo.
echo If all tests show status 200 OK, your deployment is working correctly.
echo For detailed information, check DEPLOYMENT-VERIFICATION-REPORT.md
echo.
pause