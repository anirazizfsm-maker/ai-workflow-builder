@echo off
title GitHub Repository Cloning Tool

echo ===============================
echo GITHUB REPOSITORY CLONING TOOL
echo ===============================
echo.
echo This tool will help you clone the GitHub repository.
echo.

:menu
echo Select an option:
echo 1. Clone repository to current directory
echo 2. Clone repository to a specific directory
echo 3. Shallow clone (faster for large repositories)
echo 4. Clone with different Git configurations
echo 5. View troubleshooting guide
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto clone_current
if "%choice%"=="2" goto clone_specific
if "%choice%"=="3" goto shallow_clone
if "%choice%"=="4" goto config_clone
if "%choice%"=="5" goto troubleshooting
if "%choice%"=="6" goto exit_script
echo Invalid choice. Please try again.
echo.
goto menu

:clone_current
echo.
echo Cloning repository to current directory...
echo ----------------------------------------
git clone https://github.com/anirazizfsm-maker/ai-workflow-builder.git
echo.
echo Cloning process completed.
echo.
pause
goto menu

:clone_specific
echo.
set /p target_dir="Enter target directory path: "
echo.
echo Cloning repository to %target_dir%...
echo ------------------------------------
git clone https://github.com/anirazizfsm-maker/ai-workflow-builder.git "%target_dir%"
echo.
echo Cloning process completed.
echo.
pause
goto menu

:shallow_clone
echo.
echo Performing shallow clone (depth 1)...
echo -----------------------------------
git clone --depth 1 https://github.com/anirazizfsm-maker/ai-workflow-builder.git
echo.
echo Shallow cloning process completed.
echo.
pause
goto menu

:config_clone
echo.
echo Applying Git configurations for better cloning...
echo -----------------------------------------------
git config --global http.postBuffer 524288000
git config --global http.sslVerify true
git config --global credential.helper store
echo.
echo Cloning repository with updated configurations...
echo ------------------------------------------------
git clone https://github.com/anirazizfsm-maker/ai-workflow-builder.git
echo.
echo Cloning process completed.
echo.
pause
goto menu

:troubleshooting
echo.
echo GitHub Repository Cloning Troubleshooting:
echo ----------------------------------------
echo.
echo Common issues and solutions:
echo.
echo 1. Network timeout:
echo    - Try shallow cloning (option 3)
echo    - Try during off-peak hours
echo    - Use a different network or VPN
echo.
echo 2. Authentication issues:
echo    - Ensure you're logged into GitHub
echo    - Check your personal access token if using one
echo.
echo 3. SSL certificate problems:
echo    - Update Git to the latest version
echo    - Temporarily disable SSL verification (not recommended):
echo      git config --global http.sslVerify false
echo.
echo 4. Large repository issues:
echo    - Use shallow cloning (option 3)
echo    - Increase Git buffer size:
echo      git config --global http.postBuffer 524288000
echo.
echo 5. Alternative methods:
echo    - Download ZIP file from GitHub
echo    - Use GitHub CLI: gh repo clone anirazizfsm-maker/ai-workflow-builder
echo.
pause
goto menu

:exit_script
echo.
echo Thank you for using the GitHub Repository Cloning Tool!
echo.
echo Remember to:
echo 1. Check your internet connection
echo 2. Ensure Git is properly installed
echo 3. Refer to GITHUB-CLONING-TROUBLESHOOTING.md for detailed help
echo.
pause
exit /b 0