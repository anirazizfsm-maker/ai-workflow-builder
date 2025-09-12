#!/bin/bash

# Render.com Deployment Script for Lethimdo Backend
# Run this script from your backend directory

echo "🚀 Starting Render.com deployment preparation..."

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from your backend directory."
    exit 1
fi

echo "✅ Found package.json - in correct directory"

# Step 2: Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Step 3: Add and commit files
echo "📝 Adding files to git..."
git add .
git status

echo "💾 Committing changes..."
git commit -m "Prepare backend for Render.com deployment" || echo "No changes to commit"

# Step 4: Check if remote origin exists
if git remote get-url origin 2>/dev/null; then
    echo "✅ Git remote origin already configured"
    echo "🔄 Pushing to existing repository..."
    git push
else
    echo "⚠️  No git remote origin found"
    echo "📋 Next steps:"
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to https://github.com/new"
    echo "   - Repository name: lethimdo-backend"
    echo "   - Make it public"
    echo "   - Don't initialize with README (since you already have files)"
    echo ""
    echo "2. Add the remote and push:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/lethimdo-backend.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

echo ""
echo "🎯 Render.com Deployment Instructions:"
echo "=================================="
echo ""
echo "1. 🌐 Go to https://render.com and sign up/login"
echo ""
echo "2. 🔗 Connect your GitHub account"
echo ""
echo "3. ➕ Create new Web Service:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Select your lethimdo-backend repository"
echo "   - Click 'Connect'"
echo ""
echo "4. ⚙️  Configure deployment settings:"
echo "   Name: lethimdo-backend"
echo "   Region: Frankfurt (closest to Bangladesh)"
echo "   Branch: main"
echo "   Root Directory: (leave empty)"
echo "   Runtime: Node"
echo "   Build Command: npm install"
echo "   Start Command: npm start"
echo ""
echo "5. 🔐 Add Environment Variables:"
echo "   NODE_ENV=production"
echo "   PORT=10000"
echo "   FRONTEND_URL=https://your-netlify-app.netlify.app"
echo "   JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters"
echo ""
echo "6. 🚀 Click 'Create Web Service'"
echo ""
echo "7. 🔍 Monitor deployment in the logs"
echo ""
echo "8. ✅ Test your deployed API:"
echo "   https://lethimdo-backend.onrender.com/health"
echo ""
echo "💡 Your backend will be available at:"
echo "   https://lethimdo-backend.onrender.com"
echo ""
echo "📚 Complete guide available in: RENDER-DEPLOYMENT-GUIDE.md"
echo ""