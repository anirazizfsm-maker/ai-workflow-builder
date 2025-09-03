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
