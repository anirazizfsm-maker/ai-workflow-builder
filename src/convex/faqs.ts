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
    // Use index instead of filter to avoid scans
    return await ctx.db
      .query("faqs")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
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

export const updateFAQ = mutation({
  args: {
    id: v.id("faqs"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("FAQ not found");
    }
    await ctx.db.patch(id, patch);
    return { success: true };
  },
});

export const deleteFAQ = mutation({
  args: {
    id: v.id("faqs"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("FAQ not found");
    }
    await ctx.db.delete(args.id);
    return { success: true };
  },
});