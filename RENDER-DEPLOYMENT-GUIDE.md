# Render.com Backend Deployment Guide

## Why Render.com?
- ✅ **Free tier supports backend applications** (unlike Railway's new limitation)
- ✅ **Bangladesh billing compatible** 
- ✅ **Simple deployment process**
- ✅ **Automatic builds from GitHub**
- ✅ **Free SSL certificates**
- ✅ **750 hours/month free compute**

## Step-by-Step Deployment

### 1. Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended) or email
4. Verify your email address

### 2. Push Your Code to GitHub (if not already done)
```bash
# In your backend directory
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lethimdo-backend.git
git push -u origin main
```

### 3. Create Web Service on Render
1. **Dashboard**: Go to https://dashboard.render.com
2. **New Service**: Click "New +" → "Web Service"
3. **Connect Repository**: 
   - Connect your GitHub account
   - Select your backend repository
   - Click "Connect"

### 4. Configure Deployment Settings
```yaml
Name: lethimdo-backend
Region: Frankfurt (closest to Bangladesh)
Branch: main
Root Directory: . (or leave empty)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 5. Environment Variables Setup
Add these in Render dashboard under "Environment":

**Required Variables:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-netlify-app.netlify.app
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters
```

**OpenAI Integration (when ready):**
```
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
```

**Optional (for future features):**
```
DATABASE_URL=postgresql://username:password@host:port/database
REDIS_URL=redis://username:password@host:port
```

### 6. Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Deploy to production URL

### 7. Monitor Deployment
- **Build Logs**: Check real-time build progress
- **Service URL**: Your app will be available at: `https://lethimdo-backend.onrender.com`
- **Health Check**: Test at: `https://lethimdo-backend.onrender.com/health`

## Important Notes

### Free Tier Limitations
- **Sleep Mode**: Apps sleep after 15 minutes of inactivity
- **Cold Start**: 30-60 seconds wake-up time (acceptable for most use cases)
- **750 hours/month**: Enough for development and small-scale production

### Bangladesh Considerations
- **Payment Method**: Accepts international cards and PayPal
- **No Geographic Restrictions**: Full access from Bangladesh
- **Frankfurt Region**: Best performance for Bangladesh users

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check build logs for missing dependencies
2. **App Won't Start**: Verify start command matches package.json
3. **Environment Variables**: Ensure all required vars are set

### Health Check Endpoint
Your backend includes `/health` endpoint that returns:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

## Next Steps After Deployment
1. ✅ Test health endpoint
2. ✅ Configure frontend to use new backend URL
3. ✅ Set up OpenAI API key
4. ✅ Test all API endpoints
5. ✅ Update domain DNS if needed

## Cost Analysis for Your Agency
- **Free Tier**: Perfect for MVP and client demos
- **Paid Plans**: Start at $7/month for always-on service
- **Scaling**: Can handle significant traffic before needing upgrades

## Support
- **Documentation**: https://render.com/docs
- **Community**: https://community.render.com
- **Status Page**: https://status.render.com

---
**Created for Lethimdo - Bangladesh Freelance Agency**
**Focus: International clients, USD earnings, cost-effective hosting**