@echo off
echo 🛠️  Render.com Environment Variables Update Helper

echo.
echo Please follow these steps to update your Render.com environment variables:
echo.
echo 1. Go to https://dashboard.render.com
echo 2. Select your backend service (lethimdo-backend)
echo 3. Navigate to the "Environment" tab
echo 4. Update or add the following variables:
echo.
echo    FRONTEND_URL=https://your-netlify-url.netlify.app
echo.
echo 5. Click "Save Changes"
echo 6. The service will automatically redeploy
echo.
echo Note: Replace "your-netlify-url" with your actual Netlify deployment URL.
echo.
echo After updating, test the integration with:
echo curl -H "Origin: https://your-netlify-url.netlify.app" ^
https://lethimdo-backend.onrender.com/health
echo.
pause