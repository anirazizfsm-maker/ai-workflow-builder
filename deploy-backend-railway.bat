@echo off
echo ================================================================
echo   RENDER.COM BACKEND DEPLOYMENT FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 Deploying Lethimdo AI Platform Backend to Render.com
echo.

echo ================================================================
echo   CHECKING PREREQUISITES
echo ================================================================
echo.

echo This script will guide you through deploying to Render.com
echo You'll need to use the Render.com web dashboard:
echo https://dashboard.render.com
echo.

echo ================================================================
echo   RENDER.COM DEPLOYMENT SETUP
echo ================================================================
echo.

echo 1. Go to: https://dashboard.render.com
echo 2. Sign up/login with GitHub
echo 3. Click "New +" → "Web Service"
echo 4. Connect your GitHub repository
echo 5. Select: lethimdo-ai-platform
echo.

echo ================================================================
echo   RENDER.COM CONFIGURATION
echo ================================================================
echo.

echo Set these configuration values:
echo.
echo Name: lethimdo-backend
echo Region: Frankfurt (closest to Bangladesh)
echo Branch: main
echo Root Directory: backend
echo Runtime: Node
echo Build Command: npm install
echo Start Command: npm start
echo.

echo ================================================================
echo   ENVIRONMENT VARIABLES SETUP
echo ================================================================
echo.

echo Add these environment variables in Render.com dashboard:
echo.
echo NODE_ENV=production
echo PORT=10000
echo JWT_SECRET=your_secure_jwt_secret_here_minimum_32_characters
echo FRONTEND_URL=https://your-netlify-app.netlify.app
echo.
echo Optional (for AI features):
echo OPENAI_API_KEY=sk-your_openai_api_key_here
echo OPENAI_MODEL=gpt-4
echo OPENAI_MAX_TOKENS=2000
echo.

echo ================================================================
echo   DEPLOYMENT PROCESS
echo ================================================================
echo.

echo 1. Click "Create Web Service"
echo 2. Watch the build logs in real-time
echo 3. Deployment should complete in 2-3 minutes
echo 4. Your backend will be available at:
echo    https://lethimdo-backend-xxxx.onrender.com
echo.

echo ================================================================
echo   TESTING DEPLOYMENT
echo ================================================================
echo.

echo Test your deployment:
echo.
echo 1. Visit your backend URL
echo 2. Add "/health" to test health endpoint
echo    Example: https://lethimdo-backend-xxxx.onrender.com/health
echo 3. Should return JSON with status "OK"
echo.

echo ================================================================
echo   TROUBLESHOOTING
echo ================================================================
echo.

echo Common issues and solutions:
echo.
echo 1. Build errors:
echo    → Check package.json and dependencies
echo    → Ensure all required packages are in dependencies
echo.
echo 2. Environment variables:
echo    → Add all required variables in Render.com dashboard
echo    → Especially OPENAI_API_KEY for AI features
echo.
echo 3. Start command issues:
echo    → Verify "npm start" matches package.json
echo    → Check that server listens on process.env.PORT
echo.
echo 4. Application errors:
echo    → Check application logs in Render.com dashboard
echo    → Look for specific error messages
echo.

echo Opening Render.com dashboard...
start https://dashboard.render.com

echo.
echo ================================================================
echo   🎉 BACKEND DEPLOYMENT GUIDE COMPLETE!
echo ================================================================
echo.
echo 🇧🇩 BANGLADESH FREELANCE AGENCY STATUS:
echo ✅ Professional backend API ready for deployment
echo ✅ Global Render.com infrastructure 
echo ✅ Auto-scaling enabled
echo ✅ Ready for international clients
echo.
echo 💰 COST ANALYSIS:
echo Render.com Free Tier: 750 hours/month free
echo OpenAI API: ~$5-20/month (pay-as-use)
echo Total: FREE for development, ~$5-25/month for production
echo.
echo 🚀 NEXT STEPS:
echo 1. ✅ Deploy backend to Render.com using instructions above
echo 2. 🔄 Update frontend to use live API URL
echo 3. 🧪 Test AI workflow generation
echo 4. 📝 Update documentation with API endpoints
echo 5. 👥 Ready for client demonstrations!
echo.
echo 🌐 YOUR FUTURE LIVE API:
echo Backend URL: https://lethimdo-backend-xxxx.onrender.com
echo Health Check: https://lethimdo-backend-xxxx.onrender.com/health
echo API Docs: https://lethimdo-backend-xxxx.onrender.com/api
echo.
echo 📊 CLIENT DEMO ENDPOINTS:
echo Authentication: https://lethimdo-backend-xxxx.onrender.com/api/auth
echo AI Workflows: https://lethimdo-backend-xxxx.onrender.com/api/ai
echo Analytics: https://lethimdo-backend-xxxx.onrender.com/api/analytics
echo.
echo 🎯 BUSINESS READINESS:
echo ✅ Professional API for client demos
echo ✅ Scalable infrastructure for growth  
echo ✅ Cost-effective hosting (~$1-5 per client/month)
echo ✅ Global accessibility for international market
echo.

echo.
echo Press any key to exit...
pause >nul