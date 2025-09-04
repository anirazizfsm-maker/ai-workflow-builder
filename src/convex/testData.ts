import { mutation } from "./_generated/server";

export const seedFAQs = mutation({
  args: {},
  handler: async (ctx) => {
    const faqs = [
      {
        question: "What is Lethimdo?",
        answer: "Lethimdo is an AI-powered workflow automation platform that helps you build and deploy automation workflows using natural language descriptions.",
        category: "General",
        tags: ["platform", "automation", "AI"],
        isActive: true,
      },
      {
        question: "How do I create a workflow?",
        answer: "Simply describe what you want to automate in plain English, and our AI will generate the workflow JSON for you. You can then customize and deploy it.",
        category: "Workflows",
        tags: ["create", "workflow", "AI"],
        isActive: true,
      },
      {
        question: "What types of workflows can I create?",
        answer: "You can create email automation, data processing, report generation, lead follow-ups, social media posting, and many other types of workflows.",
        category: "Workflows",
        tags: ["types", "automation", "examples"],
        isActive: true,
      },
      {
        question: "Is there a free plan?",
        answer: "Yes! We offer a free plan with up to 5 workflows and 100 executions per month. Perfect for getting started.",
        category: "Pricing",
        tags: ["free", "plan", "pricing"],
        isActive: true,
      },
      {
        question: "How secure is my data?",
        answer: "We use enterprise-grade security with end-to-end encryption. Your data is never shared with third parties and is stored securely in the cloud.",
        category: "Security",
        tags: ["security", "data", "privacy"],
        isActive: true,
      },
    ];

    for (const faq of faqs) {
      await ctx.db.insert("faqs", faq);
    }

    return { success: true, count: faqs.length };
  },
});

export const seedAITemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const templates: Array<{
      templateId: string;
      name: string;
      description: string;
      params: Record<string, string>;
      steps: string[];
      tags: string[];
      isActive: boolean;
    }> = [
      {
        templateId: "welcome_email",
        name: "Welcome Email Automation",
        description: "Send personalized welcome emails to new users or customers",
        params: {
          email: "recipient email address",
          name: "recipient name",
          gmail_credential_id: "{{gmail_credential_id}}",
        },
        steps: [
          "Trigger: New user signup detected",
          "Fetch user details from database",
          "Generate personalized welcome message",
          "Send email via Gmail integration",
          "Log email sent status",
        ],
        tags: ["email", "welcome", "automation", "onboarding"],
        isActive: true,
      },
      {
        templateId: "sales_report",
        name: "Daily Sales Report",
        description: "Generate and email daily sales reports to stakeholders",
        params: {
          recipients: "comma-separated email list",
          database_credential_id: "{{database_credential_id}}",
          gmail_credential_id: "{{gmail_credential_id}}",
        },
        steps: [
          "Trigger: Daily at 9 AM",
          "Connect to sales database",
          "Query yesterday's sales data",
          "Generate PDF report with charts",
          "Email report to stakeholders",
        ],
        tags: ["sales", "report", "daily", "analytics"],
        isActive: true,
      },
      {
        templateId: "lead_followup",
        name: "Lead Follow-up Sequence",
        description: "Automated follow-up emails for new leads with personalized content",
        params: {
          lead_email: "lead email address",
          lead_name: "lead name",
          company: "lead company name",
          crm_credential_id: "{{crm_credential_id}}",
          gmail_credential_id: "{{gmail_credential_id}}",
        },
        steps: [
          "Trigger: New lead added to CRM",
          "Wait 1 hour after initial contact",
          "Send personalized follow-up email",
          "Wait 3 days if no response",
          "Send second follow-up with case study",
          "Update lead status in CRM",
        ],
        tags: ["lead", "followup", "sales", "crm"],
        isActive: true,
      },
    ];

    for (const template of templates) {
      await ctx.db.insert("aiTemplates", template);
    }

    return { success: true, count: templates.length };
  },
});

export const seedTestOrg = mutation({
  args: {},
  handler: async (ctx) => {
    const orgId = await ctx.db.insert("orgs", {
      name: "Demo Organization",
      slug: "demo-org",
    });

    // Add some test credentials
    await ctx.db.insert("credentials", {
      orgId: "demo-org",
      key: "gmail_credential_id",
      value: "encrypted_gmail_token_placeholder",
    });

    await ctx.db.insert("credentials", {
      orgId: "demo-org", 
      key: "database_credential_id",
      value: "encrypted_db_connection_placeholder",
    });

    return { success: true, orgId };
  },
});