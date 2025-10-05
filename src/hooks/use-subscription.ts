import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "./use-auth";

interface SubscriptionStatus {
  isActive: boolean;
  planName: string;
  canCreateWorkflows: boolean;
  workflowLimit: number;
  currentWorkflowCount: number;
  isTrialing: boolean;
  trialEndsAt?: number;
}

export function useSubscriptionStatus(): SubscriptionStatus {
  const { isAuthenticated } = useAuth();
  const currentUser = useQuery(api.users.currentUser, isAuthenticated ? {} : "skip");
  const subscription = useQuery(api.subscriptions.getUserSubscription, isAuthenticated ? {} : "skip");
  const userWorkflows = useQuery(api.workflows.getUserWorkflows, isAuthenticated ? {} : "skip");
  
  // Default free plan limits
  const FREE_WORKFLOW_LIMIT = 3;
  const STARTER_WORKFLOW_LIMIT = 10;
  const PRO_WORKFLOW_LIMIT = Infinity;

  if (!isAuthenticated || !currentUser) {
    return {
      isActive: false,
      planName: "guest",
      canCreateWorkflows: false,
      workflowLimit: 0,
      currentWorkflowCount: 0,
      isTrialing: false,
    };
  }

  // Get plan details from subscription or default to free
  const planName = subscription?.planName || "free";
  const isTrialing = subscription?.status === "trialing";
  const trialEndsAt = subscription?.currentPeriodEnd;
  const currentWorkflowCount = userWorkflows?.length ?? 0;

  let workflowLimit = FREE_WORKFLOW_LIMIT;
  if (planName === "starter") workflowLimit = STARTER_WORKFLOW_LIMIT;
  if (planName === "pro" || planName === "enterprise") workflowLimit = PRO_WORKFLOW_LIMIT;

  const canCreateWorkflows = currentWorkflowCount < workflowLimit;

  return {
    isActive: subscription?.status === "active" || subscription?.status === "trialing" || false,
    planName,
    canCreateWorkflows,
    workflowLimit,
    currentWorkflowCount,
    isTrialing,
    trialEndsAt,
  };
}