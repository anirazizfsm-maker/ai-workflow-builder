@echo off
echo ================================================================
echo   LETHIMDO REPOSITORY IMPORT FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.
echo This script will help you import your existing repository to GitHub
echo while preserving all Git history and professional commits.
echo.
echo For detailed instructions, see: HOW-TO-RUN-GITHUB-IMPORT-SCRIPT.md
echo.
echo Current repository status:
git log --oneline -3
echo.
echo 🎯 BENEFITS OF IMPORTING (vs creating new):
echo ✅ Preserves Git history (shows professional development)
echo ✅ Maintains commit timeline (demonstrates consistency)  
echo ✅ Keeps all documentation (enterprise-ready presentation)
echo ✅ Shows established platform (not a prototype)
echo.
set /p CONTINUE="Ready to import to GitHub? (y/n): "
if /i "%CONTINUE%" neq "y" goto :END

echo.
echo ================================================================
echo   STEP 1: CREATE GITHUB REPOSITORY
echo ================================================================
echo.
echo 1. Go to: https://github.com
echo 2. Click "+" then "New repository"
echo 3. Use these EXACT settings:
echo.
echo    Repository Name: lethimdo-ai-platform
echo    Description: AI-Powered Universal API Integration Platform ^| Built in Bangladesh 🇧🇩
echo    Visibility: ✅ Public (for client showcase)
echo    Initialize: ❌ Do NOT add README, .gitignore, or license
echo.
echo 4. Click "Create repository"
echo.

set /p CREATED="Have you created the GitHub repository? (y/n): "
if /i "%CREATED%" neq "y" goto :END

echo.
echo ================================================================
echo   STEP 2: GET REPOSITORY URL
echo ================================================================
echo.

set /p GITHUB_USERNAME="Enter your GitHub username: "
set REPO_URL=https://github.com/%GITHUB_USERNAME%/lethimdo-ai-platform.git

echo.
echo Repository URL: %REPO_URL%
echo.

set /p CONFIRM_URL="Is this URL correct? (y/n): "
if /i "%CONFIRM_URL%" neq "y" goto :END

echo.
echo ================================================================
echo   STEP 3: IMPORTING REPOSITORY
echo ================================================================
echo.

echo [1/5] Adding GitHub remote...
git remote add origin %REPO_URL%
if %errorlevel% neq 0 (
    echo Error: Failed to add remote. Repository might already be connected.
    echo Removing existing remote and trying again...
    git remote remove origin
    git remote add origin %REPO_URL%
)

echo [2/5] Renaming branch to main...
git branch -M main

echo [3/5] Updating README for professional presentation...
if exist "README-PROFESSIONAL.md" (
    copy "README-PROFESSIONAL.md" "README.md"
    git add README.md
    git commit -m "Update README for professional GitHub presentation and international client showcase"
)

echo [4/5] Pushing repository with complete history...
git push -u origin main
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Push failed! This might be because:
    echo 1. GitHub repository is not empty
    echo 2. Authentication required
    echo 3. Repository URL is incorrect
    echo.
    echo Try this command manually:
    echo git push -u origin main --force
    echo.
    goto :END
)

echo [5/5] Verifying import...
git remote -v

echo.
echo ================================================================
echo   🎉 REPOSITORY SUCCESSFULLY IMPORTED!
echo ================================================================
echo.
echo Your professional repository is now live at:
echo https://github.com/%GITHUB_USERNAME%/lethimdo-ai-platform
echo.
echo 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS:
echo ✅ Complete Git history preserved (shows professional development)
echo ✅ All documentation included (enterprise-ready)
echo ✅ Legal compliance files (GDPR, privacy policies)
echo ✅ Professional README (client-focused presentation)
echo ✅ Deployment configurations (Netlify + Render ready)
echo.
echo 💰 IMMEDIATE VALUE FOR USD CLIENTS:
echo - Demonstrates established AI platform (not prototype)
echo - Shows consistent development practices
echo - Proves enterprise-grade documentation
echo - Highlights Bangladesh cost advantage
echo.
echo 🚀 NEXT STEPS:
echo 1. Deploy frontend to Netlify
echo 2. Deploy backend to Render.com
echo 3. Add live demo links to repository
echo 4. Start client acquisition with portfolio showcase
echo.
echo Repository Features Perfect for International Clients:
echo ✅ Professional presentation
echo ✅ Complete documentation
echo ✅ Enterprise standards
echo ✅ Cost-effective positioning
echo.
echo For repository management best practices, see:
echo GITHUB-REPOSITORY-MANAGEMENT-GUIDE.md
echo.
echo For detailed import instructions, see:
echo HOW-TO-RUN-GITHUB-IMPORT-SCRIPT.md
echo.
start https://github.com/%GITHUB_USERNAME%/lethimdo-ai-platform

:END
echo.
pause