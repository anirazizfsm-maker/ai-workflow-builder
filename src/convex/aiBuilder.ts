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
    // Load templates
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

    // Keyword matching across safe fields (no reliance on non-existent tags/params)
    const text = args.text.toLowerCase();
    let bestMatch: any = null;
    let bestScore = 0;

    for (const t of templates) {
      const terms: string[] = [
        t.name?.toLowerCase?.() ?? "",
        t.description?.toLowerCase?.() ?? "",
        t.category?.toLowerCase?.() ?? "",
        t.slug?.toLowerCase?.() ?? "",
        t.templateId?.toLowerCase?.() ?? "", // include templateId in matching
      ].filter(Boolean);

      let score = 0;
      for (const term of terms) {
        if (term && text.includes(term)) score += 1;
      }
      if (t.slug && text.includes(String(t.slug).toLowerCase())) score += 1;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = t;
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

    // Extract simple parameters
    const extractedParams: Record<string, string> = {};
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) extractedParams.email = emailMatch[0];

    const nameMatch = text.match(/(?:to|for|from)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (nameMatch) extractedParams.name = nameMatch[1];

    // Derive preview steps from jsonSchema.actions if present
    let previewSteps: string[] = [];
    try {
      const parsed = JSON.parse(bestMatch.jsonSchema ?? "{}");
      if (Array.isArray(parsed?.actions)) {
        previewSteps = parsed.actions.map((a: any) => String(a));
      }
    } catch {
      // ignore JSON parse errors
    }

    const confidence = Math.min(
      0.9,
      bestScore * 0.2 + Object.keys(extractedParams).length * 0.1
    );

    return {
      template_id: bestMatch.slug || bestMatch.templateId || String(bestMatch._id), // fallback for assets lacking slug
      confidence,
      reason: `Matched template "${bestMatch.name}" based on keywords`,
      params: extractedParams,
      preview_steps: previewSteps,
    };
  },
});

export const getActiveTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("aiTemplates").collect();
  },
});

// Import api for internal use
import { api } from "./_generated/api";