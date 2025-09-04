"use node";

import { api } from "./_generated/api";

// HTTP handler moved to src/convex/http.ts to avoid exporting httpAction from a Node file.

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const processMessage = internalAction({
  args: {
    orgId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Simulate RAG retrieval using FAQ search
    const faqs = await ctx.runQuery(api.faqs.searchFAQs, {
      query: args.message,
      limit: 3,
    }) as any[];

    if (faqs.length === 0) {
      return {
        response: "I'm not sure about that. Please contact our support team for assistance.",
        citations: [],
        confidence: 0,
        needsSupport: true,
      };
    }

    // Calculate confidence based on search relevance
    const confidence = Math.min(0.9, faqs.length * 0.3);

    if (confidence < 0.6) {
      return {
        response: "I'm not sure about that specific question. Please contact our support team for more detailed assistance.",
        citations: faqs.map((faq: any) => faq.question),
        confidence,
        needsSupport: true,
      };
    }

    // Generate response based on top FAQ
    const topFaq = faqs[0];
    const response = `Based on our documentation: ${topFaq.answer}`;

    return {
      response,
      citations: faqs.map((faq: any) => faq.question),
      confidence,
      needsSupport: false,
    };
  },
});
