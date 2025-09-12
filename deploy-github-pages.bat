@echo off
echo ================================================================
echo   GITHUB PAGES DEPLOYMENT FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 GITHUB PAGES: SIMPLEST FREE HOSTING
echo ✅ 100%% FREE - No billing required
echo ✅ Already have GitHub repository
echo ✅ Professional github.io domain
echo ✅ Perfect for portfolio showcase
echo.

echo Current build status:
cd frontend
if exist "dist" (
    echo ✅ Build folder exists
) else (
    echo ❌ Build folder not found - building now...
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ Build failed! Check for errors above.
        pause
        exit /b 1
    )
)

echo.
echo ================================================================
echo   GITHUB PAGES SETUP OPTIONS
echo ================================================================
echo.

echo Choose your deployment method:
echo [1] GitHub Actions (Automatic - Recommended)
echo [2] Manual gh-pages branch
echo [3] Repository Settings (Manual)
echo.

set /p CHOICE="Enter your choice (1/2/3): "

if "%CHOICE%"=="1" goto GITHUB_ACTIONS
if "%CHOICE%"=="2" goto GH_PAGES
if "%CHOICE%"=="3" goto MANUAL_SETTINGS

:GITHUB_ACTIONS
echo.
echo ================================================================
echo   GITHUB ACTIONS DEPLOYMENT
echo ================================================================
echo.

echo Creating GitHub Actions workflow...
cd ..
mkdir ".github\workflows" 2>nul

echo Creating deploy.yml workflow file...
(
echo name: Deploy to GitHub Pages
echo.
echo on:
echo   push:
echo     branches: [ main ]
echo   workflow_dispatch:
echo.
echo permissions:
echo   contents: read
echo   pages: write
echo   id-token: write
echo.
echo jobs:
echo   deploy:
echo     runs-on: ubuntu-latest
echo     steps:
echo       - uses: actions/checkout@v4
echo       - uses: actions/setup-node@v4
echo         with:
echo           node-version: '18'
echo           cache: 'npm'
echo           cache-dependency-path: frontend/package-lock.json
echo       - name: Install dependencies
echo         run: cd frontend ^&^& npm ci
echo       - name: Build
echo         run: cd frontend ^&^& npm run build
echo       - name: Setup Pages
echo         uses: actions/configure-pages@v4
echo       - name: Upload artifact
echo         uses: actions/upload-pages-artifact@v3
echo         with:
echo           path: frontend/dist
echo       - name: Deploy to GitHub Pages
echo         uses: actions/deploy-pages@v4
) > ".github\workflows\deploy.yml"

echo ✅ GitHub Actions workflow created!
echo.
echo Adding and committing workflow...
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main

echo.
echo Now enabling GitHub Pages in repository settings...
echo 1. Go to: https://github.com/anirazizfsm-maker/lethimdo-ai-platform/settings/pages
echo 2. Source: "GitHub Actions"
echo 3. Click Save
echo.
echo Your site will be available at:
echo https://anirazizfsm-maker.github.io/lethimdo-ai-platform
echo.
start https://github.com/anirazizfsm-maker/lethimdo-ai-platform/settings/pages
goto END

:GH_PAGES
echo.
echo ================================================================
echo   GH-PAGES BRANCH DEPLOYMENT
echo ================================================================
echo.

echo Installing gh-pages package...
cd frontend
npm install --save-dev gh-pages

echo.
echo Adding deploy script to package.json...
echo You'll need to manually add this to your package.json scripts:
echo "predeploy": "npm run build",
echo "deploy": "gh-pages -d dist"
echo.
echo After adding the script, run:
echo npm run deploy
goto END

:MANUAL_SETTINGS
echo.
echo ================================================================
echo   MANUAL REPOSITORY SETTINGS
echo ================================================================
echo.

echo 1. Go to: https://github.com/anirazizfsm-maker/lethimdo-ai-platform/settings/pages
echo 2. Source: "Deploy from a branch"
echo 3. Branch: main
echo 4. Folder: /frontend/dist ^(if available^) or / ^(root^)
echo 5. Click Save
echo.
echo Your site will be available at:
echo https://anirazizfsm-maker.github.io/lethimdo-ai-platform
echo.
start https://github.com/anirazizfsm-maker/lethimdo-ai-platform/settings/pages
goto END

:END
echo.
echo ================================================================
echo   🎉 GITHUB PAGES SETUP COMPLETE
echo ================================================================
echo.
echo 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS:
echo ✅ 100%% FREE hosting forever
echo ✅ Professional .github.io domain
echo ✅ Automatic HTTPS security
echo ✅ Perfect for client portfolio
echo ✅ No billing address required
echo.
echo 💰 COST ANALYSIS:
echo GitHub Pages: $0/month
echo Vercel Pro: $20/month ^(billing issues^)
echo Annual Savings: $240 for your agency
echo.
echo 🚀 PROFESSIONAL PRESENTATION:
echo Your live demo: https://anirazizfsm-maker.github.io/lethimdo-ai-platform
echo Repository: https://github.com/anirazizfsm-maker/lethimdo-ai-platform
echo.
echo 🎯 CLIENT ACQUISITION READY:
echo ✅ Live platform demonstration
echo ✅ Professional GitHub presence
echo ✅ Cost-effective hosting solution
echo ✅ International client accessibility
echo.
pause