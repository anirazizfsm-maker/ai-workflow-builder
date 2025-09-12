@echo off
title Clear All Cache - Lethimdo
echo ==================================================
echo        CLEAR ALL CACHE FOR LETHIMDO
echo ==================================================
echo.
echo This script will clear various types of cache that
echo might be preventing you from seeing the latest 
echo changes on your website.
echo.

REM Ask for confirmation before proceeding
echo WARNING: This will clear browser cache, DNS cache, and other system caches.
set /p confirm=Do you want to proceed? (y/n): 
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    pause
    exit /b
)

echo.
echo Clearing DNS cache...
ipconfig /flushdns
echo DNS cache cleared.
echo.

echo Clearing ARP cache...
arp -d *
echo ARP cache cleared.
echo.

echo Clearing temporary files...
del /q /f /s "%TEMP%\*" 2>nul
echo Temporary files cleared.
echo.

echo Clearing browser cache (Chrome)...
taskkill /f /im chrome.exe 2>nul
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache\*" 2>nul
del /q /f /s "%LOCALAPPDATA%\Google\Chrome\User Data\Default\Cache2\entries\*" 2>nul
echo Chrome cache cleared.
echo.

echo Clearing browser cache (Edge)...
taskkill /f /im msedge.exe 2>nul
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache\*" 2>nul
del /q /f /s "%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Cache2\entries\*" 2>nul
echo Edge cache cleared.
echo.

echo Clearing browser cache (Firefox)...
taskkill /f /im firefox.exe 2>nul
del /q /f /s "%APPDATA%\Mozilla\Firefox\Profiles\*.default-release\cache2\entries\*" 2>nul
del /q /f /s "%APPDATA%\Mozilla\Firefox\Profiles\*.default\cache2\entries\*" 2>nul
echo Firefox cache cleared.
echo.

echo Clearing Windows Store cache...
wsreset.exe -i
echo Windows Store cache cleared.
echo.

echo Clearing thumbnail cache...
taskkill /f /im explorer.exe 2>nul
del /q /f /s "%LOCALAPPDATA%\Microsoft\Windows\Explorer\thumbcache_*.db" 2>nul
start explorer.exe
echo Thumbnail cache cleared.
echo.

echo Clearing npm cache...
npm cache clean --force 2>nul
echo npm cache cleared.
echo.

echo Clearing Vite cache...
rd /s /q "node_modules\.vite" 2>nul
echo Vite cache cleared.
echo.

echo All cache clearing operations completed!
echo.
echo Please restart your browser and try accessing your website again.
echo.
pause