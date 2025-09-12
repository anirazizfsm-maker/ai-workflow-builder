@echo off
echo 🧪 Frontend-Backend Integration Verification

echo.
echo Testing backend health endpoint...
curl -I https://lethimdo-backend.onrender.com/health
echo.
echo Testing authentication endpoint...
curl -I https://lethimdo-backend.onrender.com/api/auth/me
echo.
echo Testing integrations endpoint...
curl -I https://lethimdo-backend.onrender.com/api/integrations
echo.
echo.
echo 📝 To test CORS configuration, run this command in PowerShell:
echo.
echo curl -H "Origin: https://your-netlify-url.netlify.app" ^
-H "Access-Control-Request-Method: GET" ^
-H "Access-Control-Request-Headers: X-Requested-With" ^
-X OPTIONS ^
https://lethimdo-backend.onrender.com/health
echo.
echo Replace "your-netlify-url" with your actual Netlify deployment URL.
echo.
pause