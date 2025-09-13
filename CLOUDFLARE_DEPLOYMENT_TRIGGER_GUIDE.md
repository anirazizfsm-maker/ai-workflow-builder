# Cloudflare Pages Deployment Trigger Guide

## Steps to Trigger a New Deployment

Since we've updated the configuration files, you'll need to trigger a new deployment in Cloudflare Pages for the changes to take effect.

### Option 1: Trigger a New Deployment from Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Sign in to your Cloudflare account
3. Click on "Pages" in the left sidebar
4. Select your project (ai-workflow-builder)
5. Click on "Deployments" tab
6. Click the "Create deployment" button
7. Select the branch you want to deploy (usually `main`)
8. Click "Save and Deploy"

### Option 2: Trigger Deployment via Git Push

We've already pushed the changes, so you can also trigger a deployment by making a small change and pushing it:

1. Make a small change to any file (e.g., add a comment)
2. Commit and push the change:
   ```
   git add .
   git commit -m "Trigger deployment"
   git push origin main
   ```

## Updated Configuration

The updated configuration now uses a shell script (`build-frontend.sh`) to execute the Node.js build script. This approach is more reliable on Cloudflare Pages.

## Expected Build Process

After triggering a new deployment, the build process should:

1. Clone the repository
2. Detect the `wrangler.json` file
3. Execute `bash build-frontend.sh` as the build command
4. The shell script will run `node ./build-frontend.cjs`
5. The Node.js script will:
   - Navigate to the frontend directory
   - Install dependencies
   - Build the application
   - Output to `frontend/dist`

## Troubleshooting

If the build still fails:

1. Check the build logs in Cloudflare Pages dashboard
2. Verify that all required files are in the repository:
   - `wrangler.json`
   - `build-frontend.cjs`
   - `build-frontend.sh`
3. Make sure the frontend directory structure is correct
4. Confirm environment variables are set:
   - `VITE_API_BASE_URL=https://lethimdo-backend.onrender.com`
   - `VITE_APP_NAME=Lethimdo`

## After Successful Deployment

Once the deployment succeeds:
1. Test the application at the provided `*.pages.dev` URL
2. Hard-refresh (Ctrl+F5 or Cmd+Shift+R) several routes to verify SPA routing works
3. Check that API calls to the backend are working correctly