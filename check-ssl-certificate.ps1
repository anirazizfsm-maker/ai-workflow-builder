# PowerShell script to check SSL certificate details for api.lethimdo.com

Write-Host "==============================================================="
Write-Host "  SSL CERTIFICATE DETAILED CHECK FOR API.LETHIMDO.COM"
Write-Host "==============================================================="
Write-Host ""

try {
    # Create HTTP request
    $request = [System.Net.HttpWebRequest]::Create("https://api.lethimdo.com")
    $request.Timeout = 10000  # 10 seconds timeout
    
    # Get response
    $response = $request.GetResponse()
    
    # Get certificate
    $cert = $request.ServicePoint.Certificate
    
    if ($cert -ne $null) {
        Write-Host "✅ Certificate Found:" -ForegroundColor Green
        Write-Host "Subject: $($cert.Subject)"
        Write-Host "Issuer: $($cert.Issuer)"
        Write-Host "Valid From: $($cert.GetEffectiveDateString())"
        Write-Host "Valid To: $($cert.GetExpirationDateString())"
        Write-Host "Serial Number: $($cert.GetSerialNumberString())"
        Write-Host "Thumbprint: $($cert.GetCertHashString())"
    } else {
        Write-Host "⚠️  No certificate information available" -ForegroundColor Yellow
    }
    
    # Close response
    $response.Close()
    
} catch [System.Net.WebException] {
    Write-Host "❌ Web Exception:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host ""
    Write-Host "This might indicate SSL/TLS issues with the certificate." -ForegroundColor Yellow
} catch {
    Write-Host "❌ Error checking certificate:" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host ""
Write-Host "==============================================================="
Write-Host "  CERTIFICATE CHECK COMPLETE"
Write-Host "==============================================================="
Write-Host ""
Write-Host "If you see SSL/TLS errors, see CERTIFICATE-ISSUANCE-TROUBLESHOOT.md" -ForegroundColor Yellow