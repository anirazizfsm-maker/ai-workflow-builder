# Cloudflare Pages Branch Deployment Guide

## Non-Production Branch Deploy Command

To deploy a non-production branch to Cloudflare Pages, you can use the Wrangler CLI with the following command:

```bash
wrangler pages deploy frontend/dist --branch=your-branch-name
```

### Complete Command with All Options

```bash
wrangler pages deploy frontend/dist --project-name=your-project-name --branch=your-branch-name --commit-hash=your-commit-hash --commit-message="Your commit message"
```

### Parameters Explanation

- `frontend/dist` - The directory containing your built static assets
- `--project-name` - The name of your Cloudflare Pages project (optional if you're in the project directory)
- `--branch` - The name of the branch you want to deploy to
- `--commit-hash` - The SHA to attach to this deployment (optional)
- `--commit-message` - The commit message to attach to this deployment (optional)

## Prerequisites

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Build your application**:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

## Deployment Steps

### 1. Deploy to a Specific Branch

```bash
wrangler pages deploy frontend/dist --branch=staging
```

### 2. Deploy with Project Name

```bash
wrangler pages deploy frontend/dist --project-name=my-lethimdo-app --branch=staging
```

### 3. Deploy with Commit Information

```bash
wrangler pages deploy frontend/dist --branch=staging --commit-hash=$(git rev-parse HEAD) --commit-message="Deploy to staging"
```

## GitHub Integration Alternative

For automatic branch deployments, you can configure Cloudflare Pages through the dashboard:

1. Go to your Cloudflare Pages project
2. Navigate to "Settings" > "Build & deployments"
3. In the "Branches and deployments" section, configure:
   - Production branch: `main`
   - Preview branches: `develop`, `staging`, `feature/*`

This will automatically deploy:
- Pushes to `main` as production
- Pushes to other configured branches as preview deployments

## Environment Variables for Different Branches

You can set different environment variables for different branches:

1. In Cloudflare Pages dashboard, go to "Settings" > "Environment variables"
2. Add variables with branch-specific values:
   - `VITE_API_BASE_URL` = `https://staging-api.lethimdo.com` (for staging branch)
   - `VITE_API_BASE_URL` = `https://lethimdo-backend.onrender.com` (for production/main branch)

## Preview URLs

When you deploy to a non-production branch, Cloudflare Pages will provide a preview URL in the format:
```
https://<branch-name>.<project-name>.pages.dev
```

For example:
```
https://staging.my-lethimdo-app.pages.dev
```

## Troubleshooting

### Common Issues

1. **Authentication Error**:
   ```bash
   wrangler login
   ```

2. **Project Not Found**:
   - Verify project name with `wrangler pages project list`
   - Or specify the correct project name in the command

3. **Directory Not Found**:
   - Ensure you've built your application first
   - Verify the `frontend/dist` directory exists

4. **Permission Issues**:
   - Ensure your Cloudflare account has Pages enabled
   - Check that you have permissions for the project

## Best Practices

1. **Use Descriptive Branch Names**:
   - `staging` for pre-production testing
   - `develop` for development previews
   - `feature/new-ui` for specific feature testing

2. **Set Appropriate Environment Variables**:
   - Use different API endpoints for different environments
   - Configure feature flags as needed

3. **Monitor Deployments**:
   - Check the Cloudflare dashboard for deployment status
   - Review logs for any build or deployment issues

4. **Clean Up Unused Previews**:
   - Delete preview deployments for merged branches
   - Keep only actively used preview environments

## Example Workflow

1. Create a new feature branch:
   ```bash
   git checkout -b feature/new-dashboard
   ```

2. Make changes and commit:
   ```bash
   git add .
   git commit -m "Add new dashboard feature"
   git push origin feature/new-dashboard
   ```

3. Build the application:
   ```bash
   cd frontend
   npm run build
   cd ..
   ```

4. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy frontend/dist --branch=feature/new-dashboard
   ```

5. Test the preview:
   Visit `https://feature-new-dashboard.my-lethimdo-app.pages.dev`

This approach allows you to test changes in isolation before merging to production.