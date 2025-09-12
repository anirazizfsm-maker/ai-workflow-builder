import React from 'react';
import { Link } from 'react-router-dom';

const AgencySection: React.FC = () => {
  return (
    <div className="agency-section fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Built for Bangladesh Freelance Agencies
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional API integration platform that helps you compete with Western agencies while saving 90% on costs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cost-Effective Solution</h3>
            <p className="text-gray-600">
              Save up to 90% compared to Western agencies. No expensive infrastructure or AI costs required.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">International Ready</h3>
            <p className="text-gray-600">
              Connect with 150+ popular APIs that your international clients already use every day.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">
              Deliver professional API integrations 5x faster with our pre-built connectors and automation tools.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Start Earning in USD Today
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of Bangladesh freelance agencies using Lethimdo to deliver professional API integration services to international clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 font-semibold transition-all agency-button"
              >
                Create Free Account
              </Link>
              <Link 
                to="/docs" 
                className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-semibold transition-colors agency-button"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencySection;