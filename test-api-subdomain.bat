@echo off
echo ================================================================
echo   API SUBDOMAIN TEST
echo   Verify api.lethimdo.com configuration
echo ================================================================
echo.

echo 🇧🇩 Testing API subdomain for your Bangladesh freelance agency
echo.

echo ================================================================
echo   TESTING API SUBDOMAIN (api.lethimdo.com)
echo ================================================================
echo.
echo Testing if api.lethimdo.com resolves...
nslookup api.lethimdo.com
echo.

echo ================================================================
echo   TESTING API ENDPOINTS
echo ================================================================
echo.
echo Testing health endpoint...
powershell -Command "try { Invoke-WebRequest -Uri 'https://api.lethimdo.com/health' -UseBasicParsing -TimeoutSec 10 | Select-Object -ExpandProperty StatusCode } catch { Write-Host 'Failed to connect - API subdomain may not be configured yet' }"
echo.

echo Testing basic API info...
powershell -Command "try { Invoke-WebRequest -Uri 'https://api.lethimdo.com/' -UseBasicParsing -TimeoutSec 10 | Select-Object -ExpandProperty StatusCode } catch { Write-Host 'Failed to connect - API subdomain may not be configured yet' }"
echo.

echo Testing integrations endpoint...
powershell -Command "try { Invoke-WebRequest -Uri 'https://api.lethimdo.com/api/integrations' -UseBasicParsing -TimeoutSec 10 | Select-Object -ExpandProperty StatusCode } catch { Write-Host 'Failed to connect - API subdomain may not be configured yet' }"
echo.

echo ================================================================
echo   CONFIGURATION STATUS
echo ================================================================
echo.
echo If all tests show status code 200, your API subdomain is working!
echo.
echo If tests fail, check:
echo 1. DNS records in Hostinger
echo 2. Domain verification in Render.com
echo 3. SSL certificate provisioning (may take 5-30 minutes)
echo.
echo For detailed setup instructions, see:
echo - [RENDER-API-SUBDOMAIN-GUIDE.md](RENDER-API-SUBDOMAIN-GUIDE.md)
echo - [CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md](CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md)
echo.
pause