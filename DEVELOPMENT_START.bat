@echo off
title Lethimdo Development Environment

echo ====================================================
echo    Lethimdo - Development Environment Start
echo ====================================================
echo.

echo 1. Starting frontend development server...
echo.
cd c:\Users\user\lethimdo\frontend
start "" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo 2. Opening documentation...
echo.
cd c:\Users\user\lethimdo
start "" "NEXT_STEPS_GUIDE.md"
start "" "POST_DEPLOYMENT_CHECKLIST.md"

echo 3. Opening project directories...
echo.
cd c:\Users\user\lethimdo
explorer .

echo 4. Opening GitHub repository...
echo.
start "" "https://github.com/anirazizfsm-maker/ai-workflow-builder"

echo.
echo Development environment started successfully!
echo.
echo Frontend development server should be running on http://localhost:5173
echo.
echo Documentation files have been opened for your reference.
echo.
echo Project directory has been opened in Explorer.
echo.
echo GitHub repository has been opened in your browser.
echo.

echo Next steps:
echo 1. Check the frontend development server at http://localhost:5173
echo 2. Review the documentation files for next steps
echo 3. Make code changes as needed
echo 4. Test locally before deploying
echo.

pause