# Lethimdo Frontend

Professional API Integration Platform for Bangladesh Freelance Agencies

## 🌐 Live Demo
- **Frontend**: [https://lethimdo.netlify.app](https://lethimdo.netlify.app)
- **Backend**: [https://lethimdo-backend.onrender.com](https://lethimdo-backend.onrender.com)

## 🚀 Features

### 150+ API Integrations
Connect with popular services including:
- Salesforce
- Google Workspace
- Slack
- Stripe
- GitHub
- Shopify
- And 140+ more services

### Universal API Connectivity
Four ways to connect any API:
1. **150+ Pre-Built Integrations** - Ready-to-use connectors
2. **Auto-Discovery** - Paste any API URL for automatic configuration
3. **Custom Builder** - Visual integration builder for custom APIs
4. **Community Marketplace** - Share and install community integrations

### Professional Dashboard
- Real-time API connection status
- Integration management
- Workflow automation
- Performance analytics

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Router** for navigation
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **Render.com** for deployment
- **RESTful API** architecture

## 📦 Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd lethimdo/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Deployment

### Netlify Deployment
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
VITE_API_DEV_URL=http://localhost:3001
VITE_APP_NAME=Lethimdo
VITE_APP_VERSION=1.0.0
```

## 🎯 Bangladesh Freelance Agency Benefits

### Cost-Effective Solution
- **90% lower costs** compared to Western agencies
- **FREE hosting tier** with Netlify and Render.com
- **No AI integration costs** (optional feature)

### Professional Services
- Modern, responsive UI/UX
- 150+ pre-built integrations
- Auto-discovery for any API
- Custom workflow automation

### International Client Ready
- USD earning potential
- Professional documentation
- Multi-language support
- 24/7 system monitoring

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Entry point
├── dist/                   # Production build
├── .env                    # Environment variables
├── netlify.toml            # Netlify configuration
└── deploy-to-netlify.bat   # Deployment script
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Check test coverage
npm run test:coverage
```

## 📚 API Endpoints

### Health Check
- `GET /health` - System health status

### Authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Integrations
- `GET /api/integrations` - List all integrations
- `POST /api/integrations/:id/connect` - Connect to integration
- `POST /api/integrations/discover` - Auto-discover API

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/execute` - Execute workflow

## 🎨 Professional UI Components

1. **Header** - Navigation and branding
2. **Hero Section** - Engaging landing page
3. **Features Section** - Key selling points
4. **Dashboard Cards** - Interactive dashboard elements
5. **Footer** - Professional footer with links
6. **API Status** - Real-time connection monitoring
7. **API Test Page** - Comprehensive testing suite

## 🚀 Getting Started for Clients

1. **Sign Up** - Create your agency account
2. **Connect APIs** - Use our 150+ integrations
3. **Build Workflows** - Automate business processes
4. **Monitor Performance** - Track time/cost savings
5. **Scale Operations** - Add more clients and services

## 📞 Support

For technical support or business inquiries:
- Email: support@lethimdo.com
- Documentation: [https://lethimdo.netlify.app/docs](https://lethimdo.netlify.app/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🇧🇩 Bangladesh Freelance Agency Model

Lethimdo is specifically designed for Bangladesh freelance agencies to:
- **Earn in USD** from international clients
- **Reduce operational costs** by 90%
- **Deliver professional API integration services**
- **Scale without expensive infrastructure**
- **Compete with Western agencies on price and quality**

## 🎨 Professional Design Enhancements

### Custom Styling
We've added professional styling components for a more polished look:
- Gradient backgrounds for visual appeal
- Smooth animations and transitions
- Card hover effects for interactivity
- Professional color scheme with blue and indigo accents
- Bangladesh flag accent colors for agency branding

### Responsive Design
All components are fully responsive and will look great on:
- Desktop computers
- Tablets
- Mobile devices

### Professional UI Elements
- Enhanced dashboard cards with badges and stats
- Improved navigation with clear CTAs
- Professional footer with social links
- Hero section with visual dashboard preview
- Agency-specific sections highlighting benefits

## ☁️ Deployment to Netlify

### Prerequisites
1. A Netlify account (free tier available)
2. Netlify CLI installed (`npm install -g netlify-cli`)
3. Your project built and ready for deployment

### Deployment Steps
1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy your site**:
   ```bash
   # From the frontend directory
   npm run build
   netlify deploy --prod
   ```

4. **Configure your site**:
   - When prompted, select your build directory: `dist`
   - Netlify will provide a live URL for your site

### Custom Domain Configuration
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Domain settings"
4. Add your custom domain
5. Follow Netlify's DNS configuration instructions

### Environment Variables in Netlify
1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site settings" → "Environment variables"
4. Add the following variables:
   ```
   VITE_API_BASE_URL=https://lethimdo-backend.onrender.com
   VITE_APP_NAME=Lethimdo
   ```

## 🛠️ Troubleshooting

### Common Issues
1. **Build failures**: Ensure all dependencies are installed with `npm install`
2. **API connection issues**: Verify environment variables are set correctly
3. **Styling issues**: Check that Tailwind CSS is properly configured

### Support
For any deployment issues or questions:
- Check the Netlify documentation
- Contact our support team at support@lethimdo.com
- Refer to the detailed logs in your Netlify deploy settings

---
*Built with ❤️ for Bangladesh Freelance Agencies*