@echo off
echo ================================================================
echo   NAME SERVER CHECK
echo   Checking if lethimdo.com is using Hostinger name servers
echo ================================================================
echo.

echo 🇧🇩 Bangladesh Freelance Agency - Name Server Verification
echo.

echo ================================================================
echo   CURRENT NAME SERVERS
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
echo - Hostinger name servers (ns1.hostinger.com, etc.) = CORRECT
echo - Parking name servers (dns-parking.com) = NEEDS UPDATE
echo - Other registrar name servers = NEEDS UPDATE
echo.

echo ================================================================
echo   NEXT STEPS BASED ON RESULTS
echo ================================================================
echo.
echo IF YOU SEE HOSTINGER NAME SERVERS:
echo ✅ Your domain is correctly configured
echo 🔄 Proceed with adding DNS records in Hostinger
echo.

echo IF YOU SEE PARKING OR OTHER NAME SERVERS:
echo ❌ Your domain is not using Hostinger DNS
echo 🛠️ Update name servers at your domain registrar:
echo    1. Login to domain registrar (where you bought lethimdo.com)
echo    2. Find "Nameservers" or "DNS Management"
echo    3. Replace with Hostinger's name servers:
echo       ns1.hostinger.com
echo       ns2.hostinger.com
echo       ns3.hostinger.com
echo       ns4.hostinger.com
echo    4. Wait 24-48 hours for propagation
echo.

echo IF YOU SEE THE MESSAGE "These nameservers are outdated...":
echo ❌ Hostinger has detected you're using parking name servers
echo 🛠️ Follow the same steps above to update to Hostinger's nameservers
echo.

echo For immediate solutions, see:
echo - [IMMEDIATE-DNS-FIX-GUIDE.md](IMMEDIATE-DNS-FIX-GUIDE.md)
echo.

echo For detailed instructions, see:
echo - [TROUBLESHOOT-API-TXT-RECORD-UPDATED.md](TROUBLESHOOT-API-TXT-RECORD-UPDATED.md)
echo - [HOSTINGER-DNS-CONFIGURATION.md](HOSTINGER-DNS-CONFIGURATION.md)
echo - [DOMAIN-REGISTRAR-UPDATE-GUIDE.md](DOMAIN-REGISTRAR-UPDATE-GUIDE.md)
echo.
pause