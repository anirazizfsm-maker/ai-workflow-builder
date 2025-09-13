@echo off
title Verify WWW Configuration

echo ====================================================
echo    Verify WWW Subdomain Configuration
echo ====================================================
echo.

echo 1. Checking DNS records for www.lethimdo.com...
echo.
nslookup www.lethimdo.com
echo.

echo 2. Checking if WWW domain is accessible...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://www.lethimdo.com' -TimeoutSec 10; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Success: WWW domain is accessible' } catch { Write-Host 'Error: WWW domain is not accessible' }"
echo.

echo 3. Checking root domain...
echo.
nslookup lethimdo.com
echo.

echo 4. Checking if root domain is accessible...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://lethimdo.com' -TimeoutSec 10; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Success: Root domain is accessible' } catch { Write-Host 'Error: Root domain is not accessible' }"
echo.

echo 5. Opening both domains in browser for manual verification...
echo.
start "" "https://www.lethimdo.com"
start "" "https://lethimdo.com"
echo.

echo ====================================================
echo    Configuration Status
echo ====================================================
echo.
echo If both domains loaded successfully in your browser:
echo - ✅ Your WWW subdomain configuration is working
echo - ✅ Your root domain is accessible
echo - ✅ SSL certificates are properly configured
echo.
echo If you see errors:
echo - ❌ Wait longer for DNS propagation (up to 4 hours)
echo - ❌ Double-check your DNS records in Cloudflare
echo - ❌ Ensure Proxy status is set to "Proxied" (orange cloud)
echo.
echo For troubleshooting, see:
echo - FIX_WWW_SUBDOMAIN_CONFIGURATION.md
echo - WWW_SUBDOMAIN_CONFIGURATION_CHECKLIST.md
echo.
echo Press any key to exit...
pause >nul