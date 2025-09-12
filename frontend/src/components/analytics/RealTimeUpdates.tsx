import React, { useState, useEffect } from 'react';
import { useSocketListener } from '../../hooks/useSocket';
import { useWorkflowPerformance } from '../../hooks/useApi';

const RealTimeUpdates: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { data: workflowPerformanceData, refetch } = useWorkflowPerformance();

  // Listen for workflow execution updates
  useSocketListener('workflow-execution-update', (data) => {
    const newNotification = {
      id: Date.now(),
      type: 'execution',
      message: `Workflow "${data.workflowName}" executed successfully`,
      timestamp: new Date(),
      data
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // Refetch workflow performance data to update charts
    refetch();
  });

  // Listen for workflow status changes
  useSocketListener('workflow-status-change', (data) => {
    const newNotification = {
      id: Date.now(),
      type: 'status',
      message: `Workflow "${data.workflowName}" status changed to ${data.status}`,
      timestamp: new Date(),
      data
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  });

  // Listen for analytics updates
  useSocketListener('analytics-update', (data) => {
    const newNotification = {
      id: Date.now(),
      type: 'analytics',
      message: 'Analytics data updated',
      timestamp: new Date(),
      data
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // Refetch workflow performance data to update charts
    refetch();
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'execution': return 'bg-green-100 text-green-800';
      case 'status': return 'bg-blue-100 text-blue-800';
      case 'analytics': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Real-time Updates</h2>
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p>No recent updates</p>
            <p className="text-sm mt-1">Real-time updates will appear here</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className="flex items-start p-3 rounded-lg border border-gray-200"
            >
              <div className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded ${getNotificationColor(notification.type)}`}>
                {notification.type.toUpperCase()}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(notification.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <svg className="h-4 w-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
          <span>Connected to real-time updates</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeUpdates;