import { apiEndpoints } from './api';

class AutoFixService {
  private static instance: AutoFixService;

  private constructor() {}

  public static getInstance(): AutoFixService {
    if (!AutoFixService.instance) {
      AutoFixService.instance = new AutoFixService();
    }
    return AutoFixService.instance;
  }

  public async diagnoseError(workflowId: string, error: any): Promise<any> {
    try {
      const response = await apiEndpoints.ai.diagnoseError({
        workflowId,
        error
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Diagnosis failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Diagnosis failed');
    }
  }

  public async suggestFix(workflowId: string, error: any): Promise<any> {
    try {
      const response = await apiEndpoints.ai.suggestFix({
        workflowId,
        error
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Fix suggestion failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Fix suggestion failed');
    }
  }

  public async autoRepair(workflowId: string, error: any): Promise<any> {
    try {
      const response = await apiEndpoints.ai.autoRepair({
        workflowId,
        error
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Auto-repair failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Auto-repair failed');
    }
  }

  public async getFixHistory(workflowId: string): Promise<any> {
    try {
      // This would be a separate endpoint in a real implementation
      // For now, we'll return mock data
      return {
        success: true,
        data: [
          {
            id: 'fix-1',
            workflowId,
            errorType: 'credential_error',
            fixType: 'auto',
            description: 'Refreshed expired OAuth token',
            status: 'success',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            timeSaved: 15 // minutes
          },
          {
            id: 'fix-2',
            workflowId,
            errorType: 'api_rate_limit',
            fixType: 'manual',
            description: 'Added rate limiting to API calls',
            status: 'pending',
            timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            timeSaved: 0
          }
        ]
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch fix history');
    }
  }
}

export default AutoFixService.getInstance();