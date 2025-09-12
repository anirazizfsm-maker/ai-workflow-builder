# 🚀 FRONTEND DEVELOPMENT SERVER GUIDE

## 🎯 **RUNNING THE FRONTEND DEVELOPMENT SERVER**

The error "Missing script: dev" occurs because you're trying to run the development server from the wrong directory. The frontend has its own package.json with the "dev" script.

## 🚀 **STEP-BY-STEP INSTRUCTIONS**

### **STEP 1: NAVIGATE TO THE CORRECT DIRECTORY**

You need to be in the `frontend` directory to run the frontend development server:

```cmd
cd c:\Users\user\lethimdo\frontend
```

### **STEP 2: RUN THE DEVELOPMENT SERVER**

Once in the frontend directory, run:

```bash
npm run dev
```

### **STEP 3: ACCESS YOUR APPLICATION**

The development server should start and display output similar to:

```
VITE v5.0.0 ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

Open your browser and go to: http://localhost:5173

## 🔍 **UNDERSTANDING THE PROJECT STRUCTURE**

### **Root Directory (c:\Users\user\lethimdo)**
Contains the main package.json with these scripts:
- `npm run dev` - Runs both frontend and backend
- `npm run dev:frontend` - Runs only frontend
- `npm run dev:backend` - Runs only backend

### **Frontend Directory (c:\Users\user\lethimdo\frontend)**
Contains the frontend package.json with these scripts:
- `npm run dev` - Runs the Vite development server
- `npm run build` - Builds the frontend for production

### **Backend Directory (c:\Users\user\lethimdo\backend)**
Contains the backend package.json with these scripts:
- `npm run dev` - Runs the Node.js development server
- `npm start` - Runs the Node.js production server

## 🧪 **DIFFERENT WAYS TO RUN THE DEVELOPMENT SERVER**

### **Option 1: Run Frontend Only (Recommended for Frontend Development)**
```cmd
cd c:\Users\user\lethimdo\frontend
npm run dev
```

### **Option 2: Run Both Frontend and Backend (From Root Directory)**
```cmd
cd c:\Users\user\lethimdo
npm run dev
```

### **Option 3: Run Backend Only**
```cmd
cd c:\Users\user\lethimdo\backend
npm run dev
```

## 🔧 **TROUBLESHOOTING**

### **If You Still Get "Missing script: dev":**
1. Double-check you're in the correct directory
2. Verify the package.json file exists:
   ```cmd
   dir package.json
   ```
3. Check the scripts section in package.json:
   ```cmd
   type package.json | findstr "dev"
   ```

### **If npm is Not Recognized:**
1. Make sure Node.js is installed
2. Check Node.js version:
   ```cmd
   node --version
   npm --version
   ```

### **If Port 5173 is Already in Use:**
1. The server will suggest an alternative port
2. Or stop other processes using port 5173:
   ```cmd
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

### **If Environment Variables Are Not Loading:**
1. Make sure your .env file is in the frontend directory
2. Restart the development server
3. Clear browser cache and hard refresh (Ctrl+F5)

## ⏰ **EXPECTED TIMELINE**

- **Starting server**: 10-30 seconds
- **First build**: 30-60 seconds
- **Subsequent builds**: 5-15 seconds (with hot reload)

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

### **Clear npm Cache:**
```bash
npm cache clean --force
```

## 🇧🇩 **BANGLADESH FREELANCE AGENCY NOTES**

### **Why This Matters:**
- Proper development server setup is essential for testing your application
- Understanding project structure helps with debugging
- Correct environment ensures efficient development workflow

### **Best Practices:**
1. Always run the development server from the correct directory
2. Keep terminal windows organized
3. Document any custom ports or configurations
4. Test thoroughly before client demos

---
**Frontend Development Server Guide - Lethimdo Bangladesh Freelance Agency**