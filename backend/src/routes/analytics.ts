import { Router, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { DatabaseService } from '../services/databaseService';
import { AuthenticatedRequest } from '../middleware/auth';
import { ValidationError } from '../middleware/errorHandler';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = Router();

// Get analytics overview
router.get('/', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array().map(err => err.msg).join(', '));
  }

  const period = req.query.period as string || 'monthly';
  const pool = DatabaseService.getPool();

  // Get current period analytics
  const analyticsResult = await pool.query(
    `SELECT 
       SUM(total_time_saved) as total_time_saved,
       SUM(total_cost_saved) as total_cost_saved,
       SUM(workflows_executed) as workflows_executed,
       SUM(successful_executions) as successful_executions,
       SUM(failed_executions) as failed_executions,
       CASE 
         WHEN SUM(workflows_executed) > 0 
         THEN ROUND((SUM(successful_executions)::decimal / SUM(workflows_executed) * 100), 2)
         ELSE 0 
       END as success_rate
     FROM analytics_daily 
     WHERE user_id = $1 
       AND date >= CURRENT_DATE - INTERVAL '1 ${period === 'yearly' ? 'year' : period === 'monthly' ? 'month' : period === 'weekly' ? 'week' : 'day'}'`,
    [req.user!.id]
  );

  // Get active workflows count
  const workflowsResult = await pool.query(
    'SELECT COUNT(*) as active_workflows FROM workflows WHERE user_id = $1 AND status = $2',
    [req.user!.id, 'active']
  );

  const analytics = analyticsResult.rows[0];
  const activeWorkflows = parseInt(workflowsResult.rows[0].active_workflows);

  res.json({
    success: true,
    data: {
      totalTimeSaved: parseFloat(analytics.total_time_saved) || 0,
      totalCostSaved: parseFloat(analytics.total_cost_saved) || 0,
      workflowsExecuted: parseInt(analytics.workflows_executed) || 0,
      successfulExecutions: parseInt(analytics.successful_executions) || 0,
      failedExecutions: parseInt(analytics.failed_executions) || 0,
      successRate: parseFloat(analytics.success_rate) || 0,
      activeWorkflows,
      period,
    },
  });
}));

// Get time savings analytics
router.get('/time-savings', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const period = req.query.period as string || 'monthly';
  const pool = DatabaseService.getPool();

  let dateFormat, dateInterval;
  switch (period) {
    case 'daily':
      dateFormat = 'YYYY-MM-DD';
      dateInterval = '30 days';
      break;
    case 'weekly':
      dateFormat = 'YYYY-\"W\"WW';
      dateInterval = '12 weeks';
      break;
    case 'yearly':
      dateFormat = 'YYYY';
      dateInterval = '5 years';
      break;
    default: // monthly
      dateFormat = 'YYYY-MM';
      dateInterval = '12 months';
  }

  const result = await pool.query(
    `SELECT 
       TO_CHAR(date, $1) as period,
       SUM(total_time_saved) as time_saved
     FROM analytics_daily 
     WHERE user_id = $2 
       AND date >= CURRENT_DATE - INTERVAL '${dateInterval}'
     GROUP BY TO_CHAR(date, $1)
     ORDER BY period`,
    [dateFormat, req.user!.id]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      period: row.period,
      timeSaved: parseFloat(row.time_saved) || 0,
    })),
  });
}));

// Get cost savings analytics
router.get('/cost-savings', [
  query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
], asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const period = req.query.period as string || 'monthly';
  const pool = DatabaseService.getPool();

  let dateFormat, dateInterval;
  switch (period) {
    case 'daily':
      dateFormat = 'YYYY-MM-DD';
      dateInterval = '30 days';
      break;
    case 'weekly':
      dateFormat = 'YYYY-\"W\"WW';
      dateInterval = '12 weeks';
      break;
    case 'yearly':
      dateFormat = 'YYYY';
      dateInterval = '5 years';
      break;
    default: // monthly
      dateFormat = 'YYYY-MM';
      dateInterval = '12 months';
  }

  const result = await pool.query(
    `SELECT 
       TO_CHAR(date, $1) as period,
       SUM(total_cost_saved) as cost_saved
     FROM analytics_daily 
     WHERE user_id = $2 
       AND date >= CURRENT_DATE - INTERVAL '${dateInterval}'
     GROUP BY TO_CHAR(date, $1)
     ORDER BY period`,
    [dateFormat, req.user!.id]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      period: row.period,
      costSaved: parseFloat(row.cost_saved) || 0,
    })),
  });
}));

// Get workflow performance analytics
router.get('/workflow-performance', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const pool = DatabaseService.getPool();

  const result = await pool.query(
    `SELECT 
       w.id,
       w.name,
       w.execution_count,
       w.success_rate,
       SUM(we.time_saved) as total_time_saved,
       SUM(we.cost_saved) as total_cost_saved,
       AVG(we.duration) as avg_duration
     FROM workflows w
     LEFT JOIN workflow_executions we ON w.id = we.workflow_id
     WHERE w.user_id = $1 AND w.status = 'active'
     GROUP BY w.id, w.name, w.execution_count, w.success_rate
     ORDER BY total_time_saved DESC NULLS LAST
     LIMIT 10`,
    [req.user!.id]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      workflowId: row.id,
      workflowName: row.name,
      executionCount: parseInt(row.execution_count) || 0,
      successRate: parseFloat(row.success_rate) || 0,
      totalTimeSaved: parseFloat(row.total_time_saved) || 0,
      totalCostSaved: parseFloat(row.total_cost_saved) || 0,
      avgDuration: parseFloat(row.avg_duration) || 0,
    })),
  });
}));

// Get workflow performance for specific workflow
router.get('/workflow-performance/:workflowId', asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { workflowId } = req.params;
  const pool = DatabaseService.getPool();

  // Verify workflow ownership
  const workflowResult = await pool.query(
    'SELECT id FROM workflows WHERE id = $1 AND user_id = $2',
    [workflowId, req.user!.id]
  );

  if (workflowResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Workflow not found',
    });
  }

  // Get execution analytics for the last 30 days
  const result = await pool.query(
    `SELECT 
       DATE(start_time) as date,
       COUNT(*) as executions,
       SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful_executions,
       SUM(time_saved) as time_saved,
       SUM(cost_saved) as cost_saved,
       AVG(duration) as avg_duration
     FROM workflow_executions
     WHERE workflow_id = $1 
       AND start_time >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY DATE(start_time)
     ORDER BY date`,
    [workflowId]
  );

  res.json({
    success: true,
    data: result.rows.map(row => ({
      date: row.date,
      executions: parseInt(row.executions),
      successfulExecutions: parseInt(row.successful_executions),
      timeSaved: parseFloat(row.time_saved) || 0,
      costSaved: parseFloat(row.cost_saved) || 0,
      avgDuration: parseFloat(row.avg_duration) || 0,
      successRate: row.executions > 0 ? (row.successful_executions / row.executions * 100) : 0,
    })),
  });
}));

export default router;