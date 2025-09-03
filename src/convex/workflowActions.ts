"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

type WorkflowNode = {
  id: string;
  type: string;
  name: string;
  parameters: Record<string, unknown>;
};

type WorkflowTemplate = {
  nodes: WorkflowNode[];
  connections: { from: string; to: string }[];
};

export const generateWorkflowJSON = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    // Simulate AI workflow generation
    // In a real implementation, this would call OpenAI or another AI service
    
    const workflowTemplates: Record<string, WorkflowTemplate> = {
      "email": {
        nodes: [
          {
            id: "trigger",
            type: "webhook",
            name: "Webhook Trigger",
            parameters: {
              httpMethod: "POST",
              path: "/webhook"
            }
          },
          {
            id: "email",
            type: "email",
            name: "Send Email",
            parameters: {
              to: "{{$json.email}}",
              subject: "Welcome!",
              body: "Thank you for signing up!"
            }
          }
        ],
        connections: [
          {
            from: "trigger",
            to: "email"
          }
        ]
      },
      "report": {
        nodes: [
          {
            id: "schedule",
            type: "cron",
            name: "Daily Schedule",
            parameters: {
              cron: "0 9 * * *"
            }
          },
          {
            id: "data",
            type: "database",
            name: "Fetch Data",
            parameters: {
              query: "SELECT * FROM sales WHERE date = CURDATE()"
            }
          },
          {
            id: "report",
            type: "email",
            name: "Send Report",
            parameters: {
              to: "team@company.com",
              subject: "Daily Sales Report",
              body: "{{$json.report}}"
            }
          }
        ],
        connections: [
          {
            from: "schedule",
            to: "data"
          },
          {
            from: "data",
            to: "report"
          }
        ]
      }
    };

    // Simple keyword matching for demo
    let selectedTemplate: WorkflowTemplate = workflowTemplates.email;
    if (args.prompt.toLowerCase().includes("report") || args.prompt.toLowerCase().includes("daily")) {
      selectedTemplate = workflowTemplates.report;
    }

    return {
      success: true,
      workflowJSON: selectedTemplate,
      title: args.prompt.split(' ').slice(0, 4).join(' '),
      description: `Generated workflow: ${args.prompt}`,
    };
  },
});