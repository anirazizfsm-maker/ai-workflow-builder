import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Simple Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="relative max-w-7xl mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="ml-2 text-2xl font-bold text-gray-900">Lethimdo</span>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with
            <span className="text-blue-600"> Every API </span>
            Effortlessly
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Lethimdo's Universal API Integration Platform connects with any service that has an API. 
            150+ pre-built integrations, auto-discovery, custom builders, and community marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
              Start Integrating
            </Link>
            <Link to="/integrations" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-semibold">
              Browse Integrations
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Four Ways to Connect Any API
          </h2>
          <p className="text-lg text-gray-600">
            Universal connectivity for every integration need
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon="🔌"
            title="150+ Pre-Built"
            description="Ready-to-use integrations for Salesforce, Google, Slack, Stripe, and more popular services."
          />
          <FeatureCard
            icon="🔍"
            title="Auto-Discovery"
            description="Paste any API URL and let Lethimdo automatically discover and configure the integration."
          />
          <FeatureCard
            icon="🛠️"
            title="Custom Builder"
            description="Visual integration builder for custom APIs with authentication and endpoint configuration."
          />
          <FeatureCard
            icon="🏪"
            title="Community Marketplace"
            description="Browse, install, and share integrations created by the community with one-click setup."
          />
        </div>
      </div>

      {/* Integration Showcase */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Integrations Ready Now
            </h2>
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
              <div key={integration.name} className="bg-white p-4 rounded-lg text-center hover:shadow-md transition-shadow">
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
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Connect Your APIs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers using Lethimdo for universal API connectivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 font-semibold">
              Start Free Trial
            </Link>
            <Link to="/docs" className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-600 font-semibold">
              View Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-6 w-6 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-white">Lethimdo</span>
          </div>
          <p className="text-gray-400">
            © 2024 Lethimdo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Lethimdo Dashboard</span>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Your Dashboard</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Integrations"
            description="150+ API integrations ready to use"
            icon="🔌"
            link="/integrations"
          />
          <DashboardCard
            title="Auto-Discovery"
            description="Discover any API automatically"
            icon="🔍"
            link="/discover"
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
            description="Integration performance"
            icon="📊"
            link="/analytics"
          />
          <DashboardCard
            title="Documentation"
            description="Integration guides"
            icon="📚"
            link="/docs"
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
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, icon, link }) => {
  return (
    <Link to={link} className="block">
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="mt-4 text-blue-600 font-medium">Learn more →</div>
      </div>
    </Link>
  );
};

// Simple Integrations Page
const IntegrationsPage: React.FC = () => {
  const integrations = [
    { id: 'salesforce', name: 'Salesforce', icon: '🔹', category: 'CRM', status: 'Available' },
    { id: 'google', name: 'Google Workspace', icon: '🌐', category: 'Productivity', status: 'Available' },
    { id: 'slack', name: 'Slack', icon: '💬', category: 'Communication', status: 'Available' },
    { id: 'stripe', name: 'Stripe', icon: '💳', category: 'Payments', status: 'Available' },
    { id: 'github', name: 'GitHub', icon: '🐙', category: 'Developer', status: 'Available' },
    { id: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce', status: 'Available' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Available Integrations</h1>
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <span className="text-sm text-gray-500">{integration.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">{integration.status}</span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
          <Route path="/login" element={<LandingPage />} />
          <Route path="/register" element={<LandingPage />} />
          <Route path="/discover" element={<Dashboard />} />
          <Route path="/builder" element={<Dashboard />} />
          <Route path="/marketplace" element={<Dashboard />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/docs" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;