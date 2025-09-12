# 🔄 RESTART DEVELOPMENT SERVER GUIDE

## 🎯 **HOW TO RESTART YOUR DEVELOPMENT SERVER**

Since you've edited the .env file, you need to restart your development server for the changes to take effect.

## 🚀 **STEP-BY-STEP INSTRUCTIONS**

### **STEP 1: STOP THE CURRENT DEVELOPMENT SERVER**

#### **If your server is running in a terminal:**
1. Go to the terminal window where your development server is running
2. Press **Ctrl+C** once or twice
3. Wait for the server to stop (you should see a command prompt)

#### **If you can't find the terminal:**
1. Open Task Manager (Ctrl+Shift+Esc)
2. Go to the **Processes** tab
3. Look for **Node.js** processes
4. Right-click on any Node.js processes and select **End Task**
5. Close any terminal/command prompt windows

### **STEP 2: NAVIGATE TO THE FRONTEND DIRECTORY**

#### **Using Command Prompt:**
1. Open Command Prompt (Press Win+R, type `cmd`, press Enter)
2. Navigate to your frontend directory:
   ```cmd
   cd c:\Users\user\lethimdo\frontend
   ```

#### **Using PowerShell:**
1. Open PowerShell (Press Win+R, type `powershell`, press Enter)
2. Navigate to your frontend directory:
   ```powershell
   cd "c:\Users\user\lethimdo\frontend"
   ```

#### **Using Git Bash (if installed):**
1. Open Git Bash
2. Navigate to your frontend directory:
   ```bash
   cd /c/Users/user/lethimdo/frontend
   ```

For detailed instructions on running the development server, see: [FRONTEND-DEVELOPMENT-SERVER-GUIDE.md](FRONTEND-DEVELOPMENT-SERVER-GUIDE.md)

### **STEP 3: START THE DEVELOPMENT SERVER**

Run this command in your terminal:
```bash
npm run dev
```

### **STEP 4: VERIFY THE SERVER IS RUNNING**

1. Look for output similar to:
   ```
   > lethimdo-frontend@0.0.0 dev
   > vite
   
   PORT=5173
   Local: http://localhost:5173/
   Network: http://192.168.x.x:5173/
   ```
   
2. Open your browser and go to: http://localhost:5173

## 🔍 **TROUBLESHOOTING**

### **If you get "command not found" or "npm is not recognized":**
1. Make sure Node.js is installed
2. Try using `yarn dev` instead if you're using Yarn

### **If the port is already in use:**
1. The server will suggest a different port
2. Or stop other Node.js processes using Task Manager

### **If you see environment variable errors:**
1. Double-check your .env file
2. Make sure it contains:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   VITE_APP_NAME=Lethimdo
   ```

### **If the server starts but variables aren't working:**
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors (F12)

## ⏰ **EXPECTED TIMELINE**

- **Stopping server**: 5-10 seconds
- **Starting server**: 10-30 seconds
- **First build**: 30-60 seconds

## 🧪 **VERIFY ENVIRONMENT VARIABLES ARE LOADED**

### **In your browser:**
1. Open your app at http://localhost:5173
2. Open browser developer tools (F12)
3. Go to Console tab
4. Type:
   ```javascript
   console.log(import.meta.env.VITE_API_BASE_URL)
   console.log(import.meta.env.VITE_APP_NAME)
   ```
5. You should see the values printed

## 📞 **IF YOU STILL HAVE ISSUES**

### **Check Node.js Installation:**
```cmd
node --version
npm --version
```

### **Reinstall Dependencies (if needed):**
```bash
npm install
```

## 🇧🇩 **BANGLADESH FREELANCE AGENCY NOTES**

### **Why This Matters:**
- Environment variables configure your app for different environments
- Proper restart ensures all configuration changes take effect
- Essential for testing API connections with your backend

### **Best Practices:**
1. Always restart after .env changes
2. Keep terminal windows organized
3. Document any custom ports or configurations
4. Test thoroughly before client demos

---
**Development Server Restart Guide - Lethimdo Bangladesh Freelance Agency**