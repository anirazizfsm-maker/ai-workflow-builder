import { v } from "convex/values";
import { action, query } from "./_generated/server";

// AI Builder endpoint: POST /v1/ai-builder/parse
// Input: { org_id, text } where text = user's natural language request
// Output: { template_id, confidence, reason, params, preview_steps }

export const parse = action({
  args: {
    org_id: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    // Get available templates
    const templates: any[] = await ctx.runQuery(api.aiBuilder.getActiveTemplates);
    
    if (templates.length === 0) {
      return {
        template_id: null,
        confidence: 0,
        reason: "No templates available",
        params: {},
        preview_steps: [],
      };
    }

    // Simple keyword matching for demo (in production, use LLM)
    const text = args.text.toLowerCase();
    let bestMatch: any = null;
    let bestScore = 0;

    for (const template of templates) {
      let score = 0;
      
      // Check template name and tags for matches
      const searchTerms = [
        template.name.toLowerCase(),
        ...template.tags.map((tag: string) => tag.toLowerCase()),
        template.description.toLowerCase()
      ];

      for (const term of searchTerms) {
        if (text.includes(term)) {
          score += 1;
        }
      }

      // Boost score for exact matches
      if (text.includes(template.name.toLowerCase())) {
        score += 2;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = template;
      }
    }

    if (!bestMatch || bestScore === 0) {
      return {
        template_id: null,
        confidence: 0,
        reason: "No matching template found for the request",
        params: {},
        preview_steps: [],
      };
    }

    // Extract parameters from text (simple regex patterns for demo)
    const extractedParams: Record<string, string> = {};
    
    // Extract email addresses
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch && bestMatch.params.email) {
      extractedParams.email = emailMatch[0];
    }

    // Extract names (simple pattern)
    const nameMatch = text.match(/(?:to|for|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (nameMatch && bestMatch.params.name) {
      extractedParams.name = nameMatch[1];
    }

    // Calculate confidence based on matches and extracted params
    const confidence = Math.min(0.9, (bestScore * 0.2) + (Object.keys(extractedParams).length * 0.1));

    return {
      template_id: bestMatch.templateId,
      confidence,
      reason: `Matched template "${bestMatch.name}" based on keywords`,
      params: extractedParams,
      preview_steps: bestMatch.steps,
    };
  },
});

export const getActiveTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aiTemplates")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

// Import api for internal use
import { api } from "./_generated/api";