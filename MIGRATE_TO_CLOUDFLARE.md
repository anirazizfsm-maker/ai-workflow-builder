# Migrating from Netlify to Cloudflare Pages

This guide will help you migrate your Lethimdo frontend from Netlify to Cloudflare Pages.

## Why Migrate to Cloudflare Pages?

Cloudflare Pages offers several advantages:
- Global CDN with excellent performance
- Free tier with generous limits
- Tight integration with Cloudflare's other services
- Built-in CI/CD with GitHub integration
- Workers integration for serverless functions

## What Happens If You Erase Everything from Netlify?

If you erase everything from Netlify:
1. **Your current site will go offline** until you deploy it elsewhere
2. **Custom domain settings will be lost** (you'll need to reconfigure them)
3. **Environment variables will be lost** (you'll need to reconfigure them)
4. **Analytics and monitoring data will be lost**
5. **Form submissions and other Netlify-specific features will stop working**

However, your source code and local files will remain intact, so you can redeploy elsewhere.

## Migration Steps

### Step 1: Prepare Your Project for Cloudflare Pages

1. **Remove Netlify-specific files** (optional):
   ```bash
   cd frontend
   rm netlify.toml
   rm deploy-to-netlify.bat
   rm -rf .netlify/
   ```

2. **Create Cloudflare Pages configuration**:
   Create a `_routes.json` file in your `public` directory:
   ```json
   {
     "version": 1,
     "include": ["/*"],
     "exclude": []
   }
   ```

3. **Ensure your _redirects file exists** (for SPA routing):
   Make sure `public/_redirects` exists with:
   ```
   /* /index.html 200
   ```

### Step 2: Set Up Cloudflare Pages

1. Go to https://dash.cloudflare.com/
2. Sign in or create an account
3. Click on "Pages" in the left sidebar
4. Click "Create a project"
5. Connect to your Git provider (GitHub, GitLab, etc.)
6. Select your repository
7. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/frontend` (if your frontend is in a subdirectory)

### Step 3: Configure Environment Variables

In Cloudflare Pages dashboard:
1. Go to your project settings
2. Navigate to "Environment variables"
3. Add the following variables:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   VITE_APP_NAME=Lethimdo
   ```

### Step 4: Deploy to Cloudflare Pages

1. After configuring build settings and environment variables, Cloudflare will automatically deploy
2. Wait for the deployment to complete
3. Note the provided *.pages.dev URL

### Step 5: Configure Custom Domain (Optional)

1. In your project settings, go to "Custom domains"
2. Add your custom domain
3. Follow Cloudflare's DNS configuration instructions
4. Update your domain's nameservers to Cloudflare if needed

## Configuration Comparison

| Feature | Netlify | Cloudflare Pages |
|---------|---------|------------------|
| Build Command | `npm run build` | `npm run build` |
| Output Directory | `dist` | `dist` |
| SPA Routing | `_redirects` file | `_routes.json` + `_redirects` |
| Environment Variables | Dashboard UI | Dashboard UI |
| Custom Domains | Supported | Supported |
| Free Tier | Generous | Generous |

## Important Considerations

### CORS Configuration
Your backend CORS settings should already work with Cloudflare Pages since they're based on the origin URL. Just make sure to update the `FRONTEND_URL` environment variable in your Render.com backend if you change domains:

In Render.com dashboard:
```
FRONTEND_URL=https://your-project.pages.dev
```

### Environment Variables
Cloudflare Pages environment variables work similarly to Netlify:
- Variables prefixed with `VITE_` are embedded in the client-side build
- Changes require a redeploy to take effect

## Testing Your Migration

1. Visit your new Cloudflare Pages URL
2. Check that all pages load correctly
3. Verify API calls to your backend work
4. Test all forms and interactive elements
5. Check mobile responsiveness

## Rollback Plan

If you encounter issues with Cloudflare Pages:
1. You can redeploy to Netlify using your existing configuration
2. Simply run the deploy-to-netlify.bat script or use the Netlify dashboard
3. Your Netlify configuration files are still in version control

## Bangladesh Freelance Agency Considerations

As a Bangladesh-based freelance agency:
- Cloudflare has excellent global performance, including in Bangladesh
- The free tier should be sufficient for most agency needs
- Cloudflare's security features provide additional protection for client projects
- Integration with other Cloudflare services can be beneficial for scaling

## Next Steps

1. Set up Cloudflare Pages following the steps above
2. Test thoroughly before switching DNS
3. Update any documentation to reflect the new hosting provider
4. Configure monitoring and analytics on Cloudflare
5. Inform any stakeholders about the migration