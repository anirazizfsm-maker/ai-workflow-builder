import React, { useState, useRef, useEffect } from 'react';
import { useN8nNodes, useCreateWorkflow, useN8nWorkflow } from '../hooks/useApi';
import { useGenerateWorkflow } from '../hooks/useApi';
import { useAppStore } from '../stores/useAppStore';

const WorkflowBuilder: React.FC = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [description, setDescription] = useState('');
  const [businessContext, setBusinessContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { data: nodesData } = useN8nNodes();
  const createWorkflowMutation = useCreateWorkflow();
  const generateWorkflowMutation = useGenerateWorkflow();
  const { activeWorkflow } = useAppStore();

  // If there's an active workflow, load it
  const { data: workflowData } = useN8nWorkflow(activeWorkflow?.id || '');

  useEffect(() => {
    if (workflowData?.data?.data) {
      setWorkflowName(workflowData.data.data.name);
      setDescription(workflowData.data.data.description);
      // Load nodes and connections from workflow data
      if (workflowData.data.data.n8nWorkflow) {
        setNodes(workflowData.data.data.n8nWorkflow.nodes || []);
        setConnections(workflowData.data.data.n8nWorkflow.connections || []);
      }
    }
  }, [workflowData]);

  useEffect(() => {
    if (nodesData?.data?.data) {
      // Nodes are available for the node palette
    }
  }, [nodesData]);

  const handleGenerateWorkflow = () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    generateWorkflowMutation.mutate(
      { description, businessContext },
      {
        onSuccess: (data) => {
          setGeneratedWorkflow(data.data);
          setWorkflowName(data.data.name);
          setDescription(data.data.description);
          setNodes(data.data.nodes || []);
          setConnections(data.data.connections || []);
          setIsGenerating(false);
        },
        onError: (error: any) => {
          console.error('Workflow generation failed:', error);
          setIsGenerating(false);
        }
      }
    );
  };

  const handleSaveWorkflow = () => {
    if (!workflowName.trim()) return;
    
    const workflowData = {
      name: workflowName,
      description,
      naturalLanguageInput: description,
      n8nWorkflow: {
        nodes,
        connections
      },
      estimatedTimeSavings: generatedWorkflow?.estimatedTimeSavings || 0,
      estimatedCostSavings: generatedWorkflow?.estimatedCostSavings || 0
    };
    
    createWorkflowMutation.mutate(workflowData);
  };

  const handleAddNode = (nodeType: any) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType.type,
      name: nodeType.name,
      parameters: {},
      position: [100 + nodes.length * 50, 100 + nodes.length * 30]
    };
    
    setNodes([...nodes, newNode]);
  };

  const handleNodeClick = (node: any) => {
    setSelectedNode(node);
  };

  const handleNodeMove = (nodeId: string, position: [number, number]) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, position } : node
    ));
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
              <p className="mt-1 text-sm text-gray-500">Create and manage your automation workflows</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveWorkflow}
                disabled={createWorkflowMutation.isPending || !workflowName}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createWorkflowMutation.isPending ? 'Saving...' : 'Save Workflow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Node Palette */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Node Palette</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Core Nodes</h3>
                  <div className="space-y-2">
                    {nodesData?.data?.data?.filter((node: any) => node.category === 'Core Nodes').map((node: any) => (
                      <div 
                        key={node.type}
                        onClick={() => handleAddNode(node)}
                        className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{node.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Triggers</h3>
                  <div className="space-y-2">
                    {nodesData?.data?.data?.filter((node: any) => node.category === 'Triggers').map((node: any) => (
                      <div 
                        key={node.type}
                        onClick={() => handleAddNode(node)}
                        className="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100 border border-gray-200"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{node.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Canvas</h2>
              
              <div 
                ref={canvasRef}
                className="h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 relative overflow-hidden"
              >
                {nodes.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No nodes added</h3>
                      <p className="mt-1 text-sm text-gray-500">Drag nodes from the palette to get started</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full">
                    {nodes.map((node) => (
                      <div
                        key={node.id}
                        className={`absolute p-3 bg-white rounded-md shadow cursor-move border-2 ${
                          selectedNode?.id === node.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{
                          left: `${node.position[0]}px`,
                          top: `${node.position[1]}px`,
                          width: '150px'
                        }}
                        onClick={() => handleNodeClick(node)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                              <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                              </svg>
                            </div>
                            <div className="ml-2">
                              <p className="text-xs font-medium text-gray-900 truncate">{node.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(node.id);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Properties and AI */}
          <div className="lg:col-span-1 space-y-6">
            {/* Workflow Properties */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Properties</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="workflow-name" className="block text-sm font-medium text-gray-700">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter workflow name"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe what this workflow does"
                  />
                </div>
              </div>
            </div>
            
            {/* AI Workflow Generation */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Workflow Generation</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="ai-description" className="block text-sm font-medium text-gray-700">
                    Describe your workflow
                  </label>
                  <textarea
                    id="ai-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Send a welcome email when a new customer signs up and add them to a Google Sheet"
                  />
                </div>
                
                <div>
                  <label htmlFor="business-context" className="block text-sm font-medium text-gray-700">
                    Business Context (Optional)
                  </label>
                  <textarea
                    id="business-context"
                    rows={2}
                    value={businessContext}
                    onChange={(e) => setBusinessContext(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., E-commerce business, customer onboarding process"
                  />
                </div>
                
                <button
                  onClick={handleGenerateWorkflow}
                  disabled={isGenerating || !description.trim()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    'Generate Workflow'
                  )}
                </button>
              </div>
            </div>
            
            {/* Node Properties */}
            {selectedNode && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Node Properties</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Node Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNode.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Node ID
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedNode.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Parameters
                    </label>
                    <p className="mt-1 text-sm text-gray-500">Configure node-specific parameters here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;