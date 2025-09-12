@echo off
echo 🚀 Deploying to Cloudflare Pages

echo 🔧 Building the project...
cd frontend
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully

echo 📝 To deploy to Cloudflare Pages:
echo 1. Go to https://dash.cloudflare.com/
echo 2. Click on "Pages" in the left sidebar
echo 3. Click "Create a project"
echo 4. Connect to your Git provider (GitHub, GitLab, etc.)
echo 5. Select your repository
echo 6. Configure build settings:
echo    - Build command: npm run build
echo    - Build output directory: dist
echo    - Root directory: /frontend (if applicable)
echo 7. Add environment variables:
echo    - VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
echo    - VITE_APP_NAME=Lethimdo
echo 8. Click "Save and Deploy"

echo 📂 Alternatively, you can deploy the dist folder manually:
echo 1. Zip the contents of the dist folder
echo 2. Go to Cloudflare Pages dashboard
echo 3. Click "Upload assets" instead of connecting to Git
echo 4. Upload your zip file

echo 🎉 Deployment instructions complete!
pause