# Fix DNS Configuration for Lethimdo

## Current Issues

Based on your DNS records, there are several problems:

1. **WWW CNAME Record**: Points to `lethimdo.com` instead of your Cloudflare Pages domain
2. **Root Domain A Record**: Points to Netlify IP (`75.2.60.5`) instead of Cloudflare Pages
3. **NS Records**: Point to parking servers instead of proper nameservers

## Required Fixes

### 1. Fix WWW Subdomain (www.lethimdo.com)

**Current Record:**
```
Type: CNAME
Name: www
Content: lethimdo.com
Proxy status: Proxied
TTL: Auto
```

**Should Be:**
```
Type: CNAME
Name: www
Content: [your-project.pages.dev] (get this from Cloudflare Pages)
Proxy status: Proxied
TTL: Auto
```

### 2. Fix Root Domain (lethimdo.com)

**Current Record:**
```
Type: A
Name: @ (or lethimdo.com)
Content: 75.2.60.5
Proxy status: Proxied
TTL: Auto
```

**Should Be:**
```
Type: A
Name: @
Content: 192.0.2.1 (Cloudflare Pages IP for apex domains)
Proxy status: Proxied
TTL: Auto
```

### 3. Fix NS Records

The NS records should point to either:
- **Hostinger nameservers** (if managing DNS through Hostinger)
- **Cloudflare nameservers** (if managing DNS through Cloudflare)

Currently they point to parking servers, which is incorrect.

## Step-by-Step Fix Process

### Step 1: Find Your Cloudflare Pages Domain

1. Login to Cloudflare Dashboard: https://dash.cloudflare.com
2. Click on "Pages" in the left sidebar
3. Find your project (likely named "ai-workflow-builder")
4. Click on the project name
5. Note the domain shown under "Production" (something like `your-project.pages.dev`)

### Step 2: Fix WWW CNAME Record

1. In Cloudflare Dashboard, select your domain (lethimdo.com)
2. Click on the "DNS" tab
3. Find the CNAME record for "www"
4. Click the edit button (pencil icon)
5. Change the "Content" field to your Cloudflare Pages domain (from Step 1)
6. Make sure "Proxy status" is set to "Proxied" (orange cloud)
7. Click "Save"

### Step 3: Fix Root Domain A Record

1. In the DNS tab, find the A record for "@"
2. Click the edit button (pencil icon)
3. Change the "Content" field to `192.0.2.1`
4. Make sure "Proxy status" is set to "Proxied" (orange cloud)
5. Click "Save"

### Step 4: Fix NS Records (Choose One Option)

#### Option A: Manage DNS through Hostinger (Recommended if you prefer Hostinger)

1. Login to Hostinger hPanel
2. Go to "Domains" → "lethimdo.com" → "Manage"
3. Click on "DNS Zone" or "DNS Management"
4. Find the Hostinger nameservers (usually something like `ns1.hostinger.com` and `ns2.hostinger.com`)
5. Update your domain's nameservers at your registrar to point to Hostinger's nameservers

#### Option B: Manage DNS through Cloudflare (Recommended for Cloudflare Pages)

1. In Cloudflare Dashboard, select your domain (lethimdo.com)
2. Click on "DNS" tab
3. Delete the NS records pointing to parking servers
4. Cloudflare's NS records should automatically be used

## Verification Steps

After making these changes:

1. Wait 5-15 minutes for changes to process
2. Wait up to 4 hours for full DNS propagation
3. Test both domains:
   - https://lethimdo.com
   - https://www.lethimdo.com

## Troubleshooting

### If domains still don't work:

1. Check that all records have "Proxy status" set to "Proxied" (orange cloud)
2. Verify that the CNAME content matches exactly what Cloudflare Pages provides
3. Check Cloudflare's SSL/TLS tab for certificate issues
4. Clear your browser cache and try again

### If you see "Welcome to Cloudflare" page:

1. This is normal during propagation
2. Wait longer for DNS propagation to complete
3. Check that your CNAME record points to the correct `*.pages.dev` target

## For Your Bangladesh Freelance Agency

Having properly configured DNS is crucial for your professional image:
- ✅ Professional appearance for client presentations
- ✅ Better SEO with both domains working correctly
- ✅ Improved accessibility for international clients
- ✅ Enhanced credibility with potential clients

## Next Steps

1. Make the DNS changes as described above
2. Wait for propagation (5-60 minutes)
3. Test both domains
4. Set up analytics and monitoring once everything is working