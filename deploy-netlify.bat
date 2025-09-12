@echo off
echo ================================================================
echo   NETLIFY DEPLOYMENT FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 NETLIFY: BEST VERCEL ALTERNATIVE FOR BANGLADESH
echo ✅ Accepts Bangladesh billing addresses
echo ✅ Professional custom domains
echo ✅ Perfect for international client demos
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
echo   DEPLOYMENT OPTIONS
echo ================================================================
echo.

echo Choose your deployment method:
echo [1] Drag & Drop (Easiest - No account needed initially)
echo [2] GitHub Connection (Automatic deployments)
echo [3] Netlify CLI (Advanced)
echo.

set /p CHOICE="Enter your choice (1/2/3): "

if "%CHOICE%"=="1" goto DRAG_DROP
if "%CHOICE%"=="2" goto GITHUB_CONNECT
if "%CHOICE%"=="3" goto CLI_DEPLOY

:DRAG_DROP
echo.
echo ================================================================
echo   DRAG & DROP DEPLOYMENT
echo ================================================================
echo.
echo 1. Go to: https://netlify.com
echo 2. Scroll down to "Want to deploy a new site without connecting to Git?"
echo 3. Drag your 'dist' folder to the deployment area
echo 4. Your site will be live instantly!
echo.
echo Your build folder location:
echo %CD%\dist
echo.
echo Opening build folder for you...
start explorer "%CD%\dist"
echo.
echo Opening Netlify...
start https://netlify.com
goto END

:GITHUB_CONNECT
echo.
echo ================================================================
echo   GITHUB CONNECTION DEPLOYMENT
echo ================================================================
echo.
echo 1. Go to: https://netlify.com
echo 2. Click "Sign up" and choose "GitHub"
echo 3. After login, click "Add new site" → "Import an existing project"
echo 4. Choose GitHub and select: lethimdo-ai-platform
echo 5. Configure build settings:
echo    - Base directory: frontend
echo    - Build command: npm run build
echo    - Publish directory: frontend/dist
echo 6. Click "Deploy site"
echo.
echo Opening Netlify...
start https://netlify.com
goto END

:CLI_DEPLOY
echo.
echo ================================================================
echo   NETLIFY CLI DEPLOYMENT
echo ================================================================
echo.
echo Installing Netlify CLI...
npm install -g netlify-cli

echo.
echo Deploying to Netlify...
cd dist
netlify deploy

echo.
echo For production deployment, run:
echo netlify deploy --prod
goto END

:END
echo.
echo ================================================================
echo   🎉 DEPLOYMENT GUIDE COMPLETE
echo ================================================================
echo.
echo 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS:
echo ✅ Professional hosting without billing issues
echo ✅ Global CDN for international clients
echo ✅ Custom domain support for branding
echo ✅ Automatic HTTPS for security
echo ✅ Cost-effective alternative to Vercel
echo.
echo 💰 COST COMPARISON:
echo Vercel Pro: $20/month (billing issues)
echo Netlify: FREE tier sufficient, Pro $19/month
echo.
echo 🚀 NEXT STEPS AFTER DEPLOYMENT:
echo 1. Get your live URL from Netlify
echo 2. Update GitHub repository with demo link
echo 3. Add custom domain (optional)
echo 4. Start client acquisition with live demo
echo.
pause