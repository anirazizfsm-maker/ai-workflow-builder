import { apiEndpoints } from './api';

class N8nService {
  private static instance: N8nService;
  private baseUrl: string;
  private apiKey: string | null;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = import.meta.env.VITE_N8N_API_KEY || null;
  }

  public static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }

  public async getWorkflows(): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.list();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch workflows');
    }
  }

  public async getWorkflowById(workflowId: string): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.get(workflowId);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch workflow');
    }
  }

  public async createWorkflow(workflowData: any): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.create(workflowData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to create workflow');
    }
  }

  public async updateWorkflow(workflowId: string, workflowData: any): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.update(workflowId, workflowData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to update workflow');
    }
  }

  public async deleteWorkflow(workflowId: string): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.delete(workflowId);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete workflow');
    }
  }

  public async executeWorkflow(workflowId: string): Promise<any> {
    try {
      // In a real implementation, this would call the n8n API directly
      // For now, we'll use our backend API which acts as a proxy
      const response = await apiEndpoints.workflows.execute(workflowId);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to execute workflow');
    }
  }

  public async getExecutions(workflowId: string): Promise<any> {
    try {
      // This would be a separate endpoint in a real implementation
      // For now, we'll return mock data
      return {
        success: true,
        data: [
          {
            id: 'exec-1',
            workflowId,
            status: 'success',
            startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            finishedAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
            duration: 60000, // 1 minute
            timeSaved: 30, // minutes
            costSaved: 25 // USD
          },
          {
            id: 'exec-2',
            workflowId,
            status: 'failed',
            startedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            finishedAt: new Date(Date.now() - 7100000).toISOString(), // 1 hour 58 minutes ago
            duration: 100000, // 1 minute 40 seconds
            errorMessage: 'API rate limit exceeded'
          }
        ]
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch executions');
    }
  }

  public async getNodes(): Promise<any> {
    try {
      // This would fetch available nodes from n8n
      // For now, we'll return mock data
      return {
        success: true,
        data: [
          { name: 'HTTP Request', type: 'http', category: 'Core Nodes' },
          { name: 'Function', type: 'function', category: 'Core Nodes' },
          { name: 'Switch', type: 'switch', category: 'Core Nodes' },
          { name: 'Set', type: 'set', category: 'Core Nodes' },
          { name: 'Item Lists', type: 'itemLists', category: 'Core Nodes' },
          { name: 'Google Sheets', type: 'googleSheets', category: 'Google' },
          { name: 'Slack', type: 'slack', category: 'Communication' },
          { name: 'Email Send', type: 'emailSend', category: 'Communication' },
          { name: 'Cron', type: 'cron', category: 'Triggers' },
          { name: 'Webhook', type: 'webhook', category: 'Triggers' }
        ]
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch nodes');
    }
  }
}

export default N8nService.getInstance();