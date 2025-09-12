#!/bin/bash
# Build script for Cloudflare Pages deployment
# This script handles the subdirectory structure of the repository

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if we're in the right directory
if [ -d "frontend" ]; then
    echo "Found frontend directory. Changing to frontend directory..."
    cd frontend
    
    echo "Installing dependencies..."
    npm install
    
    echo "Building frontend application..."
    npm run build
    
    echo "Build completed successfully!"
    echo "Build output is in dist directory"
else
    echo "ERROR: frontend directory not found!"
    echo "Current directory contents:"
    ls -la
    exit 1
fi