@echo off
echo ================================================================
echo   VLY.AI COMPONENTS INTEGRATION SCRIPT
echo   Script to integrate vly.ai design components into Lethimdo
echo ================================================================
echo.

echo 🎨 Bangladesh Freelance Agency - Component Integration
echo.

echo This script helps you integrate individual vly.ai components into
echo your current Lethimdo website.
echo.

echo 📋 AVAILABLE COMPONENTS:
echo =====================
echo 1. Header.tsx
echo 2. Footer.tsx
echo 3. HeroSection.tsx
echo 4. FeaturesSection.tsx
echo 5. Dashboard.tsx
echo 6. Button.tsx
echo.

echo 🛠️ INTEGRATION OPTIONS:
echo ====================
echo 1. Integrate Header component
echo 2. Integrate Footer component
echo 3. Integrate HeroSection component
echo 4. Integrate FeaturesSection component
echo 5. Integrate all layout components (Header, Footer)
echo 6. Integrate all section components (Hero, Features)
echo 7. Integrate all components
echo 8. Exit
echo.

:menu
set /p choice=Enter your choice (1-8): 

if "%choice%"=="1" goto integrate_header
if "%choice%"=="2" goto integrate_footer
if "%choice%"=="3" goto integrate_hero
if "%choice%"=="4" goto integrate_features
if "%choice%"=="5" goto integrate_layout
if "%choice%"=="6" goto integrate_sections
if "%choice%"=="7" goto integrate_all
if "%choice%"=="8" goto exit
echo Invalid choice. Please try again.
goto menu

:integrate_header
echo.
echo Integrating Header component...
copy "c:\Users\user\lethimdo\vly-design\components\layout\Header.tsx" "c:\Users\user\lethimdo\frontend\src\components\Header.tsx"
echo Header component integrated successfully!
echo.
goto menu

:integrate_footer
echo.
echo Integrating Footer component...
copy "c:\Users\user\lethimdo\vly-design\components\layout\Footer.tsx" "c:\Users\user\lethimdo\frontend\src\components\Footer.tsx"
echo Footer component integrated successfully!
echo.
goto menu

:integrate_hero
echo.
echo Integrating HeroSection component...
copy "c:\Users\user\lethimdo\vly-design\components\sections\HeroSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\HeroSection.tsx"
echo HeroSection component integrated successfully!
echo.
goto menu

:integrate_features
echo.
echo Integrating FeaturesSection component...
copy "c:\Users\user\lethimdo\vly-design\components\sections\FeaturesSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\FeaturesSection.tsx"
echo FeaturesSection component integrated successfully!
echo.
goto menu

:integrate_layout
echo.
echo Integrating all layout components...
copy "c:\Users\user\lethimdo\vly-design\components\layout\Header.tsx" "c:\Users\user\lethimdo\frontend\src\components\Header.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\layout\Footer.tsx" "c:\Users\user\lethimdo\frontend\src\components\Footer.tsx"
echo All layout components integrated successfully!
echo.
goto menu

:integrate_sections
echo.
echo Integrating all section components...
copy "c:\Users\user\lethimdo\vly-design\components\sections\HeroSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\HeroSection.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\sections\FeaturesSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\FeaturesSection.tsx"
echo All section components integrated successfully!
echo.
goto menu

:integrate_all
echo.
echo Integrating all components...
copy "c:\Users\user\lethimdo\vly-design\components\layout\Header.tsx" "c:\Users\user\lethimdo\frontend\src\components\Header.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\layout\Footer.tsx" "c:\Users\user\lethimdo\frontend\src\components\Footer.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\sections\HeroSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\HeroSection.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\sections\FeaturesSection.tsx" "c:\Users\user\lethimdo\frontend\src\components\FeaturesSection.tsx"
copy "c:\Users\user\lethimdo\vly-design\components\ui\Button.tsx" "c:\Users\user\lethimdo\frontend\src\components\Button.tsx"
echo All components integrated successfully!
echo.
goto menu

:exit
echo.
echo 🚀 Integration complete! Remember to test your changes.
echo.
echo To start the development server:
echo cd c:\Users\user\lethimdo\frontend
echo npm run dev
echo.
echo To deploy your changes:
echo git add .
echo git commit -m "Integrated vly.ai design components"
echo git push origin main
echo.
echo Netlify will automatically deploy your updated frontend.
echo.
pause
exit