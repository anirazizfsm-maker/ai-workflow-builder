# Lethimdo Cloudflare Deployment Assistant

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   LETHIMDO CLOUDFLARE DEPLOYMENT ASSISTANT" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will help you deploy your Lethimdo application to Cloudflare Pages." -ForegroundColor Yellow
Write-Host "Since you're already logged into Cloudflare in Chrome, this will make the process easier." -ForegroundColor Yellow
Write-Host ""

Write-Host "1. First, let's make sure your repository is up to date..." -ForegroundColor Yellow
Write-Host ""

# Add all changes and commit
git add .
git commit -m "Pre-deployment update"
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to update repository. Please check your Git configuration." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host ""
Write-Host "2. Building the frontend application..." -ForegroundColor Yellow
Write-Host ""

# Build the frontend
Set-Location -Path "frontend"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Failed to build the frontend application." -ForegroundColor Red
    Write-Host "Please check for any errors in your code." -ForegroundColor Red
    Write-Host ""
    Set-Location -Path ".."
    Read-Host "Press Enter to exit..."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "3. Opening Cloudflare Dashboard in your default browser..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please log in to Cloudflare if you're not already logged in." -ForegroundColor Yellow
Write-Host ""

# Wait a few seconds
Start-Sleep -Seconds 3

# Open Cloudflare dashboard
Start-Process "https://dash.cloudflare.com/"

Write-Host ""
Write-Host "4. Creating deployment package..." -ForegroundColor Yellow
Write-Host ""

# Create deployment package
Compress-Archive -Path frontend/dist/* -DestinationPath lethimdo-deployment-package.zip -Force

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT PREPARATION COMPLETE" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS (Please follow these instructions):" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. In your browser, navigate to Cloudflare Dashboard" -ForegroundColor Cyan
Write-Host "2. Click on `"Pages`" in the left sidebar" -ForegroundColor Cyan
Write-Host "3. Click `"Create a project`" or select your existing project" -ForegroundColor Cyan
Write-Host "4. Connect to your GitHub repository if not already connected" -ForegroundColor Cyan
Write-Host "5. Configure build settings:" -ForegroundColor Cyan
Write-Host "   - Build command: node ../build-frontend.cjs" -ForegroundColor Cyan
Write-Host "   - Build output directory: frontend/dist" -ForegroundColor Cyan
Write-Host "   - Root directory: (leave empty)" -ForegroundColor Cyan
Write-Host "6. Add environment variables:" -ForegroundColor Cyan
Write-Host "   - VITE_API_BASE_URL = https://lethimdo-backend.onrender.com" -ForegroundColor Cyan
Write-Host "   - VITE_APP_NAME = Lethimdo" -ForegroundColor Cyan
Write-Host "7. Click `"Save and Deploy`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your deployment package is ready at: lethimdo-deployment-package.zip" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue..."

Write-Host ""
Write-Host "Opening GitHub repository page..." -ForegroundColor Yellow
Start-Process "https://github.com/anirazizfsm-maker/ai-workflow-builder"

Write-Host "Opening Cloudflare Pages documentation..." -ForegroundColor Yellow
Start-Process "https://developers.cloudflare.com/pages/"

Write-Host ""
Write-Host "Deployment preparation completed!" -ForegroundColor Green
Write-Host "Please follow the steps above to complete your deployment." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit..."