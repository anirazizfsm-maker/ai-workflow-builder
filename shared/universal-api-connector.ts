import { IntegrationConfig } from './integrations-database';
import { CustomIntegration, CustomEndpoint, IntegrationDiscoveryService } from './integration-discovery';

export interface ConnectionConfig {
  id: string;
  name: string;
  type: 'predefined' | 'custom' | 'discovered';
  baseUrl: string;
  authMethod: 'none' | 'api_key' | 'oauth' | 'basic' | 'bearer' | 'custom';
  credentials?: {
    apiKey?: string;
    token?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
    custom?: Record<string, any>;
  };
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
  rateLimit?: {
    requests: number;
    period: number; // seconds
  };
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface APIResponse {
  success: boolean;
  data?: any;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  error?: string;
  responseTime: number;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  limit: number;
}

class UniversalAPIConnector {
  private connections: Map<string, ConnectionConfig> = new Map();
  private rateLimitTracker: Map<string, RateLimitInfo> = new Map();
  private requestQueue: Map<string, Promise<APIResponse>[]> = new Map();

  // Create connection from predefined integration
  createConnection(integration: IntegrationConfig, credentials?: any): ConnectionConfig {
    const config: ConnectionConfig = {
      id: `conn_${integration.id}_${Date.now()}`,
      name: integration.name,
      type: 'predefined',
      baseUrl: integration.apiConfig.baseUrl,
      authMethod: integration.apiConfig.authMethod as any,
      credentials,
      headers: integration.apiConfig.headers,
      timeout: 30000,
      retryCount: 3,
      rateLimit: integration.apiConfig.rateLimit ? {
        requests: integration.apiConfig.rateLimit,
        period: 60
      } : undefined
    };

    this.connections.set(config.id, config);
    return config;
  }

  // Create connection from custom integration
  createCustomConnection(integration: CustomIntegration, credentials?: any): ConnectionConfig {
    const config: ConnectionConfig = {
      id: `conn_${integration.id}_${Date.now()}`,
      name: integration.name,
      type: 'custom',
      baseUrl: integration.baseUrl,
      authMethod: integration.authMethod as any,
      credentials,
      headers: integration.headers,
      timeout: 30000,
      retryCount: 3
    };

    this.connections.set(config.id, config);
    return config;
  }

  // Auto-discover and create connection from URL
  async createConnectionFromUrl(url: string, credentials?: any): Promise<ConnectionConfig | null> {
    const discoveryService = IntegrationDiscoveryService.getInstance();
    const result = await discoveryService.generateConfigFromUrl(url);

    if (result.knownIntegration) {
      return this.createConnection(result.knownIntegration, credentials);
    }

    if (result.integration) {
      return this.createCustomConnection(result.integration, credentials);
    }

    // Create basic connection for unknown APIs
    const config: ConnectionConfig = {
      id: `conn_discovered_${Date.now()}`,
      name: `API Connection for ${new URL(url).hostname}`,
      type: 'discovered',
      baseUrl: url,
      authMethod: credentials ? 'bearer' : 'none',
      credentials,
      timeout: 30000,
      retryCount: 3
    };

    this.connections.set(config.id, config);
    return config;
  }

  // Make API request with auto-retry and rate limiting
  async makeRequest(connectionId: string, request: APIRequest): Promise<APIResponse> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    // Check rate limits
    if (await this.isRateLimited(connectionId)) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    return this.executeRequest(connection, request);
  }

  private async executeRequest(connection: ConnectionConfig, request: APIRequest): Promise<APIResponse> {
    const startTime = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= (connection.retryCount || 0); attempt++) {
      try {
        const response = await this.performHttpRequest(connection, request);
        
        // Update rate limit info if available
        this.updateRateLimitInfo(connection.id, response.headers);
        
        return {
          ...response,
          responseTime: Date.now() - startTime
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry for certain error types
        if (error instanceof Error && (
          error.message.includes('401') || // Unauthorized
          error.message.includes('403') || // Forbidden
          error.message.includes('404')    // Not Found
        )) {
          break;
        }

        // Wait before retry (exponential backoff)
        if (attempt < (connection.retryCount || 0)) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw lastError || new Error('Request failed after all retry attempts');
  }

  private async performHttpRequest(connection: ConnectionConfig, request: APIRequest): Promise<Omit<APIResponse, 'responseTime'>> {
    const url = new URL(request.endpoint, connection.baseUrl).toString();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...connection.headers,
      ...request.headers
    };

    // Add authentication
    this.addAuthentication(headers, connection);

    // Add query parameters
    const finalUrl = this.addQueryParams(url, request.params);

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      signal: AbortSignal.timeout(connection.timeout || 30000)
    };

    // Add body for non-GET requests
    if (request.method !== 'GET' && request.data) {
      if (headers['Content-Type']?.includes('application/json')) {
        fetchOptions.body = JSON.stringify(request.data);
      } else {
        fetchOptions.body = request.data;
      }
    }

    const response = await fetch(finalUrl, fetchOptions);
    
    let responseData: any;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else if (contentType.includes('text/')) {
      responseData = await response.text();
    } else {
      responseData = await response.blob();
    }

    // Convert Headers object to plain object
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      success: response.ok,
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
    };
  }

  private addAuthentication(headers: Record<string, string>, connection: ConnectionConfig): void {
    if (!connection.credentials) return;

    switch (connection.authMethod) {
      case 'api_key':
        if (connection.credentials.apiKey) {
          headers['Authorization'] = `Bearer ${connection.credentials.apiKey}`;
        }
        break;
      case 'bearer':
        if (connection.credentials.token) {
          headers['Authorization'] = `Bearer ${connection.credentials.token}`;
        }
        break;
      case 'basic':
        if (connection.credentials.username && connection.credentials.password) {
          const credentials = btoa(`${connection.credentials.username}:${connection.credentials.password}`);
          headers['Authorization'] = `Basic ${credentials}`;
        }
        break;
      case 'custom':
        if (connection.credentials.custom) {
          Object.assign(headers, connection.credentials.custom);
        }
        break;
    }
  }

  private addQueryParams(url: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.set(key, String(value));
      }
    });

    return urlObj.toString();
  }

  private async isRateLimited(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    const rateLimitInfo = this.rateLimitTracker.get(connectionId);

    if (!connection?.rateLimit || !rateLimitInfo) {
      return false;
    }

    const now = new Date();
    if (now < rateLimitInfo.resetTime && rateLimitInfo.remaining <= 0) {
      return true;
    }

    // Reset rate limit if time window has passed
    if (now >= rateLimitInfo.resetTime) {
      this.rateLimitTracker.set(connectionId, {
        remaining: connection.rateLimit.requests,
        resetTime: new Date(now.getTime() + connection.rateLimit.period * 1000),
        limit: connection.rateLimit.requests
      });
    }

    return false;
  }

  private updateRateLimitInfo(connectionId: string, headers: Record<string, string>): void {
    // Try to parse rate limit headers (common patterns)
    const rateLimitHeaders = {
      remaining: headers['x-ratelimit-remaining'] || headers['x-rate-limit-remaining'],
      limit: headers['x-ratelimit-limit'] || headers['x-rate-limit-limit'],
      reset: headers['x-ratelimit-reset'] || headers['x-rate-limit-reset']
    };

    if (rateLimitHeaders.remaining && rateLimitHeaders.reset) {
      const resetTime = new Date(parseInt(rateLimitHeaders.reset) * 1000);
      this.rateLimitTracker.set(connectionId, {
        remaining: parseInt(rateLimitHeaders.remaining),
        resetTime,
        limit: parseInt(rateLimitHeaders.limit || '0')
      });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test connection
  async testConnection(connectionId: string): Promise<{
    success: boolean;
    responseTime: number;
    error?: string;
  }> {
    try {
      const testRequest: APIRequest = {
        method: 'GET',
        endpoint: '/'
      };

      const result = await this.makeRequest(connectionId, testRequest);
      return {
        success: result.success,
        responseTime: result.responseTime
      };
    } catch (error) {
      return {
        success: false,
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get connection info
  getConnection(connectionId: string): ConnectionConfig | undefined {
    return this.connections.get(connectionId);
  }

  // List all connections
  listConnections(): ConnectionConfig[] {
    return Array.from(this.connections.values());
  }

  // Remove connection
  removeConnection(connectionId: string): boolean {
    return this.connections.delete(connectionId);
  }

  // Auto-detect API capabilities
  async detectCapabilities(connectionId: string): Promise<{
    endpoints: string[];
    methods: string[];
    authRequired: boolean;
    responseFormats: string[];
  }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    const capabilities = {
      endpoints: [] as string[],
      methods: [] as string[],
      authRequired: false,
      responseFormats: [] as string[]
    };

    // Common endpoints to test
    const testEndpoints = [
      '/',
      '/api',
      '/health',
      '/status',
      '/users',
      '/data',
      '/items'
    ];

    // Test each endpoint
    for (const endpoint of testEndpoints) {
      try {
        const result = await this.makeRequest(connectionId, {
          method: 'GET',
          endpoint
        });

        if (result.success || result.status < 500) {
          capabilities.endpoints.push(endpoint);
        }

        if (result.status === 401 || result.status === 403) {
          capabilities.authRequired = true;
        }

        // Detect response format
        const contentType = result.headers['content-type'] || '';
        if (contentType.includes('json') && !capabilities.responseFormats.includes('json')) {
          capabilities.responseFormats.push('json');
        } else if (contentType.includes('xml') && !capabilities.responseFormats.includes('xml')) {
          capabilities.responseFormats.push('xml');
        }
      } catch (error) {
        // Continue testing other endpoints
        continue;
      }
    }

    return capabilities;
  }

  // Batch requests
  async makeBatchRequests(connectionId: string, requests: APIRequest[]): Promise<APIResponse[]> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found`);
    }

    // Execute requests with concurrency limit
    const concurrencyLimit = 5;
    const results: APIResponse[] = [];

    for (let i = 0; i < requests.length; i += concurrencyLimit) {
      const batch = requests.slice(i, i + concurrencyLimit);
      const batchPromises = batch.map(request => this.makeRequest(connectionId, request));
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        // Handle partial failures
        const settledResults = await Promise.allSettled(batchPromises);
        settledResults.forEach(result => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            results.push({
              success: false,
              status: 0,
              statusText: 'Failed',
              headers: {},
              error: result.reason?.message || 'Request failed',
              responseTime: 0
            });
          }
        });
      }
    }

    return results;
  }
}

// Singleton instance
const universalConnector = new UniversalAPIConnector();

export { UniversalAPIConnector, universalConnector };