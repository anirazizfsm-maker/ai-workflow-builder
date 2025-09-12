import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  useAnalyticsOverview, 
  useTimeSavings, 
  useCostSavings, 
  useWorkflowPerformance 
} from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/useAppStore';
import BusinessInsights from './BusinessInsights';
import RealTimeUpdates from './RealTimeUpdates';
import { format } from 'date-fns';

const AnalyticsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPeriod, setSelectedPeriod, darkMode, toggleDarkMode } = useAppStore();
  const [period, setPeriod] = useState(selectedPeriod);
  
  const { data: overviewData, isLoading: overviewLoading } = useAnalyticsOverview(period);
  const { data: timeSavingsData, isLoading: timeSavingsLoading } = useTimeSavings(period);
  const { data: costSavingsData, isLoading: costSavingsLoading } = useCostSavings(period);
  const { data: workflowPerformanceData, isLoading: workflowPerformanceLoading } = useWorkflowPerformance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} min`;
    } else if (minutes < 1440) {
      return `${Math.round(minutes / 60)} hrs`;
    } else {
      return `${Math.round(minutes / 1440)} days`;
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare data for charts
  const timeSavingsChartData = timeSavingsData?.data?.data?.map((item: any) => ({
    ...item,
    timeSaved: parseFloat(item.timeSaved)
  })) || [];

  const costSavingsChartData = costSavingsData?.data?.data?.map((item: any) => ({
    ...item,
    costSaved: parseFloat(item.costSaved)
  })) || [];

  const workflowPerformanceChartData = workflowPerformanceData?.data?.data?.slice(0, 5).map((item: any, index: number) => ({
    ...item,
    name: item.workflowName.length > 20 ? `${item.workflowName.substring(0, 17)}...` : item.workflowName,
    timeSaved: parseFloat(item.totalTimeSaved),
    costSaved: parseFloat(item.totalCostSaved)
  })) || [];

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    setSelectedPeriod(newPeriod as 'day' | 'week' | 'month' | 'year');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">Track your workflow performance and business impact</p>
          </div>
          <div className="flex space-x-3">
            <select 
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button 
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Saved</p>
                {overviewLoading ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatTime(overviewData?.data?.data?.totalTimeSaved || 0)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cost Saved</p>
                {overviewLoading ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(overviewData?.data?.data?.totalCostSaved || 0)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Workflows Executed</p>
                {overviewLoading ? (
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {overviewData?.data?.data?.workflowsExecuted || 0}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                {overviewLoading ? (
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-semibold text-gray-900">
                    {overviewData?.data?.data?.successRate || 0}%
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Time Savings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Savings Over Time</h2>
            {timeSavingsLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSavingsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatTime(value)}
                  />
                  <Tooltip 
                    formatter={(value) => [formatTime(Number(value)), 'Time Saved']}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="timeSaved" 
                    name="Time Saved" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Cost Savings Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Savings Over Time</h2>
            {costSavingsLoading ? (
              <div className="h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costSavingsChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="period" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), 'Cost Saved']}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="costSaved" 
                    name="Cost Saved" 
                    fill="#10B981" 
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Performing Workflows */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Workflows</h2>
            <button 
              onClick={() => navigate('/workflows')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All Workflows
            </button>
          </div>
          {workflowPerformanceLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {workflowPerformanceData?.data?.data?.slice(0, 5).map((workflow: any) => (
                <div 
                  key={workflow.workflowId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/analytics/workflow/${workflow.workflowId}`)}
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{workflow.workflowName}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>{workflow.executionCount} executions</span>
                      <span className="mx-2">•</span>
                      <span>{workflow.successRate.toFixed(1)}% success rate</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Time Saved</p>
                      <p className="font-medium text-gray-900">{formatTime(workflow.totalTimeSaved)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Cost Saved</p>
                      <p className="font-medium text-gray-900">{formatCurrency(workflow.totalCostSaved)}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
              {workflowPerformanceData?.data?.data?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No workflow performance data available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Execution Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Successful Executions</span>
                {overviewLoading ? (
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-green-600">
                    {overviewData?.data?.data?.successfulExecutions || 0}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed Executions</span>
                {overviewLoading ? (
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-red-600">
                    {overviewData?.data?.data?.failedExecutions || 0}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Workflows</span>
                {overviewLoading ? (
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-blue-600">
                    {overviewData?.data?.data?.activeWorkflows || 0}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">ROI Insights</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Monthly ROI</span>
                {overviewLoading ? (
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-purple-600">
                    {((overviewData?.data?.data?.totalCostSaved || 0) * 12).toLocaleString()}%
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Time per Execution</span>
                {overviewLoading ? (
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-gray-900">
                    {formatTime(5)} {/* Mock data */}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Automation Efficiency</span>
                {overviewLoading ? (
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="font-semibold text-green-600">
                    {(overviewData?.data?.data?.successRate || 0) > 90 ? 'High' : 'Medium'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Business Insights and Real-time Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <BusinessInsights />
          </div>
          <div>
            <RealTimeUpdates />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;