@echo off
title Check Current DNS Configuration

echo ====================================================
echo    Check Current DNS Configuration for lethimdo.com
echo ====================================================
echo.

echo 1. Checking DNS records for lethimdo.com...
echo.
nslookup lethimdo.com
echo.

echo 2. Checking DNS records for www.lethimdo.com...
echo.
nslookup www.lethimdo.com
echo.

echo 3. Checking current nameservers...
echo.
nslookup -type=NS lethimdo.com
echo.

echo 4. Opening Cloudflare Dashboard...
echo.
start "" "https://dash.cloudflare.com"

echo 5. Opening Hostinger Dashboard...
echo.
start "" "https://hpanel.hostinger.com"

echo ====================================================
echo    Next Steps:
echo ====================================================
echo.
echo 1. Check the nslookup results above
echo 2. Verify nameservers point to Cloudflare:
echo    - opal.ns.cloudflare.com
echo    - quincy.ns.cloudflare.com
echo.
echo 3. In Cloudflare Dashboard:
echo    - Go to DNS settings
echo    - Verify CNAME record for www points to your Cloudflare Pages domain
echo.
echo 4. If you see "Domain not pointing to Hostinger" in Hostinger:
echo    - This is normal when using Cloudflare
echo    - You can safely ignore this message
echo.

pause