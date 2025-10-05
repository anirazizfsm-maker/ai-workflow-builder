import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getSubscriber = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const addSubscriber = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
      isActive: true,
    });
  },
});
