# JSON UI Implementation Guide

## Overview
This guide outlines how to implement JSON UI design capabilities in the Lethimdo platform, allowing users to view, edit, and manage workflows using JSON format alongside the visual builder.

## Implementation Plan

### 1. Add JSON Editor Component
We'll integrate the Monaco Editor for JSON editing capabilities:

```bash
npm install @monaco-editor/react
```

### 2. Create JSON Editor Component
Create a new component `src/components/workflow-builder/JsonEditor.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onValidate: (markers: any[]) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  onSave, 
  onValidate 
}) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = () => {
    setIsEditorReady(true);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">JSON Editor</h3>
        <button
          onClick={onSave}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
      <div className="flex-1 border rounded-md overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            wordWrap: 'on',
            theme: 'vs-dark'
          }}
          onValidate={onValidate}
        />
      </div>
    </div>
  );
};

export default JsonEditor;
```

### 3. Enhance WorkflowBuilder with JSON Integration
Modify `src/components/WorkflowBuilder.tsx` to include JSON editing capabilities:

```tsx
// Add these imports at the top
import JsonEditor from './JsonEditor';

// Add to component state
const [jsonView, setJsonView] = useState(false);
const [workflowJson, setWorkflowJson] = useState('');

// Add useEffect to sync workflow data to JSON
useEffect(() => {
  const workflowData = {
    name: workflowName,
    description,
    nodes,
    connections
  };
  setWorkflowJson(JSON.stringify(workflowData, null, 2));
}, [workflowName, description, nodes, connections]);

// Add JSON validation handler
const handleJsonValidate = (markers: any[]) => {
  // Handle validation errors
};

// Add JSON save handler
const handleSaveJson = () => {
  try {
    const parsed = JSON.parse(workflowJson);
    setWorkflowName(parsed.name);
    setDescription(parsed.description);
    setNodes(parsed.nodes || []);
    setConnections(parsed.connections || []);
  } catch (error) {
    console.error('Invalid JSON:', error);
  }
};
```

### 4. Add Toggle Between Visual and JSON Views
In the WorkflowBuilder component, add a toggle button:

```tsx
<div className="flex items-center space-x-2 mb-4">
  <button
    onClick={() => setJsonView(false)}
    className={`px-4 py-2 rounded-md text-sm font-medium ${
      !jsonView 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    Visual Builder
  </button>
  <button
    onClick={() => setJsonView(true)}
    className={`px-4 py-2 rounded-md text-sm font-medium ${
      jsonView 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
  >
    JSON Editor
  </button>
</div>
```

### 5. Conditional Rendering
Replace the canvas section with conditional rendering:

```tsx
{jsonView ? (
  <JsonEditor
    value={workflowJson}
    onChange={setWorkflowJson}
    onSave={handleSaveJson}
    onValidate={handleJsonValidate}
  />
) : (
  // Existing canvas implementation
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Canvas</h2>
    {/* ... existing canvas code ... */}
  </div>
)}
```

## Benefits
1. **Flexibility**: Users can choose between visual and code-based workflow editing
2. **Advanced Control**: Power users can directly manipulate workflow JSON
3. **Integration**: Easy export/import of workflows as JSON files
4. **Debugging**: Direct access to workflow structure for troubleshooting
5. **Version Control**: JSON format works well with Git for workflow versioning

## Security Considerations
1. Validate JSON structure before applying changes
2. Sanitize user inputs to prevent injection attacks
3. Implement proper error handling for malformed JSON
4. Add user permissions for JSON editing (admin-only if needed)

## Performance Optimization
1. Debounce JSON parsing to prevent performance issues
2. Implement virtual scrolling for large JSON documents
3. Add syntax highlighting for better readability
4. Include auto-formatting for consistent JSON structure