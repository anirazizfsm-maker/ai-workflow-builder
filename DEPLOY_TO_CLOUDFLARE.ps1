# Cloudflare Pages Deployment Helper for Lethimdo

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   Lethimdo - Cloudflare Pages Deployment Helper" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

Write-Host "1. Checking if frontend builds correctly..." -ForegroundColor Yellow
Write-Host ""

Set-Location -Path "frontend"

Write-Host "Building frontend application..." -ForegroundColor Yellow
Write-Host ""

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host ""
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""

Set-Location -Path ".."
Write-Host "2. Checking for required files..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "wrangler.json") {
    Write-Host "[OK] wrangler.json found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] wrangler.json not found" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

if (Test-Path "build-frontend.cjs") {
    Write-Host "[OK] build-frontend.cjs found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] build-frontend.cjs not found" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

if (Test-Path "build-frontend.sh") {
    Write-Host "[OK] build-frontend.sh found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] build-frontend.sh not found" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

if (Test-Path "frontend/dist") {
    Write-Host "[OK] dist directory found" -ForegroundColor Green
} else {
    Write-Host "[WARNING] dist directory not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. Deployment Instructions:" -ForegroundColor Yellow
Write-Host ""
Write-Host "To deploy to Cloudflare Pages:" -ForegroundColor Cyan
Write-Host "1. Go to https://dash.cloudflare.com/" -ForegroundColor Cyan
Write-Host "2. Navigate to Pages > Create a project" -ForegroundColor Cyan
Write-Host "3. Connect to your Git repository" -ForegroundColor Cyan
Write-Host "4. Use these build settings:" -ForegroundColor Cyan
Write-Host "   - Build command: bash build-frontend.sh" -ForegroundColor Cyan
Write-Host "   - Build output directory: frontend/dist" -ForegroundColor Cyan
Write-Host "5. Add environment variables:" -ForegroundColor Cyan
Write-Host "   - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com" -ForegroundColor Cyan
Write-Host "   - VITE_APP_NAME=Lethimdo" -ForegroundColor Cyan
Write-Host "6. Click `"Save and Deploy`"" -ForegroundColor Cyan
Write-Host ""

Write-Host "For detailed instructions, see CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

Write-Host "Press any key to open the deployment guide..." -ForegroundColor Yellow
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

if (Test-Path "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md") {
    Start-Process "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md"
}

Write-Host ""
Write-Host "Deployment preparation completed!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit..."