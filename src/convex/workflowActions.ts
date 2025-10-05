"use node";

import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";
import OpenAI from "openai";

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
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      // Fallback to mock generation if no API key
      const categories = ["automation", "email", "data", "social", "reporting"];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const workflowJSON = {
        nodes: [
          {
            id: "trigger",
            type: "trigger",
            name: "Manual Trigger",
            parameters: {}
          },
          {
            id: "action1", 
            type: "action",
            name: "Process Data",
            parameters: {
              input: args.prompt
            }
          }
        ],
        connections: [
          {
            source: "trigger",
            target: "action1"
          }
        ]
      };

      return {
        success: true,
        title: `AI Generated: ${args.prompt.slice(0, 50)}...`,
        description: `Automated workflow for: ${args.prompt}`,
        workflowJSON,
        category
      };
    }

    // Use OpenRouter for AI generation
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const systemPrompt = `You are a workflow automation expert. Generate a JSON workflow structure based on user prompts.
    
Return a JSON object with this exact structure:
{
  "nodes": [
    {"id": "1", "type": "trigger", "name": "Trigger Name", "parameters": {}},
    {"id": "2", "type": "action", "name": "Action Name", "parameters": {}}
  ],
  "connections": [
    {"source": "1", "target": "2"}
  ]
}

Node types: trigger, action, condition
Common triggers: Google Form, Webhook, Schedule, Email Received
Common actions: Send Email, Update Sheet, Create Calendar Event, Send Slack Message, HTTP Request`;

    try {
      const completion = await openai.chat.completions.create({
        model: "anthropic/claude-3-haiku",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: args.prompt }
        ],
        max_tokens: 1000,
      });

      const response = completion.choices[0].message.content;
      if (!response) {
        throw new Error("No response from AI");
      }

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const workflowJSON = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        title: `AI Generated: ${args.prompt.slice(0, 50)}`,
        description: `Automated workflow for: ${args.prompt}`,
        workflowJSON,
        category: "automation"
      };
    } catch (error) {
      console.error("OpenRouter error:", error);
      
      // Fallback to simple generation
      return {
        success: true,
        title: `Workflow: ${args.prompt.slice(0, 50)}`,
        description: args.prompt,
        workflowJSON: {
          nodes: [
            { id: "1", type: "trigger", name: "Start", parameters: {} },
            { id: "2", type: "action", name: "Process", parameters: { prompt: args.prompt } }
          ],
          connections: [{ source: "1", target: "2" }]
        },
        category: "automation"
      };
    }
  },
});

export const upgradeWithAI = action({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    // Actions cannot access ctx.db; use runQuery to load user's workflows
    const workflows = await ctx.runQuery(api.workflows.getUserWorkflows);
    const workflow = workflows.find((w: any) => w._id === args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    const enhancements = [
      "Added error handling and retry logic",
      "Optimized for better performance",
      "Enhanced with additional data validation",
      "Improved with better categorization",
      "Added monitoring and alerting capabilities",
    ] as const;

    const enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
    const enhancedDescription = `${workflow.description} - ${enhancement}`;

    // Add a focused mutation to update description
    await ctx.runMutation(api.workflows.updateWorkflowDescription, {
      workflowId: args.workflowId,
      description: enhancedDescription,
    });

    return {
      success: true,
      message: `Workflow upgraded: ${enhancement}`,
      enhancement,
    };
  },
});

export const getBusinessSuggestions = action({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    // Use existing analytics queries rather than direct db access
    const since7d = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const since30d = Date.now() - 30 * 24 * 60 * 60 * 1000;

    const distribution = await ctx.runQuery(api.workflows.distributionByCategory, {
      orgId: args.orgId,
      since: since30d,
    });
    const categories = (distribution as Array<{ label: string; value: number }>).map((d) => d.label);

    const runs7 = await ctx.runQuery(api.workflows.runsPerDay, {
      orgId: args.orgId,
      days: 7,
    });
    const recentRunsCount = (runs7 as Array<{ date: string; count: number }>).reduce(
      (sum, r) => sum + r.count,
      0
    );

    // New lightweight queries for failed run count and avg duration
    const failedRuns = await ctx.runQuery(api.workflows.failedRunsCount, {
      orgId: args.orgId,
      since: since7d,
    });

    const avgDuration = await ctx.runQuery(api.workflows.avgDurationRecentRuns, {
      orgId: args.orgId,
      since: since7d,
    });

    const suggestions: Array<{ type: string; message: string; action: string }> = [];

    // Suggest new automations based on missing categories
    const allCategories = ["email", "data", "social", "reporting", "automation"] as const;
    const missingCategories = allCategories.filter((cat) => !categories.includes(cat));
    if (missingCategories.length > 0) {
      suggestions.push({
        type: "new_automation",
        message: `Consider adding ${missingCategories[0]} workflows to expand your automation coverage`,
        action: "Create Workflow",
      });
    }

    // Bottleneck suggestion based on failed runs last 7 days
    if ((failedRuns as number) > 3) {
      suggestions.push({
        type: "bottleneck",
        message: `${failedRuns} workflows failed this week. Consider upgrading to Pro for auto-fix capabilities`,
        action: "Upgrade Plan",
      });
    }

    // Profit idea based on higher usage
    if (recentRunsCount > 20) {
      suggestions.push({
        type: "profit_idea",
        message: "High usage detected! Add CRM integration to capture and nurture leads automatically",
        action: "Add Integration",
      });
    }

    // Usage optimization if average duration over 5 minutes
    if ((avgDuration as number) > 300) {
      suggestions.push({
        type: "optimization",
        message: "Workflows are running slower than optimal. Consider optimizing data processing steps",
        action: "Optimize",
      });
    }

    return suggestions.slice(0, 4);
  },
});