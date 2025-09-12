import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiEndpoints } from '../../services/api';

// Mock data for business insights
const mockInsights = [
  {
    id: '1',
    type: 'recommendation',
    title: 'Email Automation Opportunity',
    description: 'Based on your workflow patterns, implementing an email automation workflow could save you 5 hours per week.',
    potentialSavings: 2000,
    implementationEffort: 'low',
    priority: 1,
    status: 'new',
    category: 'Automation',
    actionItems: ['Create email template', 'Set up trigger conditions', 'Configure delivery schedule']
  },
  {
    id: '2',
    type: 'optimization',
    title: 'Workflow Performance Improvement',
    description: 'Your customer onboarding workflow has a 15% failure rate. Optimizing the data validation step could improve this.',
    potentialSavings: 1500,
    implementationEffort: 'medium',
    priority: 2,
    status: 'new',
    category: 'Optimization',
    actionItems: ['Review validation rules', 'Add error handling', 'Test with sample data']
  },
  {
    id: '3',
    type: 'alert',
    title: 'API Rate Limit Warning',
    description: 'Your Salesforce integration is approaching its API rate limit. Consider implementing rate limiting strategies.',
    potentialSavings: 0,
    implementationEffort: 'high',
    priority: 3,
    status: 'new',
    category: 'Performance',
    actionItems: ['Implement exponential backoff', 'Add queue management', 'Monitor usage metrics']
  }
];

const BusinessInsights: React.FC = () => {
  // In a real implementation, this would fetch from the API
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['business-insights'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockInsights;
    }
  });

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getEffortColor = (effort: string) => {
    if (effort === 'high') return 'bg-red-100 text-red-800';
    if (effort === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Business Insights</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Refresh Insights
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {insightsData?.map((insight: any) => (
            <div key={insight.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getPriorityColor(insight.priority)}`}>
                      Priority {insight.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{insight.description}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getEffortColor(insight.implementationEffort)}`}>
                      Effort: {insight.implementationEffort}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {insight.category}
                    </span>
                    {insight.potentialSavings > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Save {formatCurrency(insight.potentialSavings)}/year
                      </span>
                    )}
                  </div>
                  
                  {insight.actionItems.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Action Items:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {insight.actionItems.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-gray-400 mr-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Implement
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Dismiss
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                </span>
              </div>
            </div>
          ))}
          
          {insightsData?.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No insights available</h3>
              <p className="mt-1 text-sm text-gray-500">We'll analyze your workflows and provide recommendations soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessInsights;