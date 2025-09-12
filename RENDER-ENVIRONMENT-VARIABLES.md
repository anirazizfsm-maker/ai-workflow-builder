# Render.com Environment Variables for Lethimdo Backend

## Required Environment Variables for Render.com Deployment

Copy these exact variables into your Render.com dashboard under "Environment" tab:

### 🔧 **Core Server Configuration**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://lethimdo.netlify.app
```

### 🔐 **Authentication & Security**
```
JWT_SECRET=lethimdo_bangladesh_freelance_agency_2024_secure_jwt_token_32chars_minimum
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### 🤖 **OpenAI Integration (Required for AI Features)**
```
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
```

### 📧 **Email Configuration (Updated for Lethimdo)**
```
FROM_EMAIL=noreply@lethimdo.com
```

### 🔄 **Rate Limiting (Production Optimized)**
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 📁 **File Upload Configuration**
```
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf,text/csv
```

## Step-by-Step Variable Setup in Render.com

### 1. Access Environment Variables
1. Go to your Render.com dashboard
2. Click on your `lethimdo-backend` service
3. Navigate to "Environment" tab
4. Click "Add Environment Variable"

### 2. Add Required Variables (Priority Order)

**STEP 1 - Core Variables (Add these first):**
```
Key: NODE_ENV
Value: production

Key: PORT  
Value: 10000

Key: FRONTEND_URL
Value: https://lethimdo.netlify.app

Key: JWT_SECRET
Value: lethimdo_bangladesh_freelance_agency_2024_secure_jwt_token_32chars_minimum
```

**STEP 2 - OpenAI Integration (Add when you have API key):**
```
Key: OPENAI_API_KEY
Value: sk-your_actual_openai_api_key_here

Key: OPENAI_MODEL
Value: gpt-4

Key: OPENAI_MAX_TOKENS
Value: 2000
```

**STEP 3 - Optional Production Variables:**
```
Key: JWT_EXPIRES_IN
Value: 7d

Key: BCRYPT_ROUNDS
Value: 12

Key: FROM_EMAIL
Value: noreply@lethimdo.com

Key: RATE_LIMIT_WINDOW_MS
Value: 900000

Key: RATE_LIMIT_MAX_REQUESTS
Value: 100

Key: MAX_FILE_SIZE
Value: 10485760

Key: ALLOWED_FILE_TYPES
Value: image/jpeg,image/png,application/pdf,text/csv
```

## Important Notes

### 🎯 **For Bangladesh Freelance Agency:**
- **FRONTEND_URL**: Update this when you configure your custom domain
- **FROM_EMAIL**: Uses your domain for professional communication
- **JWT_SECRET**: Strong security for client data protection

### 🔑 **OpenAI API Key Setup:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy the key (starts with `sk-`)
4. Add to Render.com environment variables

### 🌐 **Domain Configuration:**
When you configure `lethimdo.com` with Netlify:
```
FRONTEND_URL=https://lethimdo.com
```

### 💡 **Cost Optimization:**
- Start with minimal variables (first 4 only)
- Add OpenAI key when you're ready to test AI features
- Other variables are optional for initial deployment

## Deployment Priority

1. **✅ Add Core Variables** (NODE_ENV, PORT, FRONTEND_URL, JWT_SECRET)
2. **🚀 Deploy and Test** basic functionality
3. **🤖 Add OpenAI Variables** when ready for AI features
4. **⚙️ Add Optional Variables** for enhanced functionality

## Security Best Practices

- **Never commit API keys** to version control
- **Use strong JWT secrets** (minimum 32 characters)
- **Rotate secrets regularly** in production
- **Monitor API usage** to prevent unexpected charges

---
**Created for Lethimdo - Bangladesh International Freelance Agency**
**Focus: Professional deployment, security, cost optimization**