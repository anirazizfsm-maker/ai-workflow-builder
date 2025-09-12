# Add CNAME Record for www.api.lethimdo.com

## Overview
This guide will help you add a CNAME record for www.api.lethimdo.com that points to your Render.com backend service (lethimdo-backend.onrender.com).

## Prerequisites
1. Access to your Hostinger account
2. Domain management permissions for lethimdo.com
3. DNS propagation can take up to 48 hours

## Steps to Add CNAME Record

### 1. Login to Hostinger
1. Go to https://hpanel.hostinger.com
2. Login with your credentials

### 2. Navigate to DNS Zone Editor
1. Select your domain (lethimdo.com)
2. Click on "Manage"
3. Find and click "DNS Zone" or "DNS Records"

### 3. Add New CNAME Record
Create a new CNAME record with the following details:

| Field | Value |
|-------|-------|
| Type | CNAME |
| Name/Host | www.api |
| Value/Points to | lethimdo-backend.onrender.com |
| TTL | 3600 (1 hour) or Auto |

### 4. Save the Record
Click "Add Record" or "Save Changes" to apply the new DNS record.

## Verification

### Check DNS Record
After saving, you can verify the record was added by running:
```bash
nslookup www.api.lethimdo.com
```

### Expected Response
Once DNS propagation is complete, you should see:
```
Name:    www.api.lethimdo.com
Address: [IP addresses of Render.com service]
Aliases: lethimdo-backend.onrender.com
```

## Important Notes

### DNS Propagation Time
- DNS changes can take anywhere from a few minutes to 48 hours to propagate globally
- During this time, some users may not be able to access www.api.lethimdo.com

### Render.com Configuration
Since you're pointing to a Render.com service, you'll also need to add www.api.lethimdo.com as a custom domain in your Render.com dashboard:

1. Go to https://dashboard.render.com
2. Select your lethimdo-backend service
3. Go to "Settings" → "Custom Domains"
4. Add "www.api.lethimdo.com" as a new custom domain
5. Follow the verification process (similar to what you did for api.lethimdo.com)

## Testing

### After DNS Propagation
Once DNS propagation is complete, you can test the endpoint:

1. **Health Check**:
   ```bash
   curl https://www.api.lethimdo.com/health
   ```

2. **Base Endpoint**:
   ```bash
   curl https://www.api.lethimdo.com/
   ```

Both should return the same responses as your current api.lethimdo.com endpoint.

## Troubleshooting

### If www.api.lethimdo.com is Not Resolving
1. Double-check the CNAME record in Hostinger DNS Zone
2. Verify the record has propagated using online tools like:
   - https://dnschecker.org
   - https://www.whatsmydns.net

### If SSL Certificate Issues Occur
1. Ensure you've added www.api.lethimdo.com as a custom domain in Render.com
2. Wait for Render.com to provision the SSL certificate (can take a few minutes after domain verification)

### If Still Not Working
1. Check Hostinger DNS propagation status
2. Contact Hostinger support if the DNS record appears correct but isn't resolving
3. Contact Render.com support if the domain is added but SSL certificate isn't being issued

## Alternative Approach

If you prefer to use a redirect instead of a CNAME record:
1. Create an A record pointing to a simple web server
2. Configure that server to redirect all requests to https://api.lethimdo.com
3. This approach requires additional infrastructure but provides more control

## Security Considerations

### CORS Configuration
If you plan to access www.api.lethimdo.com directly from frontend code, ensure your CORS settings in the backend allow requests from this domain.

Update your CORS configuration to include:
```javascript
{
  origin: [
    'https://lethimdo.netlify.app',
    'https://api.lethimdo.com',
    'https://www.api.lethimdo.com'
  ]
}
```

## Next Steps

1. Add the CNAME record in Hostinger DNS Zone
2. Add www.api.lethimdo.com as a custom domain in Render.com
3. Wait for DNS propagation (5-30 minutes typically)
4. Test the endpoint
5. Update any documentation or scripts that reference the API endpoint

## References

- [Hostinger DNS Management Guide](HOSTINGER-SPECIFIC-NAVIGATION-GUIDE.md)
- [Render.com Custom Domain Configuration](RENDER-API-SUBDOMAIN-GUIDE.md)
- [Domain Registrar Update Guide](DOMAIN-REGISTRAR-UPDATE-GUIDE.md)