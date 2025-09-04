import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Organizations table
    orgs: defineTable({
      name: v.string(),
      slug: v.string(),
    }).index("by_slug", ["slug"]),

    // Workflows table
    workflows: defineTable({
      userId: v.id("users"),
      title: v.string(),
      description: v.string(),
      prompt: v.string(),
      jsonConfig: v.string(),
      status: v.union(v.literal("draft"), v.literal("active"), v.literal("paused")),
      category: v.string(),
      isPublic: v.optional(v.boolean()),
      // New fields for backend features
      orgId: v.optional(v.string()),
      templateId: v.optional(v.string()),
      params: v.optional(v.record(v.string(), v.string())),
      n8nWorkflowId: v.optional(v.string()),
    }).index("by_user", ["userId"])
      .index("by_status", ["status"])
      .index("by_category", ["category"])
      .index("by_org", ["orgId"])
      .index("by_template", ["templateId"]),

    // AI Templates for workflow builder
    aiTemplates: defineTable({
      templateId: v.string(),
      name: v.string(),
      description: v.string(),
      params: v.record(v.string(), v.string()),
      steps: v.array(v.string()),
      tags: v.array(v.string()),
      isActive: v.boolean(),
    }).index("by_template_id", ["templateId"])
      .index("by_active", ["isActive"])
      .searchIndex("search_name", {
        searchField: "name",
        filterFields: ["isActive"]
      }),

    // Invoices for billing
    invoices: defineTable({
      orgId: v.string(),
      number: v.string(),
      amountCents: v.number(),
      currency: v.string(),
      status: v.union(v.literal("draft"), v.literal("paid"), v.literal("void")),
      pdfFileId: v.optional(v.id("_storage")),
      pdfUrl: v.optional(v.string()),
    }).index("by_org", ["orgId"])
      .index("by_status", ["status"])
      .index("by_number", ["number"]),

    // Chat logs for FAQ chatbot
    chats: defineTable({
      orgId: v.string(),
      userId: v.optional(v.id("users")),
      message: v.string(),
      response: v.optional(v.string()),
      citations: v.optional(v.array(v.string())),
      confidence: v.optional(v.number()),
    }).index("by_org", ["orgId"])
      .index("by_user", ["userId"]),

    // Credentials (placeholder storage for demo)
    credentials: defineTable({
      orgId: v.string(),
      key: v.string(),
      value: v.string(), // encrypted placeholder in real implementation
    }).index("by_org", ["orgId"])
      .index("by_key", ["key"]),

    // FAQ entries for the chatbot
    faqs: defineTable({
      question: v.string(),
      answer: v.string(),
      category: v.string(),
      tags: v.array(v.string()),
      isActive: v.boolean(),
    }).index("by_category", ["category"])
      .index("by_isActive", ["isActive"])
      .searchIndex("search_content", {
        searchField: "question",
        filterFields: ["category", "isActive"]
      }),

    // Workflow executions/runs
    workflowRuns: defineTable({
      workflowId: v.id("workflows"),
      userId: v.id("users"),
      status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
      startTime: v.number(),
      endTime: v.optional(v.number()),
      logs: v.array(v.string()),
      result: v.optional(v.string()),
    }).index("by_workflow", ["workflowId"])
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;