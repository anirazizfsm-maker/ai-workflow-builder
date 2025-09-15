@echo off
title Deploy Lethimdo to Cloudflare Pages

echo ====================================================
echo    DEPLOY LETHIMDO TO CLOUDFLARE PAGES
echo ====================================================
echo.

echo 1. Building frontend application...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Frontend built successfully!
echo.

echo ====================================================
echo    CLOUDFLARE PAGES DEPLOYMENT INSTRUCTIONS
echo ====================================================
echo.

echo To deploy to Cloudflare Pages:
echo.

echo 1. Go to https://dash.cloudflare.com/
echo 2. Sign in to your Cloudflare account
echo 3. Click on "Pages" in the left sidebar
echo 4. Click "Create a project"
echo 5. Click "Connect to Git"
echo 6. Connect to GitHub and select your repository
echo 7. Configure build settings:
echo    - Framework preset: None
echo    - Build command: node ../build-frontend.cjs
echo    - Build output directory: frontend/dist
echo    - Root directory: (leave empty)
echo 8. Add environment variables:
echo    - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME=Lethimdo
echo 9. Click "Save and Deploy"
echo.

echo ====================================================
echo    CUSTOM DOMAIN SETUP (www.lethimdo.com)
echo ====================================================
echo.

echo After deployment is complete:
echo 1. In Cloudflare Pages dashboard, go to your project
echo 2. Click on "Custom domains"
echo 3. Click "Add custom domain"
echo 4. Enter: www.lethimdo.com
echo 5. Follow the DNS configuration instructions
echo 6. Update your DNS records at Hostinger:
echo    - Add CNAME record for www pointing to your Cloudflare Pages domain
echo.

echo Press any key to open Cloudflare dashboard...
pause >nul
start https://dash.cloudflare.com/

echo.
echo 🎉 Deployment instructions completed!
echo.
pause