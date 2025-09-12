@echo off
title Environment Variables Manager

echo ================================
echo LETHIMDO ENVIRONMENT VARIABLES MANAGER
echo ================================
echo.
echo This script helps you manage environment variables for your Lethimdo project.
echo.

:menu
echo Select an option:
echo 1. View current frontend environment variables
echo 2. Edit frontend environment variables
echo 3. View Cloudflare Pages setup instructions
echo 4. View Netlify setup instructions
echo 5. Verify environment variables are working
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto view_frontend
if "%choice%"=="2" goto edit_frontend
if "%choice%"=="3" goto cloudflare_setup
if "%choice%"=="4" goto netlify_setup
if "%choice%"=="5" goto verify_env
if "%choice%"=="6" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:view_frontend
echo.
echo Current frontend environment variables:
echo --------------------------------------
if exist "frontend\.env" (
    type "frontend\.env"
) else (
    echo frontend\.env file not found!
)
echo.
pause
goto menu

:edit_frontend
echo.
echo Opening frontend\.env file for editing...
echo Please add or modify variables in the format: VARIABLE_NAME=value
echo.
if exist "frontend\.env" (
    notepad "frontend\.env"
) else (
    echo Creating frontend\.env file...
    echo VITE_API_BASE_URL=https://lethimdo-backend.onrender.com > "frontend\.env"
    echo VITE_APP_NAME=Lethimdo >> "frontend\.env"
    notepad "frontend\.env"
)
echo.
echo After saving changes, remember to restart your development server.
echo.
pause
goto menu

:cloudflare_setup
echo.
echo Cloudflare Pages Environment Variables Setup:
echo --------------------------------------------
echo 1. Go to your Cloudflare dashboard
echo 2. Navigate to "Pages" ^> Select your project ^> "Settings" ^> "Environment variables"
echo 3. Click "Add variable"
echo 4. Add these variables:
echo    Variable name: VITE_API_BASE_URL
echo    Value: https://lethimdo-backend.onrender.com
echo    Click "Add variable"
echo.
echo    Variable name: VITE_APP_NAME
echo    Value: Lethimdo
echo    Click "Add variable"
echo 5. Trigger a new build for changes to take effect
echo.
pause
goto menu

:netlify_setup
echo.
echo Netlify Environment Variables Setup:
echo -----------------------------------
echo Netlify automatically reads from your .env file, so no additional setup is needed.
echo.
echo If you want to override or add environment variables specifically for Netlify:
echo 1. Go to your Netlify site dashboard
echo 2. Navigate to "Site settings" ^> "Build ^& deploy" ^> "Environment"
echo 3. Click "Edit variables"
echo 4. Add variables:
echo    Key: VITE_API_BASE_URL
echo    Value: https://lethimdo-backend.onrender.com
echo.
echo    Key: VITE_APP_NAME
echo    Value: Lethimdo
echo 5. Click "Save"
echo 6. Trigger a new build for changes to take effect
echo.
pause
goto menu

:verify_env
echo.
echo Verifying environment variables...
echo ---------------------------------
echo Checking if frontend\.env exists...
if exist "frontend\.env" (
    echo ✅ frontend\.env file found
    echo Current contents:
    for /f "tokens=*" %%i in (frontend\.env) do echo   %%i
) else (
    echo ❌ frontend\.env file NOT found
    echo You need to create this file with your environment variables.
)
echo.
echo To verify environment variables are working in your application:
echo 1. Start your development server with "npm run dev"
echo 2. Open your browser's developer tools
echo 3. Go to the Console tab
echo 4. Type: import.meta.env.VITE_API_BASE_URL
echo 5. You should see: "https://lethimdo-backend.onrender.com"
echo.
pause
goto menu

:exit_script
echo.
echo Thank you for using the Environment Variables Manager!
echo.
pause
exit /b 0