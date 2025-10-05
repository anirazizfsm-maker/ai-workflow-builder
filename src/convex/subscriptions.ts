import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getUserSubscription = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    return subscription;
  },
});

export const createSubscription = mutation({
  args: {
    planId: v.string(),
    planName: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const now = Date.now();
    const trialEnd = now + 7 * 24 * 60 * 60 * 1000; // 7 days from now

    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      orgId: user._id, // Using userId as orgId for simplicity
      planId: args.planId,
      planName: args.planName,
      status: "trialing",
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
      cancelAtPeriodEnd: false,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeCustomerId: args.stripeCustomerId,
    });

    return subscriptionId;
  },
});

export const updateSubscriptionStatus = mutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.subscriptionId, {
      status: args.status,
    });
  },
});