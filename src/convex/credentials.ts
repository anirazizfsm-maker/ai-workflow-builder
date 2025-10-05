import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserCredentials = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const credentials = await ctx.db
      .query("credentials")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Filter out legacy credentials without proper structure
    return credentials.filter(c => c.userId && c.provider && c.data);
  },
});

export const getCredentialsByProvider = query({
  args: { provider: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const credential = await ctx.db
      .query("credentials")
      .withIndex("by_user_and_provider", (q) => 
        q.eq("userId", userId).eq("provider", args.provider)
      )
      .first();
    
    // Return null if it's a legacy credential
    if (credential && (!credential.userId || !credential.provider || !credential.data)) {
      return null;
    }
    
    return credential;
  },
});

export const saveCredential = mutation({
  args: {
    provider: v.string(),
    data: v.string(), // Should be encrypted on client side
    label: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if credential already exists
    const existing = await ctx.db
      .query("credentials")
      .withIndex("by_user_and_provider", (q) => 
        q.eq("userId", userId).eq("provider", args.provider)
      )
      .first();

    if (existing) {
      // Update existing credential
      await ctx.db.patch(existing._id, {
        data: args.data,
        label: args.label,
      });
      return existing._id;
    } else {
      // Create new credential
      return await ctx.db.insert("credentials", {
        userId,
        provider: args.provider,
        data: args.data,
        label: args.label,
      });
    }
  },
});

export const deleteCredential = mutation({
  args: { credentialId: v.id("credentials") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const credential = await ctx.db.get(args.credentialId);
    if (!credential || credential.userId !== userId) {
      throw new Error("Credential not found or unauthorized");
    }

    await ctx.db.delete(args.credentialId);
    return { success: true };
  },
});
