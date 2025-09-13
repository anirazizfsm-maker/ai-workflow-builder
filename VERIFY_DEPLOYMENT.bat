@echo off
title Lethimdo Deployment Verification

echo ====================================================
echo    Lethimdo - Deployment Verification
echo ====================================================
echo.

echo 1. Checking local frontend build...
echo.
cd c:\Users\user\lethimdo\frontend
if exist "dist" (
    echo [OK] Frontend build exists
) else (
    echo [WARNING] Frontend build not found
)
echo.

echo 2. Checking configuration files...
echo.
cd c:\Users\user\lethimdo
if exist "wrangler.json" (
    echo [OK] wrangler.json found
) else (
    echo [ERROR] wrangler.json not found
)

if exist "build-frontend.cjs" (
    echo [OK] build-frontend.cjs found
) else (
    echo [ERROR] build-frontend.cjs not found
)

if exist "build-frontend.sh" (
    echo [OK] build-frontend.sh found
) else (
    echo [ERROR] build-frontend.sh not found
)
echo.

echo 3. Checking environment variables...
echo.
cd c:\Users\user\lethimdo\frontend
if exist ".env" (
    echo [INFO] .env file found
    type .env
) else (
    echo [INFO] No local .env file found
)
echo.

echo 4. Checking git repository status...
echo.
cd c:\Users\user\lethimdo
git status
echo.

echo 5. Recent deployment files created:
echo.
dir /b *.md | findstr /i "deploy"
dir /b *.md | findstr /i "cloudflare"
dir /b *.md | findstr /i "post"
echo.

echo ====================================================
echo    Next Steps:
echo ====================================================
echo.
echo 1. Open your deployed application in a browser
echo 2. Test all functionality including:
echo    - Navigation between pages
echo    - User authentication (if implemented)
echo    - API connections to backend
echo    - Form submissions and data display
echo.
echo 3. Check POST_DEPLOYMENT_CHECKLIST.md for detailed steps
echo.
echo 4. Set up custom domain if not already done
echo.
echo 5. Begin testing with potential clients
echo.

pause