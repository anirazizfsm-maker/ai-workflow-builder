import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../services/databaseService';
import { AuthenticatedRequest } from '../middleware/auth';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';
import crypto from 'crypto';

const router = Router();

// OAuth configuration for different providers
const oauthConfigs = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/integrations/oauth/callback/google',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: {
      gmail: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'],
      sheets: ['https://www.googleapis.com/auth/spreadsheets'],
    },
  },
  slack: {
    clientId: process.env.SLACK_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.SLACK_CLIENT_SECRET || 'demo-client-secret',
    redirectUri: process.env.SLACK_REDIRECT_URI || 'http://localhost:3001/api/integrations/oauth/callback/slack',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    scopes: ['channels:read', 'chat:write', 'users:read'],
  },
  notion: {
    clientId: process.env.NOTION_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.NOTION_CLIENT_SECRET || 'demo-client-secret',
    redirectUri: process.env.NOTION_REDIRECT_URI || 'http://localhost:3001/api/integrations/oauth/callback/notion',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scopes: ['read', 'write'],
  },
};

// Helper function to generate OAuth state parameter
const generateOAuthState = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Store OAuth states temporarily (in production, use Redis)
const oauthStates = new Map();

// Initiate OAuth flow
router.get('/oauth/init/:provider/:service?', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { provider, service } = req.params;
  const { redirect_url } = req.query;

  if (!oauthConfigs[provider as keyof typeof oauthConfigs]) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported OAuth provider',
    });
  }

  const config = oauthConfigs[provider as keyof typeof oauthConfigs];
  const state = generateOAuthState();
  
  // Store state with user info for callback verification
  oauthStates.set(state, {
    userId: req.user!.id,
    provider,
    service: service || provider,
    redirectUrl: redirect_url || `${process.env.FRONTEND_URL}/dashboard/integrations`,
    timestamp: Date.now(),
  });

  // Build authorization URL
  const authUrl = new URL(config.authUrl);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);
  
  // Set appropriate scopes based on service
  if (provider === 'google' && service && config.scopes[service as keyof typeof config.scopes]) {
    authUrl.searchParams.set('scope', config.scopes[service as keyof typeof config.scopes].join(' '));
  } else if (provider === 'slack') {
    authUrl.searchParams.set('scope', config.scopes.join(','));
  } else if (provider === 'notion') {
    authUrl.searchParams.set('scope', config.scopes.join(' '));
  }

  res.json({
    success: true,
    data: {
      authUrl: authUrl.toString(),
      state,
    },
  });
}));

// Handle OAuth callback
router.get('/oauth/callback/:provider', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { provider } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    logger.error(`OAuth error for ${provider}:`, error);
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=oauth_error`);
  }

  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=missing_params`);
  }

  // Verify state parameter
  const stateData = oauthStates.get(state);
  if (!stateData) {
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=invalid_state`);
  }

  // Clean up expired states (older than 10 minutes)
  if (Date.now() - stateData.timestamp > 10 * 60 * 1000) {
    oauthStates.delete(state);
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard/integrations?error=expired_state`);
  }

  try {
    const config = oauthConfigs[provider as keyof typeof oauthConfigs];
    
    // Exchange code for access token
    const tokenResponse = await axios.post(config.tokenUrl, {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: 'authorization_code',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in, scope } = tokenResponse.data;

    // Store integration in database
    const pool = DatabaseService.getPool();
    const result = await pool.query(
      `INSERT INTO integrations (user_id, provider, name, type, credentials, status, capabilities, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        stateData.userId,
        provider,
        stateData.service,
        'oauth',
        JSON.stringify({
          access_token: encrypt(access_token), // Encrypt in production
          refresh_token: refresh_token ? encrypt(refresh_token) : null,
          expires_at: expires_in ? new Date(Date.now() + expires_in * 1000) : null,
          scope,
        }),
        'active',
        JSON.stringify(scope ? scope.split(' ') : []),
        JSON.stringify({
          connectedAt: new Date().toISOString(),
          provider,
          service: stateData.service,
        }),
      ]
    );

    // Clean up state
    oauthStates.delete(state);

    logger.info(`OAuth integration successful: ${provider}/${stateData.service} for user ${stateData.userId}`);

    // Redirect to success page
    res.redirect(`${stateData.redirectUrl}?success=connected&provider=${provider}&service=${stateData.service}`);

  } catch (error: any) {
    logger.error(`OAuth token exchange failed for ${provider}:`, error);
    res.redirect(`${stateData.redirectUrl}?error=token_exchange_failed`);
  }
}));

// Simple encryption for demo (use proper encryption in production)
function encrypt(text: string): string {
  // In production, use proper encryption like AES
  return Buffer.from(text).toString('base64');
}

function decrypt(encryptedText: string): string {
  // In production, use proper decryption
  return Buffer.from(encryptedText, 'base64').toString();
}

// Get available integrations
router.get('/available', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Mock available integrations - replace with actual integration catalog
  const availableIntegrations = [
    {
      id: 'gmail',
      name: 'Gmail',
      provider: 'google',
      type: 'oauth',
      capabilities: ['read_email', 'send_email', 'create_draft'],
      status: 'available',
      iconUrl: '/icons/gmail.svg',
      description: 'Connect your Gmail account to automate email workflows',
      setupUrl: '/integrations/gmail/setup',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      provider: 'google',
      type: 'oauth',
      capabilities: ['read_data', 'write_data', 'create_sheet'],
      status: 'available',
      iconUrl: '/icons/google-sheets.svg',
      description: 'Automate spreadsheet operations and data management',
      setupUrl: '/integrations/google-sheets/setup',
    },
    {
      id: 'slack',
      name: 'Slack',
      provider: 'slack',
      type: 'oauth',
      capabilities: ['send_message', 'create_channel', 'read_messages'],
      status: 'available',
      iconUrl: '/icons/slack.svg',
      description: 'Send notifications and manage Slack communications',
      setupUrl: '/integrations/slack/setup',
    },
    {
      id: 'notion',
      name: 'Notion',
      provider: 'notion',
      type: 'oauth',
      capabilities: ['create_page', 'update_page', 'read_database'],
      status: 'available',
      iconUrl: '/icons/notion.svg',
      description: 'Automate Notion workspace and database operations',
      setupUrl: '/integrations/notion/setup',
    },
    {
      id: 'airtable',
      name: 'Airtable',
      provider: 'airtable',
      type: 'api_key',
      capabilities: ['read_records', 'create_records', 'update_records'],
      status: 'available',
      iconUrl: '/icons/airtable.svg',
      description: 'Connect Airtable bases for data automation',
      setupUrl: '/integrations/airtable/setup',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      provider: 'hubspot',
      type: 'oauth',
      capabilities: ['manage_contacts', 'create_deals', 'send_emails'],
      status: 'available',
      iconUrl: '/icons/hubspot.svg',
      description: 'Automate CRM workflows and customer management',
      setupUrl: '/integrations/hubspot/setup',
    },
  ];

  res.json({
    success: true,
    data: availableIntegrations,
  });
}));

// Get user's connected integrations
router.get('/', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    `SELECT id, provider, name, type, status, capabilities, metadata, created_at, updated_at
     FROM integrations 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [req.user!.id]
  );

  const integrations = result.rows.map(row => ({
    id: row.id,
    provider: row.provider,
    name: row.name,
    type: row.type,
    status: row.status,
    capabilities: row.capabilities,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  res.json({
    success: true,
    data: integrations,
  });
}));

// Connect new integration
router.post('/connect', [
  body('provider').trim().isLength({ min: 1 }).withMessage('Provider is required'),
  body('name').trim().isLength({ min: 1 }).withMessage('Integration name is required'),
  body('type').isIn(['oauth', 'api_key', 'webhook']).withMessage('Invalid integration type'),
  body('credentials').isObject().withMessage('Credentials object is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { provider, name, type, credentials, capabilities = [] } = req.body;
  const pool = DatabaseService.getPool();

  // Check if integration already exists
  const existingResult = await pool.query(
    'SELECT id FROM integrations WHERE user_id = $1 AND provider = $2',
    [req.user!.id, provider]
  );

  if (existingResult.rows.length > 0) {
    return res.status(409).json({
      success: false,
      error: 'Integration already exists for this provider',
    });
  }

  // In a real implementation, you would:
  // 1. Validate credentials with the third-party service
  // 2. Securely encrypt and store credentials
  // 3. Test the connection

  // Mock connection validation
  const connectionValid = true; // Replace with actual validation

  if (!connectionValid) {
    return res.status(400).json({
      success: false,
      error: 'Failed to validate integration credentials',
    });
  }

  // Store integration (credentials should be encrypted in production)
  const result = await pool.query(
    `INSERT INTO integrations (user_id, provider, name, type, credentials, status, capabilities, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      req.user!.id,
      provider,
      name,
      type,
      JSON.stringify(credentials), // Encrypt in production
      'active',
      JSON.stringify(capabilities),
      JSON.stringify({ connectedAt: new Date().toISOString() }),
    ]
  );

  const integration = result.rows[0];

  logger.info(`Integration connected: ${provider} for user ${req.user!.email}`);

  res.status(201).json({
    success: true,
    data: {
      id: integration.id,
      provider: integration.provider,
      name: integration.name,
      type: integration.type,
      status: integration.status,
      capabilities: integration.capabilities,
      createdAt: integration.created_at,
    },
    message: 'Integration connected successfully',
  });
}));

// Disconnect integration
router.delete('/:id/disconnect', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    'DELETE FROM integrations WHERE id = $1 AND user_id = $2 RETURNING provider, name',
    [id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Integration');
  }

  const integration = result.rows[0];

  logger.info(`Integration disconnected: ${integration.provider} for user ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Integration disconnected successfully',
  });
}));

// Test integration connection
router.post('/:id/test', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    'SELECT * FROM integrations WHERE id = $1 AND user_id = $2',
    [id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Integration');
  }

  const integration = result.rows[0];

  // Mock connection test - replace with actual test logic
  const testResult = {
    success: true,
    latency: Math.floor(Math.random() * 200) + 50, // Mock latency
    message: 'Connection test successful',
    testedAt: new Date().toISOString(),
  };

  // In a real implementation, you would:
  // 1. Decrypt stored credentials
  // 2. Make a test API call to the service
  // 3. Verify the response
  // 4. Update integration status if needed

  logger.info(`Integration test completed: ${integration.provider} for user ${req.user!.email}`);

  res.json({
    success: true,
    data: testResult,
  });
}));

// Update integration settings
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 1 }),
  body('capabilities').optional().isArray(),
  body('metadata').optional().isObject(),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { id } = req.params;
  const { name, capabilities, metadata } = req.body;
  const pool = DatabaseService.getPool();

  const updateFields = [];
  const updateValues = [];
  let paramCount = 1;

  if (name) {
    updateFields.push(`name = $${paramCount}`);
    updateValues.push(name);
    paramCount++;
  }

  if (capabilities) {
    updateFields.push(`capabilities = $${paramCount}`);
    updateValues.push(JSON.stringify(capabilities));
    paramCount++;
  }

  if (metadata) {
    updateFields.push(`metadata = $${paramCount}`);
    updateValues.push(JSON.stringify(metadata));
    paramCount++;
  }

  updateFields.push(`updated_at = NOW()`);
  updateValues.push(id, req.user!.id);

  const query = `
    UPDATE integrations 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
    RETURNING *
  `;

  const result = await pool.query(query, updateValues);

  if (result.rows.length === 0) {
    throw new NotFoundError('Integration');
  }

  const integration = result.rows[0];

  logger.info(`Integration updated: ${integration.provider} for user ${req.user!.email}`);

  res.json({
    success: true,
    data: {
      id: integration.id,
      provider: integration.provider,
      name: integration.name,
      type: integration.type,
      status: integration.status,
      capabilities: integration.capabilities,
      metadata: integration.metadata,
      updatedAt: integration.updated_at,
    },
    message: 'Integration updated successfully',
  });
}));

// Get integration usage statistics
router.get('/:id/usage', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  // Verify integration ownership
  const integrationResult = await pool.query(
    'SELECT provider, name FROM integrations WHERE id = $1 AND user_id = $2',
    [id, req.user!.id]
  );

  if (integrationResult.rows.length === 0) {
    throw new NotFoundError('Integration');
  }

  // Mock usage statistics - replace with actual usage tracking
  const mockUsage = {
    totalRequests: Math.floor(Math.random() * 1000) + 100,
    successfulRequests: Math.floor(Math.random() * 900) + 90,
    failedRequests: Math.floor(Math.random() * 50) + 5,
    avgResponseTime: Math.floor(Math.random() * 200) + 100,
    lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    usageByDay: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 50) + 10,
    })).reverse(),
  };

  res.json({
    success: true,
    data: mockUsage,
  });
}));

export default router;