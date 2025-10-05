import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Internal queries and mutations (V8 runtime)
export const getWorkflowData = internalQuery({
  args: { workflowId: v.id("workflows") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workflowId);
  },
});

export const createRun = internalMutation({
  args: {
    workflowId: v.id("workflows"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workflowRuns", {
      workflowId: args.workflowId,
      orgId: args.orgId,
      status: "running",
      category: "automation",
      durationSec: 0,
      startedAt: Date.now(),
    });
  },
});

export const updateRunStatus = internalMutation({
  args: {
    runId: v.id("workflowRuns"),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("running")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.runId);
    if (!run) return;

    const durationSec = (Date.now() - (run.startedAt || Date.now())) / 1000;

    await ctx.db.patch(args.runId, {
      status: args.status,
      durationSec,
      ...(args.error && { error: args.error }),
    });
  },
});

export const addLog = internalMutation({
  args: {
    runId: v.id("workflowRuns"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // For now, just log to console
    // In production, you'd store logs in a separate table
    console.log(`[Run ${args.runId}] ${args.message}`);
  },
});
