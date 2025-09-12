import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Temporarily disable this import due to build issues
// import { User, Workflow } from '../../../shared/types';

// Define simplified types for now to avoid build issues
interface User {
  id: string;
  email: string;
  name: string;
  subscriptionTier: 'free' | 'starter' | 'pro' | 'business';
  subscriptionExpiry: Date;
  createdAt: Date;
  preferences: UserPreferences;
  businessProfile: BusinessProfile;
}

interface UserPreferences {
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

interface BusinessProfile {
  industry: string;
  companySize: string;
  currentTools: string[];
  painPoints: string[];
  goals: string[];
  averageHourlyRate?: number;
}

interface Workflow {
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

interface WorkflowConfig {
  schedule: string;
  retryPolicy: RetryPolicy;
  notifications: NotificationConfig;
  autoFix: boolean;
  variables: Record<string, any>;
  timeout: number;
}

interface RetryPolicy {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
}

interface NotificationConfig {
  onSuccess: boolean;
  onFailure: boolean;
  channels: ('email' | 'slack' | 'webhook')[];
  webhookUrl?: string;
}

interface CredentialRef {
  id: string;
  provider: string;
  name: string;
  type: 'oauth' | 'api_key' | 'basic_auth';
  status: 'active' | 'expired' | 'invalid';
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Workflow state
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  
  // UI state
  sidebarOpen: boolean;
  selectedPeriod: 'day' | 'week' | 'month' | 'year';
  darkMode: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, workflow: Partial<Workflow>) => void;
  removeWorkflow: (id: string) => void;
  setActiveWorkflow: (workflow: Workflow | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedPeriod: (period: 'day' | 'week' | 'month' | 'year') => void;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      workflows: [],
      activeWorkflow: null,
      sidebarOpen: false,
      selectedPeriod: 'month',
      darkMode: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      addWorkflow: (workflow) => set((state) => ({ 
        workflows: [...state.workflows, workflow] 
      })),
      updateWorkflow: (id, updatedWorkflow) => set((state) => ({
        workflows: state.workflows.map(wf => 
          wf.id === id ? { ...wf, ...updatedWorkflow } : wf
        )
      })),
      removeWorkflow: (id) => set((state) => ({
        workflows: state.workflows.filter(wf => wf.id !== id)
      })),
      setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSelectedPeriod: (period) => set({ selectedPeriod: period }),
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: 'lethimdo-app-store',
      partialize: (state) => ({ 
        darkMode: state.darkMode,
        selectedPeriod: state.selectedPeriod,
        sidebarOpen: state.sidebarOpen
      }),
    }
  )
);