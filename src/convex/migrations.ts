import { internalMutation } from "./_generated/server";

export const cleanupLegacyCredentials = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allCredentials = await ctx.db.query("credentials").collect();
    
    let cleaned = 0;
    for (const cred of allCredentials) {
      // If it has legacy fields but no new fields, delete it
      if (cred.key && !cred.userId) {
        await ctx.db.delete(cred._id);
        cleaned++;
      }
    }
    
    return { cleaned, message: `Cleaned up ${cleaned} legacy credentials` };
  },
});
