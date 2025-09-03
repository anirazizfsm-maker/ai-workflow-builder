import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const searchFAQs = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Return no results if no search term provided
      if (!args.searchTerm || args.searchTerm.trim() === "") {
        return [];
      }

      const searchTerm = args.searchTerm.trim();
      if (searchTerm.length < 2) {
        // Do not throw; just avoid noisy searches
        return [];
      }

      const category = args.category?.trim();

      const results = await ctx.db
        .query("faqs")
        .withSearchIndex("search_content", (q) => {
          let search = q.search("question", searchTerm);
          if (category && category.length > 0) {
            search = search.eq("category", category);
          }
          return search.eq("isActive", true);
        })
        .take(10);

      return results;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to search FAQs: ${message}`);
    }
  },
});

export const getAllFAQs = query({
  args: {},
  handler: async (ctx) => {
    try {
      // Use index instead of filter to avoid scans
      return await ctx.db
        .query("faqs")
        .withIndex("by_isActive", (q) => q.eq("isActive", true))
        .collect();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to fetch FAQs: ${message}`);
    }
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
    try {
      const question = args.question.trim();
      const answer = args.answer.trim();
      const category = args.category.trim();
      const tags = args.tags.map((t) => t.trim()).filter((t) => t.length > 0);

      if (!question) throw new Error("Question is required.");
      if (!answer) throw new Error("Answer is required.");
      if (!category) throw new Error("Category is required.");
      if (question.length > 300) throw new Error("Question is too long (max 300).");
      if (answer.length > 5000) throw new Error("Answer is too long (max 5000).");
      if (tags.length > 20) throw new Error("Too many tags (max 20).");
      if (tags.some((t) => t.length > 50)) throw new Error("Tag length must be <= 50 characters.");

      return await ctx.db.insert("faqs", {
        question,
        answer,
        category,
        tags,
        isActive: true,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create FAQ: ${message}`);
    }
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
    try {
      const { id, ...patch } = args;
      const existing = await ctx.db.get(id);
      if (!existing) {
        throw new Error("FAQ not found.");
      }

      const updates: Record<string, unknown> = {};

      if (patch.question !== undefined) {
        const q = patch.question.trim();
        if (!q) throw new Error("Question cannot be empty.");
        if (q.length > 300) throw new Error("Question is too long (max 300).");
        updates.question = q;
      }

      if (patch.answer !== undefined) {
        const a = patch.answer.trim();
        if (!a) throw new Error("Answer cannot be empty.");
        if (a.length > 5000) throw new Error("Answer is too long (max 5000).");
        updates.answer = a;
      }

      if (patch.category !== undefined) {
        const c = patch.category.trim();
        if (!c) throw new Error("Category cannot be empty.");
        updates.category = c;
      }

      if (patch.tags !== undefined) {
        const tags = patch.tags.map((t) => t.trim()).filter((t) => t.length > 0);
        if (tags.length > 20) throw new Error("Too many tags (max 20).");
        if (tags.some((t) => t.length > 50)) throw new Error("Tag length must be <= 50 characters.");
        updates.tags = tags;
      }

      if (patch.isActive !== undefined) {
        updates.isActive = patch.isActive;
      }

      await ctx.db.patch(id, updates);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to update FAQ: ${message}`);
    }
  },
});

export const deleteFAQ = mutation({
  args: {
    id: v.id("faqs"),
  },
  handler: async (ctx, args) => {
    try {
      const existing = await ctx.db.get(args.id);
      if (!existing) {
        throw new Error("FAQ not found.");
      }
      await ctx.db.delete(args.id);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to delete FAQ: ${message}`);
    }
  },
});