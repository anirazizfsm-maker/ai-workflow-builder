// Core shared types for Lethimdo
export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'business';
  subscriptionExpiry: Date;
  createdAt: Date;
  preferences: UserPreferences;
  businessProfile: BusinessProfile;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  dashboard: {
    defaultPeriod: 'day' | 'week' | 'month' | 'year';
    defaultCharts: string[];
  };
}

export interface BusinessProfile {
  industry: string;
  companySize: string;
  currentTools: string[];
  painPoints: string[];
  goals: string[];
  averageHourlyRate?: number;
}

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string;
  naturalLanguageInput: string;
  n8nWorkflowId: string;
  status: 'draft' | 'active' | 'paused' | 'failed';
  template: string;
  config: WorkflowConfig;
  credentials: CredentialRef[];
  createdAt: Date;
  lastExecuted: Date;
  executionCount: number;
  successRate: number;
  estimatedTimeSavings: number;
  estimatedCostSavings: number;
}

export interface WorkflowConfig {
  schedule: string;
  retryPolicy: RetryPolicy;
  notifications: NotificationConfig;
  autoFix: boolean;
  variables: Record<string, any>;
  timeout: number;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

export interface NotificationConfig {
  onSuccess: boolean;
  onFailure: boolean;
  channels: ('email' | 'slack' | 'webhook')[];
  webhookUrl?: string;
}

export interface CredentialRef {
  id: string;
  provider: string;
  name: string;
  type: 'oauth' | 'api_key' | 'basic_auth';
  status: 'active' | 'expired' | 'invalid';
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  timeSaved: number; // in minutes
  costSaved: number; // in USD
  errorMessage?: string;
  logs: ExecutionLog[];
  triggeredBy: 'schedule' | 'manual' | 'webhook' | 'api';
}

export interface ExecutionLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  nodeId?: string;
  data?: any;
}

export interface Analytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  totalTimeSaved: number;
  totalCostSaved: number;
  workflowsExecuted: number;
  successfulExecutions: number;
  failedExecutions: number;
  topPerformingWorkflows: string[];
  avgExecutionTime: number;
  efficiency: number;
}

export interface BusinessInsight {
  id: string;
  userId: string;
  type: 'recommendation' | 'optimization' | 'alert' | 'benchmark';
  title: string;
  description: string;
  potentialSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
  priority: number;
  status: 'new' | 'viewed' | 'implemented' | 'dismissed';
  createdAt: Date;
  category: string;
  actionItems: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedTimeSavings: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  requiredApps: string[];
  n8nTemplate: object;
  usageCount: number;
  tags: string[];
  rating: number;
  reviews: number;
}

export interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'oauth' | 'api_key' | 'webhook';
  capabilities: string[];
  status: 'available' | 'connected' | 'error';
  iconUrl: string;
  description: string;
  setupUrl?: string;
}

export interface ROIMetrics {
  timeSavedHours: number;
  costSaved: number;
  executionCount: number;
  efficiency: number;
  monthlyProjection: number;
  yearlyProjection: number;
  breakEvenPoint?: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// AI Service Types
export interface Intent {
  action: 'create' | 'sync' | 'notify' | 'process' | 'analyze';
  source: string;
  destination: string;
  frequency: string;
  conditions: string[];
  confidence: number;
}

export interface WorkflowSpec {
  template: WorkflowTemplate;
  config: WorkflowConfig;
  validation: ValidationResult;
  estimatedSavings: ROIMetrics;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface FixResult {
  success: boolean;
  action: string;
  description: string;
  estimatedFixTime: number;
  requiresUserAction: boolean;
  userInstructions?: string;
}