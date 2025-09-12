const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3002;

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Lethimdo API',
    version: '1.0.0',
    status: 'running'
  });
});

// Mock authentication endpoints
app.get('/api/auth/me', (req, res) => {
  res.json({ 
    user: {
      id: 'demo-user',
      email: 'demo@lethimdo.com',
      name: 'Demo User'
    } 
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    token: 'demo-token-12345',
    user: {
      id: 'demo-user',
      email: req.body.email || 'demo@lethimdo.com',
      name: 'Demo User'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration successful',
    user: {
      id: 'demo-user',
      email: req.body.email || 'demo@lethimdo.com',
      name: req.body.name || 'Demo User'
    }
  });
});

// Mock integrations endpoints
app.get('/api/integrations', (req, res) => {
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

app.post('/api/integrations/:id/connect', (req, res) => {
  res.json({
    success: true,
    message: `Successfully connected to ${req.params.id}`,
    connection: {
      id: `conn-${Date.now()}`,
      service: req.params.id,
      status: 'connected',
      connectedAt: new Date().toISOString()
    }
  });
});

// Mock AI workflow generation endpoint
app.post('/api/ai/generate-workflow', (req, res) => {
  const { description, businessContext } = req.body;
  
  if (!description || description.length < 10) {
    return res.status(400).json({
      error: 'Description must be at least 10 characters long'
    });
  }

  // Enhanced AI workflow generation based on keywords
  const keywords = description.toLowerCase();
  let workflow;
  
  if (keywords.includes('email') || keywords.includes('notification')) {
    workflow = {
      name: "Email Processing Workflow",
      description: "Automated email processing and response system", 
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook",
          name: "Email Trigger",
          parameters: { httpMethod: "POST", path: "email-webhook" },
          position: [250, 300]
        },
        {
          id: "gmail-1",
          type: "n8n-nodes-base.gmail", 
          name: "Send Auto Reply",
          parameters: {
            operation: "send",
            subject: "Re: {{$json.subject}}",
            message: "Thank you for your email. We'll respond within 24 hours."
          },
          position: [450, 300]
        }
      ],
      estimatedTimeSavings: 10,
      estimatedCostSavings: 400,
      complexity: 'medium',
      requiredIntegrations: ['Gmail', 'Webhook']
    };
  } else if (keywords.includes('data') || keywords.includes('spreadsheet')) {
    workflow = {
      name: "Data Processing Pipeline", 
      description: "Automated data collection and reporting",
      nodes: [
        {
          id: "schedule-1",
          type: "n8n-nodes-base.schedule",
          name: "Daily Schedule",
          parameters: { cronExpression: "0 9 * * *" },
          position: [250, 300]
        },
        {
          id: "http-1",
          type: "n8n-nodes-base.httpRequest",
          name: "Fetch Data",
          parameters: { url: "https://api.example.com/data", method: "GET" },
          position: [450, 300]
        },
        {
          id: "sheets-1",
          type: "n8n-nodes-base.googleSheets",
          name: "Update Sheet", 
          parameters: { operation: "append" },
          position: [650, 300]
        }
      ],
      estimatedTimeSavings: 20,
      estimatedCostSavings: 800,
      complexity: 'medium',
      requiredIntegrations: ['Google Sheets', 'HTTP Request']
    };
  } else if (keywords.includes('customer') || keywords.includes('onboard')) {
    workflow = {
      name: "Customer Onboarding Automation",
      description: "Complete automated customer onboarding process",
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook", 
          name: "New Customer Signup",
          parameters: { httpMethod: "POST", path: "customer-signup" },
          position: [250, 300]
        },
        {
          id: "gmail-1",
          type: "n8n-nodes-base.gmail",
          name: "Welcome Email",
          parameters: {
            operation: "send",
            subject: "Welcome to Our Platform!",
            message: "Welcome {{$json.name}}! We're excited to have you onboard."
          },
          position: [450, 300]
        },
        {
          id: "delay-1",
          type: "n8n-nodes-base.delay",
          name: "Wait 24 Hours",
          parameters: { amount: 1, unit: "days" },
          position: [650, 300]
        }
      ],
      estimatedTimeSavings: 25,
      estimatedCostSavings: 1000,
      complexity: 'complex', 
      requiredIntegrations: ['Gmail', 'Webhook']
    };
  } else {
    // Generic workflow
    workflow = {
      name: `Generated: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`,
      description: `Workflow created from: "${description}"`,
      nodes: [
        {
          id: "webhook-1",
          type: "n8n-nodes-base.webhook",
          name: "Trigger",
          parameters: { httpMethod: "POST", path: "automation-trigger" },
          position: [250, 300]
        },
        {
          id: "function-1", 
          type: "n8n-nodes-base.function",
          name: "Process Data",
          parameters: {
            functionCode: "return items.map(item => ({...item.json, processed: true}));"
          },
          position: [450, 300]
        }
      ],
      estimatedTimeSavings: 8,
      estimatedCostSavings: 300,
      complexity: 'simple',
      requiredIntegrations: ['Webhook']
    };
  }

  // Add business context if provided
  if (businessContext) {
    workflow.description += ` | Context: ${businessContext}`;
  }

  res.json({
    success: true,
    data: workflow,
    message: 'AI workflow generated successfully',
    timestamp: new Date().toISOString()
  });
});

// Mock workflows storage (in production, use a real database)
let workflows = [];
let workflowCounter = 1;

// Mock workflows endpoints
app.get('/api/workflows', (req, res) => {
  res.json({
    success: true,
    data: workflows,
    total: workflows.length
  });
});

app.post('/api/workflows', (req, res) => {
  const { name, description, naturalLanguageInput, n8nWorkflow } = req.body;
  
  const workflow = {
    id: `wf_${workflowCounter++}`,
    name: name || 'Untitled Workflow',
    description: description || '',
    naturalLanguageInput: naturalLanguageInput || '',
    n8nWorkflow: n8nWorkflow || null,
    status: 'draft',
    createdAt: new Date().toISOString(),
    lastExecuted: null,
    executionCount: 0,
    successRate: 0,
    estimatedTimeSavings: n8nWorkflow?.estimatedTimeSavings || 0,
    estimatedCostSavings: n8nWorkflow?.estimatedCostSavings || 0
  };
  
  workflows.push(workflow);
  
  res.status(201).json({
    success: true,
    data: workflow,
    message: 'Workflow created successfully'
  });
});

app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflows.find(w => w.id === req.params.id);
  
  if (!workflow) {
    return res.status(404).json({
      error: 'Workflow not found'
    });
  }
  
  res.json({
    success: true,
    data: workflow
  });
});

app.post('/api/workflows/:id/execute', (req, res) => {
  const workflow = workflows.find(w => w.id === req.params.id);
  
  if (!workflow) {
    return res.status(404).json({
      error: 'Workflow not found'
    });
  }
  
  // Mock execution
  workflow.executionCount += 1;
  workflow.lastExecuted = new Date().toISOString();
  workflow.successRate = Math.random() > 0.1 ? 100 : 95; // 90% success rate
  
  res.json({
    success: true,
    data: {
      executionId: `exec_${Date.now()}`,
      status: 'completed',
      startedAt: new Date().toISOString(),
      duration: Math.floor(Math.random() * 5000) + 1000,
      logs: [
        { timestamp: new Date().toISOString(), level: 'info', message: 'Workflow started' },
        { timestamp: new Date().toISOString(), level: 'info', message: 'Processing data...' },
        { timestamp: new Date().toISOString(), level: 'success', message: 'Workflow completed successfully' }
      ]
    },
    message: 'Workflow executed successfully'
  });
});

// Mock auto-discovery endpoint (restored)
app.post('/api/integrations/discover', (req, res) => {
  const { url } = req.body;
  res.json({
    success: true,
    data: {
      url: url,
      name: 'Discovered API',
      endpoints: [
        { method: 'GET', path: '/users', description: 'List users' },
        { method: 'POST', path: '/users', description: 'Create user' },
        { method: 'GET', path: '/data', description: 'Get data' }
      ],
      authMethods: ['api_key', 'bearer_token'],
      discovered: true
    },
    message: 'API discovered successfully'
  });
});

// Mock marketplace endpoints
app.get('/api/integrations/marketplace/search', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'custom-crm', name: 'Custom CRM Integration', rating: 4.8, downloads: 1250 },
      { id: 'payment-processor', name: 'Payment Processor', rating: 4.6, downloads: 890 },
      { id: 'analytics-tool', name: 'Analytics Tool', rating: 4.9, downloads: 2100 }
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Lethimdo API server running on port ${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}`);
  console.log(`🔍 Health check: http://localhost:${port}/health`);
  console.log(`✅ Ready to handle integration requests!`);
});