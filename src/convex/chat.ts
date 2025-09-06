import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Moved from chatHttp.ts to avoid exporting mutations from a Node.js file
export const logChat = internalMutation({
  args: {
    orgId: v.string(),
    message: v.string(),
    response: v.string(),
    citations: v.array(v.string()),
    confidence: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatLogs", args);
  },
});
