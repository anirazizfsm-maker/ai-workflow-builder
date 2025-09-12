import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiEndpoints, checkApiConnection } from '../services/api';
// import toast from 'react-hot-toast'; // Import this in components that need it

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiEndpoints.health(),
    retry: 3,
    refetchInterval: 30000, // Check every 30 seconds
  });
};

// API connection status hook
export const useApiConnection = () => {
  return useQuery({
    queryKey: ['api-connection'],
    queryFn: checkApiConnection,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Authentication hooks
export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiEndpoints.auth.me(),
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiEndpoints.auth.login,
    onSuccess: (response) => {
      // Store token
      if (response.data.token) {
        localStorage.setItem('lethimdo_token', response.data.token);
      }
      
      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      
      // toast.success('Login successful!');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: apiEndpoints.auth.register,
    onSuccess: () => {
      // toast.success('Registration successful! Please log in.');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

// Integrations hooks
export const useIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],
    queryFn: () => apiEndpoints.integrations.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useConnectIntegration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiEndpoints.integrations.connect(id),
    onSuccess: (_response, _id) => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      // toast.success(`Successfully connected to ${id}!`);
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Connection failed');
    },
  });
};

export const useDiscoverIntegration = () => {
  return useMutation({
    mutationFn: (url: string) => apiEndpoints.integrations.discover(url),
    onSuccess: () => {
      // toast.success('API discovered successfully!');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Discovery failed');
    },
  });
};

// Workflows hooks
export const useWorkflows = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: () => apiEndpoints.workflows.list(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiEndpoints.workflows.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      // toast.success('Workflow created successfully!');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to create workflow');
    },
  });
};

export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiEndpoints.workflows.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      // toast.success('Workflow executed successfully!');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'Workflow execution failed');
    },
  });
};

// AI hooks (for future use)
export const useGenerateWorkflow = () => {
  return useMutation({
    mutationFn: ({ description, businessContext }: { 
      description: string; 
      businessContext?: string 
    }) => apiEndpoints.ai.generateWorkflow(description, businessContext),
    onSuccess: () => {
      // toast.success('AI workflow generated successfully!');
    },
    onError: (_error: any) => {
      // toast.error(error.response?.data?.message || 'AI generation failed');
    },
  });
};

// Analytics hooks
export const useAnalyticsOverview = (period?: string) => {
  return useQuery({
    queryKey: ['analytics', 'overview', period],
    queryFn: () => apiEndpoints.analytics.overview(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTimeSavings = (period?: string) => {
  return useQuery({
    queryKey: ['analytics', 'time-savings', period],
    queryFn: () => apiEndpoints.analytics.timeSavings(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCostSavings = (period?: string) => {
  return useQuery({
    queryKey: ['analytics', 'cost-savings', period],
    queryFn: () => apiEndpoints.analytics.costSavings(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkflowPerformance = () => {
  return useQuery({
    queryKey: ['analytics', 'workflow-performance'],
    queryFn: () => apiEndpoints.analytics.workflowPerformance(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWorkflowPerformanceById = (workflowId: string) => {
  return useQuery({
    queryKey: ['analytics', 'workflow-performance', workflowId],
    queryFn: () => apiEndpoints.analytics.workflowPerformanceById(workflowId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Auto-fix hooks
export const useDiagnoseError = () => {
  return useMutation({
    mutationFn: ({ workflowId, error }: { workflowId: string; error: any }) => 
      apiEndpoints.autoFix.diagnoseError({ workflowId, error }),
  });
};

export const useSuggestFix = () => {
  return useMutation({
    mutationFn: ({ workflowId, error }: { workflowId: string; error: any }) => 
      apiEndpoints.autoFix.suggestFix({ workflowId, error }),
  });
};

export const useAutoRepair = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ workflowId, error }: { workflowId: string; error: any }) => 
      apiEndpoints.autoFix.autoRepair({ workflowId, error }),
    onSuccess: (_data, variables) => {
      // Invalidate workflow queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
    },
  });
};

// n8n Integration hooks
export const useN8nWorkflows = () => {
  return useQuery({
    queryKey: ['n8n', 'workflows'],
    queryFn: () => apiEndpoints.workflows.list(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useN8nWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: ['n8n', 'workflow', workflowId],
    queryFn: () => apiEndpoints.workflows.get(workflowId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useN8nNodes = () => {
  return useQuery({
    queryKey: ['n8n', 'nodes'],
    queryFn: async () => {
      // In a real implementation, this would fetch from n8n service
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
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useExecuteN8nWorkflow = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (workflowId: string) => apiEndpoints.workflows.execute(workflowId),
    onSuccess: (_data, variables) => {
      // Invalidate workflow queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['n8n', 'workflows'] });
      queryClient.invalidateQueries({ queryKey: ['n8n', 'workflow', variables] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
