# 🌐 CUSTOM DOMAIN CONFIGURATION GUIDE
## Setting Up lethimdo.com for Frontend and API Subdomain

## 🎯 OVERVIEW

This guide will help you configure your custom domain for both frontend and backend services:

1. **Frontend**: https://lethimdo.com (Netlify)
2. **Backend API**: https://api.lethimdo.com (Render.com)

## 🚀 STEP 1: CONFIGURE FRONTEND DOMAIN (lethimdo.com)

### Current Status
Based on existing documentation, your frontend domain should already be configured:
- Domain: lethimdo.com
- Provider: Hostinger
- Target: Netlify (75.2.60.5)

### Verification Steps
1. Run the DNS status check script:
   ```
   check-dns-status.bat
   ```

2. Expected results:
   ```
   lethimdo.com → 75.2.60.5 (Netlify IP)
   www.lethimdo.com → [your-site].netlify.app
   ```

### If Not Working
Follow the instructions in [NETLIFY-CUSTOM-DOMAIN-SETUP.md](NETLIFY-CUSTOM-DOMAIN-SETUP.md):
1. Login to Hostinger: https://hpanel.hostinger.com
2. Go to Domains → lethimdo.com → DNS Zone
3. Update A record:
   ```
   Type: A
   Name: @
   Points to: 75.2.60.5
   ```
4. Update CNAME record:
   ```
   Type: CNAME
   Name: www
   Points to: [your-netlify-site].netlify.app
   ```

## ⚙️ STEP 2: CONFIGURE API SUBDOMAIN (api.lethimdo.com)

### Create Custom Domain in Render.com
1. Go to your Render.com dashboard
2. Click on your `lethimdo-backend` service
3. Go to "Settings" tab
4. Scroll to "Custom Domains" section
5. Click "Add Custom Domain"
6. Enter: `api.lethimdo.com`
7. Click "Add Domain"

### Get Verification TXT Record
After adding the domain, Render will provide:
- A TXT record for verification
- A CNAME record for the domain

Example:
```
TXT Record:
Name: _render-api.lethimdo.com
Value: render-verify=xxxxxxxxxxxx

CNAME Record:
Name: api.lethimdo.com
Value: your-app-name.onrender.com
```

## 🌐 STEP 3: CONFIGURE DNS IN HOSTINGER

### Login to Hostinger DNS Management
1. Go to: https://hpanel.hostinger.com
2. Click on "Domains" in the sidebar
3. Find "lethimdo.com" and click "Manage"
4. Click "DNS Zone"

### Add DNS Records for API Subdomain

#### Add TXT Verification Record
```
Type: TXT
Name: _render-api.lethimdo.com
Value: render-verify=xxxxxxxxxxxx
TTL: 3600
```

#### Add CNAME Record for API
```
Type: CNAME
Name: api.lethimdo.com
Value: your-app-name.onrender.com
TTL: 3600
```

### Save Changes
1. Click "Save" or "Update" for each record
2. Wait 5-15 minutes for DNS changes to propagate

## 🔍 STEP 4: VERIFY CONFIGURATION

### Check DNS Propagation
1. Use online tools:
   - https://dnschecker.org/#A/lethimdo.com
   - https://dnschecker.org/#CNAME/api.lethimdo.com

2. Command line check:
   ```cmd
   nslookup lethimdo.com
   nslookup api.lethimdo.com
   ```

### Test Domains in Browser
1. Frontend: https://lethimdo.com
2. API: https://api.lethimdo.com/health

### Expected Results
- Frontend should load your Netlify site
- API should return JSON health response:
  ```json
  {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 123.45,
    "environment": "production"
  }
  ```

## 🔧 STEP 5: UPDATE APPLICATION CONFIGURATION

### Update Frontend Environment Variables
In your frontend code, update API calls to use the new domain:
```
VITE_API_BASE_URL=https://api.lethimdo.com
```

### Update Render.com Environment Variables
In Render.com dashboard, update:
```
FRONTEND_URL=https://lethimdo.com
```

## ⏰ TIMELINE EXPECTATIONS

### DNS Propagation Time
- **Minimum**: 5-15 minutes
- **Typical**: 30 minutes to 2 hours
- **Maximum**: 24-48 hours (rare)

### SSL Certificate Provisioning
- **Automatic**: Render.com and Netlify automatically provision SSL
- **Time**: Usually 5-30 minutes after DNS propagation

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. Domain Not Loading
- Check DNS records are correct
- Wait longer for propagation
- Clear browser cache

#### 2. SSL Certificate Not Working
- Ensure DNS is fully propagated first
- May take additional 15-30 minutes after DNS

#### 3. Render Verification Failing
- Double-check TXT record value
- Wait for DNS propagation
- Refresh domain status in Render dashboard

#### 4. Mixed Content Warnings
- Ensure all API calls use HTTPS
- Update any hardcoded HTTP URLs

## 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS

### Professional Branding
- ✅ Custom domains increase client trust
- ✅ Professional appearance for demos
- ✅ Better for business cards and proposals
- ✅ SEO benefits for client acquisition

### Client Presentation
- "Visit our platform at https://lethimdo.com"
- "Our API is available at https://api.lethimdo.com"
- Professional SSL certificates
- Global accessibility

## 🎯 FINAL CHECKLIST

### Before Starting
- [ ] Confirm you have access to Hostinger DNS management
- [ ] Know your Netlify site name
- [ ] Know your Render.com service URL

### After Configuration
- [ ] Frontend loads at https://lethimdo.com
- [ ] API loads at https://api.lethimdo.com/health
- [ ] Both sites have valid SSL certificates
- [ ] Frontend can communicate with backend API
- [ ] All links and resources load correctly

### Professional Setup Complete
- [ ] Custom domain for frontend
- [ ] Custom subdomain for API
- [ ] Professional SSL certificates
- [ ] Client-ready URLs
- [ ] Bangladesh agency optimized

## 📞 SUPPORT

If you encounter issues:
1. Check DNS records using online tools
2. Verify all values match exactly
3. Wait for full DNS propagation
4. Contact support if issues persist

## 🎉 SUCCESS INDICATORS

You'll know everything is working when:
- ✅ https://lethimdo.com loads your frontend
- ✅ https://api.lethimdo.com/health returns JSON
- ✅ HTTPS shows secure connection
- ✅ No mixed content warnings
- ✅ Fast loading times globally

---
**Professional Domain Configuration for Lethimdo - Bangladesh Freelance Agency**