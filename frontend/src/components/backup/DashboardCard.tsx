import React from 'react';
import { Link } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  badge?: string;
  stat?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  link,
  badge,
  stat
}) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden h-full agency-card transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 transition-transform duration-300 group-hover:scale-110">
              <span className="text-xl">{icon}</span>
            </div>
            {badge && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 agency-badge">
                {badge}
              </span>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              {description}
            </p>
          </div>
          
          {stat && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-900 agency-stat">{stat}</span> active
              </p>
            </div>
          )}
          
          <div className="mt-4 flex items-center text-blue-600 text-sm font-medium transition-transform duration-200 group-hover:translate-x-1">
            <span>Learn more</span>
            <svg className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardCard;