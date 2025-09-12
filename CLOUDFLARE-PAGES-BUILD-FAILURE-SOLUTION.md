# Cloudflare Pages Build Failure Solution

## Problem Analysis

The build is failing with the error:
```
Error: Cannot find cwd: /opt/buildhome/repo/frontend
```

This indicates that Cloudflare Pages is looking for a frontend directory that doesn't exist in the location it expects.

## Root Cause

The issue is that your repository structure has the frontend code in a subdirectory (`/frontend`), but Cloudflare Pages isn't properly configured to recognize this structure. The error suggests that Cloudflare is trying to set the working directory to `/opt/buildhome/repo/frontend` but this path doesn't exist.

## Solutions

### Solution 1: Correct Cloudflare Pages Configuration (Recommended)

1. Go to your Cloudflare Pages project dashboard
2. Navigate to "Settings" → "Build & deployments"
3. In the "Build configurations" section, ensure:
   - **Build command**: `cd frontend && npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: Leave empty (or set to `/`)

Alternatively, if Cloudflare Pages has a specific "Root directory" setting:
- Set **Root directory** to `/frontend`

### Solution 2: Move Frontend Files to Repository Root (Alternative)

If the above doesn't work, you can restructure your repository to move frontend files to the root:

1. Move all files from `/frontend` directory to the repository root
2. Update any relative paths in your code if necessary
3. Update your backend deployment configuration if needed

### Solution 3: Use a Custom Build Script

Create a custom build script that handles the subdirectory structure:

1. In your repository root, create a `build.sh` file:
   ```bash
   #!/bin/bash
   cd frontend
   npm install
   npm run build
   ```

2. In Cloudflare Pages settings:
   - **Build command**: `bash build.sh`
   - **Build output directory**: `frontend/dist`

## Environment Variables

Make sure your environment variables are correctly set in Cloudflare Pages:
- `VITE_API_BASE_URL` = `https://lethimdo-backend.onrender.com`
- `VITE_APP_NAME` = `Lethimdo`

## Verification Steps

1. After making changes, trigger a new deployment
2. Check the build logs to ensure the build command runs successfully
3. Verify that the site deploys and is accessible
4. Test API connectivity by checking network requests in browser dev tools

## Bangladesh Freelance Agency Considerations

As a Bangladesh-based freelance agency:
- Cloudflare's free tier should be sufficient for most projects
- The global CDN will improve performance for international clients
- Make sure to test the deployment thoroughly before presenting to clients
- Keep your Netlify deployment as a backup during the transition

## Troubleshooting Tips

1. **Check Repository Structure**: Ensure your GitHub repository has the correct structure
2. **Verify Build Command**: Test the build command locally before deploying
3. **Check Environment Variables**: Ensure all required environment variables are set
4. **Review Build Logs**: Look for specific error messages in the build logs
5. **Contact Support**: If issues persist, Cloudflare support can help diagnose configuration issues