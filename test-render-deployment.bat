@echo off
echo ========================================
echo Render.com Deployment Testing Script
echo Lethimdo Bangladesh Freelance Agency
echo ========================================
echo.

echo Step 1: Checking if your backend is deployed...
echo Testing URL: https://lethimdo-backend.onrender.com/health
echo.

echo Waiting for deployment to complete...
echo (This may take 3-5 minutes for first deployment)
echo.

:TEST_LOOP
echo Testing backend health endpoint...
curl -s -o NUL -w "%%{http_code}" https://lethimdo-backend.onrender.com/health > temp_status.txt
set /p STATUS=<temp_status.txt
del temp_status.txt

if "%STATUS%"=="200" (
    echo.
    echo ========================================
    echo ✅ SUCCESS! Backend is LIVE!
    echo ========================================
    echo.
    echo Backend URL: https://lethimdo-backend.onrender.com
    echo Health Check: https://lethimdo-backend.onrender.com/health
    echo.
    echo Testing full API response...
    curl -s https://lethimdo-backend.onrender.com/health
    echo.
    echo.
    echo ========================================
    echo NEXT STEPS:
    echo ========================================
    echo 1. ✅ Backend deployed successfully
    echo 2. 🔄 Update frontend to use this backend URL
    echo 3. 🤖 Add OpenAI API key for AI features
    echo 4. 🎯 Test complete system functionality
    echo.
    goto END
) else if "%STATUS%"=="503" (
    echo ⏳ Backend is starting up (Service Unavailable)...
    echo Waiting 30 seconds before retry...
    timeout /t 30 /nobreak > NUL
    goto TEST_LOOP
) else if "%STATUS%"=="000" (
    echo 🔄 Deployment in progress or URL not ready...
    echo Waiting 30 seconds before retry...
    timeout /t 30 /nobreak > NUL
    goto TEST_LOOP
) else (
    echo ❌ Unexpected status: %STATUS%
    echo Waiting 30 seconds before retry...
    timeout /t 30 /nobreak > NUL
    goto TEST_LOOP
)

:END
echo.
echo ========================================
echo Deployment Status Check Complete
echo Bangladesh Agency Professional Setup
echo ========================================
echo.
echo Your backend is now ready for international clients!
echo Frontend: https://lethimdo.netlify.app
echo Backend: https://lethimdo-backend.onrender.com
echo.
pause