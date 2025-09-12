# Alfa Workflow Maker - Deployment Guide

This guide covers deploying the Alfa Workflow Maker platform to production environments.

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended

#### 1. Deploy Backend to Railway

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Initialize:**
   ```bash
   railway login
   cd backend
   railway init
   ```

3. **Set Environment Variables:**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secure-jwt-secret-here
   railway variables set FRONTEND_URL=https://your-frontend-domain.vercel.app
   
   # Optional but recommended for full functionality:
   railway variables set OPENAI_API_KEY=your-openai-api-key
   railway variables set GOOGLE_CLIENT_ID=your-google-oauth-client-id
   railway variables set GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
   ```

4. **Add PostgreSQL Database:**
   ```bash
   railway add postgresql
   ```

5. **Deploy:**
   ```bash
   railway deploy
   ```

#### 2. Deploy Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_API_URL`: Your Railway backend URL + `/api`
   - `VITE_FRONTEND_URL`: Your Vercel deployment URL

### Option 2: Docker Deployment

#### Local Development with Docker Compose

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - n8n (optional): http://localhost:5678
   - Grafana (optional): http://localhost:3000

#### Production Docker Deployment

1. **Build production images:**
   ```bash
   docker build -t alfa-workflow-backend --target backend-production .
   docker build -t alfa-workflow-frontend --target frontend-production .
   ```

2. **Run with production configuration:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 3: Manual Server Deployment

#### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis (optional but recommended)
- PM2 (for process management)

#### Backend Setup

1. **Install dependencies and build:**
   ```bash
   cd backend
   npm ci --only=production
   npm run build
   ```

2. **Set up environment variables:**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL=postgresql://user:password@localhost:5432/alfa_workflow_db
   export JWT_SECRET=your-secure-jwt-secret
   export FRONTEND_URL=https://your-domain.com
   # Add other environment variables as needed
   ```

3. **Run database migrations:**
   ```bash
   npm run migrate
   ```

4. **Start with PM2:**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

#### Frontend Setup

1. **Build for production:**
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

2. **Serve with nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Environment Variables

### Required Variables

#### Backend
- `NODE_ENV`: production
- `PORT`: 3001 (or your preferred port)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string for JWT signing
- `FRONTEND_URL`: Your frontend domain URL

#### Frontend
- `VITE_API_URL`: Backend API URL (with /api suffix)

### Optional Variables (for full functionality)

#### AI Services
- `OPENAI_API_KEY`: OpenAI API key for AI-powered features

#### OAuth Integrations
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth
- `SLACK_CLIENT_ID` & `SLACK_CLIENT_SECRET`: Slack OAuth
- `NOTION_CLIENT_ID` & `NOTION_CLIENT_SECRET`: Notion OAuth

#### External Services
- `N8N_API_URL` & `N8N_API_KEY`: n8n workflow engine
- `REDIS_URL`: Redis for caching and sessions

## Database Setup

### PostgreSQL Schema

The application will automatically create the required database schema on first run. Required tables:

- `users`: User accounts and profiles
- `workflows`: Workflow definitions and configurations
- `workflow_executions`: Execution history and logs
- `integrations`: Third-party service connections
- `analytics_daily`: Daily analytics aggregations
- `ai_generations`: AI workflow generation history

### Database Migrations

Run migrations after deployment:

```bash
npm run migrate
```

## Monitoring and Maintenance

### Health Checks

- Backend health: `GET /api/health`
- Database connectivity: `GET /api/health/db`
- Redis connectivity: `GET /api/health/redis`

### Logging

Logs are structured JSON format suitable for log aggregation services:

```bash
# View logs with PM2
pm2 logs

# View logs with Docker
docker-compose logs -f backend
```

### Monitoring

Optional monitoring stack included:
- Prometheus metrics: http://localhost:9090
- Grafana dashboards: http://localhost:3000

### Backup

Regular database backups recommended:

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Security Considerations

1. **JWT Secret**: Use a cryptographically secure random string
2. **Database**: Use strong passwords and connection encryption
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS appropriately for your domain
5. **Rate Limiting**: API rate limiting is enabled by default
6. **Input Validation**: All inputs are validated server-side

## Scaling

### Horizontal Scaling

- Multiple backend instances can run behind a load balancer
- Use Redis for session storage when scaling horizontally
- Database connection pooling is configured for high load

### Performance Optimization

- Enable Redis caching
- Configure CDN for static assets
- Use database read replicas for analytics queries
- Implement proper database indexing

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is accessible
   - Check firewall settings

2. **OAuth Integration Issues**
   - Verify redirect URLs in OAuth app settings
   - Check client ID/secret configuration
   - Ensure HTTPS for production OAuth

3. **AI Features Not Working**
   - Verify OpenAI API key is valid
   - Check API quota and billing
   - Review request/response logs

### Support

For deployment support:
- Check application logs
- Review health check endpoints
- Contact support with error details and deployment configuration

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] HTTPS configured
- [ ] Health checks passing
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Performance testing completed
- [ ] Security audit completed
- [ ] Documentation updated", "original_text": "", "replace_all": false}