# Lethimdo Cloudflare Pages Deployment

This document explains how to deploy the Lethimdo frontend to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. This repository connected to GitHub
3. The backend deployed and running (https://lethimdo-backend.onrender.com)

## Deployment Process

### Automated Deployment Preparation

Run either of these scripts to prepare for deployment:

- `DEPLOY_TO_CLOUDFLARE.bat` (Windows)
- `DEPLOY_TO_CLOUDFLARE.ps1` (PowerShell)

These scripts will:
1. Build the frontend locally to verify it works
2. Check that all required files are present
3. Provide deployment instructions
4. Open the detailed deployment guide

### Manual Deployment Steps

1. Go to https://dash.cloudflare.com/
2. Navigate to Pages > Create a project
3. Connect to your Git repository
4. Use these build settings:
   - Build command: `bash build-frontend.sh`
   - Build output directory: `frontend/dist`
5. Add environment variables:
   - `VITE_API_BASE_URL=https://lethimdo-backend.onrender.com`
   - `VITE_APP_NAME=Lethimdo`
6. Click "Save and Deploy"

## Configuration Files

- `wrangler.json`: Cloudflare Pages configuration
- `build-frontend.cjs`: Node.js build script
- `build-frontend.sh`: Shell script that executes the Node.js build script

## Troubleshooting

If the build fails:

1. Check that all configuration files are in the repository root
2. Verify the frontend directory structure is correct
3. Ensure environment variables are set correctly
4. Check Cloudflare build logs for specific error messages

## After Deployment

1. Test the application at the provided `*.pages.dev` URL
2. Hard-refresh (Ctrl+F5 or Cmd+Shift+R) several routes to verify SPA routing works
3. Check that API calls to the backend are working correctly