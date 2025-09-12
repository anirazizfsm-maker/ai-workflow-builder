import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description,
  highlight = false
}) => {
  return (
    <div className={`rounded-xl p-6 transition-all duration-200 ${
      highlight 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm' 
        : 'bg-white border border-gray-100 shadow-sm'
    } hover:shadow-md`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
        <span className="text-xl">{icon}</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🔌',
      title: '150+ Pre-Built Integrations',
      description: 'Ready-to-use integrations for Salesforce, Google, Slack, Stripe, and more popular services with one-click setup.',
    },
    {
      icon: '🔍',
      title: 'Auto-Discovery',
      description: 'Paste any API URL and let Lethimdo automatically discover and configure the integration with zero coding required.',
      highlight: true
    },
    {
      icon: '🛠️',
      title: 'Custom Builder',
      description: 'Visual integration builder for custom APIs with authentication, endpoint configuration, and data mapping.',
    },
    {
      icon: '🏪',
      title: 'Community Marketplace',
      description: 'Browse, install, and share integrations created by the community with one-click setup and rating system.',
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Four Ways to Connect Any API
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Universal connectivity for every integration need of your Bangladesh freelance agency
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlight={feature.highlight}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Professional API Integration for Bangladesh Freelance Agencies
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Save 90% on development costs compared to Western agencies while delivering the same 
              professional API integration services to international clients.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$0</div>
                <div className="mt-1 text-sm text-gray-600">Initial Setup Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">150+</div>
                <div className="mt-1 text-sm text-gray-600">API Integrations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="mt-1 text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;