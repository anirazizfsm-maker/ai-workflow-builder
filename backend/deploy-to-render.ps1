# Render.com Deployment Script for Lethimdo Backend (PowerShell)
# Run this script from your backend directory

Write-Host "🚀 Starting Render.com deployment preparation..." -ForegroundColor Green

# Step 1: Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from your backend directory." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found package.json - in correct directory" -ForegroundColor Green

# Step 2: Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}

# Step 3: Add and commit files
Write-Host "📝 Adding files to git..." -ForegroundColor Yellow
git add .
git status

Write-Host "💾 Committing changes..." -ForegroundColor Yellow
try {
    git commit -m "Prepare backend for Render.com deployment"
    Write-Host "✅ Changes committed" -ForegroundColor Green
} catch {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Step 4: Check if remote origin exists
try {
    $remoteUrl = git remote get-url origin 2>$null
    if ($remoteUrl) {
        Write-Host "✅ Git remote origin already configured: $remoteUrl" -ForegroundColor Green
        Write-Host "🔄 Pushing to existing repository..." -ForegroundColor Yellow
        git push
    }
} catch {
    Write-Host "⚠️  No git remote origin found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
    Write-Host "   - Go to https://github.com/new" -ForegroundColor Gray
    Write-Host "   - Repository name: lethimdo-backend" -ForegroundColor Gray
    Write-Host "   - Make it public" -ForegroundColor Gray
    Write-Host "   - Don't initialize with README (since you already have files)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Add the remote and push:" -ForegroundColor White
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/lethimdo-backend.git" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "🎯 Render.com Deployment Instructions:" -ForegroundColor Magenta
Write-Host "==================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "1. 🌐 Go to https://render.com and sign up/login" -ForegroundColor White
Write-Host ""
Write-Host "2. 🔗 Connect your GitHub account" -ForegroundColor White
Write-Host ""
Write-Host "3. ➕ Create new Web Service:" -ForegroundColor White
Write-Host "   - Click 'New +' → 'Web Service'" -ForegroundColor Gray
Write-Host "   - Select your lethimdo-backend repository" -ForegroundColor Gray
Write-Host "   - Click 'Connect'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ⚙️  Configure deployment settings:" -ForegroundColor White
Write-Host "   Name: lethimdo-backend" -ForegroundColor Gray
Write-Host "   Region: Frankfurt (closest to Bangladesh)" -ForegroundColor Gray
Write-Host "   Branch: main" -ForegroundColor Gray
Write-Host "   Root Directory: (leave empty)" -ForegroundColor Gray
Write-Host "   Runtime: Node" -ForegroundColor Gray
Write-Host "   Build Command: npm install" -ForegroundColor Gray
Write-Host "   Start Command: npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "5. 🔐 Add Environment Variables:" -ForegroundColor White
Write-Host "   NODE_ENV=production" -ForegroundColor Gray
Write-Host "   PORT=10000" -ForegroundColor Gray
Write-Host "   FRONTEND_URL=https://your-netlify-app.netlify.app" -ForegroundColor Gray
Write-Host "   JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters" -ForegroundColor Gray
Write-Host ""
Write-Host "6. 🚀 Click 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "7. 🔍 Monitor deployment in the logs" -ForegroundColor White
Write-Host ""
Write-Host "8. ✅ Test your deployed API:" -ForegroundColor White
Write-Host "   https://lethimdo-backend.onrender.com/health" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Your backend will be available at:" -ForegroundColor Cyan
Write-Host "   https://lethimdo-backend.onrender.com" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Complete guide available in: RENDER-DEPLOYMENT-GUIDE.md" -ForegroundColor White
Write-Host ""