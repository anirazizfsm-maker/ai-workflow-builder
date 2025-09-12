# Frontend-Backend Integration Guide

This guide will help you ensure proper integration between your frontend and backend services.

## 1. Frontend Environment Configuration

### Current Configuration
Your frontend [.env](file:///Users/user/lethimdo/frontend/.env) file is already properly configured with:
```env
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_APP_NAME=Lethimdo
```

### Verification Steps
1. Ensure the [.env](file:///Users/user/lethimdo/frontend/.env) file exists in the `frontend/` directory
2. Verify that `VITE_API_BASE_URL` points to your Render.com backend URL
3. Confirm that the file is not committed to version control (should be in [.gitignore](file:///Users/user/lethimdo/frontend/.gitignore))

## 2. Hosting Provider Environment Variables

### For Netlify
After deploying your frontend to Netlify, you need to add the same environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Environment variables"
3. Add the following variable:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   ```
4. Redeploy your site:
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"

### For Cloudflare Pages
If using Cloudflare Pages instead:

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" → "Environment variables"
3. Add the following variable:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   ```
4. Redeploy your site

## 3. Backend CORS Configuration

### Current Configuration
Your backend is already configured with proper CORS settings in [simple-server.js](file:///Users/user/lethimdo/backend/simple-server.js):

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
```

### Production Environment Variables
Ensure your Render.com backend has the correct environment variables in [.env.production](file:///Users/user/lethimdo/backend/.env.production):

```env
# Frontend URL
FRONTEND_URL=https://lethimdo.netlify.app
```

### Updating Render.com Environment Variables
To update environment variables on Render.com:

1. Go to https://dashboard.render.com
2. Select your backend service
3. Navigate to "Environment" tab
4. Update or add the following variable:
   ```
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   ```
5. Click "Save Changes"
6. The service will automatically redeploy with the new configuration

## 4. Verification Steps

### Test CORS Configuration
Run the following test to verify CORS is working:

```bash
curl -H "Origin: https://your-netlify-url.netlify.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://lethimdo-backend.onrender.com/health
```

You should see CORS headers in the response:
- `Access-Control-Allow-Origin: https://your-netlify-url.netlify.app`
- `Access-Control-Allow-Credentials: true`

### Test API Endpoints
Test a few key endpoints to ensure they're accessible:

```bash
# Health check
curl https://lethimdo-backend.onrender.com/health

# Authentication endpoint
curl https://lethimdo-backend.onrender.com/api/auth/me

# Integrations endpoint
curl https://lethimdo-backend.onrender.com/api/integrations
```

## 5. Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` environment variable is set correctly on Render.com
   - Verify that the Netlify URL matches exactly (including https://)
   - Check that the backend service has restarted after environment variable changes

2. **API Connection Failures**:
   - Verify that `VITE_API_BASE_URL` is set correctly in your frontend environment
   - Check that the backend is running and accessible
   - Ensure firewall settings allow connections

3. **Environment Variables Not Taking Effect**:
   - Confirm variables are set in the correct environment (development vs production)
   - Redeploy services after changing environment variables
   - Check for typos in variable names

### Debugging Steps

1. Check browser developer tools console for specific error messages
2. Verify network requests in the "Network" tab
3. Check backend logs in Render.com dashboard
4. Test endpoints directly with curl or Postman

## 6. Best Practices

1. **Environment Separation**:
   - Use different environment variables for development and production
   - Keep sensitive information in environment variables, not in code

2. **Security**:
   - Never commit environment files to version control
   - Use specific origins in CORS configuration rather than wildcards
   - Regularly rotate sensitive keys

3. **Monitoring**:
   - Set up monitoring for both frontend and backend services
   - Configure alerts for downtime or performance issues
   - Regularly test integration points

## 7. Next Steps

1. Deploy frontend with updated environment variables
2. Update backend environment variables if Netlify URL changes
3. Test integration thoroughly
4. Monitor for any issues after deployment