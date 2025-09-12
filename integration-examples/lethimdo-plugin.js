// Lethimdo Integration Plugin for any Node.js/Express website

class LethimdoPlugin {
  constructor(options = {}) {
    this.options = {
      serviceUrl: options.serviceUrl || 'http://localhost:3001',
      enableAuth: options.enableAuth !== false,
      enableLogging: options.enableLogging !== false,
      customIntegrations: options.customIntegrations || [],
      ...options
    };
    
    this.integrations = new Map();
    this.connections = new Map();
    this.initializeDefaultIntegrations();
  }

  // Initialize with default integrations
  initializeDefaultIntegrations() {
    const defaultIntegrations = [
      { id: 'salesforce', name: 'Salesforce', category: 'CRM', authType: 'oauth' },
      { id: 'google', name: 'Google Workspace', category: 'Productivity', authType: 'oauth' },
      { id: 'slack', name: 'Slack', category: 'Communication', authType: 'oauth' },
      { id: 'stripe', name: 'Stripe', category: 'Payments', authType: 'api_key' },
      { id: 'github', name: 'GitHub', category: 'Developer', authType: 'oauth' },
      { id: 'shopify', name: 'Shopify', category: 'E-commerce', authType: 'api_key' }
    ];

    defaultIntegrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });

    // Add custom integrations
    this.options.customIntegrations.forEach(integration => {
      this.integrations.set(integration.id, integration);
    });
  }

  // Express middleware to add routes
  middleware() {
    const router = require('express').Router();

    // Get available integrations
    router.get('/integrations', (req, res) => {
      const integrationList = Array.from(this.integrations.values());
      res.json({
        success: true,
        data: integrationList,
        total: integrationList.length
      });
    });

    // Connect to a service
    router.post('/integrations/:id/connect', async (req, res) => {
      try {
        const { id } = req.params;
        const { credentials } = req.body;
        const userId = this.options.enableAuth ? req.user?.id : 'anonymous';

        if (!this.integrations.has(id)) {
          return res.status(404).json({ error: 'Integration not found' });
        }

        const connection = await this.createConnection(userId, id, credentials);
        res.json({
          success: true,
          data: connection,
          message: `Connected to ${this.integrations.get(id).name}`
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Discover API
    router.post('/integrations/discover', async (req, res) => {
      try {
        const { url } = req.body;
        const userId = this.options.enableAuth ? req.user?.id : 'anonymous';
        
        const discoveredAPI = await this.discoverAPI(url, userId);
        res.json({
          success: true,
          data: discoveredAPI,
          message: 'API discovered successfully'
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });

    // Get user connections
    router.get('/integrations/connections', (req, res) => {
      const userId = this.options.enableAuth ? req.user?.id : 'anonymous';
      const userConnections = Array.from(this.connections.values())
        .filter(conn => conn.userId === userId);
      
      res.json({
        success: true,
        data: userConnections
      });
    });

    // Marketplace search
    router.get('/integrations/marketplace/search', (req, res) => {
      const { query, category } = req.query;
      
      // Mock marketplace data - replace with real marketplace API
      const marketplaceItems = [
        { id: 'custom-crm', name: 'Custom CRM', rating: 4.8, category: 'CRM' },
        { id: 'payment-gateway', name: 'Payment Gateway', rating: 4.6, category: 'Payments' },
        { id: 'analytics', name: 'Analytics Tool', rating: 4.9, category: 'Analytics' }
      ];

      let filtered = marketplaceItems;
      if (query) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (category) {
        filtered = filtered.filter(item => item.category === category);
      }

      res.json({
        success: true,
        data: filtered
      });
    });

    return router;
  }

  // Create a connection
  async createConnection(userId, integrationId, credentials) {
    const connection = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      integrationId: integrationId,
      status: 'connected',
      credentials: this.encryptCredentials(credentials),
      connectedAt: new Date().toISOString(),
      lastUsed: null
    };

    this.connections.set(connection.id, connection);

    if (this.options.enableLogging) {
      console.log(`✅ New connection: ${integrationId} for user ${userId}`);
    }

    return {
      id: connection.id,
      integrationId: connection.integrationId,
      status: connection.status,
      connectedAt: connection.connectedAt
    };
  }

  // Discover API endpoints
  async discoverAPI(url, userId) {
    try {
      // Basic API discovery - you can enhance this
      const response = await fetch(url);
      const contentType = response.headers.get('content-type');
      
      const discoveredAPI = {
        id: `discovered_${Date.now()}`,
        url: url,
        name: `Discovered API (${new URL(url).hostname})`,
        contentType: contentType,
        status: response.status,
        endpoints: [
          { method: 'GET', path: '/', description: 'Root endpoint' },
          { method: 'GET', path: '/health', description: 'Health check' }
        ],
        authMethods: ['api_key', 'bearer_token'],
        discoveredAt: new Date().toISOString(),
        userId: userId
      };

      // Add to integrations
      this.integrations.set(discoveredAPI.id, {
        id: discoveredAPI.id,
        name: discoveredAPI.name,
        category: 'Custom',
        authType: 'api_key',
        url: url
      });

      return discoveredAPI;
    } catch (error) {
      throw new Error(`Failed to discover API: ${error.message}`);
    }
  }

  // Simple credential encryption (use proper encryption in production)
  encryptCredentials(credentials) {
    // In production, use proper encryption
    return Buffer.from(JSON.stringify(credentials)).toString('base64');
  }

  // Add custom integration
  addIntegration(integration) {
    this.integrations.set(integration.id, integration);
  }

  // Get integration by ID
  getIntegration(id) {
    return this.integrations.get(id);
  }

  // Get user connections
  getUserConnections(userId) {
    return Array.from(this.connections.values())
      .filter(conn => conn.userId === userId);
  }
}

module.exports = LethimdoPlugin;

/*
Usage Example:

const express = require('express');
const LethimdoPlugin = require('./lethimdo-plugin');

const app = express();

// Initialize the plugin
const lethimdo = new LethimdoPlugin({
  enableAuth: true,
  enableLogging: true,
  customIntegrations: [
    {
      id: 'my-custom-api',
      name: 'My Custom API',
      category: 'Custom',
      authType: 'api_key'
    }
  ]
});

// Add the plugin routes to your app
app.use('/api', lethimdo.middleware());

// Your existing routes...
app.get('/', (req, res) => {
  res.send('My website with Lethimdo integration!');
});

app.listen(3000, () => {
  console.log('Website running with Lethimdo integration on port 3000');
});
*/