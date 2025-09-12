import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { universalConnector } from '../../shared/universal-api-connector';
import { getAllIntegrations, searchIntegrations, getPopularIntegrations } from '../../shared/integrations-database';
import { IntegrationDiscoveryService } from '../../shared/integration-discovery';

const router = Router();

// Enhanced integrations list with marketplace data
router.get('/available', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, search, sortBy = 'popularity' } = req.query;
    
    let integrations = getAllIntegrations();

    // Filter by category
    if (category && category !== 'all') {
      integrations = integrations.filter(integration => 
        integration.category === category
      );
    }

    // Search functionality
    if (search) {
      integrations = searchIntegrations(search as string);
    }

    // Sort integrations
    switch (sortBy) {
      case 'popularity':
        integrations.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'name':
        integrations.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'category':
        integrations.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'complexity':
        integrations.sort((a, b) => {
          const complexityOrder = { easy: 1, medium: 2, advanced: 3 };
          return complexityOrder[a.setupComplexity] - complexityOrder[b.setupComplexity];
        });
        break;
    }

    res.json({
      success: true,
      data: integrations,
      total: integrations.length
    });
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch integrations'
    });
  }
});

// Marketplace search with advanced filtering
router.get('/marketplace/search', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      query, 
      category, 
      sortBy = 'popular', 
      priceFilter, 
      minRating,
      verified,
      featured,
      limit = 50,
      offset = 0 
    } = req.query;

    // This would normally query a marketplace database
    // For now, we'll simulate marketplace data based on our integrations
    let marketplaceIntegrations = getAllIntegrations().map(integration => ({
      ...integration,
      // Add marketplace-specific fields
      version: '1.0.0',
      author: {
        id: `author_${integration.id}`,
        name: integration.name.includes('Google') ? 'Google LLC' : 
              integration.name.includes('Microsoft') ? 'Microsoft Corporation' :
              integration.name.includes('Slack') ? 'Slack Technologies' :
              `${integration.name} Team`,
        avatar: `https://ui-avatars.com/api/?name=${integration.name}&background=0D8ABC&color=fff`,
        verified: ['Google', 'Microsoft', 'Slack', 'GitHub', 'Stripe'].some(company => 
          integration.name.includes(company)
        )
      },
      downloads: Math.floor(Math.random() * 100000) + integration.popularity * 10000,
      rating: 3.5 + (integration.popularity / 10) * 1.5,
      reviewCount: Math.floor(Math.random() * 1000) + integration.popularity * 50,
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      verified: integration.popularity >= 8,
      featured: integration.popularity >= 9,
      documentation: {
        setup: `## Setup Instructions\n\n1. Create an account with ${integration.name}\n2. Generate API credentials\n3. Configure the integration in Lethimdo`,
        usage: `## Usage\n\nThis integration allows you to connect ${integration.name} with your workflows.`,
        examples: [
          `Example 1: Basic ${integration.name} integration`,
          `Example 2: Advanced ${integration.name} workflow`
        ]
      },
      supportedVersions: ['1.0.0', '1.1.0'],
      dependencies: [],
      permissions: integration.capabilities,
      sourceCodeUrl: integration.popularity >= 7 ? `https://github.com/lethimdo/${integration.id}` : undefined,
      demoUrl: `https://demo.lethimdo.com/integrations/${integration.id}`,
      status: 'active' as const,
      compatibility: {
        minVersion: '1.0.0'
      },
      longDescription: `${integration.description}\n\nThis integration provides comprehensive support for ${integration.name}, allowing you to seamlessly connect your workflows with their powerful features.`
    }));

    // Apply filters
    if (query) {
      const searchTerm = (query as string).toLowerCase();
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm) ||
        integration.description.toLowerCase().includes(searchTerm) ||
        integration.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (category && category !== 'All Categories') {
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        integration.category === category
      );
    }

    if (priceFilter && Array.isArray(priceFilter)) {
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        priceFilter.includes(integration.pricing)
      );
    }

    if (minRating) {
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        integration.rating >= parseFloat(minRating as string)
      );
    }

    if (verified === 'true') {
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        integration.verified
      );
    }

    if (featured === 'true') {
      marketplaceIntegrations = marketplaceIntegrations.filter(integration =>
        integration.featured
      );
    }

    // Sort results
    switch (sortBy) {
      case 'popular':
        marketplaceIntegrations.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'newest':
        marketplaceIntegrations.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'rating':
        marketplaceIntegrations.sort((a, b) => b.rating - a.rating);
        break;
      case 'downloads':
        marketplaceIntegrations.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'updated':
        marketplaceIntegrations.sort((a, b) => 
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
        break;
    }

    // Apply pagination
    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const paginatedResults = marketplaceIntegrations.slice(offsetNum, offsetNum + limitNum);

    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        total: marketplaceIntegrations.length,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < marketplaceIntegrations.length
      }
    });
  } catch (error) {
    console.error('Error searching marketplace:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search marketplace'
    });
  }
});

// Install integration from marketplace
router.post('/marketplace/install/:integrationId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const userId = req.user!.id;

    // Find the integration
    const integration = getAllIntegrations().find(int => int.id === integrationId);
    
    if (!integration) {
      return res.status(404).json({
        success: false,
        error: 'Integration not found'
      });
    }

    // In a real implementation, this would:
    // 1. Download the integration package
    // 2. Verify signatures and security
    // 3. Install dependencies
    // 4. Register the integration for the user
    // 5. Update download count

    // For now, we'll simulate the installation
    const installedIntegration = {
      id: `installed_${integrationId}_${Date.now()}`,
      integrationId,
      userId,
      name: integration.name,
      status: 'installed',
      version: '1.0.0',
      installedAt: new Date().toISOString(),
      configuration: {},
      enabled: true
    };

    // Simulate adding to user's installed integrations
    // This would normally be saved to database

    res.json({
      success: true,
      data: installedIntegration,
      message: `${integration.name} has been successfully installed!`
    });
  } catch (error) {
    console.error('Error installing integration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to install integration'
    });
  }
});

// Get user's favorite integrations
router.get('/favorites', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // This would normally query from database
    // For now, return empty array
    const favorites = [];

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch favorites'
    });
  }
});

// Add integration to favorites
router.post('/favorites/:integrationId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const userId = req.user!.id;

    // This would normally save to database
    const favorite = {
      id: `fav_${Date.now()}`,
      userId,
      integrationId,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: favorite,
      message: 'Added to favorites'
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to favorites'
    });
  }
});

// Remove integration from favorites
router.delete('/favorites/:integrationId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const userId = req.user!.id;

    // This would normally delete from database

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from favorites'
    });
  }
});

// Auto-discover API from URL
router.post('/discover', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required'
      });
    }

    const discoveryService = IntegrationDiscoveryService.getInstance();
    const result = await discoveryService.generateConfigFromUrl(url);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error discovering API:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to discover API'
    });
  }
});

// Create custom integration
router.post('/custom', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, baseUrl, authMethod, endpoints } = req.body;
    const userId = req.user!.id;

    // Validate required fields
    if (!name || !baseUrl) {
      return res.status(400).json({
        success: false,
        error: 'Name and base URL are required'
      });
    }

    const customIntegration = {
      id: `custom_${Date.now()}`,
      name,
      description: description || `Custom integration for ${name}`,
      baseUrl,
      authMethod: authMethod || 'none',
      endpoints: endpoints || [],
      userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // This would normally save to database

    res.json({
      success: true,
      data: customIntegration,
      message: 'Custom integration created successfully'
    });
  } catch (error) {
    console.error('Error creating custom integration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create custom integration'
    });
  }
});

// Test custom integration
router.post('/test/:integrationId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const { credentials } = req.body;

    // This would normally load the integration from database
    // For now, we'll create a test connection and try to connect

    const connectionId = await universalConnector.createConnectionFromUrl(
      'https://api.example.com', // This would come from the stored integration
      credentials
    );

    if (!connectionId) {
      return res.status(400).json({
        success: false,
        error: 'Failed to create test connection'
      });
    }

    const testResult = await universalConnector.testConnection(connectionId.id);

    // Clean up test connection
    universalConnector.removeConnection(connectionId.id);

    res.json({
      success: true,
      data: testResult
    });
  } catch (error) {
    console.error('Error testing integration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test integration'
    });
  }
});

// Get integration reviews
router.get('/:integrationId/reviews', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    // This would normally query from database
    // For now, return mock reviews
    const mockReviews = [
      {
        id: 'review_1',
        userId: 'user_1',
        userName: 'John Doe',
        userAvatar: 'https://ui-avatars.com/api/?name=John+Doe',
        rating: 5,
        comment: 'Excellent integration! Works perfectly with our workflow.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        helpful: 12
      },
      {
        id: 'review_2',
        userId: 'user_2',
        userName: 'Jane Smith',
        userAvatar: 'https://ui-avatars.com/api/?name=Jane+Smith',
        rating: 4,
        comment: 'Good integration, but could use better documentation.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        helpful: 8
      }
    ];

    res.json({
      success: true,
      data: mockReviews,
      pagination: {
        total: mockReviews.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// Submit integration review
router.post('/:integrationId/reviews', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { integrationId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user!.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const review = {
      id: `review_${Date.now()}`,
      integrationId,
      userId,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString(),
      helpful: 0
    };

    // This would normally save to database

    res.json({
      success: true,
      data: review,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit review'
    });
  }
});

export default router;