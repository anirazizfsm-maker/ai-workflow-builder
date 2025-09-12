# PowerShell DNS Check Script for lethimdo.com
# This script uses PowerShell's Resolve-DnsName cmdlet which may work better than nslookup

Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  POWERSHELL DNS CHECK FOR LETHIMDO.COM" -ForegroundColor Cyan
Write-Host "  Using PowerShell's Resolve-DnsName cmdlet" -ForegroundColor Cyan
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🇧🇩 Bangladesh Freelance Agency - PowerShell DNS Testing" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host "  CHECKING NAME SERVERS FOR LETHIMDO.COM" -ForegroundColor Yellow
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host ""
    
    $result = Resolve-DnsName -Name lethimdo.com -Type NS -ErrorAction Stop
    Write-Host "✅ Name Server Query Successful:" -ForegroundColor Green
    $result | Format-Table Name, Type, NameTarget, PrimaryServer, ResponsiblePerson -AutoSize
    
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host "  CHECKING A RECORD FOR LETHIMDO.COM" -ForegroundColor Yellow
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host ""
    
    $aRecord = Resolve-DnsName -Name lethimdo.com -Type A -ErrorAction Stop
    Write-Host "✅ A Record Query Successful:" -ForegroundColor Green
    $aRecord | Format-Table Name, Type, IPAddress -AutoSize
    
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host "  INTERPRETING RESULTS" -ForegroundColor Yellow
    Write-Host "===============================================================" -ForegroundColor Yellow
    Write-Host ""
    
    # Check if we see Hostinger name servers
    $hostingerNS = $result | Where-Object { $_.NameTarget -like "*hostinger*" }
    $parkingNS = $result | Where-Object { $_.NameTarget -like "*parking*" }
    
    if ($hostingerNS) {
        Write-Host "✅ GREAT NEWS! Name servers have propagated to Hostinger:" -ForegroundColor Green
        $hostingerNS | ForEach-Object { Write-Host "   $($_.NameTarget)" -ForegroundColor Green }
        Write-Host ""
        Write-Host "🔄 You can now proceed with configuring DNS records in Hostinger" -ForegroundColor Cyan
        Write-Host "📋 See HOSTINGER-DNS-CONFIGURATION.md for detailed steps" -ForegroundColor Cyan
    }
    elseif ($parkingNS) {
        Write-Host "❌ Name servers are still pointing to parking servers:" -ForegroundColor Red
        $parkingNS | ForEach-Object { Write-Host "   $($_.NameTarget)" -ForegroundColor Red }
        Write-Host ""
        Write-Host "⏰ Name server propagation is still in progress" -ForegroundColor Yellow
        Write-Host "⏱️  Please wait 24-48 hours from when you made the change" -ForegroundColor Yellow
        Write-Host "📚 See DOMAIN-REGISTRAR-UPDATE-GUIDE.md for troubleshooting" -ForegroundColor Yellow
    }
    else {
        Write-Host "⚠️  Unexpected name server configuration detected:" -ForegroundColor Yellow
        $result | ForEach-Object { Write-Host "   $($_.NameTarget)" -ForegroundColor Yellow }
        Write-Host ""
        Write-Host "📋 Check your domain registrar settings" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "❌ Error occurred while checking DNS:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 TROUBLESHOOTING STEPS:" -ForegroundColor Yellow
    Write-Host "1. Check your internet connection" -ForegroundColor Yellow
    Write-Host "2. Try running this script as Administrator" -ForegroundColor Yellow
    Write-Host "3. Temporarily disable firewall/antivirus" -ForegroundColor Yellow
    Write-Host "4. Try from a different network" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 TIP: You can also check propagation online at https://dnschecker.org/#NS/lethimdo.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
#$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null