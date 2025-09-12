@echo off
echo ================================================================
echo   NETLIFY DEPLOYMENT FIX SCRIPT
echo ================================================================
echo.
echo This script will help fix the netlify.toml parsing error by:
echo 1. Backing up conflicting configuration files
echo 2. Verifying the netlify.toml format
echo 3. Providing instructions for redeployment
echo.
pause

echo.
echo [1/3] Backing up conflicting configuration files...
echo.

if exist "vercel.json" (
    echo Renaming vercel.json to vercel.json.bak
    ren "vercel.json" "vercel.json.bak"
) else (
    echo vercel.json not found in root directory
)

if exist "frontend\vercel.json" (
    echo Renaming frontend\vercel.json to frontend\vercel.json.bak
    ren "frontend\vercel.json" "vercel.json.bak"
) else (
    echo frontend\vercel.json not found
)

echo.
echo [2/3] Verifying netlify.toml format...
echo.

if exist "frontend\netlify.toml" (
    echo netlify.toml found in frontend directory:
    echo.
    type "frontend\netlify.toml"
    echo.
    echo.
    echo File verification complete.
) else (
    echo ERROR: netlify.toml not found in frontend directory!
    echo Please ensure the file exists before proceeding.
    goto :END
)

echo.
echo [3/3] Deployment instructions...
echo.

echo ================================================================
echo   NEXT STEPS FOR NETLIFY DEPLOYMENT
echo ================================================================
echo.
echo 1. COMMIT AND PUSH CHANGES TO GITHUB:
echo    git add .
echo    git commit -m "Fix Netlify deployment configuration"
echo    git push origin main
echo.
echo 2. UPDATE NETLIFY BUILD SETTINGS:
echo    - Base directory: frontend
echo    - Build command: npm run build
echo    - Publish directory: dist
echo.
echo 3. SET ENVIRONMENT VARIABLES IN NETLIFY:
echo    VITE_API_BASE_URL = https://lethimdo-backend.onrender.com
echo    VITE_APP_NAME = Lethimdo
echo.
echo 4. TRIGGER A NEW DEPLOYMENT:
echo    - Netlify will automatically deploy on push
echo    - Or manually trigger deploy in Netlify dashboard
echo.
echo For detailed troubleshooting, see:
echo NETLIFY-DEPLOYMENT-FIX-GUIDE.md
echo.

:END
echo.
echo Script execution complete.
pause