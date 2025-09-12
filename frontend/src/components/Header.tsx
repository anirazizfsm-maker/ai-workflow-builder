import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Lethimdo', subtitle = '' }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xl px-3 py-2 rounded">
                {title}
              </div>
            </Link>
            {subtitle && (
              <div className="ml-4 text-sm text-gray-500">{subtitle}</div>
            )}
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            <Link to="/integrations" className="text-gray-700 hover:text-blue-600 font-medium">
              Integrations
            </Link>
            <Link to="/workflows" className="text-gray-700 hover:text-blue-600 font-medium">
              Workflows
            </Link>
            <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">
              Analytics
            </Link>
          </nav>
          
          <div className="flex items-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;