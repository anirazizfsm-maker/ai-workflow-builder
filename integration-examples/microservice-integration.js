// Example: How to integrate Lethimdo as a microservice into your existing website

class LethimdoIntegrationClient {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  // Check if Lethimdo service is available
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      throw new Error('Lethimdo service unavailable');
    }
  }

  // Get available integrations for your website
  async getAvailableIntegrations() {
    const response = await fetch(`${this.baseUrl}/api/integrations`);
    const data = await response.json();
    return data.data; // Returns array of available integrations
  }

  // Connect a user to a specific service
  async connectUserToService(userId, serviceId, credentials) {
    const response = await fetch(`${this.baseUrl}/api/integrations/${serviceId}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.generateUserToken(userId)}` // Your auth system
      },
      body: JSON.stringify({
        userId: userId,
        credentials: credentials
      })
    });
    return await response.json();
  }

  // Auto-discover an API for a user
  async discoverAPIForUser(userId, apiUrl) {
    const response = await fetch(`${this.baseUrl}/api/integrations/discover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.generateUserToken(userId)}`
      },
      body: JSON.stringify({
        url: apiUrl,
        userId: userId
      })
    });
    return await response.json();
  }

  // Search marketplace integrations
  async searchMarketplace(query, category = null) {
    const params = new URLSearchParams({ query });
    if (category) params.append('category', category);
    
    const response = await fetch(`${this.baseUrl}/api/integrations/marketplace/search?${params}`);
    return await response.json();
  }

  // Helper method to generate user token (implement based on your auth system)
  generateUserToken(userId) {
    // This should integrate with your existing authentication system
    // Return a JWT token or API key that identifies the user
    return `user-${userId}-token`;
  }
}

// Usage in your existing website backend
module.exports = LethimdoIntegrationClient;

// Example usage in your Express.js routes:
/*
const LethimdoClient = require('./LethimdoIntegrationClient');
const lethimdo = new LethimdoClient();

// Add to your existing routes
app.get('/api/my-website/integrations', async (req, res) => {
  try {
    const integrations = await lethimdo.getAvailableIntegrations();
    res.json({ success: true, integrations });
  } catch (error) {
    res.status(500).json({ error: 'Integration service unavailable' });
  }
});

app.post('/api/my-website/connect-service', async (req, res) => {
  const { serviceId, credentials } = req.body;
  const userId = req.user.id; // From your auth middleware
  
  try {
    const result = await lethimdo.connectUserToService(userId, serviceId, credentials);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/