# WWW Subdomain Configuration Checklist

## Prerequisites
- [ ] Cloudflare account with access to lethimdo.com domain
- [ ] Cloudflare Pages project for Lethimdo
- [ ] Access to Cloudflare Dashboard

## Steps to Complete

### 1. Login to Cloudflare Dashboard
- [ ] Go to https://dash.cloudflare.com
- [ ] Sign in with your Cloudflare account credentials

### 2. Find Your Cloudflare Pages Project
- [ ] In the left sidebar, click on "Pages"
- [ ] Locate your project (likely named "ai-workflow-builder")
- [ ] Click on the project name

### 3. Add Custom Domain for WWW
- [ ] In your Pages project, click on "Settings" tab
- [ ] Scroll down to "Custom domains" section
- [ ] Click "Add custom domain"
- [ ] Enter: `www.lethimdo.com`
- [ ] Click "Continue"
- [ ] Note the DNS record details that Cloudflare provides

### 4. Add DNS Record in Cloudflare
- [ ] In Cloudflare Dashboard, select your domain (lethimdo.com)
- [ ] Click on the "DNS" tab
- [ ] Click "Add record"
- [ ] Fill in the details:
  - Type: CNAME
  - Name: www
  - Content: [your-project.pages.dev] (use the exact value from Step 3)
  - Proxy status: Proxied (orange cloud)
  - TTL: Auto
- [ ] Click "Save"

### 5. Configure Root Domain (lethimdo.com)
- [ ] In the DNS tab, look for an A record for "@"
- [ ] If it doesn't exist or points to the wrong IP, add/update it:
  ```
  Type: A
  Name: @
  Content: 192.0.2.1 (This is Cloudflare's IP for apex domains)
  Proxy status: Proxied (orange cloud)
  TTL: Auto
  ```
- [ ] Click "Save"

### 6. Wait for DNS Propagation
- [ ] Initial processing: 5-15 minutes
- [ ] Local propagation: 15-30 minutes
- [ ] Global propagation: 1-4 hours

### 7. Test Your Configuration
After waiting for propagation:
- [ ] https://www.lethimdo.com loads correctly
- [ ] https://lethimdo.com loads correctly
- [ ] Both domains show SSL certificate as secure
- [ ] Hard refresh works on both domains (SPA routing)
- [ ] API calls work correctly on both domains

## Troubleshooting Checklist

### If www.lethimdo.com doesn't work:
- [ ] Double-check the CNAME record in DNS tab
- [ ] Ensure the Content field matches exactly what Cloudflare Pages provided
- [ ] Make sure Proxy status is "Proxied" (orange cloud)
- [ ] Wait longer for DNS propagation

### If SSL Certificate Issues:
- [ ] Ensure all DNS records have Proxy status set to "Proxied"
- [ ] Wait for SSL certificate to be issued (can take up to 24 hours)
- [ ] Check the "SSL/TLS" tab in Cloudflare for certificate status

### If Mixed Content or HTTPS Issues:
- [ ] Verify that `VITE_API_BASE_URL` in your .env file uses HTTPS
- [ ] Check that all external resources use HTTPS
- [ ] Review browser console for mixed content warnings

## Completion
Once all items in the "Test Your Configuration" section are checked, your WWW subdomain configuration is complete!