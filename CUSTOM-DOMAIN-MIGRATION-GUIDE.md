# Custom Domain Migration Guide: .netlify.app to .com

## Overview
This guide explains how to migrate your frontend from https://lethimdo.netlify.app to https://lethimdo.com.

## Prerequisites
1. Domain ownership of lethimdo.com (confirmed you have this)
2. Access to Netlify dashboard
3. Access to domain registrar (Hostinger)

## Migration Steps

### Step 1: Configure Custom Domain in Netlify
1. Log in to your Netlify account
2. Go to your site settings
3. Navigate to "Domain Management"
4. Click "Add custom domain"
5. Enter "lethimdo.com" and click "Verify"
6. Follow the DNS configuration instructions

### Step 2: Update DNS Records at Your Registrar (Hostinger)
Since you're currently using parking name servers, you'll need to either:
1. Update name servers to Hostinger's DNS servers (recommended long-term solution)
2. Add DNS records directly at the current registrar

#### Option A: Update Name Servers (Recommended)
1. Log in to Hostinger
2. Go to "Domains" → "lethimdo.com" → "Manage"
3. Click "Nameservers"
4. Select "Use Hostinger nameservers"
5. The nameservers should be:
   - ns1.hostinger.com
   - ns2.hostinger.com
   - ns3.hostinger.com
   - ns4.hostinger.com

#### Option B: Add DNS Records at Current Registrar
If you prefer to keep using parking name servers temporarily:
1. Log in to your domain registrar
2. Find DNS management section
3. Add these records:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 3600
   
   Type: A
   Name: www
   Value: 75.2.60.5
   TTL: 3600
   ```

### Step 3: Configure SSL Certificate
Netlify automatically provisions SSL certificates for custom domains:
1. In Netlify Domain Management, wait for SSL status to show "Active"
2. This may take a few minutes to hours after DNS propagation

### Step 4: Update Environment Variables
Update your frontend environment variables to use the new domain:

In your `.env` file:
```
VITE_API_BASE_URL=https://api.lethimdo.com
VITE_APP_NAME=Lethimdo
```

And in Netlify environment variables:
1. Go to your site settings in Netlify
2. Navigate to "Environment"
3. Update `VITE_API_BASE_URL` to `https://api.lethimdo.com`

### Step 5: Update Backend CORS Settings
Update your backend CORS configuration to allow the new domain:

In your backend code (likely in server setup):
```javascript
const corsOptions = {
  origin: [
    'https://lethimdo.com',
    'https://www.lethimdo.com',
    'https://lethimdo.netlify.app' // Keep this temporarily during migration
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Step 6: Test the Migration
1. Visit https://lethimdo.com
2. Verify all functionality works correctly
3. Test API connections
4. Check all links and redirects

### Step 7: Update Documentation and References
1. Update README.md with new URLs
2. Update any marketing materials
3. Update GitHub repository description
4. Update any client communications

## Timeline
- DNS Changes: 24-48 hours for full propagation
- SSL Certificate: 1-24 hours after DNS propagation
- Total Migration Time: 2-3 days for complete transition

## Troubleshooting
### Common Issues:
1. **Site not loading**: Check DNS records are correct
2. **SSL issues**: Wait for certificate provisioning
3. **Mixed content warnings**: Ensure all resources use HTTPS
4. **CORS errors**: Verify backend CORS configuration

### Verification Commands:
```bash
# Check DNS records
nslookup lethimdo.com
dig lethimdo.com

# Check SSL certificate
openssl s_client -connect lethimdo.com:443 -servername lethimdo.com
```

## Rollback Plan
If issues occur:
1. Revert Netlify custom domain settings
2. Temporarily use .netlify.app domain
3. Contact Netlify support if needed

## Benefits for Bangladesh Freelance Agencies
1. Professional appearance with custom domain
2. Better branding for client presentations
3. Improved SEO with custom domain
4. Enhanced credibility with international clients