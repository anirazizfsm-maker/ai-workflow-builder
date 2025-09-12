@echo off
echo ================================
echo   LETHIMDO BACKUP CREATOR
echo ================================
echo.

set BACKUP_DIR=C:\Users\user\Desktop\Lethimdo-Backups
set PROJECT_DIR=C:\Users\user\lethimdo
set DATE_STAMP=%date:~10,4%-%date:~4,2%-%date:~7,2%

echo Creating backup directory...
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [1/4] Creating Source Code Backup...
powershell Compress-Archive -Path "%PROJECT_DIR%\*" -DestinationPath "%BACKUP_DIR%\Lethimdo-SourceCode-%DATE_STAMP%.zip" -Force

echo [2/4] Creating Documentation Backup...
copy "%PROJECT_DIR%\COMPLETE-PROJECT-GUIDE.md" "%BACKUP_DIR%\Lethimdo-Guide-%DATE_STAMP%.md"
copy "%PROJECT_DIR%\QUICK-REFERENCE.md" "%BACKUP_DIR%\Lethimdo-QuickRef-%DATE_STAMP%.md"
copy "%PROJECT_DIR%\deployment-guide.md" "%BACKUP_DIR%\Lethimdo-Deployment-%DATE_STAMP%.md"

echo [3/4] Creating Essential Files Backup...
mkdir "%BACKUP_DIR%\Essential-Files-%DATE_STAMP%" 2>nul
copy "%PROJECT_DIR%\frontend\src\App.tsx" "%BACKUP_DIR%\Essential-Files-%DATE_STAMP%\"
copy "%PROJECT_DIR%\backend\simple-server.js" "%BACKUP_DIR%\Essential-Files-%DATE_STAMP%\"
copy "%PROJECT_DIR%\vercel.json" "%BACKUP_DIR%\Essential-Files-%DATE_STAMP%\"
copy "%PROJECT_DIR%\backend\railway.toml" "%BACKUP_DIR%\Essential-Files-%DATE_STAMP%\"

echo [4/4] Creating Project Info Summary...
echo LETHIMDO PROJECT BACKUP > "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo ======================= >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo. >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo Original Location: %PROJECT_DIR% >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo Backup Date: %DATE% %TIME% >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo. >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo CONTENTS: >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo - Complete source code (ZIP) >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo - Documentation files (MD) >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo - Essential configuration files >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo - Deployment instructions >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo. >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo NEXT STEPS: >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo 1. Deploy to Netlify (frontend) >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo 2. Deploy to Render.com (backend) >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo 3. Configure environment variables >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"
echo 4. Start freelance agency in Bangladesh >> "%BACKUP_DIR%\PROJECT-INFO-%DATE_STAMP%.txt"

echo.
echo ================================
echo   BACKUP COMPLETED SUCCESSFULLY!
echo ================================
echo.
echo Backup Location: %BACKUP_DIR%
echo.
echo Files Created:
echo - Lethimdo-SourceCode-%DATE_STAMP%.zip (Complete project)
echo - Lethimdo-Guide-%DATE_STAMP%.md (Complete guide)
echo - Lethimdo-QuickRef-%DATE_STAMP%.md (Quick reference)
echo - Essential-Files-%DATE_STAMP%/ (Key config files)
echo - PROJECT-INFO-%DATE_STAMP%.txt (Summary)
echo.
echo Opening backup folder...
explorer "%BACKUP_DIR%"
echo.
pause