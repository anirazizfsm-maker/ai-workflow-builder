import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflows } from '../hooks/useApi';
import Header from './Header';
import Footer from './Footer';

const WorkflowsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workflowsData, isLoading, error } = useWorkflows();

  const workflows = workflowsData?.data?.data || [];

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else if (minutes < 1440) {
      return `${Math.round(minutes / 60)} hrs`;
    } else {
      return `${Math.round(minutes / 1440)} days`;
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header title="Workflows" subtitle="Manage your automation workflows" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Workflows</h1>
            <p className="mt-2 text-gray-600">View and manage all your automation workflows</p>
          </div>
          <button 
            onClick={() => navigate('/builder')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Create New Workflow
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading workflows...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load workflows. Please try again later.
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow: any) => (
            <div key={workflow.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                      workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">{workflow.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Time Saved</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatTime(workflow.estimatedTimeSavings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cost Saved</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(workflow.estimatedCostSavings)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Executions</p>
                      <p className="text-sm font-medium text-gray-900">
                        {workflow.executionCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="text-sm font-medium text-gray-900">
                        {workflow.successRate}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/analytics/workflow/${workflow.id}`)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="View Analytics"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    title="Edit Workflow"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Created {new Date(workflow.createdAt).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Execute
                  </button>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    Pause
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {workflows.length === 0 && !isLoading && (
            <div className="col-span-2 text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new workflow.</p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/builder')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Workflow
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WorkflowsPage;