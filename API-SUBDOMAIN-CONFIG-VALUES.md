# 🎯 API SUBDOMAIN CONFIGURATION VALUES

## 🚀 RENDER.COM CUSTOM DOMAIN SETUP DETAILS

### Service Information
- **Service Name**: lethimdo-backend
- **Current URL**: https://lethimdo-backend.onrender.com
- **Service URL Pattern**: lethimdo-backend-xxxx.onrender.com
- **Environment**: Production

### Custom Domain to Add
- **Domain Name**: api.lethimdo.com

### DNS Records You'll Need to Add in Hostinger

#### 1. TXT Verification Record (Get exact value from Render.com)
```
Type: TXT
Name: _render-api.lethimdo.com
Value: [REPLACE WITH EXACT VALUE FROM RENDER.COM]
TTL: 3600
```

#### 2. CNAME Record
```
Type: CNAME
Name: api.lethimdo.com
Value: lethimdo-backend-xxxx.onrender.com (replace xxxx with your actual service ID)
TTL: 3600
```

## 🌐 STEP-BY-STEP SETUP PROCESS

### Step 1: Add Custom Domain in Render.com
1. Go to https://dashboard.render.com
2. Click on your `lethimdo-backend` service
3. Navigate to "Settings" → "Custom Domains"
4. Click "Add Custom Domain"
5. Enter: `api.lethimdo.com`
6. Click "Add Domain"

### Step 2: Get Verification Details
After adding the domain, Render.com will show you:
- The exact TXT record value for verification
- Confirmation of the CNAME target (your service URL)

### Step 3: Add DNS Records in Hostinger
1. Login to https://hpanel.hostinger.com
2. Go to "Domains" → "lethimdo.com" → "Manage" → "DNS Zone"
3. Add the TXT verification record with the exact value from Render.com
4. Add the CNAME record pointing to your service URL

### Step 4: Wait for Verification
- DNS propagation typically takes 5-30 minutes
- SSL certificate provisioning typically takes 5-30 minutes after DNS verification
- Total time: 10-60 minutes

## 🔍 VERIFICATION CHECKLIST

### In Render.com Dashboard
- [ ] Domain shows as "Verified" (TXT record confirmed)
- [ ] Domain shows as "Active" (CNAME working)
- [ ] Green lock icon appears (SSL certificate active)

### Testing API Endpoints
Once active, these should work:
- https://api.lethimdo.com/health
- https://api.lethimdo.com/
- https://api.lethimdo.com/api/integrations

## 🚨 TROUBLESHOOTING TIPS

### If Verification Fails
1. Double-check the TXT record value exactly matches what Render.com provided
2. Ensure there are no extra spaces in the values
3. Wait 15-30 minutes for DNS propagation
4. Refresh the domain status in Render.com

### If SSL Certificate Doesn't Provision
1. Verify the CNAME record is correctly configured
2. Check for typos in the domain names
3. Wait up to 1 hour for SSL provisioning
4. Contact Render.com support if issues persist

### If API Endpoints Don't Work
1. Test using https://dnschecker.org to verify DNS propagation
2. Clear your browser cache
3. Try in an incognito/private browser window
4. Check that both frontend and backend are using HTTPS

## 🎯 SUCCESS INDICATORS

When everything is working correctly:
- ✅ https://api.lethimdo.com/health returns JSON with status "OK"
- ✅ https://api.lethimdo.com/ returns API information
- ✅ https://api.lethimdo.com/api/integrations returns integration data
- ✅ All endpoints show a valid SSL certificate (green lock icon)

---
**Configuration Values for Lethimdo API Subdomain - Bangladesh Freelance Agency**