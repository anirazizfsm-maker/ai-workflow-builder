import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample data for dashboard cards
  const dashboardCards = [
    {
      title: 'Integrations',
      description: '150+ API integrations ready to use',
      icon: '🔌',
      link: '/integrations',
      stat: '24',
    },
    {
      title: 'Workflows',
      description: 'Manage your automation workflows',
      icon: '🔄',
      link: '/workflows',
    },
    {
      title: 'Auto-Discovery',
      description: 'Discover any API automatically',
      icon: '🔍',
      link: '/discover',
      badge: 'New',
    },
    {
      title: 'Custom Builder',
      description: 'Build custom integrations',
      icon: '🛠️',
      link: '/builder',
    },
    {
      title: 'Marketplace',
      description: 'Community integrations',
      icon: '🏪',
      link: '/marketplace',
    },
    {
      title: 'Analytics',
      description: 'Business intelligence dashboard',
      icon: '📊',
      link: '/analytics',
      badge: 'New',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Example */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Quick Action
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        This modal demonstrates UI components for accessible interfaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your API integrations and workflows</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Settings
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Create Workflow
            </button>
          </div>
        </div>
        
        {/* API Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">API Connection Status</h3>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Updated just now
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{card.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-500">{card.description}</p>
                  </div>
                </div>
                {card.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {card.badge}
                  </span>
                )}
              </div>
              {card.stat && (
                <div className="mt-4 text-2xl font-bold text-gray-900">{card.stat}</div>
              )}
              <div className="mt-4">
                <Link 
                  to={card.link} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View details →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose Your Integration Method</h3>
                  <p className="text-gray-600">Browse pre-built integrations, use auto-discovery, or build custom ones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Configure Authentication</h3>
                  <p className="text-gray-600">Set up OAuth, API keys, or custom authentication methods</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Start Using in Workflows</h3>
                  <p className="text-gray-600">Begin automating with your connected APIs immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;