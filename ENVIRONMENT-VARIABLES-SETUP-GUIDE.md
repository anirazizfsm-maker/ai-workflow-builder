# Environment Variables Setup Guide

This guide explains where and how to add environment variables for the Lethimdo project.

## Current Environment Variables

You have two environment variables that need to be configured:

| Variable Name | Value |
|---------------|-------|
| VITE_API_BASE_URL | https://lethimdo-backend.onrender.com |
| VITE_APP_NAME | Lethimdo |

## 1. Local Development

For local development, these variables are stored in the `.env` file in the frontend directory.

**File Location**: `frontend/.env`

**Format**: 
```
VARIABLE_NAME=value
```

**Current Content**:
```
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_APP_NAME=Lethimdo
```

**How to Edit**:
1. Open `frontend/.env` in any text editor
2. Add or modify variables in the format `NAME=value`
3. Save the file
4. Restart your development server

## 2. Netlify Deployment

Netlify automatically reads environment variables from your `.env` file during the build process, so no additional configuration is needed.

If you want to override or add environment variables specifically for Netlify:
1. Go to your Netlify site dashboard
2. Navigate to "Site settings" → "Build & deploy" → "Environment"
3. Click "Edit variables"
4. Add variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://lethimdo-backend.onrender.com`
   
   - Key: `VITE_APP_NAME`
   - Value: `Lethimdo`
5. Click "Save"

## 3. Cloudflare Pages Deployment

For Cloudflare Pages, you need to add environment variables in the Cloudflare dashboard:

1. Go to the Cloudflare dashboard
2. Navigate to "Pages" → Select your project → "Settings" → "Environment variables"
3. Click "Add variable"
4. Add each variable:
   
   **First Variable**:
   - Variable name: `VITE_API_BASE_URL`
   - Value: `https://lethimdo-backend.onrender.com`
   - Click "Add variable"
   
   **Second Variable**:
   - Variable name: `VITE_APP_NAME`
   - Value: `Lethimdo`
   - Click "Add variable"
5. The variables will be available during the build process

## 4. Backend Environment Variables

For completeness, your backend also has environment variables that should be configured on Render.com:

**File Location**: `backend/.env` (for local development)
**Production**: Set in Render.com dashboard

Key variables:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `FRONTEND_URL`

## Important Notes

1. **VITE_ Prefix**: All frontend environment variables must start with `VITE_` to be accessible in Vite applications
2. **Security**: Never commit sensitive values to version control
3. **Restart Required**: After changing environment variables locally, restart your development server
4. **Rebuild Needed**: After changing environment variables in deployment platforms, you need to trigger a new build

## Verification

To verify your environment variables are working:

1. **Local**: Check browser console for `import.meta.env.VITE_API_BASE_URL`
2. **Deployed**: Check network requests to ensure API calls go to the correct URL

## Troubleshooting

If environment variables aren't working:

1. Check the spelling of variable names
2. Ensure `VITE_` prefix for frontend variables
3. Restart development server after local changes
4. Trigger a new build after deployment changes
5. Check deployment logs for any errors