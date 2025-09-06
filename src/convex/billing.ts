import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Billing webhook endpoint: POST /v1/billing/webhook
// Handles Stripe (global) and SSLCommerz (Bangladesh) webhooks
// On successful payment → generate invoice PDF and email to user

export const createInvoice = internalMutation({
  args: {
    orgId: v.string(),
    number: v.string(),
    amountCents: v.number(),
    currency: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", args);
  },
});

export const updateInvoicePdf = internalMutation({
  args: {
    invoiceId: v.id("invoices"),
    pdfFileId: v.id("_storage"),
    pdfUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      pdfFileId: args.pdfFileId,
      pdfUrl: args.pdfUrl,
    });
  },
});