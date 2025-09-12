# OpenAI Integration Implementation Guide

## Overview
This guide outlines how to integrate OpenAI capabilities into the Lethimdo platform to enhance workflow automation and provide AI-powered features.

## Implementation Plan

### 1. Backend Integration

#### Install Required Packages
```bash
npm install openai
```

#### Create OpenAI Service
Create `backend/src/services/openaiService.js`:

```javascript
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateWorkflow = async (description, businessContext = '') => {
  try {
    const prompt = `
      Create a workflow JSON structure based on this description:
      "${description}"
      
      Business Context: ${businessContext || 'General business automation'}
      
      The workflow should include:
      1. Appropriate trigger nodes
      2. Action nodes for the described functionality
      3. Error handling where appropriate
      4. Logical flow connections
      
      Return ONLY valid JSON in this format:
      {
        "name": "Generated Workflow Name",
        "description": "Brief description",
        "nodes": [
          {
            "id": "node-1",
            "type": "trigger",
            "name": "Trigger Name",
            "parameters": {},
            "position": [100, 100]
          }
        ],
        "connections": [
          {
            "source": "node-1",
            "target": "node-2"
          }
        ],
        "estimatedTimeSavings": 30,
        "estimatedCostSavings": 50
      }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: process.env.OPENAI_MAX_TOKENS || 2000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate workflow with AI');
  }
};

export const analyzeWorkflow = async (workflowData) => {
  try {
    const prompt = `
      Analyze this workflow and provide optimization suggestions:
      
      Workflow: ${JSON.stringify(workflowData, null, 2)}
      
      Please provide:
      1. Potential optimizations
      2. Error handling improvements
      3. Performance suggestions
      4. Security considerations
      
      Return ONLY valid JSON in this format:
      {
        "optimizations": ["suggestion 1", "suggestion 2"],
        "errorHandling": ["improvement 1", "improvement 2"],
        "performance": ["suggestion 1", "suggestion 2"],
        "security": ["consideration 1", "consideration 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze workflow with AI');
  }
};

export const generateDocumentation = async (workflowData) => {
  try {
    const prompt = `
      Generate comprehensive documentation for this workflow:
      
      Workflow: ${JSON.stringify(workflowData, null, 2)}
      
      Please provide:
      1. Overview of what the workflow does
      2. Step-by-step explanation of each node
      3. Configuration instructions
      4. Troubleshooting guide
      5. Best practices
      
      Format the response in Markdown.
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate documentation with AI');
  }
};
```

#### Update Environment Variables
Add to your backend `.env` file:
```
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
```

#### Update API Routes
Update your workflow routes to use OpenAI:

```javascript
// In your workflow routes file
import { generateWorkflow, analyzeWorkflow, generateDocumentation } from '../services/openaiService.js';

// Add new AI-powered endpoints
app.post('/api/workflows/generate', async (req, res) => {
  try {
    const { description, businessContext } = req.body;
    const workflow = await generateWorkflow(description, businessContext);
    res.json({ success: true, data: workflow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/workflows/:id/analyze', async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch workflow from database
    const workflow = await getWorkflowById(id);
    const analysis = await analyzeWorkflow(workflow);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/workflows/:id/documentation', async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch workflow from database
    const workflow = await getWorkflowById(id);
    const documentation = await generateDocumentation(workflow);
    res.json({ success: true, data: documentation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 2. Frontend Integration

#### Update WorkflowBuilder Component
Enhance the existing WorkflowBuilder to use the new AI features:

```tsx
// In src/components/WorkflowBuilder.tsx
// Update the handleGenerateWorkflow function:

const handleGenerateWorkflow = () => {
  if (!description.trim()) return;
  
  setIsGenerating(true);
  
  // Use the new AI endpoint
  generateWorkflowMutation.mutate(
    { description, businessContext },
    {
      onSuccess: (data) => {
        // Handle the AI-generated workflow
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

// Add new AI analysis feature
const handleAnalyzeWorkflow = () => {
  if (!activeWorkflow?.id) return;
  
  analyzeWorkflowMutation.mutate(
    activeWorkflow.id,
    {
      onSuccess: (data) => {
        // Display analysis results in a modal or panel
        setAnalysisResults(data.data);
        setShowAnalysis(true);
      },
      onError: (error: any) => {
        console.error('Workflow analysis failed:', error);
      }
    }
  );
};
```

#### Add AI Analysis Panel
Create a new component for displaying AI analysis:

```tsx
// src/components/workflow-builder/AIAnalysisPanel.tsx
import React from 'react';

interface AIAnalysisPanelProps {
  analysis: any;
  onClose: () => void;
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Workflow Analysis</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Optimizations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.optimizations.map((opt: string, index: number) => (
                  <li key={index} className="text-gray-700">{opt}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Error Handling</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.errorHandling.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.performance.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Security</h4>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.security.map((item: string, index: number) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;
```

### 3. Enhanced Features with OpenAI

#### Natural Language Workflow Creation
Allow users to describe workflows in plain English:

```tsx
// Add to WorkflowBuilder component
const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

// In the AI section of the right panel:
<div>
  <label htmlFor="natural-language" className="block text-sm font-medium text-gray-700">
    Describe Your Workflow
  </label>
  <textarea
    id="natural-language"
    rows={4}
    value={naturalLanguageInput}
    onChange={(e) => setNaturalLanguageInput(e.target.value)}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    placeholder="e.g., When a new customer signs up, send them a welcome email and add them to our Google Sheet"
  />
  <button
    onClick={() => handleGenerateWorkflow()}
    disabled={isGenerating || !naturalLanguageInput.trim()}
    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
  >
    {isGenerating ? 'Generating...' : 'Create Workflow with AI'}
  </button>
</div>
```

#### AI-Powered Workflow Documentation
Generate documentation for workflows:

```tsx
// Add to WorkflowsPage component
const handleGenerateDocumentation = async (workflowId: string) => {
  try {
    const response = await fetch(`/api/workflows/${workflowId}/documentation`);
    const data = await response.json();
    
    // Display documentation in a modal
    setDocumentation(data.data);
    setShowDocumentation(true);
  } catch (error) {
    console.error('Failed to generate documentation:', error);
  }
};
```

## Benefits for Bangladesh Freelance Agencies
1. **Increased Productivity**: AI assistance speeds up workflow creation
2. **Better Quality**: AI analysis identifies optimization opportunities
3. **Professional Documentation**: Automatically generated workflow docs
4. **Competitive Advantage**: Cutting-edge AI features impress clients
5. **Reduced Development Time**: Less manual coding required

## Cost Considerations
1. **OpenAI API Costs**: Based on usage (typically $0.03-0.06 per 1K tokens)
2. **Implementation Time**: 2-3 days for basic integration
3. **Ongoing Maintenance**: Minimal once implemented

## Security Best Practices
1. Never expose API keys in frontend code
2. Implement rate limiting to prevent abuse
3. Validate all AI-generated content before applying
4. Log API usage for monitoring
5. Implement proper error handling

## Next Steps
1. Obtain OpenAI API key
2. Implement backend OpenAI service
3. Update API routes with AI endpoints
4. Enhance frontend components with AI features
5. Test thoroughly with sample workflows
6. Monitor usage and costs