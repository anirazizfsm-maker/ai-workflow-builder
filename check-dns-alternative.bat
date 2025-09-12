@echo off
echo ================================================================
echo   ALTERNATIVE DNS CHECK
echo   Using different DNS servers to check lethimdo.com
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - Alternative DNS Testing
echo.

echo ================================================================
echo   CHECKING WITH GOOGLE DNS (8.8.8.8)
echo ================================================================
echo.
nslookup -type=NS lethimdo.com 8.8.8.8
echo.

echo ================================================================
echo   CHECKING WITH CLOUDFLARE DNS (1.1.1.1)
echo ================================================================
echo.
nslookup -type=NS lethimdo.com 1.1.1.1
echo.

echo ================================================================
echo   CHECKING WITH OPENDNS (208.67.222.222)
echo ================================================================
echo.
nslookup -type=NS lethimdo.com 208.67.222.222
echo.

echo ================================================================
echo   DIRECT DOMAIN RESOLUTION TEST
echo ================================================================
echo.
echo Checking if lethimdo.com resolves to Netlify...
nslookup lethimdo.com 8.8.8.8
echo.

echo Checking www.lethimdo.com...
nslookup www.lethimdo.com 8.8.8.8
echo.

echo ================================================================
echo   INTERPRETING RESULTS
echo ================================================================
echo.
echo If you see timeouts with all DNS servers:
echo ❌ Your network might be blocking DNS queries
echo ❌ Your firewall/antivirus might be interfering
echo ❌ There might be local network issues
echo.
echo If you see results with some DNS servers but not others:
echo ⚠️  Some DNS servers might be temporarily unavailable
echo 🔄 Try again later or use a different network
echo.
echo If you see parking name servers:
echo ❌ Name server propagation is not complete
echo ⏰ Wait longer and check again
echo.
echo If you see Hostinger name servers:
echo ✅ Name server propagation is complete
echo 🔄 Proceed with DNS record configuration
echo.
echo 💡 TIPS:
echo 1. Try running this script from a different network
echo 2. Temporarily disable firewall/antivirus
echo 3. Check your internet connection
echo 4. Try again in 15-30 minutes
echo.
pause