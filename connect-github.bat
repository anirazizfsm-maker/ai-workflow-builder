@echo off
REM Connect Local Repository to GitHub Script for Lethimdo Bangladesh Freelance Agency
REM This script helps connect your local repository to a GitHub remote repository

echo 🚀 GitHub Repository Connection Script
echo ======================================
echo This script will help you connect your local Lethimdo repository to GitHub
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

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Remote origin already exists:
    git remote get-url origin
    echo.
    set /p choice="Do you want to replace it? (y/N): "
    if /i not "%choice%"=="y" (
        echo Keeping existing remote configuration
        pause
        exit /b 0
    )
)

REM Get GitHub username and repository name
echo Please enter your GitHub information:
set /p username="GitHub Username: "
set /p repo="Repository Name (e.g., lethimdo-ai-platform): "

REM Validate input
if "%username%"=="" (
    echo ❌ Error: Username cannot be empty
    pause
    exit /b 1
)

if "%repo%"=="" (
    echo ❌ Error: Repository name cannot be empty
    pause
    exit /b 1
)

REM Create the remote URL
set remote_url=https://github.com/%username%/%repo%.git

echo.
echo Setting up remote repository: %remote_url%
echo.

REM Add the remote origin
git remote add origin %remote_url%
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to add remote origin
    pause
    exit /b 1
)

echo ✅ Remote origin added successfully
echo.

REM Verify the remote
echo Verifying remote configuration:
git remote -v
echo.

REM Try to push to GitHub (may need to set upstream)
echo Attempting to push to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ⚠️  Push failed. This might be expected for a new repository.
    echo Try creating the repository on GitHub first, then run:
    echo git push -u origin main
    echo.
)

echo 🎉 GitHub repository connection process completed!
echo.
echo Next steps:
echo 1. Go to https://github.com/%username%/%repo% and create the repository if it doesn't exist
echo 2. Run "push-to-github.bat" to push your code
echo 3. Configure repository settings on GitHub as needed
echo.
pause