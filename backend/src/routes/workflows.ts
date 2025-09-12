import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { DatabaseService } from '../services/databaseService';
import { AuthenticatedRequest } from '../middleware/auth';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import axios from 'axios';

// Routes for workflow management
const router = Router();

// n8n API configuration
const N8N_API_URL = process.env.N8N_API_URL || 'http://localhost:5678/api/v1';
const N8N_API_KEY = process.env.N8N_API_KEY || 'demo-key';

// Helper function to interact with n8n API
const n8nApi = {
  async createWorkflow(workflowData: any) {
    try {
      const response = await axios.post(`${N8N_API_URL}/workflows`, workflowData, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      logger.error('n8n API error:', error);
      throw new Error('Failed to create n8n workflow');
    }
  },

  async executeWorkflow(workflowId: string, data?: any) {
    try {
      const response = await axios.post(`${N8N_API_URL}/workflows/${workflowId}/execute`, data || {}, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      logger.error('n8n execution error:', error);
      throw new Error('Failed to execute n8n workflow');
    }
  },

  async testWorkflow(workflowData: any) {
    try {
      // Validate workflow structure without creating it
      const response = await axios.post(`${N8N_API_URL}/workflows/test`, workflowData, {
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      logger.error('n8n test error:', error);
      return { valid: false, errors: [error] };
    }
  },
};

// Get all workflows for user
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'active', 'paused', 'failed']),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string;
  const offset = (page - 1) * limit;

  const pool = DatabaseService.getPool();
  
  let whereClause = 'WHERE user_id = $1';
  const queryParams = [req.user!.id];
  
  if (status) {
    whereClause += ' AND status = $2';
    queryParams.push(status);
  }

  // Get total count
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM workflows ${whereClause}`,
    queryParams
  );
  const total = parseInt(countResult.rows[0].count);

  // Get workflows
  const result = await pool.query(
    `SELECT id, name, description, natural_language_input, status, 
            template, config, estimated_time_savings, estimated_cost_savings,
            execution_count, success_rate, created_at, last_executed
     FROM workflows ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`,
    [...queryParams, limit, offset]
  );

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get single workflow
router.get('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    `SELECT * FROM workflows WHERE id = $1 AND user_id = $2`,
    [id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// Test workflow before creation
router.post('/test', [
  body('workflow').isObject().withMessage('Workflow configuration is required'),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { workflow } = req.body;

  try {
    // Test workflow with n8n (or simulate if n8n not available)
    const testResult = process.env.NODE_ENV === 'production' 
      ? await n8nApi.testWorkflow(workflow)
      : {
          valid: true,
          estimatedExecutionTime: Math.floor(Math.random() * 5000) + 1000,
          requiredCredentials: ['gmail', 'sheets'],
          warnings: [],
        };

    res.json({
      success: true,
      data: testResult,
      message: 'Workflow test completed'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Workflow test failed',
    });
  }
}));

// Generate workflow with AI (Enhanced create route)
router.post('/generate', [
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('businessContext').optional().trim(),
  body('integrations').optional().isArray(),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { description, businessContext, integrations = [] } = req.body;

  try {
    // For demo purposes, generate a mock n8n workflow
    const mockWorkflow = {
      name: `Generated: ${description.substring(0, 50)}...`,
      nodes: [
        {
          id: 'trigger',
          type: 'n8n-nodes-base.webhook',
          name: 'Webhook',
          parameters: {
            httpMethod: 'POST',
            path: `webhook-${Date.now()}`,
            responseMode: 'onReceived',
          },
          position: [250, 300],
        },
        {
          id: 'process',
          type: 'n8n-nodes-base.function',
          name: 'Process Data',
          parameters: {
            functionCode: `
              // Extract and process data based on: ${description}
              const data = items[0].json;
              return [{ json: { ...data, processed: true, timestamp: new Date() } }];
            `,
          },
          position: [450, 300],
        },
      ],
      connections: {
        'Webhook': {
          main: [[
            {
              node: 'Process Data',
              type: 'main',
              index: 0,
            },
          ]],
        },
      },
      estimatedTimeSavings: Math.floor(Math.random() * 40) + 10,
      estimatedCostSavings: Math.floor(Math.random() * 200) + 50,
      confidence: Math.floor(Math.random() * 30) + 70,
      requiredIntegrations: integrations.length > 0 ? integrations : ['webhook', 'function'],
    };

    // Add integration-specific nodes
    if (integrations.includes('gmail')) {
      mockWorkflow.nodes.push({
        id: 'gmail',
        type: 'n8n-nodes-base.gmail',
        name: 'Gmail',
        parameters: {
          email: '{{ $json.email }}',
          subject: 'Automated Notification',
        },
        position: [650, 300],
      });
    }

    if (integrations.includes('sheets')) {
      mockWorkflow.nodes.push({
        id: 'sheets',
        type: 'n8n-nodes-base.googleSheets',
        name: 'Google Sheets',
        parameters: {
          range: 'A:Z',
          values: '={{ $json }}',
        },
        position: [650, 450],
      });
    }

    res.json({
      success: true,
      data: {
        n8nWorkflow: mockWorkflow,
        estimatedTimeSavings: mockWorkflow.estimatedTimeSavings,
        estimatedCostSavings: mockWorkflow.estimatedCostSavings,
        confidence: mockWorkflow.confidence,
        requiredIntegrations: mockWorkflow.requiredIntegrations,
        suggestedImprovements: [
          'Consider adding error handling nodes',
          'Add conditional logic for different scenarios',
          'Include data validation steps',
        ],
      },
      message: 'Workflow generated successfully'
    });
  } catch (error: any) {
    logger.error('Workflow generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate workflow',
    });
  }
}));
router.post('/create', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('description').optional().trim(),
  body('naturalLanguageInput').trim().isLength({ min: 10 }).withMessage('Natural language input must be at least 10 characters'),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { name, description, naturalLanguageInput } = req.body;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    `INSERT INTO workflows (user_id, name, description, natural_language_input, status, config, credentials)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      req.user!.id,
      name,
      description || '',
      naturalLanguageInput,
      'draft',
      JSON.stringify({
        schedule: '',
        retryPolicy: {
          maxRetries: 3,
          retryDelay: 5000,
          backoffMultiplier: 2
        },
        notifications: {
          onSuccess: true,
          onFailure: true,
          channels: ['email']
        },
        autoFix: true,
        variables: {},
        timeout: 300000
      }),
      JSON.stringify([])
    ]
  );

  logger.info(`Workflow created: ${name} by user ${req.user!.email}`);

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Workflow created successfully'
  });
}));

// Update workflow
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('config').optional().isObject(),
  body('status').optional().isIn(['draft', 'active', 'paused', 'failed']),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { id } = req.params;
  const { name, description, config, status } = req.body;
  const pool = DatabaseService.getPool();

  // Check if workflow exists and belongs to user
  const existingWorkflow = await pool.query(
    'SELECT id FROM workflows WHERE id = $1 AND user_id = $2',
    [id, req.user!.id]
  );

  if (existingWorkflow.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  const updateFields = [];
  const updateValues = [];
  let paramCount = 1;

  if (name) {
    updateFields.push(`name = $${paramCount}`);
    updateValues.push(name);
    paramCount++;
  }

  if (description !== undefined) {
    updateFields.push(`description = $${paramCount}`);
    updateValues.push(description);
    paramCount++;
  }

  if (config) {
    updateFields.push(`config = $${paramCount}`);
    updateValues.push(JSON.stringify(config));
    paramCount++;
  }

  if (status) {
    updateFields.push(`status = $${paramCount}`);
    updateValues.push(status);
    paramCount++;
  }

  updateFields.push(`updated_at = NOW()`);
  updateValues.push(id, req.user!.id);

  const query = `
    UPDATE workflows 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
    RETURNING *
  `;

  const result = await pool.query(query, updateValues);

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Workflow updated successfully'
  });
}));

// Execute workflow
router.post('/:id/execute', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  // Check if workflow exists and belongs to user
  const workflowResult = await pool.query(
    'SELECT * FROM workflows WHERE id = $1 AND user_id = $2',
    [id, req.user!.id]
  );

  if (workflowResult.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  const workflow = workflowResult.rows[0];

  // Create execution record
  const executionResult = await pool.query(
    `INSERT INTO workflow_executions (workflow_id, status, triggered_by, logs)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [id, 'running', 'manual', JSON.stringify([])]
  );

  const execution = executionResult.rows[0];

  // Here you would trigger the actual n8n workflow execution
  // For now, we'll simulate it
  logger.info(`Workflow execution started: ${workflow.name} (${id})`);

  res.json({
    success: true,
    data: {
      execution: execution,
      workflow: workflow
    },
    message: 'Workflow execution started'
  });
}));

// Get workflow executions
router.get('/:id/executions', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const pool = DatabaseService.getPool();

  // Verify workflow ownership
  const workflowResult = await pool.query(
    'SELECT id FROM workflows WHERE id = $1 AND user_id = $2',
    [id, req.user!.id]
  );

  if (workflowResult.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  // Get total count
  const countResult = await pool.query(
    'SELECT COUNT(*) FROM workflow_executions WHERE workflow_id = $1',
    [id]
  );
  const total = parseInt(countResult.rows[0].count);

  // Get executions
  const result = await pool.query(
    `SELECT * FROM workflow_executions 
     WHERE workflow_id = $1 
     ORDER BY start_time DESC 
     LIMIT $2 OFFSET $3`,
    [id, limit, offset]
  );

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// Get workflow status
router.get('/:id/status', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    `SELECT w.id, w.name, w.status, w.last_executed, w.execution_count, w.success_rate,
            (SELECT COUNT(*) FROM workflow_executions we WHERE we.workflow_id = w.id AND we.status = 'running') as running_executions
     FROM workflows w
     WHERE w.id = $1 AND w.user_id = $2`,
    [id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// Delete workflow
router.delete('/:id', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    'DELETE FROM workflows WHERE id = $1 AND user_id = $2 RETURNING id, name',
    [id, req.user!.id]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Workflow');
  }

  logger.info(`Workflow deleted: ${result.rows[0].name} (${id}) by user ${req.user!.email}`);

  res.json({
    success: true,
    message: 'Workflow deleted successfully'
  });
}));

export default router;