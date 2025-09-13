@echo off
title Trigger Cloudflare Pages Deployment

echo ====================================================
echo    Lethimdo - Trigger Cloudflare Pages Deployment
echo ====================================================
echo.

echo This script will help you trigger a new deployment to Cloudflare Pages.
echo.

echo 1. Opening Cloudflare Dashboard...
echo.
start "" "https://dash.cloudflare.com/"

echo 2. Opening deployment guide...
echo.
if exist "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md" (
    start "" "CLOUDFLARE_DEPLOYMENT_TRIGGER_GUIDE.md"
) else (
    echo WARNING: Deployment guide not found!
    echo.
)

echo 3. Showing repository status...
echo.
cd c:\Users\user\lethimdo
git status
echo.

echo 4. Showing recent commits...
echo.
git log --oneline -5
echo.

echo Instructions:
echo 1. Go to Cloudflare Dashboard (opened in browser)
echo 2. Navigate to Pages ^> Your Project ^> Deployments
echo 3. Click "Create deployment"
echo 4. Follow the guide for build settings
echo.
echo OR
echo.
echo Make a small change and push to trigger deployment:
echo git add .
echo git commit -m "Trigger deployment"
echo git push origin main
echo.

pause