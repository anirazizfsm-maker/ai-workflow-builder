import React from 'react';
import { Link } from 'react-router-dom';
import ProfessionalStyling from './ProfessionalStyling';

const MarketingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalStyling />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-white text-blue-600 font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center">
                  L
                </div>
                <div>
                  <h1 className="text-xl font-bold">Lethimdo</h1>
                  <p className="text-xs text-blue-200">Professional API Integration Platform</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-medium hover:text-blue-200 transition-colors">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              <span>🇧🇩 Built for Bangladesh Freelance Agencies</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Earn in USD. Save 90%. <br />Compete Globally.
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional API integration platform that helps Bangladesh freelance agencies deliver world-class services to international clients while maintaining a 90% cost advantage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 font-semibold transition-all shadow-lg hover:shadow-xl agency-button text-lg"
              >
                Start Free Trial
              </Link>
              <Link 
                to="/docs" 
                className="px-8 py-4 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 font-semibold transition-colors agency-button text-lg"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Bangladesh Agencies Choose Lethimdo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional tools at a fraction of the cost to compete with Western agencies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">90% Cost Savings</h3>
              <p className="text-gray-600">
                Deliver the same professional services as Western agencies while keeping 90% of the costs in your pocket.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">150+ API Integrations</h3>
              <p className="text-gray-600">
                Connect with all the tools your international clients use including Salesforce, Stripe, Slack, and more.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">5x Faster Delivery</h3>
              <p className="text-gray-600">
                Pre-built integrations and automation tools help you deliver projects 5x faster than building from scratch.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">USD Earnings</h3>
              <p className="text-gray-600">
                Work with international clients and earn in USD while operating from Bangladesh.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Security</h3>
              <p className="text-gray-600">
                Enterprise-grade security features to protect both your business and your clients' data.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scalable Growth</h3>
              <p className="text-gray-600">
                Start small and scale your operations without expensive infrastructure investments.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Stories */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories from Bangladesh Agencies
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how other Bangladesh freelance agencies are using Lethimdo to grow their business
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">TechSolutions BD</h3>
                  <p className="text-gray-600">Dhaka, Bangladesh</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Lethimdo helped us win a $15,000 contract with a US client by demonstrating professional API integration capabilities. We delivered the project in 2 weeks instead of 2 months, saving our client time and money."
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5/5 stars</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">DigitalNomad BD</h3>
                  <p className="text-gray-600">Chittagong, Bangladesh</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "We've been able to increase our rates by 300% since using Lethimdo. Our clients are impressed by the professional dashboard and seamless integrations. The 90% cost savings means we're making more profit while charging less than Western agencies."
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5/5 stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Freelance Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Bangladesh freelance agencies using Lethimdo to earn in USD and save 90% on costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors agency-button text-lg"
            >
              Start Free 14-Day Trial
            </Link>
            <Link 
              to="/docs" 
              className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold transition-colors agency-button text-lg"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center">
                  L
                </div>
                <span className="text-xl font-bold">Lethimdo</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Professional API integration platform built for Bangladesh freelance agencies to compete globally while saving costs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li><Link to="/integrations" className="text-base text-gray-300 hover:text-white">Integrations</Link></li>
                <li><Link to="/discover" className="text-base text-gray-300 hover:text-white">Auto-Discovery</Link></li>
                <li><Link to="/builder" className="text-base text-gray-300 hover:text-white">Custom Builder</Link></li>
                <li><Link to="/marketplace" className="text-base text-gray-300 hover:text-white">Marketplace</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li><Link to="/docs" className="text-base text-gray-300 hover:text-white">Documentation</Link></li>
                <li><Link to="/test-api" className="text-base text-gray-300 hover:text-white">API Testing</Link></li>
                <li><a href="mailto:support@lethimdo.com" className="text-base text-gray-300 hover:text-white">Email Support</a></li>
                <li><a href="#" className="text-base text-gray-300 hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              &copy; 2024 Lethimdo. Professional API Integration Platform for Bangladesh Freelance Agencies.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/docs" className="text-base text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link to="/docs" className="text-base text-gray-400 hover:text-white">Terms of Service</Link>
            </div>
          </div>
          
          {/* Bangladesh Agency Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-full">
              <span className="mr-2">🇧🇩</span>
              <span>Proudly Serving Bangladesh Freelance Agencies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingPage;