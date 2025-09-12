import React from 'react';
import { useApiConnection, useHealthCheck } from '../hooks/useApi';

const ApiStatus: React.FC = () => {
  const { data: connectionStatus, isLoading: connectionLoading } = useApiConnection();
  const { data: healthData, isLoading: healthLoading } = useHealthCheck();

  if (connectionLoading || healthLoading) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-700 mr-2"></div>
          <span>Checking API connection...</span>
        </div>
      </div>
    );
  }

  const isConnected = connectionStatus?.connected && healthData?.data;

  return (
    <div className={`border px-4 py-3 rounded mb-4 ${
      isConnected 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-red-100 border-red-400 text-red-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="font-semibold">
            {isConnected ? 'API Connected' : 'API Disconnected'}
          </span>
        </div>
        
        <div className="text-sm">
          <span className="mr-4">
            Backend: {connectionStatus?.url || 'Unknown'}
          </span>
          {isConnected && healthData?.data && (
            <span>
              Status: {healthData.data.status} | 
              Env: {healthData.data.environment}
            </span>
          )}
        </div>
      </div>
      
      {!isConnected && connectionStatus?.error && (
        <div className="mt-2 text-sm">
          <strong>Error:</strong> {connectionStatus.error}
        </div>
      )}
    </div>
  );
};

export default ApiStatus;