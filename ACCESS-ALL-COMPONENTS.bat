@echo off
title Lethimdo Platform - Access All Components

echo ====================================================
echo    LETHIMDO PLATFORM - ACCESS ALL COMPONENTS
echo ====================================================
echo.

echo 🎯 LETHIMDO PLATFORM COMPONENTS ACCESS
echo.

echo 1. Website (Frontend):
echo    🌐 Live: NOT YET DEPLOYED - Run deployment script first
echo    🖥️  Local Development: http://localhost:5173
echo    📁 Files: C:\Users\user\lethimdo\frontend\
echo.

echo 2. Backend API:
echo    🌐 Live: https://lethimdo-backend.onrender.com
echo    🖥️  Local Development: http://localhost:3001
echo    📁 Files: C:\Users\user\lethimdo\backend\
echo.

echo 3. Source Code Repository:
echo    🌐 GitHub: https://github.com/anirazizfsm-maker/ai-workflow-builder
echo    📁 Local: C:\Users\user\lethimdo\
echo.

echo 4. Documentation:
echo    📄 Main Guide: COMPLETE-ACCESS-GUIDE.md
echo    📄 API Docs: backend\API_DOCUMENTATION.md
echo    📄 Deployment: backend\DEPLOYMENT_SCRIPTS.md
echo    📄 Frontend Deploy: frontend\ACCESS-VIA-CLOUDFLARE-GUIDE.md
echo.

echo ====================================================
echo    QUICK ACCESS OPTIONS
echo ====================================================
echo.

echo [1] Open Project Folder
echo [2] Open Frontend Folder
echo [3] Open Backend Folder
echo [4] Open Documentation
echo [5] Deploy Website to Cloudflare Pages
echo [6] Start Local Development Servers
echo [7] Open Backend API Dashboard (Render.com)
echo [8] Open GitHub Repository
echo [9] Open This Guide
echo [0] Exit
echo.

set /p CHOICE="Enter your choice (0-9): "

if "%CHOICE%"=="1" goto PROJECT_FOLDER
if "%CHOICE%"=="2" goto FRONTEND_FOLDER
if "%CHOICE%"=="3" goto BACKEND_FOLDER
if "%CHOICE%"=="4" goto DOCUMENTATION
if "%CHOICE%"=="5" goto DEPLOY_WEBSITE
if "%CHOICE%"=="6" goto LOCAL_DEVELOPMENT
if "%CHOICE%"=="7" goto RENDER_DASHBOARD
if "%CHOICE%"=="8" goto GITHUB_REPO
if "%CHOICE%"=="9" goto THIS_GUIDE
if "%CHOICE%"=="0" goto END

:PROJECT_FOLDER
echo.
echo Opening Project Folder...
explorer "C:\Users\user\lethimdo"
goto END

:FRONTEND_FOLDER
echo.
echo Opening Frontend Folder...
explorer "C:\Users\user\lethimdo\frontend"
goto END

:BACKEND_FOLDER
echo.
echo Opening Backend Folder...
explorer "C:\Users\user\lethimdo\backend"
goto END

:DOCUMENTATION
echo.
echo Opening Documentation...
explorer "C:\Users\user\lethimdo\COMPLETE-ACCESS-GUIDE.md"
goto END

:DEPLOY_WEBSITE
echo.
echo Opening Cloudflare Deployment Script...
cd "C:\Users\user\lethimdo\frontend"
start DEPLOY-TO-CLOUDFLARE-PAGES.bat
goto END

:LOCAL_DEVELOPMENT
echo.
echo Instructions for Local Development:
echo.
echo 1. Start Backend Server:
echo    - Open terminal
echo    - cd C:\Users\user\lethimdo\backend
echo    - npm run dev
echo.
echo 2. Start Frontend Server:
echo    - Open another terminal
echo    - cd C:\Users\user\lethimdo\frontend
echo    - npm run dev
echo.
echo 3. Access:
echo    - Backend: http://localhost:3001
echo    - Frontend: http://localhost:5173
echo.
echo Press any key to continue...
pause >nul
goto MENU

:RENDER_DASHBOARD
echo.
echo Opening Render.com Dashboard...
start https://dashboard.render.com/
goto END

:GITHUB_REPO
echo.
echo Opening GitHub Repository...
start https://github.com/anirazizfsm-maker/ai-workflow-builder
goto END

:THIS_GUIDE
echo.
echo Opening This Guide...
explorer "C:\Users\user\lethimdo\COMPLETE-ACCESS-GUIDE.md"
goto END

:END
echo.
echo ====================================================
echo    ACCESS COMPLETE
echo ====================================================
echo.
echo 🎉 You can access all Lethimdo platform components!
echo.
echo For detailed instructions, see:
echo COMPLETE-ACCESS-GUIDE.md
echo.
pause