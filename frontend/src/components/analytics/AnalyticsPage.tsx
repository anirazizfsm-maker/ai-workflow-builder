import React from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import Header from '../Header';
import Footer from '../Footer';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Analytics" subtitle="Business intelligence and performance metrics" />
      <main className="flex-grow">
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;