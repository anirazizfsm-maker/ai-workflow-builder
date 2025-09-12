@echo off
echo 🚀 Deploying Lethimdo Frontend to Netlify...

echo 🔧 Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully

echo 📤 Please deploy the contents of the 'dist' folder to Netlify manually:
echo 1. Go to https://app.netlify.com/
echo 2. Click "Add new site" → "Deploy manually"
echo 3. Drag and drop the 'dist' folder from your frontend directory
echo 4. Wait for deployment to complete

echo 📝 After deployment, make sure to:
echo 1. Set the environment variable VITE_API_BASE_URL to https://lethimdo-backend.onrender.com
echo 2. Verify that the _redirects file is included in the deployment

echo 🎉 Deployment preparation complete!
pause