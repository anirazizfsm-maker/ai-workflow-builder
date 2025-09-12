# Cloudflare Pages Setup for Lethimdo

## Exact, Copy-Paste Steps for Cloudflare Pages Deployment

### 1. Connect Repository

1. Go to https://dash.cloudflare.com/
2. Sign in to your Cloudflare account
3. Click on "Pages" in the left sidebar
4. Click "Create a project"
5. Click "Connect to Git"
6. Connect to GitHub (or your Git provider)
7. Select repository: `ai-workflow-builder`
8. Click "Begin setup"

### 2. Framework Preset and Build Settings

In the "Set up builds and deployments" section:

- **Framework preset**: None (or Vite if available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/frontend`

### 3. Environment Variables

In the "Environment variables" section, add:

```
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_APP_NAME=Lethimdo
```

Note: We don't need VITE_CONVEX_URL since your project no longer uses Convex.

### 4. SPA Routing Configuration

Cloudflare Pages automatically handles SPA routing when you have a `_redirects` file in your public directory. Your project already has this file with the correct content:

```
/* /index.html 200
```

This is equivalent to enabling "Serve this project as a Single-Page Application" in Cloudflare Pages.

### 5. Custom Domain Setup

#### For www.lethimdo.com:

1. In Cloudflare Pages dashboard, go to your project
2. Click "Custom domains" tab
3. Click "Add custom domain"
4. Enter: `www.lethimdo.com`
5. Click "Continue"
6. Cloudflare will show you the CNAME target (something like `your-project.pages.dev`)
7. Go to your DNS provider (Hostinger) and add a CNAME record:
   - Name: `www`
   - Type: `CNAME`
   - Content: `your-project.pages.dev` (use the exact value Cloudflare provides)
   - TTL: Auto or 1 hour

#### For apex domain (lethimdo.com):

The easiest approach is to move your DNS to Cloudflare:

1. In Cloudflare dashboard, add your domain `lethimdo.com`
2. Follow Cloudflare's instructions to update nameservers at your registrar (Hostinger)
3. Wait for DNS propagation (24-48 hours)
4. Back in Pages project, add `lethimdo.com` as a custom domain
5. Cloudflare will automatically configure the apex domain

Alternative approach (URL redirect):
1. At your registrar (Hostinger), set up a URL redirect from `lethimdo.com` to `https://www.lethimdo.com`

### 6. Deploy

1. Click "Save and Deploy"
2. Wait for the deployment to complete (usually 2-5 minutes)
3. Note the provided `*.pages.dev` URL for testing

### 7. After Switching - Testing Checklist

After deployment completes, test these routes with hard-refresh (Ctrl+F5 or Cmd+Shift+R):

- [ ] Homepage: `https://www.lethimdo.com/`
- [ ] Pricing: `https://www.lethimdo.com/pricing`
- [ ] Dashboard: `https://www.lethimdo.com/dashboard`
- [ ] Any other key routes in your application

### 8. Troubleshooting

#### If you see a blank page or 404 on route refresh:
- ✅ Your `_redirects` file is already correctly configured
- Redeploy if you made any changes

#### If API calls fail:
- ✅ Check that `VITE_API_BASE_URL` is set to `https://lethimdo-backend.onrender.com`
- Redeploy after verifying environment variables

#### If you see "Welcome to Cloudflare" page:
- Wait a few minutes for DNS propagation
- Check that your CNAME record points to the correct `*.pages.dev` target

### 9. Bangladesh Freelance Agency Considerations

As a Bangladesh-based freelance agency using Cloudflare:
- Cloudflare's global network provides excellent performance for international clients
- The free tier is sufficient for most agency projects
- Cloudflare's security features protect client data
- Easy integration with other Cloudflare services if needed in the future

### 10. Migration from Netlify (if applicable)

If you're migrating from Netlify:
1. You can keep your Netlify site as a backup during migration
2. After confirming Cloudflare deployment works, you can delete the Netlify site
3. Update any documentation or client communications about the new URLs

## Next Steps

1. Follow the steps above to set up Cloudflare Pages
2. Test thoroughly before updating DNS records
3. Monitor performance and uptime
4. Set up analytics and monitoring as needed