@echo off
echo ================================================================
echo   SSL CERTIFICATE CHECK FOR API.LETHIMDO.COM
echo ================================================================
echo.
echo This script will check the SSL certificate status for your API endpoint.
echo.

echo [1/3] Testing HTTPS connectivity...
echo.
powershell "Invoke-WebRequest -Uri https://api.lethimdo.com -Method HEAD | Select-Object StatusCode, StatusDescription"
echo.

echo [2/3] Checking certificate details...
echo.
powershell "try { $cert = [System.Net.HttpWebRequest]::Create('https://api.lethimdo.com').GetResponse().GetResponseStream().Socket.Certificate; Write-Host 'Certificate Subject:' $cert.Subject; Write-Host 'Certificate Issuer:' $cert.Issuer; Write-Host 'Valid From:' $cert.GetEffectiveDateString(); Write-Host 'Valid To:' $cert.GetExpirationDateString(); } catch { Write-Host 'Certificate information not available or connection failed' }"
echo.

echo [3/3] Testing with curl (if available)...
echo.
curl -I https://api.lethimdo.com 2>nul | findstr "HTTP"
if %errorlevel% neq 0 (
    echo curl not available or connection failed
)
echo.

echo ================================================================
echo   CERTIFICATE CHECK COMPLETE
echo ================================================================
echo.
echo If you see connection errors, it indicates certificate issues.
echo For troubleshooting, see CERTIFICATE-ISSUANCE-TROUBLESHOOT.md
echo.
pause