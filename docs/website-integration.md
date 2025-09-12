# Lethimdo Platform - Website Integration Guide

## 🚀 Quick Start for Website Integration

### 1. Production Build Commands

```bash
# Frontend Production Build
cd frontend
npm run build
# This creates a 'dist' folder with optimized files

# Backend Production Build  
cd backend
npm run build
# This creates a 'dist' folder with compiled JavaScript
```

### 2. Environment Configuration

Create `.env.production` files:

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=Lethimdo
VITE_APP_URL=https://your-domain.com
```

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key
```

### 3. Website Integration Options

#### Option A: Subdomain Integration
- Deploy frontend to `app.your-domain.com`
- Deploy backend to `api.your-domain.com`
- Add DNS CNAME records

#### Option B: Subdirectory Integration
- Deploy frontend to `your-domain.com/app/`
- Deploy backend to `your-domain.com/api/`
- Configure nginx/Apache reverse proxy

#### Option C: Embedded Widget
- Build as a widget component
- Embed in existing website pages
- Minimal integration with iframes

### 4. Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React App)
    location /app {
        alias /var/www/lethimdo/frontend/dist;
        try_files $uri $uri/ /app/index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. Docker Deployment

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6. Database Setup Requirements

```sql
-- PostgreSQL setup
CREATE DATABASE lethimdo;
CREATE USER lethimdo_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE lethimdo TO lethimdo_user;
```

### 7. SSL/HTTPS Setup

```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com -d app.your-domain.com -d api.your-domain.com
```

### 8. Performance Optimization

- Enable Gzip compression
- Configure CDN (CloudFlare recommended)
- Set up proper caching headers
- Enable HTTP/2
- Optimize images and assets

### 9. Monitoring & Analytics

- Set up Google Analytics
- Configure error tracking (Sentry)
- Monitor API performance
- Set up uptime monitoring

### 10. Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secrets
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] API keys secured

## 📦 Deployment Scripts

**deploy-frontend.sh:**
```bash
#!/bin/bash
cd frontend
npm ci
npm run build
rsync -avz --delete dist/ user@server:/var/www/lethimdo/frontend/
```

**deploy-backend.sh:**
```bash
#!/bin/bash
cd backend
npm ci
npm run build
rsync -avz --delete dist/ user@server:/var/www/lethimdo/backend/
pm2 restart lethimdo-api
```

## 🔧 Maintenance Commands

```bash
# Update dependencies
npm update

# Check security vulnerabilities
npm audit

# Run tests
npm test

# Monitor logs
pm2 logs lethimdo-api

# Database backup
pg_dump lethimdo > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🌐 CDN Integration

For faster global performance:

1. **CloudFlare Setup:**
   - Add your domain to CloudFlare
   - Enable caching for static assets
   - Configure page rules for API endpoints

2. **AWS CloudFront:**
   - Create distribution for frontend
   - Set up origin for backend API
   - Configure caching behaviors

## 📱 Mobile Responsiveness

The platform is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Tablet devices
- Progressive Web App (PWA) ready

## 🔄 Backup Strategy

1. **Database Backups:**
   - Daily automated backups
   - Store in separate location
   - Test restore procedures

2. **File Backups:**
   - Regular code repository backups
   - Environment configuration backups
   - User uploaded files backup

## 📞 Support Integration

Ready for:
- Live chat integration (Intercom, Zendesk)
- Help desk ticketing
- Knowledge base integration
- Community forum setup

## 🎯 Analytics Integration

Pre-configured for:
- Google Analytics 4
- Custom event tracking
- User behavior analytics
- Conversion tracking
- A/B testing ready