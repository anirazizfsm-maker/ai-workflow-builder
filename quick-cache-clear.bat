@echo off
title Quick Cache Clear - Lethimdo
echo ==================================================
echo        QUICK CACHE CLEAR FOR LETHIMDO
echo ==================================================
echo.
echo Clearing essential caches...
echo.

echo Clearing DNS cache...
ipconfig /flushdns
echo DNS cache cleared.
echo.

echo Clearing temporary files...
del /q /f /s "%TEMP%\*" 2>nul
echo Temporary files cleared.
echo.

echo Clearing npm cache...
npm cache clean --force 2>nul
echo npm cache cleared.
echo.

echo Clearing Vite cache...
cd frontend
rd /s /q "node_modules\.vite" 2>nul
echo Vite cache cleared.
echo.

echo Cache clearing completed!
echo.
echo Please restart your browser and refresh your website.
echo.
timeout /t 5 >nul