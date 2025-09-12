# 🎯 COMPLETE API SUBDOMAIN SETUP GUIDE
## Step-by-Step Instructions for api.lethimdo.com

## 🚀 STEP 1: ADD CUSTOM DOMAIN IN RENDER.COM

### 1.1 Access Render.com Dashboard
1. Open your web browser and go to https://dashboard.render.com
2. Log in with your credentials

### 1.2 Navigate to Your Service
1. Find your service named `lethimdo-backend` in the services list
2. Click on the service name to open its dashboard

### 1.3 Add Custom Domain
1. In the left sidebar, click on "Settings"
2. Scroll down to the "Custom Domains" section
3. Click the "Add Custom Domain" button
4. In the domain field, type exactly: `api.lethimdo.com`
5. Click "Add Domain"

### 1.4 Note Verification Details
After adding the domain, Render.com will display:
- A TXT record for DNS verification (copy the exact value)
- Confirmation of the CNAME target (your service URL)

## 🌐 STEP 2: CONFIGURE DNS IN HOSTINGER

### 2.1 Access Hostinger DNS Management
1. Open a new browser tab and go to https://hpanel.hostinger.com
2. Log in with your credentials
3. In the dashboard, click on "Domains" in the left sidebar
4. Find "lethimdo.com" in your domain list
5. Click the "Manage" button next to it
6. Click on "DNS Zone" or "DNS / Nameservers"

### 2.2 Add TXT Verification Record
1. Click "Add Record" or the "+" button
2. Fill in the details:
   - **Type**: TXT
   - **Name/Host**: `_render-api.lethimdo.com` (include the underscore)
   - **Value/Content**: `[Use the exact value provided by Render.com]`
   - **TTL**: `3600`
3. Click "Save" or "Add Record"

### 2.3 Add CNAME Record for API
1. Click "Add Record" or the "+" button
2. Fill in the details:
   - **Type**: CNAME
   - **Name/Host**: `api.lethimdo.com`
   - **Value/Content**: `lethimdo-backend-xxxx.onrender.com` (replace xxxx with your actual service ID)
   - **TTL**: `3600`
3. Click "Save" or "Add Record"

## ⏰ STEP 3: WAIT FOR VERIFICATION AND SSL PROVISIONING

### 3.1 DNS Propagation Timeline
- **Immediate**: Changes saved in Hostinger
- **5-15 minutes**: Initial DNS propagation
- **30 minutes**: Most locations updated
- **1 hour**: Worldwide propagation complete

### 3.2 SSL Certificate Provisioning
- **Automatic**: Render.com automatically provisions SSL
- **5-30 minutes**: After DNS verification
- **Indicator**: Green lock icon in Render dashboard

## 🔍 STEP 4: VERIFY CONFIGURATION IN RENDER.COM

### 4.1 Check Domain Status
1. Return to your Render.com dashboard
2. Go to your service → Settings → Custom Domains
3. Look for status indicators:
   - **"Verified"** - TXT record has been validated
   - **"Active"** - Domain is working
   - **Green lock icon** - SSL certificate is provisioned

### 4.2 Expected Timeline
- **DNS Propagation**: 5-30 minutes
- **SSL Provisioning**: 5-30 minutes after DNS verification
- **Total Time**: 10-60 minutes

## 🧪 STEP 5: TEST THE CONFIGURATION

### 5.1 Test API Endpoints
Once the domain shows as "Active" with a green lock icon, test these endpoints:

1. **Health Check**:
   ```
   https://api.lethimdo.com/health
   ```
   Expected response:
   ```json
   {
     "status": "OK",
     "timestamp": "2025-01-01T00:00:00.000Z",
     "uptime": 123.45,
     "environment": "production"
   }
   ```

2. **Basic API Info**:
   ```
   https://api.lethimdo.com/
   ```
   Expected response:
   ```json
   {
     "message": "Lethimdo API",
     "version": "1.0.0",
     "status": "running"
   }
   ```

3. **Integrations List**:
   ```
   https://api.lethimdo.com/api/integrations
   ```
   Expected response: List of available integrations

## 🚨 TROUBLESHOOTING

### Common Issues and Solutions

#### 1. "Verification Failed" in Render.com
- **Cause**: TXT record doesn't match exactly
- **Solution**: 
  1. Double-check the TXT record value exactly matches what Render.com provided
  2. Ensure there are no extra spaces at the beginning or end
  3. Wait 15-30 minutes for DNS propagation
  4. Refresh the domain status in Render.com

#### 2. "Pending SSL" for Extended Time
- **Cause**: DNS records not properly configured or not propagated
- **Solution**:
  1. Verify the CNAME record is correctly configured
  2. Check for typos in domain names
  3. Use https://dnschecker.org to verify DNS propagation
  4. Wait up to 1 hour for SSL provisioning

#### 3. "Domain Not Found" When Testing
- **Cause**: DNS records not propagated or misconfigured
- **Solution**:
  1. Verify DNS records using online tools like https://dnschecker.org
  2. Check domain spelling in both Render.com and Hostinger
  3. Wait for full DNS propagation (up to 1 hour)
  4. Clear browser cache and try again

#### 4. Mixed Content Warnings
- **Cause**: Frontend trying to access API over HTTP instead of HTTPS
- **Solution**:
  1. Ensure all API calls use HTTPS
  2. Update any hardcoded HTTP URLs
  3. Check environment variables in frontend

## 🎯 SUCCESS INDICATORS

You'll know everything is working when:

### In Render.com Dashboard
- ✅ Domain shows as "Active"
- ✅ Green lock icon for SSL certificate
- ✅ No verification errors

### API Endpoint Testing
- ✅ https://api.lethimdo.com/health returns JSON with status "OK"
- ✅ https://api.lethimdo.com/ returns API information
- ✅ https://api.lethimdo.com/api/integrations returns integration data

### Browser Testing
- ✅ Green lock icon in browser address bar
- ✅ No SSL warnings or errors
- ✅ Fast loading times

## 📚 DOCUMENTATION REFERENCES

For additional help, refer to these documents we've created:
- [Render API Subdomain Guide](RENDER-API-SUBDOMAIN-GUIDE.md)
- [Render API Setup Details](RENDER-API-SETUP-DETAILS.md)
- [API Subdomain Config Values](API-SUBDOMAIN-CONFIG-VALUES.md)
- [Custom Domain Configuration Guide](CUSTOM-DOMAIN-CONFIGURATION-GUIDE.md)

## 🇧🇩 BANGLADESH FREELANCE AGENCY BENEFITS

With this professional API subdomain setup, your Bangladesh freelance agency will:
- ✅ Present a polished, professional image to international clients
- ✅ Have clean, memorable URLs for both frontend and API
- ✅ Follow industry-standard architecture practices
- ✅ Be ready for client demos with production-ready URLs

## 📞 SUPPORT

If you encounter issues:
1. Check DNS records using online tools like https://dnschecker.org
2. Verify all values match exactly between Render.com and Hostinger
3. Wait for full DNS propagation (up to 1 hour)
4. Contact Render.com support if issues persist

---
**Complete API Subdomain Setup Guide for Lethimdo - Bangladesh Freelance Agency**