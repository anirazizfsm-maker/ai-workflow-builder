import { v } from "convex/values";
import { query } from "./_generated/server";

// Admin dashboard queries for listing clients, workflows, invoices, and analytics

export const listWorkflowsByStatus = query({
  args: {
    orgId: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("paused"))),
  },
  handler: async (ctx, args) => {
    // Removed orgId filtering since workflows do not have orgId or a by_org index
    if (args.status) {
      const status = args.status;
      return await ctx.db
        .query("workflows")
        .withIndex("by_status", (q) => q.eq("status", status))
        .take(100);
    }
    return await ctx.db.query("workflows").take(100);
  },
});

export const listInvoices = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.orgId) {
      const orgId = args.orgId;
      return await ctx.db
        .query("invoices")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .take(50);
    }

    return await ctx.db.query("invoices").take(50);
  },
});

export const listChats = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.orgId) {
      const orgId = args.orgId;
      return await ctx.db
        .query("chatLogs")
        .withIndex("by_org", (q) => q.eq("orgId", orgId))
        .take(100);
    }

    return await ctx.db.query("chatLogs").take(100);
  },
});

export const getAnalytics = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get workflow counts by status
    const activeWorkflows = await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();

    const draftWorkflows = await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "draft"))
      .collect();

    const pausedWorkflows = await ctx.db
      .query("workflows")
      .withIndex("by_status", (q) => q.eq("status", "paused"))
      .collect();

    // Get invoice stats
    const paidInvoices = await ctx.db
      .query("invoices")
      .withIndex("by_status", (q) => q.eq("status", "paid"))
      .collect();

    const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amountCents, 0);

    return {
      workflows: {
        active: activeWorkflows.length,
        draft: draftWorkflows.length,
        paused: pausedWorkflows.length,
        total: activeWorkflows.length + draftWorkflows.length + pausedWorkflows.length,
      },
      billing: {
        paidInvoices: paidInvoices.length,
        totalRevenueCents: totalRevenue,
      },
    };
  },
});