# Local Development Setup Guide
## Professional Development Environment for Bangladesh Freelance Agencies

## 🎯 OVERVIEW

This guide will help you set up a professional local development environment for the Lethimdo platform, specifically tailored for Bangladesh freelance agencies focusing on international client work and USD earnings.

## 🛠️ PREREQUISITES

### Essential Tools
1. **Git** - Version control system
2. **Node.js** (v18 or higher) - JavaScript runtime
3. **npm** - Package manager
4. **VS Code** (recommended) - Code editor
5. **GitHub Account** - Repository hosting

### Optional Tools
1. **Postman** - API testing
2. **MongoDB Compass** - Database GUI
3. **Docker** - Containerization (advanced)

## 📁 PROJECT STRUCTURE

```
lethimdo/
├── backend/                # Node.js Express backend
│   ├── src/                # Backend source code
│   ├── tests/              # Backend tests
│   ├── package.json        # Backend dependencies
│   └── render.yaml         # Render.com deployment config
├── frontend/               # React TypeScript frontend
│   ├── src/                # Frontend source code
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── netlify.toml        # Netlify deployment config
├── .github/workflows/      # GitHub Actions workflows
├── docs/                   # Documentation files
├── legal/                  # Legal documents
├── shared/                 # Shared types and utilities
├── README.md               # Main documentation
└── README-PROFESSIONAL.md  # Client presentation
```

## 🚀 SETUP PROCESS

### Step 1: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/lethimdo-ai-platform.git
cd lethimdo-ai-platform
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 3: Environment Configuration
1. **Backend Environment** (backend/.env):
   ```
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-development-jwt-secret-here
   OPENAI_API_KEY=sk-your-openai-key-here (optional)
   ```

2. **Frontend Environment** (frontend/.env):
   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_APP_NAME=Lethimdo
   ```

### Step 4: Database Setup
For local development, you can use:
1. **MongoDB Atlas** (cloud, recommended for beginners)
2. **Local MongoDB Installation**
3. **Mock Data** (for UI development)

#### MongoDB Atlas Setup:
1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster
4. Add database user
5. Add your IP address to whitelist
6. Get connection string and add to backend .env:
   ```
   DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/lethimdo
   ```

## ▶️ RUNNING THE APPLICATION

### Method 1: Using Automated Scripts
```bash
# Start both frontend and backend
start-local.bat

# Test backend API endpoints
test-backend-local.bat

# Test frontend-backend integration
test-frontend-backend.bat
```

### Method 2: Manual Start
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Method 3: Using npm Scripts
```bash
# In project root
npm run dev  # If you have root package.json with workspaces
```

## 🧪 TESTING

### Backend Testing
```bash
cd backend
npm run test
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:ui  # UI test runner
npm run test:coverage  # Coverage report
```

### API Testing
1. **Health Check**:
   ```bash
   curl http://localhost:5000/health
   ```

2. **API Endpoints**:
   - Auth: `POST http://localhost:5000/api/auth/login`
   - Users: `GET http://localhost:5000/api/users`
   - Workflows: `GET http://localhost:5000/api/workflows`

## 🎨 DEVELOPMENT FEATURES

### Hot Reloading
- **Frontend**: Vite provides instant hot module replacement
- **Backend**: Nodemon restarts server on file changes

### Debugging
- **VS Code Debug Configurations**: Pre-configured launch.json
- **Chrome DevTools**: For frontend debugging
- **Node.js Inspector**: For backend debugging

### Linting and Formatting
- **ESLint**: Code quality checks
- **Prettier**: Code formatting
- **TypeScript**: Type safety

## ☁️ CLOUD DEPLOYMENT OPTIONS

### Development to Production Workflow

#### Local Development
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: Local or MongoDB Atlas

#### Staging Environment
- **Frontend**: Netlify deploy previews
- **Backend**: Render.com staging
- **Database**: MongoDB Atlas staging cluster

#### Production Environment
- **Frontend**: Netlify (lethimdo.com)
- **Backend**: Render.com (lethimdo-backend.onrender.com)
- **Database**: MongoDB Atlas production cluster

### Deployment Platforms for Bangladesh Agencies:
1. **Frontend**: Netlify (Free tier, global CDN)
2. **Backend**: Render.com (Free tier, reliable hosting)
3. **Domain**: Hostinger (Affordable, Bangladesh-friendly)
4. **API Services**: Personal OpenAI account (Free credits)

## 💰 COST-EFFECTIVE DEVELOPMENT

### Free Development Stack:
- **Code Editor**: VS Code (Free)
- **Version Control**: GitHub (Free)
- **Runtime**: Node.js (Free)
- **Database**: MongoDB Atlas (Free tier)
- **Hosting**: Netlify + Render.com (Free tiers)
- **API Services**: OpenAI personal account (Free credits)

### Bangladesh Agency Advantages:
- **Zero upfront costs** for development environment
- **Professional tools** without licensing fees
- **Cloud platforms** with Bangladesh billing support
- **Scalable infrastructure** that grows with your agency

## 🛡️ SECURITY BEST PRACTICES

### Environment Variables
- Never commit .env files to repository
- Use different variables for development/production
- Generate secure JWT secrets
- Rotate API keys regularly

### Development Security
- Use HTTPS in production (automatic with Netlify/Render.com)
- Validate all user inputs
- Sanitize database queries
- Implement proper authentication

### Data Protection
- Encrypt sensitive data
- Follow GDPR/CCPA guidelines
- Implement data backup strategies
- Regular security audits

## 🎯 BANGLADESH AGENCY DEVELOPMENT TIPS

### Professional Development Practices:
1. **Git Workflow**: Feature branches, pull requests, code reviews
2. **Documentation**: Keep README files updated
3. **Testing**: Write tests for critical functionality
4. **Code Quality**: Use linters and formatters

### Client Presentation:
1. **Clean Code**: Well-organized, readable code
2. **Professional UI**: Modern, responsive design
3. **Comprehensive Docs**: Clear setup and usage guides
4. **Demo Ready**: Always deployable state

### Cost Optimization:
1. **Free Tools**: Leverage free tiers during development
2. **Efficient Coding**: Write optimized, maintainable code
3. **Automated Processes**: Use scripts for repetitive tasks
4. **Resource Management**: Monitor usage to avoid overages

## 🆘 TROUBLESHOOTING

### Common Issues and Solutions

#### Installation Problems
1. **Node.js Version Issues**:
   - Solution: Use Node Version Manager (nvm)
   - Check version: `node --version`

2. **npm Install Failures**:
   - Solution: Clear cache: `npm cache clean --force`
   - Reinstall: `rm -rf node_modules package-lock.json` then `npm install`

#### Runtime Issues
1. **Port Conflicts**:
   - Solution: Change PORT in .env files
   - Check ports: `netstat -an | grep LISTEN`

2. **Database Connection**:
   - Solution: Verify DATABASE_URL in .env
   - Check MongoDB Atlas IP whitelist

#### Development Environment
1. **Hot Reload Not Working**:
   - Solution: Check file watchers limit
   - Restart development servers

2. **TypeScript Errors**:
   - Solution: Run `npm run build` to see all errors
   - Check tsconfig.json configuration

### Getting Help
1. **Check Documentation**: This guide and other README files
2. **Review Logs**: Terminal output for error messages
3. **Community Support**: GitHub Issues, Stack Overflow
4. **Professional Support**: Contact support@lethimdo.com

## 📞 SUPPORT

For technical support or development questions:
- **Email**: support@lethimdo.com
- **GitHub**: Create issues in repository
- **Documentation**: This repository contains comprehensive guides

## 🚀 NEXT STEPS

After setting up your local development environment:

1. ✅ **Run the application** locally
2. ✅ **Test all features** 
3. ✅ **Make code changes**
4. ✅ **Commit to Git**
5. ✅ **Deploy to cloud platforms**
6. ✅ **Start client acquisition**

## 🇧🇩 PROUDLY SERVING BANGLADESH FREELANCE AGENCIES

This development setup is specifically designed for Bangladesh freelance agencies to:
- Build professional, enterprise-grade applications
- Compete with Western agencies on technical excellence
- Maintain cost advantages while delivering quality
- Scale operations efficiently

---
*Local Development Setup Guide for Lethimdo - Bangladesh Freelance Agency Platform*
*Focus: Professional development practices, cost optimization, international client readiness*