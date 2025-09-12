import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from './stores/useAppStore';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DashboardCard from './components/DashboardCard';
import ApiStatus from './components/ApiStatus';
import ApiTestPage from './components/ApiTestPage';
import ProfessionalStyling from './components/ProfessionalStyling';
import AgencySection from './components/AgencySection';
import MarketingPage from './components/MarketingPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import WorkflowPerformanceDetail from './components/analytics/WorkflowPerformanceDetail';
import WorkflowsPage from './components/WorkflowsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useIntegrations, useConnectIntegration } from './hooks/useApi';
import WorkflowBuilder from './components/WorkflowBuilder';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import './App.css';

// Simple Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalStyling />
      <Header />
      
      <HeroSection />
      
      <FeaturesSection />
      
      {/* Agency Section for Bangladesh Freelance Agencies */}
      <AgencySection />
      
      {/* Integration Showcase */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Integrations Ready Now
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with the tools your international clients already use
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { name: 'Salesforce', icon: '🔹' },
              { name: 'Google', icon: '🌐' },
              { name: 'Slack', icon: '💬' },
              { name: 'Stripe', icon: '💳' },
              { name: 'GitHub', icon: '🐙' },
              { name: 'Shopify', icon: '🛒' },
              { name: 'Zoom', icon: '📹' },
              { name: 'Notion', icon: '📝' },
            ].map((integration) => (
              <div key={integration.name} className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow border border-gray-100 agency-card">
                <div className="text-3xl mb-2">{integration.icon}</div>
                <div className="text-sm font-medium text-gray-900">{integration.name}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <span className="text-gray-600">And 140+ more integrations available...</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Connect Your APIs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers using Lethimdo for universal API connectivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 font-semibold transition-colors agency-button">
              Start Free Trial
            </Link>
            <Link to="/docs" className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-600 font-semibold transition-colors agency-button">
              View Documentation
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Simple Dashboard Component
const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Example using Headless UI */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Quick Action
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This modal demonstrates the use of Headless UI components for accessible UI.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Header title="Lethimdo Dashboard" subtitle="" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
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
        <ApiStatus />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Integrations"
            description="150+ API integrations ready to use"
            icon="🔌"
            link="/integrations"
            stat="24"
          />
          <DashboardCard
            title="Workflows"
            description="Manage your automation workflows"
            icon="🔄"
            link="/workflows"
          />
          <DashboardCard
            title="Auto-Discovery"
            description="Discover any API automatically"
            icon="🔍"
            link="/discover"
            badge="New"
          />
          <DashboardCard
            title="Custom Builder"
            description="Build custom integrations"
            icon="🛠️"
            link="/builder"
          />
          <DashboardCard
            title="Marketplace"
            description="Community integrations"
            icon="🏪"
            link="/marketplace"
          />
          <DashboardCard
            title="Analytics"
            description="Business intelligence dashboard"
            icon="📊"
            link="/analytics"
            badge="New"
          />
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
      
      <Footer />
    </div>
  );
};


// Simple Integrations Page
const IntegrationsPage: React.FC = () => {
  const { data: integrationsResponse, isLoading, error } = useIntegrations();
  const connectMutation = useConnectIntegration();

  const integrations = integrationsResponse?.data?.data || [
    { id: 'salesforce', name: 'Salesforce', icon: '🔹', category: 'CRM', status: 'Available' },
    { id: 'google', name: 'Google Workspace', icon: '🌐', category: 'Productivity', status: 'Available' },
    { id: 'slack', name: 'Slack', icon: '💬', category: 'Communication', status: 'Available' },
    { id: 'stripe', name: 'Stripe', icon: '💳', category: 'Payments', status: 'Available' },
    { id: 'github', name: 'GitHub', icon: '🐙', category: 'Developer', status: 'Available' },
    { id: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce', status: 'Available' },
  ];

  const handleConnect = (id: string) => {
    connectMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Successfully connected to ${id}!`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Connection failed');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Integrations" subtitle="Connect with 150+ popular services" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Integrations</h1>
            <p className="mt-2 text-gray-600">Connect with the tools your clients use every day</p>
          </div>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
        
        {/* API Connection Status */}
        <ApiStatus />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading integrations...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load integrations. Using fallback data.
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration: any) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <span className="text-sm text-gray-500">{integration.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">{integration.status}</span>
                <button 
                  onClick={() => handleConnect(integration.id)}
                  disabled={connectMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectMutation.isPending ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<Dashboard />} />
          <Route path="/builder" element={<WorkflowBuilder />} />
          <Route path="/marketplace" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/workflow/:workflowId" element={<WorkflowPerformanceDetail />} />
          <Route path="/docs" element={<Dashboard />} />
          <Route path="/test-api" element={<ApiTestPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;