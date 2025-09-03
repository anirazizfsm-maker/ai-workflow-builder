import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const searchFAQs = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Return no results if no search term provided
    if (!args.searchTerm || args.searchTerm.trim() === "") {
      return [];
    }

    let results = await ctx.db
      .query("faqs")
      .withSearchIndex("search_content", (q) => {
        let search = q.search("question", args.searchTerm as string);
        if (args.category) {
          search = search.eq("category", args.category);
        }
        return search.eq("isActive", true);
      })
      .take(10);

    return results;
  },
});

export const getAllFAQs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("faqs")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const createFAQ = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("faqs", {
      question: args.question,
      answer: args.answer,
      category: args.category,
      tags: args.tags,
      isActive: true,
    });
  },
});