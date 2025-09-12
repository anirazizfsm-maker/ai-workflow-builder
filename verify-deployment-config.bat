@echo off
title Verify Deployment Configuration

echo =================================
echo VERIFYING DEPLOYMENT CONFIGURATION
echo =================================
echo.

set error_count=0

echo Checking required files...
echo --------------------------

REM Check .env file
if exist "frontend\.env" (
    echo ✅ frontend\.env found
    echo    Contents:
    for /f "tokens=*" %%i in (frontend\.env) do echo      %%i
    echo.
) else (
    echo ❌ frontend\.env NOT found
    set /a error_count+=1
)

REM Check netlify.toml
if exist "frontend\netlify.toml" (
    echo ✅ frontend\netlify.toml found
    echo    Key settings:
    findstr /c:"publish" /c:"command" frontend\netlify.toml
    echo.
) else (
    echo ❌ frontend\netlify.toml NOT found
    set /a error_count+=1
)

REM Check _redirects file
if exist "frontend\public\_redirects" (
    echo ✅ frontend\public\_redirects found
    echo    Contents:
    for /f "tokens=*" %%i in (frontend\public\_redirects) do echo      %%i
    echo.
) else (
    echo ❌ frontend\public\_redirects NOT found
    set /a error_count+=1
)

REM Summary
echo ================================
echo CONFIGURATION VERIFICATION SUMMARY
echo ================================
echo.

if %error_count%==0 (
    echo ✅ ALL REQUIRED FILES ARE PRESENT
    echo.
    echo Your deployment configuration is complete and ready.
    echo You can now deploy to either Netlify or Cloudflare Pages.
    echo.
    echo For Netlify:
    echo   - Connect your GitHub repository
    echo   - Netlify will automatically use your configuration
    echo.
    echo For Cloudflare Pages:
    echo   - Set build command to: npm run build
    echo   - Set build output directory to: dist
    echo   - Set root directory to: /frontend
    echo   - Add environment variables in the dashboard
    echo.
) else (
    echo ⚠️  %error_count% ISSUES FOUND
    echo.
    echo Please check the missing files and create them as needed.
    echo Refer to ADD-ENVIRONMENT-VARIABLES-AND-SUBDIRECTORY-GUIDE.md for details.
    echo.
)

pause