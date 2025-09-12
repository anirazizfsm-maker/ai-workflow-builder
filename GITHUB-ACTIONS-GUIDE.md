# GitHub Actions Guide for Lethimdo

This guide explains how to set up and use GitHub Actions for automated testing and deployment of the Lethimdo platform, specifically tailored for Bangladesh freelance agencies.

## 🎯 GitHub Actions Overview

### Why Use GitHub Actions?
1. **Automated Testing** - Run tests automatically on every push or pull request
2. **Continuous Integration** - Ensure code quality and prevent breaking changes
3. **Continuous Deployment** - Automatically deploy to hosting platforms
4. **Cost-Effective** - Free tier available for open source projects
5. **Bangladesh Agency Friendly** - No billing address restrictions

## 🚀 Setting Up GitHub Actions

### Prerequisites
1. GitHub repository (already set up)
2. Netlify account for frontend deployment
3. Render.com account for backend deployment

### Workflow Files
We've created three workflow files in `.github/workflows/`:
1. `frontend-test.yml` - Tests the frontend on push/PR
2. `frontend-deploy.yml` - Deploys frontend to Netlify on push to main
3. `backend-test.yml` - Tests the backend on push/PR

## 🧪 Frontend Testing Workflow

### What It Does
- Runs on every push to main branch and every pull request
- Tests against multiple Node.js versions (18.x and 20.x)
- Installs dependencies and runs test suite

### Configuration
```yaml
name: Frontend Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm run test
```

## ☁️ Frontend Deployment Workflow

### What It Does
- Runs only on push to main branch
- Builds the frontend application
- Deploys to Netlify automatically

### Configuration
```yaml
name: Frontend Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Build frontend
      run: |
        cd frontend
        npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      with:
        args: deploy --dir=frontend/dist --prod
      if: github.ref == 'refs/heads/main'
```

## 🧪 Backend Testing Workflow

### What It Does
- Runs on every push to main branch and every pull request
- Tests against multiple Node.js versions (18.x and 20.x)
- Installs dependencies and runs test suite

### Configuration
```yaml
name: Backend Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install backend dependencies
      run: |
        cd backend
        npm ci
    
    - name: Run backend tests
      run: |
        cd backend
        npm run test
```

## 🔐 Setting Up Secrets

### Netlify Deployment Secrets
1. Go to your repository Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
   - `NETLIFY_SITE_ID` - Your Netlify site ID

### How to Get Netlify Secrets
1. Log in to Netlify
2. Go to User Settings → Applications
3. Create a new personal access token
4. Copy the token and add it as `NETLIFY_AUTH_TOKEN` in GitHub secrets
5. Get your site ID from the site settings and add it as `NETLIFY_SITE_ID`

## 🎯 Benefits for Bangladesh Freelance Agencies

### Cost Savings
- **Free Tier**: GitHub Actions free tier is sufficient for most freelance projects
- **No Billing Restrictions**: Unlike some platforms, GitHub Actions works with Bangladeshi billing addresses
- **Reduced Manual Work**: Automation reduces time spent on repetitive tasks

### Professional Workflow
- **Quality Assurance**: Automated testing prevents bugs from reaching production
- **Client Confidence**: Professional CI/CD pipeline impresses international clients
- **Faster Delivery**: Automated deployment speeds up the release process

### Scalability
- **Easy Setup**: Simple YAML configuration files
- **Flexible**: Can be customized for specific project needs
- **Extensible**: Thousands of available GitHub Actions

## 🛠️ Troubleshooting Common Issues

### Test Failures
1. Check the workflow logs in the Actions tab
2. Verify that tests run locally: `npm run test` in frontend/backend directories
3. Ensure all dependencies are properly installed in the workflow

### Deployment Failures
1. Verify Netlify secrets are correctly configured
2. Check that the build command works locally: `npm run build`
3. Ensure the dist directory path is correct

### Permission Issues
1. Make sure GitHub Actions are enabled for your repository
2. Verify that the workflow files have correct permissions
3. Check that secrets are properly configured

## 📊 Monitoring Workflows

### GitHub Actions Dashboard
1. Go to the "Actions" tab in your repository
2. View workflow runs and their status
3. Access detailed logs for troubleshooting
4. See historical workflow performance

### Notifications
1. Configure email notifications for workflow failures
2. Set up Slack or Discord notifications for team awareness
3. Use GitHub's built-in notification system

## 📞 Support

For GitHub Actions setup issues:
1. Check GitHub's official documentation
2. Review this setup guide
3. Contact support at support@lethimdo.com

## 🇧🇩 Proudly Serving Bangladesh Freelance Agencies

GitHub Actions help Bangladesh freelance agencies:
- Maintain professional development practices
- Automate repetitive tasks
- Deliver high-quality code consistently
- Compete with Western agencies on technical excellence

---
*Actions guide with ❤️ for Bangladesh Freelance Agencies*