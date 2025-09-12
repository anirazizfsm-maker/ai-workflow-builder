@echo off
echo Monitoring Netlify deployment status for lethimdo...
echo This may take 2-5 minutes for changes to appear on the live site.
echo.
echo Press Ctrl+C to stop monitoring.
echo.

:loop
echo.
echo Checking deployment status at %date% %time%...
curl -s -o /dev/null -w "HTTP Status: %%{http_code}\n" https://lethimdo.netlify.app
timeout /t 30 /nobreak >nul
goto loop