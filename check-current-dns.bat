@echo off
echo ================================================================
echo   CURRENT DNS RECORDS CHECK
echo   Checking existing DNS records for lethimdo.com
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - DNS Troubleshooting
echo.

echo ================================================================
echo   CHECKING CURRENT TXT RECORDS
echo ================================================================
echo.
echo Checking TXT records for lethimdo.com...
nslookup -type=TXT lethimdo.com
echo.

echo Checking TXT records for api.lethimdo.com...
nslookup -type=TXT api.lethimdo.com
echo.

echo ================================================================
echo   CHECKING CURRENT A AND CNAME RECORDS
echo ================================================================
echo.
echo Checking A records for lethimdo.com...
nslookup lethimdo.com
echo.

echo Checking CNAME records for www.lethimdo.com...
nslookup www.lethimdo.com
echo.

echo Checking CNAME records for api.lethimdo.com...
nslookup api.lethimdo.com
echo.

echo ================================================================
echo   CHECKING NAME SERVERS
echo ================================================================
echo.
echo Checking name servers for lethimdo.com...
nslookup -type=NS lethimdo.com
echo.

echo ================================================================
echo   INTERPRETING RESULTS
echo ================================================================
echo.
echo Look for:
echo - Any existing TXT records that might conflict
echo - Whether api.lethimdo.com resolves (it shouldn't yet)
echo - Current name servers (should be Hostinger's)
echo.
echo If you see "can't find" errors for api.lethimdo.com, this is normal
echo until you add the DNS records.
echo.
echo For troubleshooting the missing TXT verification record:
echo 1. Check [TROUBLESHOOT-API-TXT-RECORD.md](TROUBLESHOOT-API-TXT-RECORD.md)
echo 2. Try refreshing Render.com dashboard
echo 3. Remove and re-add the custom domain
echo 4. Contact Render.com support if needed
echo.
pause