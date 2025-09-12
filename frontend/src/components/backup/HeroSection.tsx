import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <span>🚀 Professional API Integration Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Connect Any API in Minutes, Not Days
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Professional API integration platform built for Bangladesh freelance agencies to deliver world-class services to international clients while saving 90% on costs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 font-semibold transition-all shadow-lg hover:shadow-xl agency-button"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/docs" 
                className="px-8 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-semibold transition-colors agency-button"
              >
                View Documentation
              </Link>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>No credit card required • 14-day free trial • Cancel anytime</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-gray-500">Dashboard</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <span>🔌</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Salesforce</div>
                      <div className="text-sm text-gray-500">Connected</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <span>💳</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Stripe</div>
                      <div className="text-sm text-gray-500">Connected</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <span>💬</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Slack</div>
                      <div className="text-sm text-gray-500">Connected</div>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active Integrations</span>
                  <span className="font-medium text-gray-900">24</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;