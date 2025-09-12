import { IntegrationConfig, getAllIntegrations, searchIntegrations } from './integrations-database';

export interface AutoDiscoveredAPI {
  url: string;
  name: string;
  type: 'rest' | 'graphql' | 'soap' | 'rpc';
  authMethod?: 'none' | 'api_key' | 'oauth' | 'basic' | 'custom';
  endpoints: DiscoveredEndpoint[];
  documentation?: string;
  swaggerUrl?: string;
  confidence: number; // 0-1
}

export interface DiscoveredEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description?: string;
  parameters?: DiscoveredParameter[];
  authentication?: boolean;
}

export interface DiscoveredParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  example?: any;
}

export interface CustomIntegration {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  authMethod: 'none' | 'api_key' | 'oauth' | 'basic' | 'bearer' | 'custom';
  headers?: Record<string, string>;
  endpoints: CustomEndpoint[];
  testEndpoint?: {
    path: string;
    method: string;
    expectedStatus: number;
  };
}

export interface CustomEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
  parameters?: CustomParameter[];
  headers?: Record<string, string>;
  body?: any;
  responseType?: 'json' | 'xml' | 'text' | 'binary';
}

export interface CustomParameter {
  name: string;
  location: 'path' | 'query' | 'header' | 'body';
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  defaultValue?: any;
}

class IntegrationDiscoveryService {
  private static instance: IntegrationDiscoveryService;

  static getInstance(): IntegrationDiscoveryService {
    if (!IntegrationDiscoveryService.instance) {
      IntegrationDiscoveryService.instance = new IntegrationDiscoveryService();
    }
    return IntegrationDiscoveryService.instance;
  }

  // Auto-discover API endpoints from URL
  async discoverAPI(url: string): Promise<AutoDiscoveredAPI | null> {
    try {
      const discovery = await this.attemptAutoDiscovery(url);
      if (discovery) {
        return discovery;
      }

      // Fallback: Try common patterns
      return await this.discoverCommonPatterns(url);
    } catch (error) {
      console.error('API discovery failed:', error);
      return null;
    }
  }

  private async attemptAutoDiscovery(baseUrl: string): Promise<AutoDiscoveredAPI | null> {
    const commonDiscoveryPaths = [
      '/swagger.json',
      '/swagger/v1/swagger.json',
      '/api-docs',
      '/openapi.json',
      '/docs/swagger.json',
      '/.well-known/openapi',
      '/api/swagger.json',
      '/v1/swagger.json',
      '/graphql', // GraphQL introspection
    ];

    for (const path of commonDiscoveryPaths) {
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (path.includes('swagger') || path.includes('openapi')) {
            return this.parseSwaggerSpec(data, baseUrl);
          } else if (path === '/graphql') {
            return this.parseGraphQLSchema(data, baseUrl);
          }
        }
      } catch (error) {
        // Continue to next discovery method
        continue;
      }
    }

    return null;
  }

  private async discoverCommonPatterns(baseUrl: string): Promise<AutoDiscoveredAPI | null> {
    const commonPatterns = [
      '/api',
      '/api/v1',
      '/api/v2',
      '/v1',
      '/v2',
      '/rest',
      '/services',
    ];

    let bestMatch: AutoDiscoveredAPI | null = null;
    let highestConfidence = 0;

    for (const pattern of commonPatterns) {
      try {
        const testUrl = `${baseUrl}${pattern}`;
        const endpoints = await this.probeEndpoints(testUrl);
        
        if (endpoints.length > 0) {
          const confidence = Math.min(0.8, endpoints.length * 0.2);
          
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = {
              url: testUrl,
              name: this.extractNameFromUrl(baseUrl),
              type: 'rest',
              endpoints,
              confidence
            };
          }
        }
      } catch (error) {
        continue;
      }
    }

    return bestMatch;
  }

  private async probeEndpoints(baseUrl: string): Promise<DiscoveredEndpoint[]> {
    const commonEndpoints = [
      { path: '/', method: 'GET' as const },
      { path: '/health', method: 'GET' as const },
      { path: '/status', method: 'GET' as const },
      { path: '/info', method: 'GET' as const },
      { path: '/version', method: 'GET' as const },
      { path: '/users', method: 'GET' as const },
      { path: '/api', method: 'GET' as const },
    ];

    const discoveredEndpoints: DiscoveredEndpoint[] = [];

    for (const endpoint of commonEndpoints) {
      try {
        const response = await fetch(`${baseUrl}${endpoint.path}`, {
          method: endpoint.method,
          headers: { 'Accept': 'application/json' }
        });

        if (response.status < 500) { // Any non-server error indicates endpoint exists
          discoveredEndpoints.push({
            ...endpoint,
            description: `Auto-discovered ${endpoint.method} endpoint`,
            authentication: response.status === 401 || response.status === 403
          });
        }
      } catch (error) {
        // Endpoint doesn't exist or network error
        continue;
      }
    }

    return discoveredEndpoints;
  }

  private parseSwaggerSpec(spec: any, baseUrl: string): AutoDiscoveredAPI {
    const endpoints: DiscoveredEndpoint[] = [];

    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, pathSpec]: [string, any]) => {
        Object.entries(pathSpec).forEach(([method, methodSpec]: [string, any]) => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
            endpoints.push({
              path,
              method: method.toUpperCase() as any,
              description: methodSpec.summary || methodSpec.description,
              parameters: this.parseSwaggerParameters(methodSpec.parameters || [])
            });
          }
        });
      });
    }

    return {
      url: baseUrl,
      name: spec.info?.title || this.extractNameFromUrl(baseUrl),
      type: 'rest',
      endpoints,
      documentation: spec.info?.description,
      swaggerUrl: `${baseUrl}/swagger.json`,
      confidence: 0.95
    };
  }

  private parseSwaggerParameters(params: any[]): DiscoveredParameter[] {
    return params.map(param => ({
      name: param.name,
      type: param.type || 'string',
      required: param.required || false,
      description: param.description
    }));
  }

  private parseGraphQLSchema(schema: any, baseUrl: string): AutoDiscoveredAPI {
    // Basic GraphQL parsing - would need full introspection for complete schema
    return {
      url: baseUrl,
      name: this.extractNameFromUrl(baseUrl),
      type: 'graphql',
      endpoints: [{
        path: '/graphql',
        method: 'POST',
        description: 'GraphQL endpoint'
      }],
      confidence: 0.9
    };
  }

  private extractNameFromUrl(url: string): string {
    try {
      const domain = new URL(url).hostname;
      return domain.replace(/^(api\.|www\.)/, '').split('.')[0];
    } catch {
      return 'Unknown API';
    }
  }

  // Create custom integration from discovered API
  createCustomIntegration(discovered: AutoDiscoveredAPI): CustomIntegration {
    return {
      id: `custom_${Date.now()}`,
      name: discovered.name,
      description: `Auto-discovered API integration for ${discovered.name}`,
      baseUrl: discovered.url,
      authMethod: discovered.authMethod || 'none',
      endpoints: discovered.endpoints.map((endpoint, index) => ({
        id: `endpoint_${index}`,
        name: endpoint.description || `${endpoint.method} ${endpoint.path}`,
        method: endpoint.method,
        path: endpoint.path,
        description: endpoint.description,
        parameters: endpoint.parameters?.map(param => ({
          name: param.name,
          location: 'query' as const,
          type: param.type,
          required: param.required,
          description: param.description
        })) || []
      })),
      testEndpoint: discovered.endpoints.find(e => e.method === 'GET') ? {
        path: discovered.endpoints.find(e => e.method === 'GET')!.path,
        method: 'GET',
        expectedStatus: 200
      } : undefined
    };
  }

  // Test custom integration
  async testIntegration(integration: CustomIntegration, credentials?: any): Promise<{
    success: boolean;
    error?: string;
    responseTime?: number;
    statusCode?: number;
  }> {
    if (!integration.testEndpoint) {
      return { success: false, error: 'No test endpoint configured' };
    }

    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...integration.headers
      };

      // Add authentication
      if (credentials) {
        switch (integration.authMethod) {
          case 'api_key':
            headers['Authorization'] = `Bearer ${credentials.apiKey}`;
            break;
          case 'bearer':
            headers['Authorization'] = `Bearer ${credentials.token}`;
            break;
          case 'basic':
            headers['Authorization'] = `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
            break;
        }
      }

      const response = await fetch(
        `${integration.baseUrl}${integration.testEndpoint.path}`,
        {
          method: integration.testEndpoint.method,
          headers
        }
      );

      const responseTime = Date.now() - startTime;

      return {
        success: response.status === integration.testEndpoint.expectedStatus,
        statusCode: response.status,
        responseTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
    }
  }

  // Smart integration suggestions
  suggestIntegrations(query: string): IntegrationConfig[] {
    const searchResults = searchIntegrations(query);
    const allIntegrations = getAllIntegrations();
    
    // If direct search has results, return those
    if (searchResults.length > 0) {
      return searchResults.slice(0, 10);
    }

    // Otherwise, suggest popular integrations from relevant categories
    const queryLower = query.toLowerCase();
    const relevantCategories: string[] = [];

    // Map query keywords to categories
    if (queryLower.includes('email') || queryLower.includes('mail')) {
      relevantCategories.push('MARKETING', 'COMMUNICATION');
    }
    if (queryLower.includes('data') || queryLower.includes('sheet') || queryLower.includes('database')) {
      relevantCategories.push('PRODUCTIVITY', 'DATABASE');
    }
    if (queryLower.includes('social') || queryLower.includes('media')) {
      relevantCategories.push('SOCIAL_MEDIA');
    }
    if (queryLower.includes('payment') || queryLower.includes('ecommerce')) {
      relevantCategories.push('ECOMMERCE');
    }
    if (queryLower.includes('storage') || queryLower.includes('file')) {
      relevantCategories.push('CLOUD_STORAGE');
    }

    if (relevantCategories.length > 0) {
      const suggestions = allIntegrations
        .filter(integration => relevantCategories.includes(integration.category))
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8);
      
      return suggestions;
    }

    // Fallback to most popular integrations
    return allIntegrations
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);
  }

  // Generate integration configuration from URL
  async generateConfigFromUrl(url: string): Promise<{
    integration?: CustomIntegration;
    knownIntegration?: IntegrationConfig;
    suggestions: IntegrationConfig[];
  }> {
    // First, check if this is a known integration
    const domain = new URL(url).hostname.replace(/^(api\.|www\.)/, '');
    const knownIntegration = getAllIntegrations().find(integration => 
      integration.website.includes(domain) || 
      integration.apiConfig.baseUrl.includes(domain)
    );

    if (knownIntegration) {
      return {
        knownIntegration,
        suggestions: []
      };
    }

    // Try to auto-discover the API
    const discovered = await this.discoverAPI(url);
    
    if (discovered && discovered.confidence > 0.5) {
      const customIntegration = this.createCustomIntegration(discovered);
      return {
        integration: customIntegration,
        suggestions: this.suggestIntegrations(discovered.name)
      };
    }

    // Return suggestions based on URL
    const suggestions = this.suggestIntegrations(domain);
    return { suggestions };
  }
}

export { IntegrationDiscoveryService };