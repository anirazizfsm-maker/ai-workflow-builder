import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseService } from '../services/databaseService';
import { AuthenticatedRequest } from '../middleware/auth';
import { ValidationError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

// Helper function to generate n8n workflow structure
const generateN8nWorkflow = async (description: string, businessContext?: string) => {
  const prompt = `
Generate a detailed n8n workflow configuration based on this description:
"${description}"

Business Context: ${businessContext || 'General business automation'}

Please provide:
1. A complete n8n workflow JSON structure with nodes and connections
2. Appropriate trigger nodes (webhook, schedule, email, etc.)
3. Processing and action nodes based on the description
4. Proper node parameters and configurations
5. Realistic position coordinates for visual layout

Format the response as valid JSON with these keys:
- name: descriptive workflow name
- nodes: array of n8n node objects
- connections: object defining node connections
- estimatedTimeSavings: hours saved per month (number)
- estimatedCostSavings: dollars saved per month (number)
- requiredIntegrations: array of integration names
- complexity: 'simple', 'medium', or 'complex'
`;

  try {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content;
      if (responseText) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          logger.warn('Failed to parse OpenAI response, using fallback');
        }
      }
    }
  } catch (error) {
    logger.error('OpenAI API error:', error);
  }

  // Fallback mock workflow
  return {
    name: `Automated: ${description.substring(0, 50)}...`,
    nodes: [
      {
        id: 'trigger-1',
        type: 'n8n-nodes-base.webhook',
        name: 'Webhook Trigger',
        parameters: {
          httpMethod: 'POST',
          path: `webhook-${Date.now()}`,
        },
        position: [250, 300],
      },
      {
        id: 'process-1',
        type: 'n8n-nodes-base.function',
        name: 'Process Data',
        parameters: {
          functionCode: `// Process incoming data\nreturn items.map(item => ({\n  json: {\n    ...item.json,\n    processed: true,\n    timestamp: new Date().toISOString()\n  }\n}));`,
        },
        position: [450, 300],
      },
      {
        id: 'action-1',
        type: 'n8n-nodes-base.gmail',
        name: 'Send Notification',
        parameters: {
          operation: 'send',
          subject: 'Workflow Completed',
          emailAddress: '{{ $json.email }}',
        },
        position: [650, 300],
      },
    ],
    connections: {
      'Webhook Trigger': {
        main: [[
          {
            node: 'Process Data',
            type: 'main',
            index: 0,
          },
        ]],
      },
      'Process Data': {
        main: [[
          {
            node: 'Send Notification',
            type: 'main',
            index: 0,
          },
        ]],
      },
    },
    estimatedTimeSavings: Math.floor(Math.random() * 40) + 10,
    estimatedCostSavings: Math.floor(Math.random() * 300) + 100,
    requiredIntegrations: ['webhook', 'gmail'],
    complexity: 'medium',
  };
};

// Generate workflow from natural language
router.post('/generate-workflow', [
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('businessContext').optional().trim(),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { description, businessContext } = req.body;

  try {
    // Mock AI generation for now - replace with actual OpenAI integration
    const mockWorkflow = {
      name: `Auto-generated: ${description.substring(0, 50)}`,
      description: `Workflow generated from: \"${description}\"`,
      estimatedTimeSavings: Math.floor(Math.random() * 60) + 10,
      estimatedCostSavings: Math.floor(Math.random() * 200) + 50,
      steps: [
        { id: 1, type: 'trigger', name: 'Email Received', description: 'When a new email is received' },
        { id: 2, type: 'action', name: 'Extract Data', description: 'Extract relevant information from the email' },
        { id: 3, type: 'action', name: 'Update Spreadsheet', description: 'Add extracted data to Google Sheets' },
        { id: 4, type: 'action', name: 'Send Notification', description: 'Send confirmation notification' },
      ],
      integrations: ['Gmail', 'Google Sheets', 'Slack'],
      confidence: 0.85,
    };

    logger.info(`AI workflow generated for user ${req.user!.email}: ${description}`);

    res.json({
      success: true,
      data: mockWorkflow,
      message: 'Workflow generated successfully',
    });

    /* Real OpenAI integration would look like:
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const prompt = `
      Create a workflow automation based on this description: \"${description}\"
      ${businessContext ? `Business context: ${businessContext}` : ''}
      
      Please respond with a JSON object containing:
      - name: A descriptive name for the workflow
      - description: A detailed description
      - steps: Array of workflow steps with id, type (trigger/action), name, and description
      - integrations: Array of required third-party services
      - estimatedTimeSavings: Estimated time saved per execution in minutes
      - estimatedCostSavings: Estimated cost saved per month in USD
      - confidence: Confidence score (0-1) in the generated workflow
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const generatedWorkflow = JSON.parse(response.choices[0].message.content);
    */

  } catch (error) {
    logger.error('AI workflow generation failed:', error);
    throw new Error('Failed to generate workflow');
  }
}));

// Get AI recommendations for user
router.get('/recommendations', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pool = DatabaseService.getPool();

  // Get user's workflows and execution patterns
  const workflowsResult = await pool.query(
    'SELECT * FROM workflows WHERE user_id = $1 ORDER BY created_at DESC',
    [req.user!.id]
  );

  const analyticsResult = await pool.query(
    `SELECT 
       SUM(total_time_saved) as total_time_saved,
       SUM(total_cost_saved) as total_cost_saved,
       AVG(efficiency) as avg_efficiency
     FROM analytics_daily 
     WHERE user_id = $1 
       AND date >= CURRENT_DATE - INTERVAL '30 days'`,
    [req.user!.id]
  );

  // Mock AI recommendations based on user data
  const mockRecommendations = [
    {
      id: 'rec_1',
      type: 'optimization',
      title: 'Optimize Email Processing Workflow',
      description: 'Your email processing workflow could be 25% faster with better filtering rules.',
      potentialSavings: 15,
      implementationEffort: 'low',
      priority: 1,
      category: 'performance',
      actionItems: [
        'Add pre-filtering for spam emails',
        'Implement batch processing for multiple emails',
        'Cache frequently accessed data',
      ],
    },
    {
      id: 'rec_2',
      type: 'recommendation',
      title: 'Add Calendar Integration',
      description: 'Based on your email workflows, adding calendar integration could automate meeting scheduling.',
      potentialSavings: 45,
      implementationEffort: 'medium',
      priority: 2,
      category: 'integration',
      actionItems: [
        'Connect Google Calendar',
        'Set up meeting detection rules',
        'Configure automatic scheduling',
      ],
    },
    {
      id: 'rec_3',
      type: 'alert',
      title: 'Workflow Failure Rate Increasing',
      description: 'Your Gmail to Sheets workflow has a 15% failure rate this week.',
      potentialSavings: 0,
      implementationEffort: 'low',
      priority: 3,
      category: 'maintenance',
      actionItems: [
        'Check Gmail API quota',
        'Verify Google Sheets permissions',
        'Update error handling',
      ],
    },
  ];

  logger.info(`Generated ${mockRecommendations.length} AI recommendations for user ${req.user!.email}`);

  res.json({
    success: true,
    data: mockRecommendations,
  });
}));

// Analyze business needs and suggest workflows
router.post('/analyze-business', [
  body('businessType').trim().isLength({ min: 2 }),
  body('currentTools').isArray(),
  body('painPoints').isArray(),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const { businessType, currentTools, painPoints } = req.body;

  // Mock business analysis - replace with actual AI analysis
  const mockAnalysis = [
    {
      id: 'analysis_1',
      type: 'recommendation',
      title: `${businessType} Automation Opportunities`,
      description: `Based on your current tools (${currentTools.join(', ')}), we identified several automation opportunities.`,
      potentialSavings: 120,
      implementationEffort: 'medium',
      priority: 1,
      category: 'automation',
      actionItems: [
        'Automate data entry between systems',
        'Set up notification workflows',
        'Create reporting automation',
      ],
    },
  ];

  logger.info(`Business analysis completed for user ${req.user!.email}: ${businessType}`);

  res.json({
    success: true,
    data: mockAnalysis,
    message: 'Business analysis completed',
  });
}));

// Suggest improvements for specific workflow
router.post('/suggest-improvements/:workflowId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { workflowId } = req.params;
  const pool = DatabaseService.getPool();

  // Verify workflow ownership
  const workflowResult = await pool.query(
    'SELECT * FROM workflows WHERE id = $1 AND user_id = $2',
    [workflowId, req.user!.id]
  );

  if (workflowResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found',
    });
  }

  const workflow = workflowResult.rows[0];

  // Get execution statistics
  const executionStats = await pool.query(
    `SELECT 
       COUNT(*) as total_executions,
       AVG(duration) as avg_duration,
       SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_executions
     FROM workflow_executions 
     WHERE workflow_id = $1 
       AND start_time >= CURRENT_DATE - INTERVAL '30 days'`,
    [workflowId]
  );

  const stats = executionStats.rows[0];
  const failureRate = stats.total_executions > 0 ? (stats.failed_executions / stats.total_executions) : 0;

  // Mock AI suggestions based on performance
  const suggestions = [];

  if (failureRate > 0.1) {
    suggestions.push({
      type: 'reliability',
      title: 'Improve Error Handling',
      description: `This workflow has a ${(failureRate * 100).toFixed(1)}% failure rate. Consider adding better error handling.`,
      impact: 'high',
      effort: 'medium',
    });
  }

  if (stats.avg_duration > 300) {
    suggestions.push({
      type: 'performance',
      title: 'Optimize Execution Time',
      description: `Average execution time is ${Math.round(stats.avg_duration)}s. Consider optimizing slow operations.`,
      impact: 'medium',
      effort: 'medium',
    });
  }

  suggestions.push({
    type: 'feature',
    title: 'Add Monitoring',
    description: 'Consider adding monitoring and alerting to track workflow performance.',
    impact: 'medium',
    effort: 'low',
  });

  logger.info(`Generated ${suggestions.length} improvement suggestions for workflow ${workflowId}`);

  res.json({
    success: true,
    data: {
      workflowId,
      workflowName: workflow.name,
      suggestions,
      performanceMetrics: {
        totalExecutions: parseInt(stats.total_executions),
        avgDuration: parseFloat(stats.avg_duration),
        failureRate: failureRate,
      },
    },
  });
}));

// Auto-fix workflow issues
router.post('/auto-fix/:workflowId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { workflowId } = req.params;
  const pool = DatabaseService.getPool();

  // Verify workflow ownership
  const workflowResult = await pool.query(
    'SELECT * FROM workflows WHERE id = $1 AND user_id = $2',
    [workflowId, req.user!.id]
  );

  if (workflowResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found',
    });
  }

  // Get recent errors
  const errorResult = await pool.query(
    `SELECT error_message 
     FROM workflow_executions 
     WHERE workflow_id = $1 
       AND status = 'failed' 
       AND start_time >= CURRENT_DATE - INTERVAL '7 days'
     ORDER BY start_time DESC 
     LIMIT 5`,
    [workflowId]
  );

  const errors = errorResult.rows.map(row => row.error_message);

  // Mock auto-fix logic
  const fixResult = {
    success: true,
    action: 'retry_policy_updated',
    description: 'Updated retry policy to handle temporary API failures',
    estimatedFixTime: 0,
    requiresUserAction: false,
    appliedFixes: [
      'Increased retry attempts from 3 to 5',
      'Added exponential backoff',
      'Improved error detection',
    ],
  };

  logger.info(`Auto-fix applied to workflow ${workflowId} for user ${req.user!.email}`);

  res.json({
    success: true,
    data: fixResult,
    message: 'Auto-fix completed successfully',
  });
}));

export default router;