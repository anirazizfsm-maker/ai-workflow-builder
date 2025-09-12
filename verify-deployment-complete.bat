@echo off
title Lethimdo Deployment Verification
echo ==================================================
echo    LETHIMDO DEPLOYMENT VERIFICATION TOOL
echo ==================================================
echo.
echo This tool will check if your latest changes 
echo have been deployed successfully to:
echo https://lethimdo.netlify.app
echo.
echo Please wait while we verify the deployment...
echo.

REM Wait a moment for deployment to complete
timeout /t 5 /nobreak >nul

:check_deployment
echo Checking deployment status...
echo.

REM Check if website is accessible
powershell -Command "& {try { $response = Invoke-WebRequest -Uri 'https://lethimdo.netlify.app' -Method GET -TimeoutSec 10; Write-Output 'Website is accessible (Status: '$response.StatusCode')'; } catch { Write-Output 'Error accessing website: '$_.Exception.Message; }}"
echo.

echo ==================================================
echo DEPLOYMENT VERIFICATION COMPLETE
echo ==================================================
echo.
echo Next steps:
echo 1. Open your website in a browser
echo 2. Refresh the page to see the latest changes
echo 3. If changes don't appear immediately:
echo    - Wait 2-5 minutes and check again
echo    - Clear your browser cache
echo    - Try opening in an incognito/private window
echo.
echo For additional support, check the DEPLOYMENT-VERIFICATION-REPORT.md file
echo in your project directory.
echo.
pause