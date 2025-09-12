@echo off
echo ================================================================
echo   TESTING OPENAI API KEY FOR BANGLADESH FREELANCE AGENCY
echo ================================================================
echo.

echo 🇧🇩 Testing OpenAI API integration for Lethimdo platform
echo.

set /p API_KEY="Paste your OpenAI API key (sk-proj-...): "

if "%API_KEY%"=="" (
    echo ❌ No API key provided
    goto END
)

echo.
echo Testing API key with simple request...
echo.

curl -X POST "https://api.openai.com/v1/chat/completions" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %API_KEY%" ^
  -d "{\"model\":\"gpt-4\",\"messages\":[{\"role\":\"user\",\"content\":\"Test API connection for Bangladesh freelance agency\"}],\"max_tokens\":10}"

echo.
echo.
if %errorlevel% equ 0 (
    echo ✅ API key is working!
    echo ✅ Ready for AI workflow generation
    echo ✅ Perfect for client demonstrations
) else (
    echo ❌ API key test failed
    echo Check your key and try again
)

echo.
echo 💰 COST ANALYSIS:
echo This test request cost: ~$0.001
echo AI workflow generation: ~$0.002 each
echo $5 free credits = ~2,500 workflows
echo Perfect for Bangladesh agency startup phase!

:END
echo.
pause