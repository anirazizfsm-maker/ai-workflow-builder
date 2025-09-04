import { v } from "convex/values";
import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

export const searchFAQs = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    if (!args.query.trim()) {
      return await ctx.db
        .query("faqs")
        .withIndex("by_isActive", (q) => q.eq("isActive", true))
        .take(limit);
    }

    return await ctx.db
      .query("faqs")
      .withSearchIndex("search_content", (q) =>
        q.search("question", args.query).eq("isActive", true)
      )
      .take(limit);
  },
});

export const getFAQsByCategory = query({
  args: {
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("faqs")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getAllFAQs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("faqs").collect();
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
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      question: args.question,
      answer: args.answer,
      category: args.category,
      tags: args.tags,
      isActive: args.isActive,
    });
  },
});

export const deleteFAQ = mutation({
  args: { id: v.id("faqs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});