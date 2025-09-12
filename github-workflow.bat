@echo off
REM GitHub Workflow Script for Lethimdo Bangladesh Freelance Agency
REM This script helps with common GitHub collaboration tasks

echo 🚀 GitHub Workflow Helper for Lethimdo
echo =====================================
echo This script helps with common GitHub collaboration tasks
echo.

:menu
echo Please select an option:
echo 1. Create a new feature branch
echo 2. Commit changes
echo 3. Push current branch to GitHub
echo 4. Switch to main branch
echo 5. Pull latest changes from main
echo 6. View GitHub repository in browser
echo 7. View Git status
echo 8. Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto create_branch
if "%choice%"=="2" goto commit_changes
if "%choice%"=="3" goto push_branch
if "%choice%"=="4" goto switch_main
if "%choice%"=="5" goto pull_main
if "%choice%"=="6" goto open_github
if "%choice%"=="7" goto git_status
if "%choice%"=="8" goto exit_script

echo Invalid choice. Please try again.
echo.
goto menu

:create_branch
echo.
set /p branch_name="Enter feature branch name (e.g., feature/new-dashboard): "
if "%branch_name%"=="" (
    echo ❌ Error: Branch name cannot be empty
    pause
    goto menu
)
git checkout -b %branch_name%
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to create branch
    pause
    goto menu
)
echo ✅ Branch "%branch_name%" created and switched to
pause
goto menu

:commit_changes
echo.
set /p commit_message="Enter commit message: "
if "%commit_message%"=="" (
    echo ❌ Error: Commit message cannot be empty
    pause
    goto menu
)
git add .
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to commit changes
    pause
    goto menu
)
echo ✅ Changes committed successfully
pause
goto menu

:push_branch
echo.
echo Pushing current branch to GitHub...
git push -u origin HEAD
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to push branch
    pause
    goto menu
)
echo ✅ Branch pushed to GitHub successfully
pause
goto menu

:switch_main
echo.
echo Switching to main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to switch to main branch
    pause
    goto menu
)
echo ✅ Switched to main branch
pause
goto menu

:pull_main
echo.
echo Pulling latest changes from main branch...
git checkout main
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to switch to main branch
    pause
    goto menu
)
git pull origin main
if %errorlevel% neq 0 (
    echo ❌ Error: Failed to pull latest changes
    pause
    goto menu
)
echo ✅ Latest changes pulled successfully
pause
goto menu

:open_github
echo.
echo Opening GitHub repository in browser...
start https://github.com/anirazizfsm-maker/lethimdo-ai-platform
echo ✅ GitHub repository opened in browser
pause
goto menu

:git_status
echo.
echo Current Git status:
git status
echo.
pause
goto menu

:exit_script
echo.
echo 🎉 Thank you for using the GitHub Workflow Helper!
echo Have a great day!
echo.
pause
exit /b 0