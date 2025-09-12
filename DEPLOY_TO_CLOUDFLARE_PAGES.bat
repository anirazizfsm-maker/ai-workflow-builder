@echo off
echo 🚀 Deploying Lethimdo to Cloudflare Pages

echo 🔧 Building the project...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully

echo 📝 Exact steps to deploy to Cloudflare Pages:
echo.
echo 1. Go to https://dash.cloudflare.com/
echo 2. Sign in to your Cloudflare account
echo 3. Click on "Pages" in the left sidebar
echo 4. Click "Create a project"
echo 5. Click "Connect to Git"
echo 6. Connect to GitHub and select repository: ai-workflow-builder
echo 7. Click "Begin setup"
echo.
echo Build Settings:
echo - Framework preset: None (or Vite if available)
echo - Build command: npm run build
echo - Build output directory: dist
echo - Root directory: /frontend
echo.
echo Environment Variables:
echo - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
echo - VITE_APP_NAME=Lethimdo
echo.
echo Custom Domains:
echo - Add www.lethimdo.com in Pages → Custom Domains
echo - Set CNAME www → the pages.dev target Cloudflare shows
echo.
echo For apex domain (lethimdo.com):
echo - Easiest: Move DNS to Cloudflare
echo - Alternative: Set URL redirect at registrar from apex → https://www.lethimdo.com
echo.
echo Click "Save and Deploy" to complete setup
echo.
echo 📋 After deployment, test these routes with hard-refresh:
echo - Homepage: https://www.lethimdo.com/
echo - Pricing: https://www.lethimdo.com/pricing
echo - Dashboard: https://www.lethimdo.com/dashboard
echo.
echo 🎉 Deployment instructions complete!
pause