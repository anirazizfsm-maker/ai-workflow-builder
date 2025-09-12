# Adding Environment Variables to Netlify and Redeploying

This guide will help you add the required environment variable to Netlify and redeploy your frontend.

## Step 1: Add Environment Variable to Netlify

1. Go to https://app.netlify.com/
2. Log in to your Netlify account
3. Select your site (lethimdo-frontend or similar)
4. In the left sidebar, click on "Site settings"
5. In the sidebar, under "Site settings", click on "Environment variables"
6. Click the "Add a variable" button
7. Add the following variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://lethimdo-backend.onrender.com`
8. Click "Save"

## Step 2: Redeploy the Frontend

After adding the environment variable, you need to redeploy your frontend:

1. In the left sidebar, click on "Deploys"
2. Click the "Trigger deploy" button
3. Select "Deploy site"
4. Wait for the deployment to complete (usually takes 1-2 minutes)

## Step 3: Verify the Deployment

1. Once deployment is complete, visit your site
2. Open your browser's developer tools (F12)
3. Go to the "Console" tab
4. Check for any errors related to API calls
5. Go to the "Network" tab and look for requests to your backend

## Troubleshooting

If you encounter any issues:

1. Make sure the environment variable was added correctly
2. Check that the redeployment completed successfully
3. Verify that the backend is accessible at https://lethimdo-backend.onrender.com/health
4. Check the browser console for specific error messages

## Additional Notes

- Environment variables prefixed with `VITE_` are embedded into your frontend build at build time
- Changes to environment variables require a redeployment to take effect
- You can have different environment variables for different deploy contexts (production, staging, etc.)# Adding Environment Variables to Netlify and Redeploying

This guide will help you add the required environment variable to Netlify and redeploy your frontend.

## Step 1: Add Environment Variable to Netlify

1. Go to https://app.netlify.com/
2. Log in to your Netlify account
3. Select your site (lethimdo-frontend or similar)
4. In the left sidebar, click on "Site settings"
5. In the sidebar, under "Site settings", click on "Environment variables"
6. Click the "Add a variable" button
7. Add the following variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://lethimdo-backend.onrender.com`
8. Click "Save"

## Step 2: Redeploy the Frontend

After adding the environment variable, you need to redeploy your frontend:

1. In the left sidebar, click on "Deploys"
2. Click the "Trigger deploy" button
3. Select "Deploy site"
4. Wait for the deployment to complete (usually takes 1-2 minutes)

## Step 3: Verify the Deployment

1. Once deployment is complete, visit your site
2. Open your browser's developer tools (F12)
3. Go to the "Console" tab
4. Check for any errors related to API calls
5. Go to the "Network" tab and look for requests to your backend

## Troubleshooting

If you encounter any issues:

1. Make sure the environment variable was added correctly
2. Check that the redeployment completed successfully
3. Verify that the backend is accessible at https://lethimdo-backend.onrender.com/health
4. Check the browser console for specific error messages

## Additional Notes

- Environment variables prefixed with `VITE_` are embedded into your frontend build at build time
- Changes to environment variables require a redeployment to take effect
- You can have different environment variables for different deploy contexts (production, staging, etc.)