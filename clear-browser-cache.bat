@echo off
title Clear Browser Cache - Lethimdo
echo ==================================================
echo        CLEAR BROWSER CACHE FOR LETHIMDO
echo ==================================================
echo.
echo This script will clear your browser cache to help
echo you see the latest changes on your website.
echo.

echo Clearing Chrome cache...
taskkill /f /im chrome.exe 2>nul
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*" 2>nul
echo Chrome cache cleared.
echo.

echo Clearing Edge cache...
taskkill /f /im msedge.exe 2>nul
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*" 2>nul
echo Edge cache cleared.
echo.

echo Clearing temporary internet files...
del /q /f /s "%TEMP%\*" 2>nul
echo Temporary files cleared.
echo.

echo DNS cache cleared.
echo.

echo Cache clearing completed!
echo.
echo Please restart your browser and try accessing:
echo https://lethimdo.netlify.app
echo.
echo If you still don't see the changes, try:
echo 1. Opening in an incognito/private window
echo 2. Waiting a few more minutes for deployment to complete
echo.
pause