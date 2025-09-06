import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const getUserWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Use .first() instead of .unique() to avoid crashes if duplicates exist
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db
      .query("workflows")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const createWorkflow = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    prompt: v.string(),
    jsonConfig: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Use .first() instead of .unique() to avoid crashes if duplicates exist
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("workflows", {
      userId: user._id,
      title: args.title,
      description: args.description,
      prompt: args.prompt,
      jsonConfig: args.jsonConfig,
      category: args.category,
      status: "draft",
    });
  },
});

export const updateWorkflowStatus = mutation({
  args: {
    workflowId: v.id("workflows"),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await ctx.db.patch(args.workflowId, {
      status: args.status,
    });

    return { success: true };
  },
});

export const deleteWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    await ctx.db.delete(args.workflowId);
    return { success: true };
  },
});

// New analytics and reporting functions

export const logRun = internalMutation({
  args: {
    workflowId: v.id("workflows"),
    orgId: v.string(),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("running")),
    category: v.string(),
    durationSec: v.number(),
    costCents: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const runId = await ctx.db.insert("workflowRuns", args);
    
    // Auto-generate notifications for failures
    if (args.status === "failed") {
      const recentFailures = await ctx.db
        .query("workflowRuns")
        .withIndex("by_workflow_and_status", (q) => 
          q.eq("workflowId", args.workflowId).eq("status", "failed")
        )
        .filter((q) => q.gt(q.field("_creationTime"), Date.now() - 24 * 60 * 60 * 1000))
        .collect();

      if (recentFailures.length >= 3) {
        await ctx.db.insert("notifications", {
          orgId: args.orgId,
          kind: "workflow_failed",
          message: `Workflow has failed ${recentFailures.length} times in the last 24 hours`,
          severity: "error",
        });
      }
    }

    // Check usage thresholds
    const recentRuns = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.gt(q.field("_creationTime"), Date.now() - 24 * 60 * 60 * 1000))
      .collect();

    if (recentRuns.length >= 80) {
      await ctx.db.insert("notifications", {
        orgId: args.orgId,
        kind: "usage_threshold",
        message: "You're approaching your daily usage limit. Consider upgrading your plan.",
        severity: "warning",
      });
    }

    return runId;
  },
});

export const runsPerDay = query({
  args: {
    orgId: v.string(),
    days: v.number(),
  },
  handler: async (ctx, args) => {
    const since = Date.now() - args.days * 24 * 60 * 60 * 1000;
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.gt(q.field("_creationTime"), since))
      .collect();

    const buckets: { date: string; count: number }[] = [];
    const today = new Date();
    
    for (let i = 0; i < args.days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = runs.filter(run => 
        run._creationTime >= dayStart.getTime() && 
        run._creationTime <= dayEnd.getTime()
      ).length;
      
      buckets.unshift({ date: dateStr, count });
    }
    
    return buckets;
  },
});

export const distributionByCategory = query({
  args: {
    orgId: v.string(),
    since: v.number(),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.gt(q.field("_creationTime"), args.since))
      .collect();

    const distribution: Record<string, number> = {};
    runs.forEach(run => {
      distribution[run.category] = (distribution[run.category] || 0) + 1;
    });

    return Object.entries(distribution).map(([label, value]) => ({ label, value }));
  },
});

export const savingsOverTime = query({
  args: {
    orgId: v.string(),
    since: v.number(),
    hourlyRate: v.number(),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.gt(q.field("_creationTime"), args.since))
      .collect();

    const savings: { t: string; hoursSaved: number; dollarsSaved: number }[] = [];
    const groupedByWeek: Record<string, { hours: number; dollars: number }> = {};

    runs.forEach(run => {
      const date = new Date(run._creationTime);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      
      if (!groupedByWeek[weekKey]) {
        groupedByWeek[weekKey] = { hours: 0, dollars: 0 };
      }
      
      const hoursSaved = run.durationSec / 3600;
      const dollarsSaved = hoursSaved * args.hourlyRate;
      
      groupedByWeek[weekKey].hours += hoursSaved;
      groupedByWeek[weekKey].dollars += dollarsSaved;
    });

    Object.entries(groupedByWeek).forEach(([week, data]) => {
      savings.push({
        t: week,
        hoursSaved: Math.round(data.hours * 100) / 100,
        dollarsSaved: Math.round(data.dollars * 100) / 100,
      });
    });

    return savings.sort((a, b) => a.t.localeCompare(b.t));
  },
});

export const perWorkflowSavings = query({
  args: {
    orgId: v.string(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const monthStart = args.month;
    const monthEnd = monthStart + 30 * 24 * 60 * 60 * 1000;
    
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .filter((q) => 
        q.and(
          q.gt(q.field("_creationTime"), monthStart),
          q.lt(q.field("_creationTime"), monthEnd)
        )
      )
      .collect();

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();
    
    const hourlyRate = settings?.hourlyRate || 25;

    const workflowSavings: Record<string, { title: string; hours: number; dollars: number }> = {};

    for (const run of runs) {
      const workflow = await ctx.db.get(run.workflowId);
      if (!workflow) continue;

      if (!workflowSavings[run.workflowId]) {
        workflowSavings[run.workflowId] = {
          title: workflow.title,
          hours: 0,
          dollars: 0,
        };
      }

      const hoursSaved = run.durationSec / 3600;
      const dollarsSaved = hoursSaved * hourlyRate;

      workflowSavings[run.workflowId].hours += hoursSaved;
      workflowSavings[run.workflowId].dollars += dollarsSaved;
    }

    return Object.entries(workflowSavings).map(([workflowId, data]) => ({
      workflowId,
      title: data.title,
      hours: Math.round(data.hours * 100) / 100,
      dollars: Math.round(data.dollars * 100) / 100,
    }));
  },
});

// Settings functions
export const getSettings = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();
    
    return settings || {
      orgId: args.orgId,
      hourlyRate: 25,
      planPriceCents: 4900,
      planName: "Pro",
    };
  },
});

export const updateSettings = mutation({
  args: {
    orgId: v.string(),
    hourlyRate: v.optional(v.number()),
    planPriceCents: v.optional(v.number()),
    planName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...(args.hourlyRate !== undefined && { hourlyRate: args.hourlyRate }),
        ...(args.planPriceCents !== undefined && { planPriceCents: args.planPriceCents }),
        ...(args.planName !== undefined && { planName: args.planName }),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("settings", {
        orgId: args.orgId,
        hourlyRate: args.hourlyRate || 25,
        planPriceCents: args.planPriceCents || 4900,
        planName: args.planName || "Pro",
      });
    }
  },
});

// Notifications
export const getNotifications = query({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(50);
  },
});

export const markNotificationRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      readAt: Date.now(),
    });
    return { success: true };
  },
});

export const createNotification = mutation({
  args: {
    orgId: v.string(),
    kind: v.union(
      v.literal("workflow_failed"),
      v.literal("usage_threshold"),
      v.literal("suggestion"),
      v.literal("system")
    ),
    message: v.string(),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("error")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", args);
  },
});

// New helper mutation to update workflow description (used by upgradeWithAI action)
export const updateWorkflowDescription = mutation({
  args: {
    workflowId: v.id("workflows"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workflowId, { description: args.description });
    return { success: true };
  },
});

// New analytics helpers for actions without DB access
export const failedRunsCount = query({
  args: { orgId: v.string(), since: v.number() },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org_and_status", (q: any) => q.eq("orgId", args.orgId).eq("status", "failed"))
      .filter((q: any) => q.gt(q.field("_creationTime"), args.since))
      .collect();
    return runs.length;
  },
});

export const avgDurationRecentRuns = query({
  args: { orgId: v.string(), since: v.number() },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("workflowRuns")
      .withIndex("by_org", (q: any) => q.eq("orgId", args.orgId))
      .filter((q: any) => q.gt(q.field("_creationTime"), args.since))
      .collect();

    if (runs.length === 0) return 0;
    const total = runs.reduce((sum: number, r: any) => sum + (r.durationSec || 0), 0);
    return total / runs.length;
  },
});