@echo off
REM Push to GitHub Script for Lethimdo Bangladesh Freelance Agency
REM This script adds, commits, and pushes all changes to GitHub

echo 🚀 Starting GitHub push process...
echo.

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Not in a git repository
    echo Please run this script from the root of your git repository
    pause
    exit /b 1
)

echo ✅ Git repository detected
echo.

REM Add all changes
echo 📦 Adding all changes...
git add .
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to add changes
    pause
    exit /b 1
)
echo ✅ All changes added successfully
echo.

REM Commit changes
echo 💬 Creating commit...
git commit -m "Update Lethimdo platform for Bangladesh freelance agency"
if %errorlevel% neq 0 (
    echo ⚠️  No changes to commit or commit failed
    echo Continuing with push process...
)
echo ✅ Commit created successfully
echo.

REM Push to GitHub
echo ☁️  Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to push to GitHub
    echo Please check your internet connection and GitHub credentials
    pause
    exit /b 1
)
echo ✅ Code successfully pushed to GitHub
echo.

echo 🎉 GitHub push completed successfully!
echo Your Lethimdo platform is now updated on GitHub
echo.
pause