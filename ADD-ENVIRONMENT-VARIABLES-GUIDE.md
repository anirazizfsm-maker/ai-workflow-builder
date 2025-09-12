# 🎯 HOW TO ADD ENVIRONMENT VARIABLES

## 🎯 **ADDING VITE ENVIRONMENT VARIABLES**

You're asking about these specific environment variables:
```
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_APP_NAME=Lethimdo
```

These are frontend environment variables that need to be configured in different places depending on your deployment method.

## 🚀 **FOR LOCAL DEVELOPMENT**

### **STEP 1: CREATE/EDIT .env FILE**
1. Navigate to your frontend directory: `c:\Users\user\lethimdo\frontend`
2. Create or edit the `.env` file
3. Add these lines:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   VITE_APP_NAME=Lethimdo
   ```

### **STEP 2: RESTART DEVELOPMENT SERVER**
1. If your development server is running, stop it (Ctrl+C)
2. Start it again with: `npm run dev`

For detailed instructions on restarting your development server, see: 
- [RESTART-DEVELOPMENT-SERVER-GUIDE.md](RESTART-DEVELOPMENT-SERVER-GUIDE.md)
- [FRONTEND-DEVELOPMENT-SERVER-GUIDE.md](FRONTEND-DEVELOPMENT-SERVER-GUIDE.md)

## 🌐 **FOR NETLIFY DEPLOYMENT**

### **STEP 1: ACCESS NETLIFY DASHBOARD**
1. Go to: https://app.netlify.com
2. Login to your Netlify account
3. Select your deployed site

### **STEP 2: ADD ENVIRONMENT VARIABLES**
1. Go to **"Site settings"**
2. Click **"Environment variables"** in the left sidebar
3. Click **"Add variable"**
4. Add the first variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://lethimdo-backend.onrender.com`
5. Click **"Add variable"** again
6. Add the second variable:
   - **Key**: `VITE_APP_NAME`
   - **Value**: `Lethimdo`

### **STEP 3: REDeploy YOUR SITE**
1. Go to **"Deploys"** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for deployment to complete

## 🔧 **FOR MANUAL BUILD PROCESS**

### **STEP 1: CREATE .env.production FILE**
1. In your frontend directory, create `.env.production`
2. Add these lines:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   VITE_APP_NAME=Lethimdo
   ```

### **STEP 2: BUILD YOUR PROJECT**
1. Run: `npm run build`
2. The build will use these environment variables

## 🔍 **VARIABLE EXPLANATIONS**

### **VITE_API_BASE_URL**
- **Purpose**: Points to your backend API
- **Value**: `https://lethimdo-backend.onrender.com`
- **Usage**: All API calls in your frontend will use this base URL

### **VITE_APP_NAME**
- **Purpose**: Application name for branding
- **Value**: `Lethimdo`
- **Usage**: Displayed in titles, headers, etc.

## 🧪 **VERIFYING THE VARIABLES ARE WORKING**

### **In Your React Components:**
You can access these variables in your React components like this:
```javascript
// Access the API base URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Access the app name
const appName = import.meta.env.VITE_APP_NAME;

console.log('API Base URL:', apiBaseUrl);
console.log('App Name:', appName);
```

### **Testing in Browser Console:**
1. Open your deployed site
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   console.log(import.meta.env.VITE_APP_NAME)
   ```
5. You should see the values printed

## 🚨 **IMPORTANT NOTES**

### **Variable Naming Convention:**
- Must start with `VITE_` to be exposed to Vite frontend
- Case sensitive
- No spaces or special characters (except underscore)

### **Security Considerations:**
- These variables are visible in client-side code
- Never put secrets like API keys in VITE_ variables
- Only put non-sensitive configuration values

### **Common Issues:**
1. **Variables not updating**: Restart development server
2. **Variables not showing**: Check spelling (VITE_ prefix)
3. **Production vs Development**: Use correct .env files

## ⏰ **AFTER ADDING VARIABLES**

### **For Local Development:**
1. Restart your development server
2. Test API calls in your application
3. Verify the app name displays correctly

### **For Netlify Deployment:**
1. Trigger a new deployment
2. Test the deployed site
3. Check browser console for variable values

## 📞 **TROUBLESHOOTING**

### **If Variables Are Not Working:**
1. Check spelling of variable names
2. Ensure they start with `VITE_`
3. Restart development server
4. For Netlify: Trigger a new deployment
5. Check browser console for errors

### **If API Calls Are Not Working:**
1. Verify `VITE_API_BASE_URL` is correct
2. Check that your backend is running
3. Ensure CORS is configured properly
4. Test the API URL directly in browser

## 🇧🇩 **BANGLADESH FREELANCE AGENCY NOTES**

### **Why These Variables Matter:**
- **VITE_API_BASE_URL**: Connects your frontend to your backend services
- **VITE_APP_NAME**: Professional branding for client presentations
- Essential for a production-ready application

### **Best Practices for Bangladesh Agencies:**
1. Use consistent naming across all environments
2. Document all environment variables
3. Test thoroughly before client demos
4. Keep backup of configuration values

---
**Environment Variables Configuration Guide - Lethimdo Bangladesh Freelance Agency**