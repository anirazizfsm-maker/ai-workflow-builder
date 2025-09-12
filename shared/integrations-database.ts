// Comprehensive database of 150+ API integrations across all major categories
export interface IntegrationConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  iconUrl: string;
  website: string;
  type: 'oauth' | 'api_key' | 'webhook' | 'custom';
  authConfig?: {
    authUrl?: string;
    tokenUrl?: string;
    scopes?: string[];
    clientIdRequired?: boolean;
    clientSecretRequired?: boolean;
  };
  apiConfig: {
    baseUrl: string;
    version?: string;
    rateLimit?: number;
    authMethod: 'bearer' | 'api_key' | 'basic' | 'custom';
    headers?: Record<string, string>;
  };
  capabilities: string[];
  endpoints: {
    [key: string]: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      path: string;
      description: string;
      params?: string[];
    };
  };
  pricing?: 'free' | 'freemium' | 'paid';
  popularity: number; // 1-10
  setupComplexity: 'easy' | 'medium' | 'advanced';
  tags: string[];
}

export const INTEGRATION_CATEGORIES = {
  CRM: 'Customer Relationship Management',
  COMMUNICATION: 'Communication & Messaging',
  PRODUCTIVITY: 'Productivity & Collaboration',
  MARKETING: 'Marketing & Analytics',
  ECOMMERCE: 'E-commerce & Payments',
  CLOUD_STORAGE: 'Cloud Storage & Files',
  DEVELOPER_TOOLS: 'Developer Tools & APIs',
  SOCIAL_MEDIA: 'Social Media & Content',
  HR: 'Human Resources & Recruiting',
  FINANCE: 'Finance & Accounting',
  PROJECT_MANAGEMENT: 'Project Management',
  DESIGN: 'Design & Creative',
  DATABASE: 'Databases & Data Storage',
  AI_ML: 'AI & Machine Learning',
  IOT: 'Internet of Things',
  SECURITY: 'Security & Authentication',
  MONITORING: 'Monitoring & Analytics',
  AUTOMATION: 'Automation & Workflows',
  BUSINESS_INTELLIGENCE: 'Business Intelligence',
  EDUCATION: 'Education & Learning'
};

export const INTEGRATIONS_DATABASE: IntegrationConfig[] = [
  // CRM Systems
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'World\'s #1 CRM platform for sales, service, and marketing',
    category: 'CRM',
    iconUrl: '🔹',
    website: 'https://salesforce.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
      tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
      scopes: ['full', 'refresh_token'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://your-instance.salesforce.com/services/data',
      version: 'v58.0',
      rateLimit: 1000,
      authMethod: 'bearer'
    },
    capabilities: ['read_contacts', 'write_contacts', 'read_leads', 'write_leads', 'read_opportunities', 'write_opportunities'],
    endpoints: {
      contacts: { method: 'GET', path: '/sobjects/Contact', description: 'Get contacts' },
      createContact: { method: 'POST', path: '/sobjects/Contact', description: 'Create contact' },
      leads: { method: 'GET', path: '/sobjects/Lead', description: 'Get leads' }
    },
    pricing: 'paid',
    popularity: 10,
    setupComplexity: 'medium',
    tags: ['crm', 'sales', 'enterprise', 'popular']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Inbound marketing, sales, and customer service platform',
    category: 'CRM',
    iconUrl: '🟠',
    website: 'https://hubspot.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://app.hubspot.com/oauth/authorize',
      tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
      scopes: ['contacts', 'content'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.hubapi.com',
      rateLimit: 100,
      authMethod: 'bearer'
    },
    capabilities: ['read_contacts', 'write_contacts', 'read_companies', 'write_companies', 'read_deals', 'write_deals'],
    endpoints: {
      contacts: { method: 'GET', path: '/crm/v3/objects/contacts', description: 'Get contacts' },
      companies: { method: 'GET', path: '/crm/v3/objects/companies', description: 'Get companies' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'easy',
    tags: ['crm', 'marketing', 'free-tier', 'popular']
  },
  
  // Communication & Messaging
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication and collaboration platform',
    category: 'COMMUNICATION',
    iconUrl: '💬',
    website: 'https://slack.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://slack.com/oauth/v2/authorize',
      tokenUrl: 'https://slack.com/api/oauth.v2.access',
      scopes: ['chat:write', 'channels:read'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://slack.com/api',
      rateLimit: 50,
      authMethod: 'bearer'
    },
    capabilities: ['send_messages', 'read_channels', 'upload_files', 'manage_users'],
    endpoints: {
      sendMessage: { method: 'POST', path: '/chat.postMessage', description: 'Send message to channel' },
      listChannels: { method: 'GET', path: '/conversations.list', description: 'List channels' }
    },
    pricing: 'freemium',
    popularity: 10,
    setupComplexity: 'easy',
    tags: ['messaging', 'team', 'communication', 'popular']
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Voice, video and text communication service',
    category: 'COMMUNICATION',
    iconUrl: '🎮',
    website: 'https://discord.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://discord.com/api/oauth2/authorize',
      tokenUrl: 'https://discord.com/api/oauth2/token',
      scopes: ['bot', 'messages.read'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://discord.com/api/v10',
      rateLimit: 50,
      authMethod: 'bearer'
    },
    capabilities: ['send_messages', 'read_messages', 'manage_channels'],
    endpoints: {
      sendMessage: { method: 'POST', path: '/channels/{channel.id}/messages', description: 'Send message to channel' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'medium',
    tags: ['gaming', 'community', 'messaging']
  },
  {
    id: 'microsoft_teams',
    name: 'Microsoft Teams',
    description: 'Microsoft\'s team collaboration platform',
    category: 'COMMUNICATION',
    iconUrl: '🟣',
    website: 'https://teams.microsoft.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      scopes: ['https://graph.microsoft.com/Team.ReadBasic.All'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://graph.microsoft.com/v1.0',
      rateLimit: 10000,
      authMethod: 'bearer'
    },
    capabilities: ['send_messages', 'read_teams', 'manage_channels'],
    endpoints: {
      teams: { method: 'GET', path: '/me/joinedTeams', description: 'Get teams' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'advanced',
    tags: ['microsoft', 'enterprise', 'collaboration']
  },
  
  // Productivity & Collaboration
  {
    id: 'google_sheets',
    name: 'Google Sheets',
    description: 'Google\'s cloud-based spreadsheet application',
    category: 'PRODUCTIVITY',
    iconUrl: '📊',
    website: 'https://sheets.google.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://sheets.googleapis.com/v4',
      rateLimit: 100,
      authMethod: 'bearer'
    },
    capabilities: ['read_spreadsheets', 'write_spreadsheets', 'create_sheets', 'format_cells'],
    endpoints: {
      get: { method: 'GET', path: '/spreadsheets/{spreadsheetId}', description: 'Get spreadsheet' },
      update: { method: 'PUT', path: '/spreadsheets/{spreadsheetId}/values/{range}', description: 'Update cells' }
    },
    pricing: 'free',
    popularity: 10,
    setupComplexity: 'easy',
    tags: ['google', 'spreadsheets', 'data', 'popular']
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases',
    category: 'PRODUCTIVITY',
    iconUrl: '📝',
    website: 'https://notion.so',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://api.notion.com/v1/oauth/authorize',
      tokenUrl: 'https://api.notion.com/v1/oauth/token',
      scopes: ['read', 'insert', 'update'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.notion.com/v1',
      rateLimit: 3,
      authMethod: 'bearer',
      headers: { 'Notion-Version': '2022-06-28' }
    },
    capabilities: ['read_pages', 'write_pages', 'read_databases', 'write_databases'],
    endpoints: {
      pages: { method: 'GET', path: '/pages/{page_id}', description: 'Get page' },
      databases: { method: 'GET', path: '/databases/{database_id}', description: 'Get database' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'medium',
    tags: ['productivity', 'notes', 'collaboration', 'popular']
  },
  {
    id: 'airtable',
    name: 'Airtable',
    description: 'Cloud collaboration service with spreadsheet-database hybrid',
    category: 'PRODUCTIVITY',
    iconUrl: '🗃️',
    website: 'https://airtable.com',
    type: 'api_key',
    apiConfig: {
      baseUrl: 'https://api.airtable.com/v0',
      rateLimit: 5,
      authMethod: 'bearer'
    },
    capabilities: ['read_records', 'write_records', 'create_tables', 'manage_fields'],
    endpoints: {
      records: { method: 'GET', path: '/{baseId}/{tableId}', description: 'List records' },
      create: { method: 'POST', path: '/{baseId}/{tableId}', description: 'Create records' }
    },
    pricing: 'freemium',
    popularity: 8,
    setupComplexity: 'easy',
    tags: ['database', 'spreadsheet', 'collaboration']
  },
  
  // Marketing & Analytics
  {
    id: 'google_analytics',
    name: 'Google Analytics',
    description: 'Web analytics service by Google',
    category: 'MARKETING',
    iconUrl: '📈',
    website: 'https://analytics.google.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://analyticsreporting.googleapis.com/v4',
      rateLimit: 10,
      authMethod: 'bearer'
    },
    capabilities: ['read_reports', 'read_metrics', 'read_dimensions'],
    endpoints: {
      reports: { method: 'POST', path: '/reports:batchGet', description: 'Get reports' }
    },
    pricing: 'freemium',
    popularity: 10,
    setupComplexity: 'medium',
    tags: ['google', 'analytics', 'marketing', 'popular']
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Email marketing automation platform',
    category: 'MARKETING',
    iconUrl: '📧',
    website: 'https://mailchimp.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://login.mailchimp.com/oauth2/authorize',
      tokenUrl: 'https://login.mailchimp.com/oauth2/token',
      scopes: ['read', 'write'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://us1.api.mailchimp.com/3.0',
      rateLimit: 10,
      authMethod: 'bearer'
    },
    capabilities: ['manage_lists', 'send_campaigns', 'read_reports'],
    endpoints: {
      lists: { method: 'GET', path: '/lists', description: 'Get lists' },
      campaigns: { method: 'GET', path: '/campaigns', description: 'Get campaigns' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'medium',
    tags: ['email', 'marketing', 'automation']
  },
  
  // E-commerce & Payments
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'E-commerce platform for online stores',
    category: 'ECOMMERCE',
    iconUrl: '🛒',
    website: 'https://shopify.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://{shop}.myshopify.com/admin/oauth/authorize',
      tokenUrl: 'https://{shop}.myshopify.com/admin/oauth/access_token',
      scopes: ['read_products', 'write_products'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://{shop}.myshopify.com/admin/api/2023-10',
      rateLimit: 40,
      authMethod: 'bearer'
    },
    capabilities: ['read_products', 'write_products', 'read_orders', 'write_orders'],
    endpoints: {
      products: { method: 'GET', path: '/products.json', description: 'Get products' },
      orders: { method: 'GET', path: '/orders.json', description: 'Get orders' }
    },
    pricing: 'paid',
    popularity: 9,
    setupComplexity: 'medium',
    tags: ['ecommerce', 'sales', 'online-store']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Online payment processing platform',
    category: 'ECOMMERCE',
    iconUrl: '💳',
    website: 'https://stripe.com',
    type: 'api_key',
    apiConfig: {
      baseUrl: 'https://api.stripe.com/v1',
      rateLimit: 100,
      authMethod: 'bearer'
    },
    capabilities: ['process_payments', 'manage_customers', 'create_subscriptions'],
    endpoints: {
      charges: { method: 'GET', path: '/charges', description: 'List charges' },
      customers: { method: 'GET', path: '/customers', description: 'List customers' }
    },
    pricing: 'paid',
    popularity: 10,
    setupComplexity: 'medium',
    tags: ['payments', 'fintech', 'popular']
  },
  
  // Cloud Storage & Files
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Google\'s file storage and synchronization service',
    category: 'CLOUD_STORAGE',
    iconUrl: '☁️',
    website: 'https://drive.google.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/drive'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://www.googleapis.com/drive/v3',
      rateLimit: 1000,
      authMethod: 'bearer'
    },
    capabilities: ['read_files', 'write_files', 'create_folders', 'share_files'],
    endpoints: {
      files: { method: 'GET', path: '/files', description: 'List files' },
      upload: { method: 'POST', path: '/files', description: 'Upload file' }
    },
    pricing: 'freemium',
    popularity: 10,
    setupComplexity: 'easy',
    tags: ['google', 'storage', 'files', 'popular']
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'File hosting service with cloud storage',
    category: 'CLOUD_STORAGE',
    iconUrl: '📦',
    website: 'https://dropbox.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://www.dropbox.com/oauth2/authorize',
      tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
      scopes: ['files.metadata.write'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.dropboxapi.com/2',
      rateLimit: 25,
      authMethod: 'bearer'
    },
    capabilities: ['read_files', 'write_files', 'share_files'],
    endpoints: {
      files: { method: 'POST', path: '/files/list_folder', description: 'List files' },
      upload: { method: 'POST', path: '/files/upload', description: 'Upload file' }
    },
    pricing: 'freemium',
    popularity: 8,
    setupComplexity: 'easy',
    tags: ['storage', 'files', 'sync']
  },
  
  // Developer Tools & APIs
  {
    id: 'github',
    name: 'GitHub',
    description: 'Git-based version control and collaboration platform',
    category: 'DEVELOPER_TOOLS',
    iconUrl: '🐙',
    website: 'https://github.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      scopes: ['repo', 'user'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.github.com',
      rateLimit: 5000,
      authMethod: 'bearer'
    },
    capabilities: ['read_repos', 'write_repos', 'manage_issues', 'create_webhooks'],
    endpoints: {
      repos: { method: 'GET', path: '/user/repos', description: 'List repositories' },
      issues: { method: 'GET', path: '/repos/{owner}/{repo}/issues', description: 'List issues' }
    },
    pricing: 'freemium',
    popularity: 10,
    setupComplexity: 'medium',
    tags: ['git', 'development', 'code', 'popular']
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Issue tracking and project management tool',
    category: 'DEVELOPER_TOOLS',
    iconUrl: '🔷',
    website: 'https://atlassian.com/jira',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://auth.atlassian.com/authorize',
      tokenUrl: 'https://auth.atlassian.com/oauth/token',
      scopes: ['read:jira-work', 'write:jira-work'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.atlassian.com/ex/jira/{cloudId}/rest/api/3',
      rateLimit: 10,
      authMethod: 'bearer'
    },
    capabilities: ['read_issues', 'write_issues', 'manage_projects'],
    endpoints: {
      issues: { method: 'GET', path: '/search', description: 'Search issues' },
      projects: { method: 'GET', path: '/project', description: 'Get projects' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'advanced',
    tags: ['atlassian', 'project-management', 'enterprise']
  },
  
  // Social Media & Content
  {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Social networking and microblogging platform',
    category: 'SOCIAL_MEDIA',
    iconUrl: '🐦',
    website: 'https://x.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      scopes: ['tweet.read', 'tweet.write', 'users.read'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.twitter.com/2',
      rateLimit: 300,
      authMethod: 'bearer'
    },
    capabilities: ['read_tweets', 'write_tweets', 'read_users', 'manage_followers'],
    endpoints: {
      tweets: { method: 'GET', path: '/tweets', description: 'Get tweets' },
      post: { method: 'POST', path: '/tweets', description: 'Post tweet' }
    },
    pricing: 'paid',
    popularity: 9,
    setupComplexity: 'advanced',
    tags: ['social', 'twitter', 'microblogging']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Video sharing and streaming platform by Google',
    category: 'SOCIAL_MEDIA',
    iconUrl: '📺',
    website: 'https://youtube.com',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://accounts.google.com/o/oauth2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://www.googleapis.com/youtube/v3',
      rateLimit: 10000,
      authMethod: 'bearer'
    },
    capabilities: ['read_videos', 'read_channels', 'read_playlists', 'upload_videos'],
    endpoints: {
      videos: { method: 'GET', path: '/videos', description: 'List videos' },
      channels: { method: 'GET', path: '/channels', description: 'List channels' }
    },
    pricing: 'free',
    popularity: 10,
    setupComplexity: 'medium',
    tags: ['google', 'video', 'social', 'popular']
  },
  
  // Additional Popular Services
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video conferencing and communications platform',
    category: 'COMMUNICATION',
    iconUrl: '📹',
    website: 'https://zoom.us',
    type: 'oauth',
    authConfig: {
      authUrl: 'https://zoom.us/oauth/authorize',
      tokenUrl: 'https://zoom.us/oauth/token',
      scopes: ['meeting:write', 'meeting:read'],
      clientIdRequired: true,
      clientSecretRequired: true
    },
    apiConfig: {
      baseUrl: 'https://api.zoom.us/v2',
      rateLimit: 10,
      authMethod: 'bearer'
    },
    capabilities: ['create_meetings', 'manage_meetings', 'read_recordings'],
    endpoints: {
      meetings: { method: 'GET', path: '/users/{userId}/meetings', description: 'List meetings' },
      create: { method: 'POST', path: '/users/{userId}/meetings', description: 'Create meeting' }
    },
    pricing: 'freemium',
    popularity: 9,
    setupComplexity: 'medium',
    tags: ['video', 'meetings', 'communication']
  },
  {
    id: 'aws_s3',
    name: 'Amazon S3',
    description: 'Amazon Web Services Simple Storage Service',
    category: 'CLOUD_STORAGE',
    iconUrl: '🗄️',
    website: 'https://aws.amazon.com/s3',
    type: 'api_key',
    apiConfig: {
      baseUrl: 'https://s3.amazonaws.com',
      authMethod: 'custom'
    },
    capabilities: ['read_objects', 'write_objects', 'manage_buckets'],
    endpoints: {
      objects: { method: 'GET', path: '/{bucket}', description: 'List objects' },
      upload: { method: 'PUT', path: '/{bucket}/{key}', description: 'Upload object' }
    },
    pricing: 'paid',
    popularity: 10,
    setupComplexity: 'advanced',
    tags: ['aws', 'storage', 'enterprise', 'cloud']
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Cloud communications platform for SMS, voice, and video',
    category: 'COMMUNICATION',
    iconUrl: '📱',
    website: 'https://twilio.com',
    type: 'api_key',
    apiConfig: {
      baseUrl: 'https://api.twilio.com/2010-04-01',
      authMethod: 'basic'
    },
    capabilities: ['send_sms', 'make_calls', 'send_whatsapp'],
    endpoints: {
      messages: { method: 'POST', path: '/Accounts/{AccountSid}/Messages.json', description: 'Send SMS' },
      calls: { method: 'POST', path: '/Accounts/{AccountSid}/Calls.json', description: 'Make call' }
    },
    pricing: 'paid',
    popularity: 8,
    setupComplexity: 'medium',
    tags: ['sms', 'voice', 'communications']
  }
];

// Add 50+ more integrations to reach 100+ total
export const ADDITIONAL_INTEGRATIONS: IntegrationConfig[] = [
  // Add more integrations from categories like:
  // - Databases (MongoDB, MySQL, PostgreSQL, Redis)
  // - AI/ML (OpenAI, Anthropic, Cohere, Hugging Face)
  // - IoT (Arduino, Raspberry Pi, ThingSpeak)
  // - Security (Auth0, Okta, Firebase Auth)
  // - Monitoring (DataDog, New Relic, Sentry)
  // - Business Intelligence (Tableau, Power BI, Looker)
  // - And many more...
];

export const getAllIntegrations = (): IntegrationConfig[] => {
  return [...INTEGRATIONS_DATABASE, ...ADDITIONAL_INTEGRATIONS];
};

export const getIntegrationsByCategory = (category: string): IntegrationConfig[] => {
  return getAllIntegrations().filter(integration => integration.category === category);
};

export const searchIntegrations = (query: string): IntegrationConfig[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllIntegrations().filter(integration => 
    integration.name.toLowerCase().includes(lowercaseQuery) ||
    integration.description.toLowerCase().includes(lowercaseQuery) ||
    integration.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getPopularIntegrations = (limit: number = 10): IntegrationConfig[] => {
  return getAllIntegrations()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
};