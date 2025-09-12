# 🔄 DOMAIN REGISTRAR UPDATE GUIDE FOR LETHIMDO.COM

## 🎯 **SOLUTION: UPDATE NAME SERVERS FROM PARKING TO HOSTINGER**

### **PROBLEM IDENTIFIED**
Your domain **lethimdo.com** is currently using parking name servers:
- `ns1.dns-parking.com`
- `ns2.dns-parking.com`

This explains why you're seeing the message "These nameservers are outdated. Please use Hostinger nameservers option." The domain is not actually using Hostinger's DNS system, so any DNS changes you make in Hostinger won't take effect.

Based on our SOA record analysis, your domain is registered with Hostinger (responsible mail: dns.hostinger.com).

## 🚀 **SOLUTION: UPDATE NAME SERVERS**

### **STEP 1: LOGIN TO HOSTINGER**
1. Go to: https://hpanel.hostinger.com
2. Login with your Hostinger account credentials
3. If you don't remember your login, see: [IDENTIFY-DOMAIN-REGISTRAR-GUIDE.md](IDENTIFY-DOMAIN-REGISTRAR-GUIDE.md)

### **STEP 2: ACCESS DOMAIN MANAGEMENT**
1. In the Hostinger dashboard, click on **"Domains"** in the left sidebar
2. Find **"lethimdo.com"** in your domain list
3. Click **"Manage"** next to your domain

### **STEP 3: NAVIGATE TO NAMESERVERS**
1. In the domain management page, look for **"Nameservers"** or **"DNS / Nameservers"** section
2. Click on this section to expand it
3. For detailed navigation instructions, see: [HOSTINGER-SPECIFIC-NAVIGATION-GUIDE.md](HOSTINGER-SPECIFIC-NAVIGATION-GUIDE.md)

### **STEP 4: UPDATE NAMESERVERS**
1. Change from **"Use default nameservers"** or **"Parking name servers"** to **"Use Hostinger nameservers"** or **"Use custom nameservers"**
2. If you see an option for "Use Hostinger nameservers", select that option
3. If you need to enter custom nameservers, enter Hostinger's name servers:
   ```
   ns1.hostinger.com
   ns2.hostinger.com
   ns3.hostinger.com
   ns4.hostinger.com
   ```
4. Click **"Save"** or **"Update"** to apply the changes

### **STEP 5: WAIT FOR PROPAGATION**
- **Propagation Time**: 24-48 hours
- **Reason**: DNS changes need time to propagate across the internet
- **During this time**: Your website might be temporarily inaccessible

## 🧪 **VERIFY CHANGES**

### **Check Current Name Servers**
Run this command in your terminal:
```cmd
nslookup -type=NS lethimdo.com
```

### **Expected Result After Propagation**
```
lethimdo.com    nameserver = ns1.hostinger.com
lethimdo.com    nameserver = ns2.hostinger.com
lethimdo.com    nameserver = ns3.hostinger.com
lethimdo.com    nameserver = ns4.hostinger.com
```

## 🔄 **AFTER PROPAGATION COMPLETE**

### **STEP 1: RECONFIGURE DNS RECORDS**
1. After 24-48 hours, log back into Hostinger
2. Go to **"Domains"** → **"lethimdo.com"** → **"Manage"**
3. Click **"DNS Zone"** to set up your DNS records:
   - **A Record**: @ → 75.2.60.5 (for Netlify)
   - **CNAME Record**: www → [your-netlify-site].netlify.app

### **STEP 2: RE-ADD CUSTOM DOMAIN IN RENDER.COM**
1. Go to your Render.com dashboard
2. Navigate to your backend service
3. Go to **"Settings"** tab
4. Scroll to **"Custom Domains"** section
5. Remove the existing api.lethimdo.com entry
6. Add it again to generate a new TXT verification record

## ⚠️ **IMPORTANT WARNINGS**

### **WEBSITE DOWNTIME**
- Your website will be temporarily inaccessible during propagation
- This is normal and expected
- Plan this change during low-traffic hours

### **EMAIL SERVICES**
- If you have email services configured, they might be affected
- Backup your email settings before making changes

### **OTHER SERVICES**
- Any other services using lethimdo.com might be temporarily affected
- API endpoints, third-party integrations, etc.

## 🎯 **EXPECTED OUTCOME**

### **Before Fix:**
- Domain points to parking page
- DNS changes in Hostinger have no effect
- No TXT record appears in Render.com
- Message: "These nameservers are outdated. Please use Hostinger nameservers option."

### **After Fix:**
- Domain uses Hostinger's DNS system
- DNS changes in Hostinger take effect immediately
- TXT record appears in Render.com for verification
- api.lethimdo.com can be properly configured
- No more outdated nameservers message

## 📞 **SUPPORT CONTACT**

### **Hostinger Support:**
- Live chat: Available in Hostinger dashboard
- Email: support@hostinger.com
- Phone: +370 645 02010 (International)

### **Render.com Support:**
- Email: support@render.com
- Status page: https://status.render.com

## 🕐 **TIMELINE**

### **Day 1:**
- Update name servers (takes 5-10 minutes)
- Wait for propagation (24-48 hours)

### **Day 2-3:**
- Verify name server changes
- Reconfigure DNS records in Hostinger
- Re-add custom domain in Render.com
- Configure TXT verification record

### **Day 3-4:**
- Test API subdomain: https://api.lethimdo.com
- Final verification and testing

## ✅ **SUCCESS CHECKLIST**

- [ ] Name servers updated to Hostinger's servers
- [ ] Waited 24-48 hours for propagation
- [ ] DNS records reconfigured in Hostinger
- [ ] Custom domain re-added in Render.com
- [ ] TXT verification record visible in Render.com
- [ ] api.lethimdo.com working correctly
- [ ] No more "outdated nameservers" message
- [ ] All services restored and tested

---
**Note**: This process is necessary because your domain was registered with Hostinger but was using parking name servers instead of Hostinger's DNS system. This is a common issue that prevents proper DNS configuration.