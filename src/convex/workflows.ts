import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const createWorkflow = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    prompt: v.string(),
    jsonConfig: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    return await ctx.db.insert("workflows", {
      userId: user._id,
      title: args.title,
      description: args.description,
      prompt: args.prompt,
      jsonConfig: args.jsonConfig,
      status: "draft" as const,
      category: args.category,
      isPublic: false,
    });
  },
});

export const getUserWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    return await ctx.db
      .query("workflows")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getPublicWorkflows = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("workflows")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .take(20);
  },
});

export const updateWorkflowStatus = mutation({
  args: {
    workflowId: v.id("workflows"),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found or unauthorized");
    }

    return await ctx.db.patch(args.workflowId, {
      status: args.status,
    });
  },
});

export const deleteWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow || workflow.userId !== user._id) {
      throw new Error("Workflow not found or unauthorized");
    }

    return await ctx.db.delete(args.workflowId);
  },
});
