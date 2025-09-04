"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// Execution Broker for n8n integration
// In production, this would connect to N8N_HOST with N8N_API_KEY
// For demo, we simulate the n8n workflow import process

export const importN8n = internalAction({
  args: {
    orgId: v.string(),
    workflowId: v.string(),
    template: v.object({
      templateId: v.string(),
      name: v.string(),
      description: v.string(),
      params: v.record(v.string(), v.string()),
      steps: v.array(v.string()),
    }),
    params: v.record(v.string(), v.string()),
  },
  handler: async (ctx, args) => {
    // Simulate n8n workflow creation
    // In production:
    // 1. Map credential placeholders like {{gmail_credential_id}} to actual credentials
    // 2. POST to N8N_HOST/api/v1/workflows with workflow JSON
    // 3. Handle authentication with N8N_API_KEY
    // 4. Return actual n8n workflow ID

    console.log(`Importing workflow to n8n for org ${args.orgId}`);
    console.log(`Template: ${args.template.name}`);
    console.log(`Parameters:`, args.params);

    // Simulate credential mapping
    const mappedParams = { ...args.params };
    for (const [key, value] of Object.entries(args.template.params)) {
      if (value.includes('{{') && value.includes('}}')) {
        console.log(`Would map credential placeholder: ${value}`);
        // In production: fetch from credentials table and decrypt
        mappedParams[key] = `mapped_${value.replace(/[{}]/g, '')}`;
      }
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate fake n8n workflow ID
    const n8nWorkflowId = `n8n_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      n8nWorkflowId,
      status: "imported",
      logs: [
        "Workflow validation passed",
        "Credentials mapped successfully", 
        "Workflow imported to n8n",
        `Generated n8n ID: ${n8nWorkflowId}`
      ],
    };
  },
});

export const healthCheck = internalAction({
  args: {
    n8nWorkflowId: v.string(),
  },
  handler: async (ctx, args) => {
    // Simulate n8n health check
    // In production: GET N8N_HOST/api/v1/workflows/:id/status
    
    console.log(`Health checking n8n workflow: ${args.n8nWorkflowId}`);
    
    // Simulate random success/failure for demo
    const isHealthy = Math.random() > 0.1; // 90% success rate
    
    return {
      workflowId: args.n8nWorkflowId,
      status: isHealthy ? "healthy" : "error",
      lastCheck: Date.now(),
      message: isHealthy ? "Workflow is running normally" : "Workflow needs attention",
    };
  },
});
