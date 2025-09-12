import { Pool } from 'pg';
import { logger } from '../utils/logger';

export class DatabaseService {
  private static pool: Pool;
  private static convexClient: any; // Will be initialized when Convex is properly configured

  public static async initialize(): Promise<void> {
    try {
      // Initialize PostgreSQL connection
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test the connection
      await this.pool.query('SELECT NOW()');
      logger.info('PostgreSQL connection established');

      // Initialize Convex (placeholder for now)
      // this.convexClient = new ConvexClient(process.env.CONVEX_DEPLOYMENT_URL!);
      // logger.info('Convex connection established');

      // Run database migrations if needed
      await this.runMigrations();

    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  public static getPool(): Pool {
    if (!this.pool) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return this.pool;
  }

  public static getConvexClient(): any {
    if (!this.convexClient) {
      logger.warn('Convex client not initialized');
      return null;
    }
    return this.convexClient;
  }

  public static async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      logger.info('PostgreSQL connection closed');
    }
  }

  private static async runMigrations(): Promise<void> {
    try {
      // Create tables if they don't exist
      await this.createTables();
      logger.info('Database migrations completed');
    } catch (error) {
      logger.error('Database migrations failed:', error);
      throw error;
    }
  }

  private static async createTables(): Promise<void> {
    const queries = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        name VARCHAR NOT NULL,
        password_hash VARCHAR NOT NULL,
        subscription_tier VARCHAR DEFAULT 'free',
        subscription_expiry TIMESTAMP,
        business_profile JSONB,
        preferences JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Workflows table
      `CREATE TABLE IF NOT EXISTS workflows (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR NOT NULL,
        description TEXT,
        natural_language_input TEXT,
        n8n_workflow_id VARCHAR,
        status VARCHAR DEFAULT 'draft',
        template TEXT,
        config JSONB,
        credentials JSONB,
        estimated_time_savings INTEGER DEFAULT 0,
        estimated_cost_savings DECIMAL(10,2) DEFAULT 0,
        execution_count INTEGER DEFAULT 0,
        success_rate DECIMAL(3,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_executed TIMESTAMP
      )`,

      // Workflow executions table
      `CREATE TABLE IF NOT EXISTS workflow_executions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
        status VARCHAR NOT NULL,
        start_time TIMESTAMP DEFAULT NOW(),
        end_time TIMESTAMP,
        duration INTEGER,
        time_saved INTEGER DEFAULT 0,
        cost_saved DECIMAL(10,2) DEFAULT 0,
        error_message TEXT,
        logs JSONB,
        triggered_by VARCHAR DEFAULT 'manual'
      )`,

      // Analytics daily table
      `CREATE TABLE IF NOT EXISTS analytics_daily (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        date DATE,
        total_time_saved INTEGER DEFAULT 0,
        total_cost_saved DECIMAL(10,2) DEFAULT 0,
        workflows_executed INTEGER DEFAULT 0,
        successful_executions INTEGER DEFAULT 0,
        failed_executions INTEGER DEFAULT 0,
        avg_execution_time INTEGER DEFAULT 0,
        efficiency DECIMAL(3,2) DEFAULT 0,
        top_performing_workflows JSONB,
        PRIMARY KEY (user_id, date)
      )`,

      // Business insights table
      `CREATE TABLE IF NOT EXISTS business_insights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        description TEXT,
        potential_savings DECIMAL(10,2),
        implementation_effort VARCHAR,
        priority INTEGER,
        status VARCHAR DEFAULT 'new',
        category VARCHAR,
        action_items JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )`,

      // Integrations table
      `CREATE TABLE IF NOT EXISTS integrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        credentials JSONB,
        status VARCHAR DEFAULT 'active',
        capabilities JSONB,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      // Workflow templates table
      `CREATE TABLE IF NOT EXISTS workflow_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        category VARCHAR NOT NULL,
        description TEXT,
        estimated_time_savings INTEGER DEFAULT 0,
        complexity VARCHAR DEFAULT 'beginner',
        required_apps JSONB,
        n8n_template JSONB,
        usage_count INTEGER DEFAULT 0,
        tags JSONB,
        rating DECIMAL(2,1) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )`,

      // Create indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_workflows_user_id ON workflows(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow_id ON workflow_executions(workflow_id)`,
      `CREATE INDEX IF NOT EXISTS idx_workflow_executions_start_time ON workflow_executions(start_time)`,
      `CREATE INDEX IF NOT EXISTS idx_analytics_daily_user_date ON analytics_daily(user_id, date)`,
      `CREATE INDEX IF NOT EXISTS idx_business_insights_user_status ON business_insights(user_id, status)`,
      `CREATE INDEX IF NOT EXISTS idx_integrations_user_provider ON integrations(user_id, provider)`,
    ];

    for (const query of queries) {
      await this.pool.query(query);
    }
  }
}