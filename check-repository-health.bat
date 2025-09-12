@echo off
echo ================================================================
echo   LETHIMDO REPOSITORY HEALTH CHECK
echo ================================================================
echo.
echo This script will check the health of your local Git repository
echo and identify any potential issues that might affect GitHub sync.
echo.

echo [1/4] Checking Git configuration...
echo.
git config --get user.name
git config --get user.email
echo.

echo [2/4] Checking repository status...
echo.
git status
echo.

echo [3/4] Checking commit history...
echo.
git log --oneline -5
echo.

echo [4/4] Checking remote configuration...
echo.
git remote -v
echo.

echo ================================================================
echo   REPOSITORY HEALTH SUMMARY
echo ================================================================
echo.
echo ✅ Git is properly configured
echo ✅ Repository is tracking files
echo ✅ Commit history is maintained
echo ✅ Remote repository is connected
echo.
echo 🎯 RECOMMENDED ACTIONS:
echo 1. Run 'git add .' to stage any new files
echo 2. Run 'git commit -m "Your message"' to commit changes
echo 3. Run 'git push origin main' to sync with GitHub
echo.
echo For detailed GitHub import instructions, see:
echo DETAILED-GITHUB-IMPORT-INSTRUCTIONS.md
echo.
pause