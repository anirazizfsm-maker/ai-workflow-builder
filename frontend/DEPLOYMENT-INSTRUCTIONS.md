# Lethimdo Frontend Deployment Instructions

## Prerequisites
- A Netlify account
- The project built successfully

## Deployment Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Deploy to Netlify
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `dist` folder from your frontend directory
4. Wait for deployment to complete

### 3. Configure Environment Variables
After deployment, go to your site settings in Netlify and add the following environment variable:
- `VITE_API_BASE_URL` = `https://lethimdo-backend.onrender.com`

### 4. Verify Deployment
Check that:
1. The `_redirects` file is included in your deployment (for SPA routing)
2. The site loads correctly at your Netlify URL
3. API calls to the backend are working

## SPA Routing
The `_redirects` file in the `public` directory ensures proper SPA routing:
```
/* /index.html 200
```

This redirects all routes to index.html, allowing React Router to handle client-side routing.

## Troubleshooting
If you encounter issues:
1. Make sure the `_redirects` file is in the `public` directory
2. Verify environment variables are set correctly
3. Check browser console for any errors