# 🎯 RENDER.COM API SUBDOMAIN SETUP GUIDE
## Configuring api.lethimdo.com for Your Backend Service

## 🎯 OVERVIEW

This guide explains how to set up a custom API subdomain for your Render.com backend service:

**Target Configuration:**
- API Subdomain: `api.lethimdo.com`
- Service: Your Render.com backend
- SSL: Automatic HTTPS

## 🚀 STEP 1: ADD CUSTOM DOMAIN IN RENDER.COM

### Access Your Service
1. Go to https://dashboard.render.com
2. Click on your `lethimdo-backend` service
3. Navigate to the "Settings" tab

### Add Custom Domain
1. Scroll down to "Custom Domains" section
2. Click "Add Custom Domain"
3. Enter: `api.lethimdo.com`
4. Click "Add Domain"

### Get Verification Details
After adding the domain, Render will display:
- A TXT record for DNS verification
- A CNAME record for the domain

Example (values will be different for your service):
```
TXT Record for verification:
Name: _render-api.lethimdo.com
Value: render-verify=abcdef123456

CNAME Record:
Name: api.lethimdo.com
Value: lethimdo-backend-xxxx.onrender.com
```

## 🌐 STEP 2: CONFIGURE DNS IN HOSTINGER

### Access Hostinger DNS Management
1. Login to Hostinger: https://hpanel.hostinger.com
2. Click "Domains" in the sidebar
3. Find "lethimdo.com" and click "Manage"
4. Click "DNS Zone"

### Add DNS Records

#### Add TXT Verification Record
1. Click "Add Record"
2. Fill in the details:
   ```
   Type: TXT
   Name: _render-api.lethimdo.com
   Value: render-verify=abcdef123456 (use your actual value)
   TTL: 3600
   ```
3. Click "Save"

#### Add CNAME Record for API
1. Click "Add Record"
2. Fill in the details:
   ```
   Type: CNAME
   Name: api.lethimdo.com
   Value: lethimdo-backend-xxxx.onrender.com (use your actual value)
   TTL: 3600
   ```
3. Click "Save"

## 🔍 STEP 3: VERIFY CONFIGURATION

### Check Domain Status in Render
1. Return to your Render.com dashboard
2. Go to your service → Settings → Custom Domains
3. Look for status indicators:
   - ✅ "Verified" for TXT record
   - ✅ "Active" for domain
   - ✅ Green lock icon for SSL

### Test API Endpoint
Once active, test your API:
```
https://api.lethimdo.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

## ⏰ TIMELINE EXPECTATIONS

### DNS Propagation
- **Immediate**: Changes saved in Hostinger
- **5-15 minutes**: Initial propagation
- **30 minutes to 2 hours**: Most locations updated
- **24 hours**: Worldwide propagation complete

### SSL Certificate Provisioning
- **Automatic**: Render.com automatically provisions SSL
- **5-30 minutes**: After DNS verification
- **Indicator**: Green lock icon in Render dashboard

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. "Verification Failed" in Render
- Double-check TXT record value exactly matches
- Wait for DNS propagation (5-15 minutes)
- Refresh domain status in Render dashboard

#### 2. "Pending SSL" for Extended Time
- Ensure CNAME record is correctly configured
- Wait for DNS propagation
- Check for typos in domain names

#### 3. "Domain Not Found" When Testing
- Verify DNS records using online tools
- Check domain spelling
- Wait for full propagation

#### 4. Mixed Content Warnings
- Ensure all frontend API calls use HTTPS
- Update any hardcoded HTTP URLs
- Check environment variables

## 🛠️ STEP 4: UPDATE APPLICATION CONFIGURATION

### Update Frontend Environment Variables
In your frontend code, update API calls to use the new domain:

In `.env` file:
```
VITE_API_BASE_URL=https://api.lethimdo.com
```

### Update Render Environment Variables
In Render.com dashboard, update:
```
FRONTEND_URL=https://lethimdo.com
```

## 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS

### Professional Client Presentation
- ✅ Clean, memorable API URLs
- ✅ Professional appearance for demos
- ✅ Better documentation and client communication
- ✅ Industry-standard API practices

### Business Advantages
- ✅ Easier for international clients to remember
- ✅ Professional separation of frontend and backend
- ✅ Scalable architecture for future growth
- ✅ Industry-standard API endpoint structure

## 🎯 FINAL CHECKLIST

### Configuration Complete
- [ ] Custom domain added in Render.com
- [ ] TXT verification record added in Hostinger
- [ ] CNAME record added in Hostinger
- [ ] Domain shows "Active" in Render dashboard
- [ ] SSL certificate provisioned
- [ ] API accessible at https://api.lethimdo.com/health

### Testing Complete
- [ ] Frontend can communicate with backend via new domain
- [ ] All API endpoints work correctly
- [ ] No mixed content warnings
- [ ] HTTPS working for both frontend and API

### Professional Setup
- [ ] Client-ready API endpoint
- [ ] Industry-standard subdomain naming
- [ ] Professional documentation updated
- [ ] Bangladesh agency optimized for international clients

## 📞 SUPPORT

If you encounter issues:
1. Check DNS records using online tools
2. Verify all values match exactly
3. Wait for full DNS propagation
4. Contact Render.com support if issues persist

## 🎉 SUCCESS INDICATORS

You'll know everything is working when:
- ✅ Render.com shows domain as "Active"
- ✅ Green lock icon for SSL certificate
- ✅ https://api.lethimdo.com/health returns JSON
- ✅ Frontend successfully communicates with API
- ✅ No SSL or mixed content warnings

---
**API Subdomain Configuration for Lethimdo - Bangladesh Freelance Agency**