import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    isActive: v.boolean(),
  }).index("by_category", ["category"])
    .index("by_active", ["isActive"])
    .searchIndex("search_question", {
      searchField: "question",
      filterFields: ["category", "isActive"],
    }),

  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    isActive: v.boolean(),
  }).index("by_email", ["email"]),

  credentials: defineTable({
    userId: v.optional(v.id("users")),
    provider: v.optional(v.string()),
    data: v.optional(v.string()), // encrypted JSON string
    label: v.optional(v.string()),
    // Legacy fields for backward compatibility
    key: v.optional(v.string()),
    orgId: v.optional(v.string()),
    value: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_user_and_provider", ["userId", "provider"]),

  workflows: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    prompt: v.string(),
    jsonConfig: v.string(),
    category: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("active"),
      v.literal("paused"),
      v.literal("failed")
    ),
  }).index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_category", ["category"]),

  workflowRuns: defineTable({
    workflowId: v.id("workflows"),
    orgId: v.string(),
    status: v.union(v.literal("success"), v.literal("failed"), v.literal("running")),
    category: v.string(),
    durationSec: v.number(),
    costCents: v.optional(v.number()),
    error: v.optional(v.string()),
    startedAt: v.optional(v.number()),
  }).index("by_workflow", ["workflowId"])
    .index("by_org", ["orgId"])
    .index("by_org_and_status", ["orgId", "status"])
    .index("by_category", ["category"])
    .index("by_workflow_and_status", ["workflowId", "status"]),

  notifications: defineTable({
    orgId: v.string(),
    kind: v.union(
      v.literal("workflow_failed"),
      v.literal("usage_threshold"),
      v.literal("suggestion"),
      v.literal("system")
    ),
    message: v.string(),
    severity: v.union(v.literal("info"), v.literal("warning"), v.literal("error")),
    readAt: v.optional(v.number()),
  }).index("by_org", ["orgId"])
    .index("by_org_and_read", ["orgId", "readAt"]),

  settings: defineTable({
    orgId: v.string(),
    hourlyRate: v.number(),
    planPriceCents: v.number(),
    planName: v.string(),
  }).index("by_org", ["orgId"]),

  aiTemplates: defineTable({
    slug: v.optional(v.string()),
    templateId: v.optional(v.string()),
    name: v.string(),
    description: v.string(),
    category: v.optional(v.string()),
    jsonSchema: v.optional(v.string()),
    minPlan: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    steps: v.optional(v.array(v.string())),
    params: v.optional(v.record(v.string(), v.string())),
  }).index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  organizations: defineTable({
    slug: v.string(),
    name: v.string(),
    ownerId: v.optional(v.id("users")),
  }).index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  invoices: defineTable({
    orgId: v.string(),
    number: v.string(),
    amountCents: v.number(),
    currency: v.string(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
    pdfFileId: v.optional(v.id("_storage")),
    pdfUrl: v.optional(v.string()),
  }).index("by_org", ["orgId"])
    .index("by_number", ["number"])
    .index("by_status", ["status"]),

  chatLogs: defineTable({
    orgId: v.string(),
    message: v.string(),
    response: v.string(),
    citations: v.array(v.string()),
    confidence: v.number(),
  }).index("by_org", ["orgId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    orgId: v.string(),
    planId: v.string(),
    planName: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_org", ["orgId"])
    .index("by_status", ["status"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  workflowNodes: defineTable({
    workflowId: v.id("workflows"),
    nodeId: v.string(),
    type: v.string(),
    label: v.string(),
    positionX: v.number(),
    positionY: v.number(),
    config: v.string(),
    credentialsId: v.optional(v.id("credentials")),
  }).index("by_workflow", ["workflowId"])
    .index("by_workflow_and_node", ["workflowId", "nodeId"]),

  workflowEdges: defineTable({
    workflowId: v.id("workflows"),
    edgeId: v.string(),
    sourceNodeId: v.string(),
    targetNodeId: v.string(),
    sourceHandle: v.optional(v.string()),
    targetHandle: v.optional(v.string()),
  }).index("by_workflow", ["workflowId"]),

  chatMessages: defineTable({
    userId: v.id("users"),
    orgId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    metadata: v.optional(v.string()),
  }).index("by_user", ["userId"])
    .index("by_org", ["orgId"]),
});