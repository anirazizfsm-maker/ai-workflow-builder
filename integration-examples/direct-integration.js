// Example: Direct integration into your existing Express.js backend

// 1. Copy these files to your existing project:
// - Copy /shared/integrations-database.ts -> your-project/shared/
// - Copy /shared/integration-discovery.ts -> your-project/shared/
// - Copy /backend/simple-server.js routes -> your existing routes/

// 2. Add to your existing Express app:

const express = require('express');
// Your existing app setup...

// Add Lethimdo integration routes to your existing router
const integrationsRouter = express.Router();

// Pre-built integrations endpoint
integrationsRouter.get('/', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'salesforce', name: 'Salesforce', status: 'available', category: 'CRM' },
      { id: 'google', name: 'Google Workspace', status: 'available', category: 'Productivity' },
      { id: 'slack', name: 'Slack', status: 'available', category: 'Communication' },
      { id: 'stripe', name: 'Stripe', status: 'available', category: 'Payments' },
      { id: 'github', name: 'GitHub', status: 'available', category: 'Developer' },
      { id: 'shopify', name: 'Shopify', status: 'available', category: 'E-commerce' },
    ]
  });
});

// Connection endpoint
integrationsRouter.post('/:id/connect', (req, res) => {
  const { credentials } = req.body;
  const userId = req.user?.id; // Your auth middleware
  
  // Store connection in your database
  // Your database logic here...
  
  res.json({
    success: true,
    message: `Successfully connected to ${req.params.id}`,
    connection: {
      id: `conn-${Date.now()}`,
      service: req.params.id,
      userId: userId,
      status: 'connected',
      connectedAt: new Date().toISOString()
    }
  });
});

// Auto-discovery endpoint
integrationsRouter.post('/discover', async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.id;
  
  try {
    // Add your auto-discovery logic here
    // or use the discovery service from /shared/integration-discovery.ts
    
    const discoveredAPI = {
      url: url,
      name: 'Discovered API',
      endpoints: [
        { method: 'GET', path: '/users', description: 'List users' },
        { method: 'POST', path: '/users', description: 'Create user' },
        { method: 'GET', path: '/data', description: 'Get data' }
      ],
      authMethods: ['api_key', 'bearer_token'],
      userId: userId,
      discovered: true
    };
    
    // Save to your database...
    
    res.json({
      success: true,
      data: discoveredAPI,
      message: 'API discovered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marketplace search
integrationsRouter.get('/marketplace/search', (req, res) => {
  const { query, category } = req.query;
  
  // Your marketplace logic or connect to external marketplace
  res.json({
    success: true,
    data: [
      { id: 'custom-crm', name: 'Custom CRM Integration', rating: 4.8, downloads: 1250 },
      { id: 'payment-processor', name: 'Payment Processor', rating: 4.6, downloads: 890 },
      { id: 'analytics-tool', name: 'Analytics Tool', rating: 4.9, downloads: 2100 }
    ]
  });
});

// Add to your existing app
app.use('/api/integrations', integrationsRouter);

// 3. Add to your existing frontend:
// Copy the React components from /frontend/src/components/integrations/
// and integrate them into your existing React app

module.exports = integrationsRouter;