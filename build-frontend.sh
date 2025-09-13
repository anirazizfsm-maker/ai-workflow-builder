#!/bin/bash
# Cloudflare Pages build script

echo "Starting Cloudflare Pages build process..."
echo "Current working directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Execute the Node.js build script
node ./build-frontend.cjs