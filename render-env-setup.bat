@echo off
echo ========================================
echo Render.com Environment Variables Setup
echo ========================================
echo.
echo Copy these variables to your Render.com dashboard:
echo Go to: https://dashboard.render.com
echo Select: lethimdo-backend service
echo Tab: Environment
echo.
echo ========================================
echo CORE VARIABLES (Required - Add these first):
echo ========================================
echo.
echo NODE_ENV=production
echo PORT=10000
echo FRONTEND_URL=https://lethimdo.netlify.app
echo JWT_SECRET=lethimdo_bangladesh_freelance_agency_2024_secure_jwt_token_32chars_minimum
echo.
echo ========================================
echo OPENAI VARIABLES (Add when you have API key):
echo ========================================
echo.
echo OPENAI_API_KEY=sk-your_actual_openai_api_key_here
echo OPENAI_MODEL=gpt-4
echo OPENAI_MAX_TOKENS=2000
echo.
echo ========================================
echo OPTIONAL VARIABLES (For enhanced features):
echo ========================================
echo.
echo JWT_EXPIRES_IN=7d
echo BCRYPT_ROUNDS=12
echo FROM_EMAIL=noreply@lethimdo.com
echo RATE_LIMIT_WINDOW_MS=900000
echo RATE_LIMIT_MAX_REQUESTS=100
echo MAX_FILE_SIZE=10485760
echo ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf,text/csv
echo.
echo ========================================
echo NEXT STEPS:
echo ========================================
echo 1. Add the CORE VARIABLES first
echo 2. Deploy your service and test
echo 3. Get OpenAI API key from: https://platform.openai.com/api-keys
echo 4. Add OPENAI VARIABLES
echo 5. Redeploy and test AI features
echo.
echo ========================================
echo Bangladesh Freelance Agency Deployment
echo Professional setup for international clients
echo ========================================
pause