"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Execute a workflow run
export const executeWorkflow = internalAction({
  args: {
    workflowId: v.id("workflows"),
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; runId: Id<"workflowRuns"> }> => {
    // Get workflow and its nodes/edges
      const workflow = await ctx.runQuery(internal.workflowRunnerHelpers.getWorkflowData, {
      workflowId: args.workflowId,
    });

    if (!workflow || workflow.status !== "active") {
      throw new Error("Workflow is not active");
    }

    // Create a run record
    const runId: Id<"workflowRuns"> = await ctx.runMutation(internal.workflowRunnerHelpers.createRun, {
      workflowId: args.workflowId,
      orgId: workflow.userId, // Using userId as orgId for now
    });

    try {
      // Parse the workflow JSON config
      const config = JSON.parse(workflow.jsonConfig);
      const nodes = config.nodes || [];
      const edges = config.edges || [];

      // Find trigger node
      const triggerNode = nodes.find((n: any) => n.type === "trigger");
      if (!triggerNode) {
        throw new Error("No trigger node found");
      }

      // Execute workflow starting from trigger
      await executeNodeChain(ctx, {
        nodes,
        edges,
        currentNodeId: triggerNode.id,
        inputData: {},
        runId,
        visited: new Set(),
      });

      // Mark run as successful
      await ctx.runMutation(internal.workflowRunnerHelpers.updateRunStatus, {
        runId,
        status: "success",
      });

      return { success: true, runId };
    } catch (error: any) {
      // Mark run as failed
      await ctx.runMutation(internal.workflowRunnerHelpers.updateRunStatus, {
        runId,
        status: "failed",
        error: error.message,
      });

      throw error;
    }
  },
});

// Helper to execute a chain of nodes
async function executeNodeChain(
  ctx: any,
  params: {
    nodes: any[];
    edges: any[];
    currentNodeId: string;
    inputData: any;
    runId: any;
    visited: Set<string>;
  }
) {
  const { nodes, edges, currentNodeId, inputData, runId, visited } = params;

  // Prevent infinite loops
  if (visited.has(currentNodeId)) {
    return;
  }
  visited.add(currentNodeId);

  // Find current node
  const node = nodes.find((n: any) => n.id === currentNodeId);
  if (!node) {
    return;
  }

  // Execute the node
  const output = await executeNode(ctx, { node, inputData, runId });

  // Find outgoing edges
  const outgoingEdges = edges.filter((e: any) => e.source === currentNodeId);

  // Execute next nodes
  for (const edge of outgoingEdges) {
    await executeNodeChain(ctx, {
      nodes,
      edges,
      currentNodeId: edge.target,
      inputData: output,
      runId,
      visited,
    });
  }
}

// Execute a single node
async function executeNode(
  ctx: any,
  params: { node: any; inputData: any; runId: any }
) {
  const { node, inputData, runId } = params;

  // Log node execution
  await ctx.runMutation(internal.workflowRunnerHelpers.addLog, {
    runId,
    message: `Executing ${node.data?.label || node.type}`,
  });

  try {
    let output = {};

    switch (node.type) {
      case "trigger":
        output = await executeTrigger(node, inputData);
        break;
      case "action":
        output = await executeAction(node, inputData);
        break;
      case "condition":
        output = await executeCondition(node, inputData);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    await ctx.runMutation(internal.workflowRunnerHelpers.addLog, {
      runId,
      message: `✅ ${node.data?.label || node.type} completed`,
    });

    return output;
  } catch (error: any) {
    await ctx.runMutation(internal.workflowRunnerHelpers.addLog, {
      runId,
      message: `❌ ${node.data?.label || node.type} failed: ${error.message}`,
    });
    throw error;
  }
}

// Node execution handlers
async function executeTrigger(node: any, inputData: any) {
  // Simulated trigger - returns mock data
  return {
    formData: {
      name: "Test User",
      email: "test@example.com",
      timestamp: Date.now(),
    },
  };
}

async function executeAction(node: any, inputData: any) {
  // Simulated action - logs the action
  const params = node.data?.parameters || {};
  return {
    ...inputData,
    actionResult: `Executed ${node.data?.label}`,
    parameters: params,
  };
}

async function executeCondition(node: any, inputData: any) {
  // Simulated condition - always passes
  const params = node.data?.parameters || {};
  return {
    ...inputData,
    conditionMet: true,
    parameters: params,
  };
}