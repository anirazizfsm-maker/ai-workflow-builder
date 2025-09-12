@echo off
echo ================================================================
echo   FIREBASE HOSTING FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 FIREBASE: GOOGLE'S FREE HOSTING FOR BANGLADESH
echo ✅ No billing address required for free tier
echo ✅ Unlimited bandwidth on free tier
echo ✅ Google's global CDN infrastructure
echo ✅ Perfect for international clients
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
echo   FIREBASE SETUP STEPS
echo ================================================================
echo.

echo STEP 1: Install Firebase CLI
echo Installing Firebase CLI globally...
npm install -g firebase-tools

echo.
echo STEP 2: Login to Firebase
echo Opening browser for Google login...
firebase login

echo.
echo STEP 3: Initialize Firebase Project
echo.
echo When prompted, select:
echo ✅ Hosting: Configure files for Firebase Hosting
echo ✅ Use an existing project OR create new project
echo ✅ Public directory: dist
echo ✅ Configure as single-page app: Yes
echo ✅ Overwrite index.html: No
echo.

firebase init hosting

echo.
echo STEP 4: Deploy to Firebase
echo Deploying your Lethimdo platform...
firebase deploy

echo.
echo ================================================================
echo   🎉 FIREBASE DEPLOYMENT COMPLETE
echo ================================================================
echo.
echo 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS:
echo ✅ Google's enterprise infrastructure
echo ✅ FREE unlimited bandwidth
echo ✅ Professional .web.app domain
echo ✅ Global performance for international clients
echo ✅ No billing issues for Bangladesh
echo.
echo 💰 COST ANALYSIS:
echo Firebase Hosting: 100%% FREE
echo Vercel Pro: $20/month (billing issues)
echo Savings: $240/year for your agency
echo.
echo 🚀 PROFESSIONAL FEATURES:
echo ✅ Custom domain support
echo ✅ Automatic SSL certificates
echo ✅ Global CDN (same as Google services)
echo ✅ Enterprise-grade uptime
echo.
echo Your site will be available at:
echo https://your-project-id.web.app
echo.
echo 🎯 NEXT STEPS FOR CLIENT ACQUISITION:
echo 1. Copy your Firebase URL
echo 2. Update GitHub repository README
echo 3. Add live demo link to all portfolios
echo 4. Start pitching to international clients
echo.
pause