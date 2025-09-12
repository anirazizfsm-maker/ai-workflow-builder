@echo off
echo ================================================================
echo   OPENING DEPLOYED APPLICATIONS
echo ================================================================
echo.
echo Opening Lethimdo Frontend: https://lethimdo.netlify.app
start https://lethimdo.netlify.app
echo.
echo Opening Lethimdo Backend API: https://api.lethimdo.com
start https://api.lethimdo.com
echo.
echo Opening Lethimdo Backend API Health Endpoint: https://api.lethimdo.com/health
start https://api.lethimdo.com/health
echo.
echo Applications opened in your default browser.
echo.
pause