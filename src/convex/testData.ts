import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const seedFAQs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const faqs = [
      {
        question: "How do I create my first workflow?",
        answer: "Click 'Create New Workflow' on your dashboard, describe what you want to automate, and our AI will generate the workflow for you.",
        category: "General",
        tags: ["getting-started", "workflows"],
        isActive: true,
      },
      {
        question: "What integrations are supported?",
        answer: "We support 100+ integrations including Gmail, Slack, Notion, Airtable, and many more. Check our integrations page for the full list.",
        category: "Integrations",
        tags: ["integrations", "apps"],
        isActive: true,
      },
      {
        question: "How much does it cost?",
        answer: "We offer a free tier with 10 workflows per month. Pro plans start at $49/month for unlimited workflows and premium features.",
        category: "Pricing",
        tags: ["pricing", "plans"],
        isActive: true,
      },
      {
        question: "Is my data secure?",
        answer: "Yes, we use enterprise-grade encryption and never store your sensitive data. All connections are secured with OAuth 2.0.",
        category: "Security",
        tags: ["security", "privacy"],
        isActive: true,
      },
      {
        question: "Can I cancel anytime?",
        answer: "Absolutely! You can cancel your subscription at any time from your billing settings. No long-term contracts.",
        category: "Billing",
        tags: ["billing", "cancellation"],
        isActive: true,
      },
    ];

    let count = 0;
    for (const faq of faqs) {
      await ctx.db.insert("faqs", faq);
      count++;
    }

    return { success: true, count };
  },
});

export const seedAITemplates = internalMutation({
  args: {},
  handler: async (ctx) => {
    const templates = [
      {
        slug: "welcome_email",
        name: "Welcome Email Automation",
        description: "Send personalized welcome emails to new users",
        category: "email",
        jsonSchema: JSON.stringify({
          trigger: "user_signup",
          actions: ["send_email", "add_to_crm"]
        }),
        minPlan: "free",
      },
      {
        slug: "data_sync",
        name: "Data Synchronization",
        description: "Sync data between multiple platforms automatically",
        category: "data",
        jsonSchema: JSON.stringify({
          trigger: "schedule",
          actions: ["fetch_data", "transform", "sync"]
        }),
        minPlan: "pro",
      },
      {
        slug: "social_posting",
        name: "Social Media Posting",
        description: "Auto-post content across social media platforms",
        category: "social",
        jsonSchema: JSON.stringify({
          trigger: "content_ready",
          actions: ["format_post", "schedule_posts"]
        }),
        minPlan: "pro",
      },
    ];

    let count = 0;
    for (const template of templates) {
      await ctx.db.insert("aiTemplates", template);
      count++;
    }

    return { success: true, count };
  },
});

export const seedTestOrg = internalMutation({
  args: {},
  handler: async (ctx) => {
    const orgId = await ctx.db.insert("organizations", {
      slug: "demo-org",
      name: "Demo Organization",
    });

    // Add settings
    await ctx.db.insert("settings", {
      orgId: "demo-org",
      hourlyRate: 25,
      planPriceCents: 4900,
      planName: "Pro",
    });

    return { success: true, orgId };
  },
});

export const seedWorkflowRuns = internalMutation({
  args: { orgId: v.string() },
  handler: async (ctx, args) => {
    // Get some workflows to create runs for
    const workflows = await ctx.db.query("workflows").take(3);
    
    if (workflows.length === 0) {
      return { success: false, message: "No workflows found to create runs for" };
    }

    const categories = ["email", "data", "automation", "social"];
    const statuses = ["success", "failed", "success", "success"]; // Mostly successful
    
    let count = 0;
    const now = Date.now();
    
    // Create runs for the last 30 days
    for (let day = 0; day < 30; day++) {
      const dayTime = now - (day * 24 * 60 * 60 * 1000);
      const runsPerDay = Math.floor(Math.random() * 8) + 2; // 2-10 runs per day
      
      for (let run = 0; run < runsPerDay; run++) {
        const workflow = workflows[Math.floor(Math.random() * workflows.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as "success" | "failed";
        const durationSec = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
        
        await ctx.runMutation(internal.workflows.logRun, {
          workflowId: workflow._id,
          orgId: args.orgId,
          status,
          category,
          durationSec,
          costCents: Math.floor(Math.random() * 100) + 10,
          ...(status === "failed" && { error: "Simulated failure for testing" }),
        });
        
        count++;
      }
    }

    return { success: true, count };
  },
});