@echo off
echo ================================================================
echo   FRONTEND-BACKEND CONNECTIVITY TEST
echo ================================================================
echo.

echo 🇧🇩 Testing connectivity between your frontend and backend
echo for your Bangladesh freelance agency platform
echo.

echo ================================================================
echo   TESTING BACKEND DIRECTLY
echo ================================================================
echo.
echo Testing backend health endpoint...
powershell -Command "Invoke-WebRequest -Uri 'https://lethimdo-backend.onrender.com/health' -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.

echo ================================================================
echo   TESTING BACKEND API ENDPOINTS
echo ================================================================
echo.
echo Testing basic API info...
powershell -Command "Invoke-WebRequest -Uri 'https://lethimdo-backend.onrender.com/' -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.

echo.
echo Testing integrations endpoint...
powershell -Command "Invoke-WebRequest -Uri 'https://lethimdo-backend.onrender.com/api/integrations' -UseBasicParsing | Select-Object -ExpandProperty Content"
echo.

echo ================================================================
echo   CURRENT CONFIGURATION
echo ================================================================
echo.
echo Frontend URL: https://lethimdo.netlify.app
echo Backend URL: https://lethimdo-backend.onrender.com
echo.
echo When configured, these will be:
echo Frontend URL: https://lethimdo.com
echo Backend API URL: https://api.lethimdo.com
echo.

echo ================================================================
echo   NEXT STEPS
echo ================================================================
echo.
echo 1. Configure api.lethimdo.com subdomain in Hostinger DNS
echo 2. Add custom domain in Render.com dashboard
echo 3. Update frontend to use https://api.lethimdo.com
echo 4. Test end-to-end connectivity
echo.

echo 💰 Professional Benefits for Bangladesh Freelance Agency:
echo ✅ Clean API endpoints for client demos
echo ✅ Professional separation of frontend and backend
echo ✅ Industry-standard architecture
echo ✅ Better for international client presentations
echo.
pause