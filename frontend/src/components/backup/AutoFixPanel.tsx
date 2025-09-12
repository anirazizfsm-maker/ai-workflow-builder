import React, { useState } from 'react';
import { 
  useDiagnoseError, 
  useSuggestFix, 
  useAutoRepair 
} from '../hooks/useApi';

interface AutoFixPanelProps {
  workflowId: string;
  error?: any;
  onClose: () => void;
}

const AutoFixPanel: React.FC<AutoFixPanelProps> = ({ workflowId, error, onClose }) => {
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [isAutoRepairing, setIsAutoRepairing] = useState(false);
  const [repairResult, setRepairResult] = useState<any>(null);
  
  const diagnoseMutation = useDiagnoseError();
  const suggestMutation = useSuggestFix();
  const autoRepairMutation = useAutoRepair();

  const handleDiagnose = () => {
    if (!error) return;
    
    diagnoseMutation.mutate(
      { workflowId, error },
      {
        onSuccess: (data) => {
          setDiagnosis(data.data);
        },
        onError: (error: any) => {
          console.error('Diagnosis failed:', error);
        }
      }
    );
  };

  const handleSuggestFix = () => {
    if (!error) return;
    
    suggestMutation.mutate(
      { workflowId, error },
      {
        onSuccess: (data) => {
          setSuggestion(data.data);
        },
        onError: (error: any) => {
          console.error('Suggestion failed:', error);
        }
      }
    );
  };

  const handleAutoRepair = () => {
    if (!error) return;
    
    setIsAutoRepairing(true);
    
    autoRepairMutation.mutate(
      { workflowId, error },
      {
        onSuccess: (data) => {
          setRepairResult(data.data);
          setIsAutoRepairing(false);
        },
        onError: (error: any) => {
          console.error('Auto-repair failed:', error);
          setRepairResult({ success: false, message: error.message });
          setIsAutoRepairing(false);
        }
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Auto-Fix Workflow Error</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Error Details</h3>
          <div className="mt-2 text-sm text-red-700">
            <p><strong>Message:</strong> {error.message}</p>
            {error.code && <p><strong>Code:</strong> {error.code}</p>}
            {error.node && <p><strong>Node:</strong> {error.node}</p>}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Diagnosis Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">1. Diagnose Error</h3>
            <button
              onClick={handleDiagnose}
              disabled={diagnoseMutation.isPending || !error}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {diagnoseMutation.isPending ? 'Diagnosing...' : 'Diagnose'}
            </button>
          </div>
          
          {diagnoseMutation.isPending && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing error...
            </div>
          )}
          
          {diagnosis && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800"><strong>Diagnosis:</strong> {diagnosis.diagnosis}</p>
              <p className="text-sm text-blue-800 mt-1"><strong>Confidence:</strong> {diagnosis.confidence}%</p>
            </div>
          )}
        </div>

        {/* Suggestion Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">2. Suggest Fix</h3>
            <button
              onClick={handleSuggestFix}
              disabled={suggestMutation.isPending || !error || !diagnosis}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {suggestMutation.isPending ? 'Suggesting...' : 'Suggest Fix'}
            </button>
          </div>
          
          {suggestMutation.isPending && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating fix suggestions...
            </div>
          )}
          
          {suggestion && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800"><strong>Suggested Fix:</strong> {suggestion.fix}</p>
              <p className="text-sm text-green-800 mt-1"><strong>Estimated Time:</strong> {suggestion.estimatedTime} minutes</p>
              {suggestion.requiresUserAction && (
                <p className="text-sm text-yellow-800 mt-1"><strong>Action Required:</strong> {suggestion.userInstructions}</p>
              )}
            </div>
          )}
        </div>

        {/* Auto-Repair Section */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">3. Auto-Repair</h3>
            <button
              onClick={handleAutoRepair}
              disabled={isAutoRepairing || !error || !suggestion}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isAutoRepairing ? 'Repairing...' : 'Auto-Repair'}
            </button>
          </div>
          
          {isAutoRepairing && (
            <div className="mt-3 flex items-center text-sm text-gray-500">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying fix...
            </div>
          )}
          
          {repairResult && (
            <div className={`mt-3 p-3 rounded-lg ${repairResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm ${repairResult.success ? 'text-green-800' : 'text-red-800'}`}>
                <strong>Result:</strong> {repairResult.message}
              </p>
              {repairResult.success && repairResult.timeSaved && (
                <p className="text-sm text-green-800 mt-1">
                  <strong>Time Saved:</strong> {repairResult.timeSaved} minutes
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AutoFixPanel;