#!/bin/bash

# Lethimdo Production Setup Script

echo "🚀 Setting up Lethimdo for production..."

# 1. Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# 2. Install production dependencies
echo "📦 Installing production dependencies..."
cd backend
npm ci --only=production
cd ..

# 3. Run database migrations (if you add them later)
echo "🗄️ Setting up database..."
# npm run migrate:production

# 4. Start production server
echo "🚀 Starting production server..."
cd backend
npm start

echo "✅ Lethimdo is ready for production!"
echo "🌐 Frontend: Deploy the 'frontend/dist' folder to Netlify"
echo "🖥️ Backend: Deploy this backend folder to Render.com"
echo "📄 Don't forget to update environment variables!"