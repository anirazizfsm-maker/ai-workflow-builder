@echo off
echo 🚀 Redeploying Frontend to Netlify

echo 🔧 Building the project...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully

echo 📤 Please follow these steps to redeploy to Netlify:
echo 1. Go to https://app.netlify.com/
echo 2. Select your site
echo 3. Go to "Deploys" in the left sidebar
echo 4. Click "Trigger deploy" → "Deploy site"
echo 5. Wait for deployment to complete

echo 📝 Make sure you have set the following environment variable in Netlify:
echo    VITE_API_BASE_URL=https://lethimdo-backend.onrender.com

echo 🎉 Redeployment instructions complete!
pause