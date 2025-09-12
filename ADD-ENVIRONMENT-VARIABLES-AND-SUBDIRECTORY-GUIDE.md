# Adding Environment Variables and Subdirectory Configuration

This guide explains how to properly configure environment variables and subdirectory settings for deploying your Lethimdo frontend to Netlify or Cloudflare Pages.

## Current Configuration Status

✅ **Environment Variables**: Already configured in [`.env`](file:///C:/Users/user/lethimdo/frontend/.env) file
✅ **Subdirectory Configuration**: Already configured in [`netlify.toml`](file:///C:/Users/user/lethimdo/frontend/netlify.toml)
✅ **SPA Routing**: Already configured with [`_redirects`](file:///C:/Users/user/lethimdo/frontend/public/_redirects) file

## Environment Variables

Your frontend already has the required environment variables in the [`.env`](file:///C:/Users/user/lethimdo/frontend/.env) file:

```
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_APP_NAME=Lethimdo
```

These variables are automatically picked up during the build process.

### For Netlify Deployment

Netlify automatically reads environment variables from your `.env` file during build time. No additional configuration is needed.

### For Cloudflare Pages Deployment

When setting up Cloudflare Pages, you'll need to add these same environment variables in the Cloudflare dashboard:

1. In the "Set up builds and deployments" section
2. Expand "Environment variables"
3. Add:
   - `VITE_API_BASE_URL` = `https://lethimdo-backend.onrender.com`
   - `VITE_APP_NAME` = `Lethimdo`

## Subdirectory Configuration

### For Netlify

The subdirectory configuration is already set up in [`netlify.toml`](file:///C:/Users/user/lethimdo/frontend/netlify.toml):

```toml
[build]
publish = "dist"
command = "npm run build"
```

This tells Netlify to:
- Run `npm run build` to build your project
- Publish the contents of the `dist` directory

### For Cloudflare Pages

When setting up Cloudflare Pages, you'll need to specify these settings in the dashboard:

1. **Build command**: `npm run build`
2. **Build output directory**: `dist`
3. **Root directory**: `/frontend` (since your frontend code is in the frontend subdirectory)

## SPA Routing Configuration

Both Netlify and Cloudflare Pages support SPA routing through redirect rules.

Your project already includes a [`_redirects`](file:///C:/Users/user/lethimdo/frontend/public/_redirects) file in the `public` directory:

```
/* /index.html 200
```

This ensures that all routes are redirected to `index.html`, allowing React Router to handle client-side routing.

## Deployment Steps

### For Netlify

1. Push your code to GitHub
2. Connect Netlify to your GitHub repository
3. Netlify will automatically detect the build settings from `netlify.toml`
4. No additional configuration needed

### For Cloudflare Pages

1. Go to the Cloudflare dashboard
2. Navigate to Pages → Create a project
3. Connect to your GitHub repository
4. Select your repository
5. In "Set up builds and deployments":
   - Set Framework preset to "None" or "Vite"
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/frontend`
6. Add environment variables:
   - `VITE_API_BASE_URL` = `https://lethimdo-backend.onrender.com`
   - `VITE_APP_NAME` = `Lethimdo`
7. Click "Save and Deploy"

## Verification

After deployment, test these URLs with hard refresh (Ctrl+F5 or Cmd+Shift+R):

- Homepage: `https://your-domain.com/`
- Pricing: `https://your-domain.com/pricing`
- Dashboard: `https://your-domain.com/dashboard`

If any route returns a 404 error, check that:
1. The `_redirects` file is in the `public` directory
2. The file is being copied to the `dist` directory during build
3. Environment variables are correctly set

## Troubleshooting

### Environment Variables Not Working

1. Verify the variables are correctly set in the hosting platform's dashboard
2. Check that variable names start with `VITE_` (required for Vite)
3. Redeploy after making changes to environment variables

### Subdirectory Issues

1. Ensure the build command and output directory match your project structure
2. Verify that the root directory is set correctly if your frontend code is in a subdirectory
3. Check that all import paths in your code are relative or properly aliased

### SPA Routing Issues

1. Confirm the `_redirects` file exists in the `public` directory
2. Check that the file is included in the build output
3. Verify the redirect rule format: `/* /index.html 200`