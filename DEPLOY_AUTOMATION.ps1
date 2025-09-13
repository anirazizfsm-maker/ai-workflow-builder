# Lethimdo Deployment Automation Helper

Write-Host "====================================================" -ForegroundColor Green
Write-Host "   Lethimdo - Deployment Automation Helper" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

function Show-Menu {
    Write-Host "Please select your deployment method:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Prepare for GitHub Integration (Recommended)" -ForegroundColor Cyan
    Write-Host "2. Manual Deployment using Wrangler" -ForegroundColor Cyan
    Write-Host "3. Create Deployment Package" -ForegroundColor Cyan
    Write-Host "4. View Deployment Instructions" -ForegroundColor Cyan
    Write-Host "5. Exit" -ForegroundColor Cyan
    Write-Host ""
}

function GitHub-Integration {
    Write-Host ""
    Write-Host "Preparing for GitHub Integration..." -ForegroundColor Yellow
    Write-Host ""

    Write-Host "1. Committing changes to local repository..." -ForegroundColor Yellow
    git add .
    git commit -m "Add Cloudflare deployment configuration and files"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to commit changes" -ForegroundColor Red
        Pause
        return
    }

    Write-Host ""
    Write-Host "2. Pushing changes to GitHub..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to push changes to GitHub" -ForegroundColor Red
        Write-Host "Please check your internet connection and GitHub credentials" -ForegroundColor Red
        Pause
        return
    }

    Write-Host ""
    Write-Host "Successfully pushed changes to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://dash.cloudflare.com/" -ForegroundColor Cyan
    Write-Host "2. Navigate to Pages > Create a project" -ForegroundColor Cyan
    Write-Host "3. Connect to your GitHub repository" -ForegroundColor Cyan
    Write-Host "4. Use these build settings:" -ForegroundColor Cyan
    Write-Host "   - Build command: node ../build-frontend.cjs" -ForegroundColor Cyan
    Write-Host "   - Build output directory: frontend/dist" -ForegroundColor Cyan
    Write-Host "5. Add environment variables:" -ForegroundColor Cyan
    Write-Host "   - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com" -ForegroundColor Cyan
    Write-Host "   - VITE_APP_NAME=Lethimdo" -ForegroundColor Cyan
    Write-Host "6. Click `"Save and Deploy`"" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "For detailed instructions, see AUTOMATED_DEPLOYMENT_HELPER.md" -ForegroundColor Yellow
    Write-Host ""
    Pause
}

function Manual-Deployment {
    Write-Host ""
    Write-Host "Manual Deployment using Wrangler" -ForegroundColor Yellow
    Write-Host ""

    Write-Host "1. Logging in to Cloudflare..." -ForegroundColor Yellow
    Write-Host "Please complete the login process in your browser" -ForegroundColor Yellow
    wrangler login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to log in to Cloudflare" -ForegroundColor Red
        Write-Host "If the browser didn't open, copy the URL from the terminal and open it manually" -ForegroundColor Red
        Pause
        return
    }

    Write-Host ""
    Write-Host "2. Building the application..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed" -ForegroundColor Red
        Set-Location -Path ".."
        Pause
        return
    }

    Write-Host ""
    Write-Host "3. Deploying to Cloudflare Pages..." -ForegroundColor Yellow
    Set-Location -Path ".."
    wrangler pages deploy frontend/dist
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Deployment failed" -ForegroundColor Red
        Pause
        return
    }

    Write-Host ""
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Pause
}

function Create-Package {
    Write-Host ""
    Write-Host "Creating Deployment Package..." -ForegroundColor Yellow
    Write-Host ""

    Write-Host "1. Building the application..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed" -ForegroundColor Red
        Set-Location -Path ".."
        Pause
        return
    }

    Write-Host ""
    Write-Host "2. Creating ZIP package..." -ForegroundColor Yellow
    Set-Location -Path ".."
    Compress-Archive -Path frontend/dist/* -DestinationPath lethimdo-deployment-package.zip -Force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to create ZIP package" -ForegroundColor Red
        Pause
        return
    }

    Write-Host ""
    Write-Host "Deployment package created: lethimdo-deployment-package.zip" -ForegroundColor Green
    Write-Host ""
    Pause
}

function View-Instructions {
    Write-Host ""
    Write-Host "Opening deployment instructions..." -ForegroundColor Yellow
    Start-Process "AUTOMATED_DEPLOYMENT_HELPER.md"
    Write-Host ""
    Pause
}

do {
    Show-Menu
    $choice = Read-Host "Enter your choice (1-5)"

    switch ($choice) {
        1 { GitHub-Integration }
        2 { Manual-Deployment }
        3 { Create-Package }
        4 { View-Instructions }
        5 { 
            Write-Host ""
            Write-Host "Thank you for using Lethimdo Deployment Automation!" -ForegroundColor Green
            Write-Host ""
            exit 0
        }
        default { 
            Write-Host "Invalid choice. Please try again." -ForegroundColor Red
            Write-Host ""
        }
    }
} while ($true)