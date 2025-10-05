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

// Newsletter subscription endpoint
http.route({
  path: "/api/newsletter/subscribe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { email } = body;

      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const result = await ctx.runAction(api.newsletter.subscribe, { email });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return new Response(
        JSON.stringify({ error: "Subscription failed" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
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

// Reports export endpoint
http.route({
  path: "/v1/reports/export",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { org_id, type = "monthly" } = body;

      if (!org_id) {
        return new Response(
          JSON.stringify({ error: "org_id is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Generate report content
      const now = Date.now();
      const monthStart = now - 30 * 24 * 60 * 60 * 1000;
      
      const runs = await ctx.runQuery(api.workflows.runsPerDay, {
        orgId: org_id,
        days: 30,
      });
      
      const totalRuns = runs.reduce((sum: number, day: any) => sum + day.count, 0);
      const avgRunsPerDay = Math.round(totalRuns / 30 * 100) / 100;
      
      const settings = await ctx.runQuery(api.workflows.getSettings, {
        orgId: org_id,
      });
      
      const savings = await ctx.runQuery(api.workflows.perWorkflowSavings, {
        orgId: org_id,
        month: monthStart,
      });
      
      const totalHoursSaved = savings.reduce((sum: number, s: any) => sum + s.hours, 0);
      const totalDollarsSaved = savings.reduce((sum: number, s: any) => sum + s.dollars, 0);
      const roi = Math.round((totalDollarsSaved / (settings.planPriceCents / 100)) * 100) / 100;

      const reportContent = `
LETHIMDO MONTHLY REPORT
=======================
Organization: ${org_id}
Report Period: ${new Date(monthStart).toLocaleDateString()} - ${new Date(now).toLocaleDateString()}
Generated: ${new Date().toISOString()}

EXECUTIVE SUMMARY
-----------------
This month you automated ${totalRuns} workflows, saving ${Math.round(totalHoursSaved)} hours worth $${Math.round(totalDollarsSaved)}.
Your return on investment is ${roi}x your subscription cost.

WORKFLOW STATISTICS
-------------------
Total Workflows Executed: ${totalRuns}
Average Workflows Per Day: ${avgRunsPerDay}
Total Time Saved: ${Math.round(totalHoursSaved)} hours
Total Money Saved: $${Math.round(totalDollarsSaved)}

TOP PERFORMING WORKFLOWS
------------------------
${savings.slice(0, 5).map((s: any, i: number) => 
  `${i + 1}. ${s.title}: ${Math.round(s.hours)}h saved ($${Math.round(s.dollars)})`
).join('\n')}

RECOMMENDATIONS
---------------
- Continue leveraging your top-performing workflows
- Consider expanding automation to new areas
- Monitor failed workflows for optimization opportunities

SUBSCRIPTION DETAILS
--------------------
Plan: ${settings.planName}
Monthly Cost: $${settings.planPriceCents / 100}
ROI: ${roi}x return on investment

Thank you for using LETHIMDO!
For questions, contact support@lethimdo.com
      `;

      // Store as file
      const blob = new Blob([reportContent], { type: "text/plain" });
      const fileId = await ctx.storage.store(blob);
      const fileUrl = await ctx.storage.getUrl(fileId);

      return new Response(
        JSON.stringify({
          success: true,
          reportUrl: fileUrl,
          filename: `lethimdo-report-${org_id}-${new Date().toISOString().split('T')[0]}.txt`,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Report export error:", error);
      return new Response(
        JSON.stringify({ error: "Report generation failed" }),
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