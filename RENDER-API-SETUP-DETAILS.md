# 🎯 RENDER.COM API SUBDOMAIN SETUP - DETAILED INSTRUCTIONS

## 🚀 STEP 1: ADD CUSTOM DOMAIN IN RENDER.COM

### Access Your Service
1. Go to https://dashboard.render.com
2. Sign in with your credentials
3. Find your service named `lethimdo-backend`
4. Click on the service to open its dashboard

### Add Custom Domain
1. In the left sidebar, click on "Settings"
2. Scroll down to the "Custom Domains" section
3. Click the "Add Custom Domain" button
4. In the domain field, enter: `api.lethimdo.com`
5. Click "Add Domain"

### Get Verification Details
After adding the domain, Render.com will display two important pieces of information:

#### TXT Record for Verification
- **Type**: TXT
- **Name/Host**: _render-api.lethimdo.com
- **Value/Content**: (A unique verification string provided by Render.com)
- **TTL**: 3600

#### CNAME Record
- **Type**: CNAME
- **Name/Host**: api.lethimdo.com
- **Value/Content**: (Your specific Render.com service URL, similar to lethimdo-backend-xxxx.onrender.com)
- **TTL**: 3600

## 🌐 STEP 2: CONFIGURE DNS IN HOSTINGER

### Access Hostinger DNS Management
1. Go to https://hpanel.hostinger.com
2. Sign in with your credentials
3. In the dashboard, click on "Domains" in the left sidebar
4. Find "lethimdo.com" in your domain list
5. Click the "Manage" button next to it
6. Click on "DNS Zone" or "DNS / Nameservers"

### Add DNS Records

#### Add TXT Verification Record
1. Click "Add Record" or the "+" button
2. Fill in the details:
   - **Type**: TXT
   - **Name/Host**: _render-api.lethimdo.com
   - **Value/Content**: (Use the exact value from Render.com)
   - **TTL**: 3600
3. Click "Save" or "Add Record"

#### Add CNAME Record for API
1. Click "Add Record" or the "+" button
2. Fill in the details:
   - **Type**: CNAME
   - **Name/Host**: api.lethimdo.com
   - **Value/Content**: (Your specific Render.com service URL)
   - **TTL**: 3600
3. Click "Save" or "Add Record"

## 🔍 STEP 3: VERIFY CONFIGURATION

### Check Domain Status in Render.com
1. Return to your Render.com dashboard
2. Go to your service → Settings → Custom Domains
3. Look for status indicators:
   - **"Verified"** - TXT record has been validated
   - **"Active"** - Domain is working
   - **Green lock icon** - SSL certificate is provisioned

### Expected Timeline
- **DNS Propagation**: 5-30 minutes
- **SSL Provisioning**: 5-30 minutes after DNS verification
- **Total Time**: 10-60 minutes

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. "Verification Failed" in Render.com
- Double-check the TXT record value exactly matches what Render.com provided
- Wait for DNS propagation (5-15 minutes)
- Refresh the domain status in Render.com dashboard

#### 2. "Pending SSL" for Extended Time
- Ensure the CNAME record is correctly configured
- Wait for full DNS propagation
- Check for typos in domain names

#### 3. "Domain Not Found" When Testing
- Verify DNS records using online tools like https://dnschecker.org
- Check domain spelling
- Wait for full propagation

## 🎯 SUCCESS INDICATORS

You'll know everything is working when:
- ✅ Render.com shows domain as "Active"
- ✅ Green lock icon for SSL certificate
- ✅ https://api.lethimdo.com/health returns JSON
- ✅ No SSL or mixed content warnings

---
**API Subdomain Setup Guide for Lethimdo - Bangladesh Freelance Agency**