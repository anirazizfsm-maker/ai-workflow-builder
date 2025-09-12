@echo off
echo ================================================================
echo   API SUBDOMAIN SETUP VERIFICATION
echo   Check if api.lethimdo.com is properly configured
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - Professional API Verification
echo.

echo ================================================================
echo   STEP 1: CHECKING DNS RESOLUTION
echo ================================================================
echo.
echo Testing if api.lethimdo.com resolves to Render.com...
nslookup api.lethimdo.com
echo.

echo ================================================================
echo   STEP 2: TESTING API ENDPOINTS
echo ================================================================
echo.
echo Testing health endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://api.lethimdo.com/health' -UseBasicParsing -TimeoutSec 15; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host '❌ Failed to connect - Error:' $_.Exception.Message }"
echo.

echo Testing basic API info...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://api.lethimdo.com/' -UseBasicParsing -TimeoutSec 15; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host '❌ Failed to connect - Error:' $_.Exception.Message }"
echo.

echo Testing integrations endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'https://api.lethimdo.com/api/integrations' -UseBasicParsing -TimeoutSec 15; Write-Host 'Status Code:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host '❌ Failed to connect - Error:' $_.Exception.Message }"
echo.

echo ================================================================
echo   STEP 3: CHECKING SSL CERTIFICATE
echo ================================================================
echo.
echo Checking SSL certificate details...
powershell -Command "try { $req = [System.Net.HttpWebRequest]::Create('https://api.lethimdo.com/health'); $req.GetResponse() | Out-Null } catch { if ($_.Exception.InnerException -ne $null) { Write-Host 'SSL Details:' $_.Exception.InnerException.Message } else { Write-Host 'SSL Details:' $_.Exception.Message } }"
echo.

echo ================================================================
echo   VERIFICATION RESULTS
echo ================================================================
echo.
echo If all tests show status code 200 and proper JSON responses:
echo ✅ Your API subdomain is properly configured!
echo.
echo If tests fail, possible issues:
echo ❌ DNS not propagated yet (wait 5-60 minutes)
echo ❌ DNS records not configured correctly
echo ❌ SSL certificate not provisioned yet
echo ❌ Typo in domain name
echo.
echo For troubleshooting, see:
echo - [COMPLETE-API-SUBDOMAIN-SETUP-GUIDE.md](COMPLETE-API-SUBDOMAIN-SETUP-GUIDE.md)
echo - [RENDER-API-SUBDOMAIN-GUIDE.md](RENDER-API-SUBDOMAIN-GUIDE.md)
echo.
echo Additional verification tools:
echo - https://dnschecker.org/#CNAME/api.lethimdo.com
echo - https://www.ssllabs.com/ssltest/analyze.html?d=api.lethimdo.com
echo.
pause