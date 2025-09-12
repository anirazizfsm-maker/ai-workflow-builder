import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  useApiConnection, 
  useHealthCheck, 
  useIntegrations, 
  useConnectIntegration,
  useDiscoverIntegration 
} from '../hooks/useApi';

const ApiTestPage: React.FC = () => {
  const [testUrl, setTestUrl] = useState('https://jsonplaceholder.typicode.com/posts');
  
  const { data: connectionStatus, isLoading: connectionLoading, refetch: refetchConnection } = useApiConnection();
  const { data: healthData, isLoading: healthLoading, refetch: refetchHealth } = useHealthCheck();
  const { data: integrationsData, isLoading: integrationsLoading, refetch: refetchIntegrations } = useIntegrations();
  const connectMutation = useConnectIntegration();
  const discoverMutation = useDiscoverIntegration();

  const handleTestConnection = () => {
    refetchConnection();
    refetchHealth();
    toast.success('Connection test initiated!');
  };

  const handleTestIntegrations = () => {
    refetchIntegrations();
    toast.success('Integrations list refreshed!');
  };

  const handleTestConnect = (id: string) => {
    connectMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`✅ Successfully connected to ${id}!`);
      },
      onError: (error: any) => {
        toast.error(`❌ Failed to connect to ${id}: ${error.response?.data?.message || error.message}`);
      }
    });
  };

  const handleTestDiscover = () => {
    if (!testUrl) {
      toast.error('Please enter a URL to test');
      return;
    }
    
    discoverMutation.mutate(testUrl, {
      onSuccess: () => {
        toast.success('🔍 API discovery successful!');
      },
      onError: (error: any) => {
        toast.error(`❌ Discovery failed: ${error.response?.data?.message || error.message}`);
      }
    });
  };

  const isConnected = connectionStatus?.connected && healthData?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">API Connection Test Suite</h1>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Backend Connection Status</h2>
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Connection
            </button>
          </div>
          
          <div className={`p-4 rounded-md ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-semibold">
                {connectionLoading || healthLoading ? 'Testing...' : 
                 isConnected ? 'Connected Successfully' : 'Connection Failed'}
              </span>
            </div>
            
            {connectionStatus && (
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Backend URL:</strong> {connectionStatus.url}</p>
                {healthData?.data && (
                  <>
                    <p><strong>Status:</strong> {healthData.data.status}</p>
                    <p><strong>Environment:</strong> {healthData.data.environment}</p>
                    <p><strong>Uptime:</strong> {Math.round(healthData.data.uptime)} seconds</p>
                  </>
                )}
                {connectionStatus.error && (
                  <p><strong>Error:</strong> {connectionStatus.error}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Integrations Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Integrations API Test</h2>
            <button
              onClick={handleTestIntegrations}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Refresh Integrations
            </button>
          </div>
          
          {integrationsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading integrations...</p>
            </div>
          ) : integrationsData?.data?.data ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrationsData.data.data.map((integration: any) => (
                <div key={integration.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{integration.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      integration.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{integration.category}</p>
                  <button
                    onClick={() => handleTestConnect(integration.id)}
                    disabled={connectMutation.isPending}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {connectMutation.isPending ? 'Testing...' : 'Test Connect'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              No integrations data available
            </div>
          )}
        </div>

        {/* API Discovery Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Discovery Test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test URL (paste any API endpoint)
              </label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/v1/data"
              />
            </div>
            
            <button
              onClick={handleTestDiscover}
              disabled={discoverMutation.isPending}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {discoverMutation.isPending ? 'Discovering...' : 'Test API Discovery'}
            </button>
            
            {discoverMutation.data && (
              <div className="mt-4 p-4 bg-green-100 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Discovery Result:</h3>
                <pre className="text-sm text-green-700 whitespace-pre-wrap">
                  {JSON.stringify(discoverMutation.data.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Test Results Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-semibold">Backend Connection</h3>
              <p className={isConnected ? 'text-green-800' : 'text-red-800'}>
                {isConnected ? '✅ Working' : '❌ Failed'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${integrationsData?.data?.data ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <h3 className="font-semibold">Integrations API</h3>
              <p className={integrationsData?.data?.data ? 'text-green-800' : 'text-yellow-800'}>
                {integrationsData?.data?.data ? `✅ ${integrationsData.data.data.length} integrations` : '⚠️ Loading...'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${discoverMutation.data ? 'bg-green-100' : 'bg-gray-100'}`}>
              <h3 className="font-semibold">API Discovery</h3>
              <p className={discoverMutation.data ? 'text-green-800' : 'text-gray-800'}>
                {discoverMutation.data ? '✅ Tested' : '⏳ Ready to test'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiTestPage;