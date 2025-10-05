"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";

export const subscribe = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Check if already subscribed
    const existing = await ctx.runQuery(internal.newsletterHelpers.getSubscriber, {
      email: args.email,
    });

    if (existing) {
      return { success: true, message: "Already subscribed!" };
    }

    // Store in database
    await ctx.runMutation(internal.newsletterHelpers.addSubscriber, {
      email: args.email,
    });

    // Send welcome email via Resend
    try {
      await resend.emails.send({
        from: "LETHIMDO <onboarding@lethimdo.com>",
        to: [args.email],
        subject: "Welcome to LETHIMDO! 🎉",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Welcome to LETHIMDO!</h1>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>You'll receive weekly insights on AI-powered productivity and automation tips to help grow your business 2x faster.</p>
            <p>Get started by exploring our workflow templates and creating your first automation.</p>
            <a href="https://lethimdo.com/dashboard" style="display: inline-block; background: linear-gradient(to right, #1e40af, #2563eb); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
              Get Started
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Best regards,<br/>
              The LETHIMDO Team
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't fail the subscription if email fails
    }

    return { success: true, message: "Subscribed successfully!" };
  },
});

export const sendFirstWorkflowEmail = action({
  args: { 
    email: v.string(),
    workflowName: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
      await resend.emails.send({
        from: "LETHIMDO <onboarding@lethimdo.com>",
        to: [args.email],
        subject: "🎊 Congratulations on Your First Workflow!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Congratulations! 🎊</h1>
            <p>You've just created your first workflow: <strong>${args.workflowName}</strong></p>
            <p>This is the beginning of your automation journey. Here's what you can do next:</p>
            <ul style="line-height: 1.8;">
              <li>Activate your workflow to start saving time</li>
              <li>Explore our starter templates for more ideas</li>
              <li>Connect your favorite apps and services</li>
              <li>Monitor your workflow performance in real-time</li>
            </ul>
            <a href="https://lethimdo.com/dashboard" style="display: inline-block; background: linear-gradient(to right, #1e40af, #2563eb); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">
              View Your Dashboard
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              Need help? Reply to this email or visit our support center.<br/><br/>
              Best regards,<br/>
              The LETHIMDO Team
            </p>
          </div>
        `,
      });
      return { success: true };
    } catch (error) {
      console.error("Failed to send first workflow email:", error);
      return { success: false, error: String(error) };
    }
  },
});