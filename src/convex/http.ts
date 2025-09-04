import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { create, get, activate, deactivate } from "./workflowsHttp";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Auth routes
auth.addHttpRoutes(http);

// AI Builder routes
http.route({
  path: "/v1/ai-builder/parse",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { org_id, text } = body ?? {};

      if (!org_id || !text) {
        return new Response(
          JSON.stringify({ error: "org_id and text are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.aiBuilder.parse, { org_id, text });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("AI Builder parse error:", error);
      return new Response(JSON.stringify({ error: "Parse failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Workflow management routes
http.route({
  path: "/v1/workflows",
  method: "POST", 
  handler: create,
});

http.route({
  path: "/v1/workflows/{id}",
  method: "GET",
  handler: get,
});

http.route({
  path: "/v1/workflows/{id}/activate",
  method: "POST",
  handler: activate,
});

http.route({
  path: "/v1/workflows/{id}/deactivate", 
  method: "POST",
  handler: deactivate,
});

 // Billing webhook
http.route({
  path: "/v1/billing/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const headersObj: Record<string, string> = {};
      for (const [k, v] of request.headers as any) {
        headersObj[k.toLowerCase()] = v as string;
      }

      // Detect payment provider
      let provider = "unknown";
      if (headersObj["stripe-signature"]) {
        provider = "stripe";
      } else if (headersObj["user-agent"]?.includes("SSLCommerz") || (body as any).store_id) {
        provider = "sslcommerz";
      }

      console.log(`Received ${provider} webhook:`, body);

      // Parse webhook based on provider
      let paymentData:
        | {
            orgId: string;
            amount: number;
            currency: string;
            paymentId: string;
          }
        | null = null;

      if (provider === "stripe") {
        // Stripe webhook format
        if (body.type === "payment_intent.succeeded") {
          paymentData = {
            orgId: body.data.object.metadata?.org_id || "demo_org",
            amount: body.data.object.amount,
            currency: body.data.object.currency,
            paymentId: body.data.object.id,
          };
        }
      } else if (provider === "sslcommerz") {
        // SSLCommerz webhook format
        if (body.status === "VALID") {
          paymentData = {
            orgId: body.value_b || "demo_org", // custom field
            amount: parseFloat(body.amount) * 100, // convert to cents
            currency: body.currency || "BDT",
            paymentId: body.tran_id,
          };
        }
      }

      if (!paymentData) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook or payment not successful" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Process successful payment
      const invoiceNumber = `INV-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      const invoiceId = await ctx.runMutation(internal.billing.createInvoice, {
        orgId: paymentData.orgId,
        number: invoiceNumber,
        amountCents: paymentData.amount,
        currency: paymentData.currency.toUpperCase(),
        status: "paid",
      });

      const pdfContent = `
INVOICE ${invoiceNumber}
===================

Organization: ${paymentData.orgId}
Amount: ${paymentData.currency.toUpperCase()} ${(paymentData.amount / 100).toFixed(2)}
Payment ID: ${paymentData.paymentId}
Date: ${new Date().toISOString()}

Thank you for your payment!
      `;

      const pdfBlob = new Blob([pdfContent], { type: "text/plain" });
      const fileId = await ctx.storage.store(pdfBlob);
      const pdfUrl = await ctx.storage.getUrl(fileId);

      await ctx.runMutation(internal.billing.updateInvoicePdf, {
        invoiceId,
        pdfFileId: fileId,
        pdfUrl: pdfUrl || "",
      });

      return new Response(
        JSON.stringify({
          message: "Payment processed successfully",
          invoiceId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Webhook processing error:", error);
      return new Response(
        JSON.stringify({ error: "Webhook processing failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

 // Chat endpoint
http.route({
  path: "/v1/chat",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { org_id, message } = body;

      if (!org_id || !message) {
        return new Response(
          JSON.stringify({ error: "org_id and message are required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Process chat message via internal action
      const result = await ctx.runAction(internal.chatHttp.processMessage, {
        orgId: org_id,
        message,
      });

      // Log chat interaction
      await ctx.runMutation(internal.chat.logChat, {
        orgId: org_id,
        message,
        response: result.response,
        citations: result.citations,
        confidence: result.confidence,
      });

      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Chat processing error:", error);
      return new Response(
        JSON.stringify({ error: "Chat processing failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;

/*
Example curl commands for testing:

# AI Builder Parse
curl -X POST http://localhost:3000/v1/ai-builder/parse \
  -H "Content-Type: application/json" \
  -d '{"org_id": "demo-org", "text": "send welcome email to new users"}'

# Create Workflow  
curl -X POST http://localhost:3000/v1/workflows \
  -H "Content-Type: application/json" \
  -d '{"org_id": "demo-org", "template_id": "welcome_email", "params": {"email": "test@example.com"}}'

# Chat
curl -X POST http://localhost:3000/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"org_id": "demo-org", "message": "How do I create a workflow?"}'

# Billing Webhook (Stripe simulation)
curl -X POST http://localhost:3000/v1/billing/webhook \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"type": "payment_intent.succeeded", "data": {"object": {"id": "pi_test", "amount": 2000, "currency": "usd", "metadata": {"org_id": "demo-org"}}}}'
*/