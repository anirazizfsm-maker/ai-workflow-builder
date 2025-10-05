import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Play, Pause, Trash2, AlertCircle, CheckCircle2, Clock, Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import type { Id } from "@/convex/_generated/dataModel";

interface Workflow {
  _id: Id<"workflows">;
  title: string;
  category: string;
  status: "draft" | "active" | "paused" | "failed";
}

interface WorkflowListProps {
  workflows: Workflow[];
}

export function WorkflowList({ workflows }: WorkflowListProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { canCreateWorkflows, workflowLimit } = useSubscriptionStatus();
  const updateStatus = useMutation(api.workflows.updateWorkflowStatus);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);

  // Optimistic state for workflows
  const [optimisticWorkflows, setOptimisticWorkflows] = useState<Workflow[]>([]);
  const displayWorkflows = [...workflows, ...optimisticWorkflows];

  const getStatusIcon = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "paused":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleToggleStatus = async (w: Workflow) => {
    const next = w.status === "active" ? "paused" : "active";
    
    // Optimistic update
    const optimisticIndex = optimisticWorkflows.findIndex(ow => ow._id === w._id);
    if (optimisticIndex >= 0) {
      const updated = [...optimisticWorkflows];
      updated[optimisticIndex] = { ...updated[optimisticIndex], status: next };
      setOptimisticWorkflows(updated);
    }

    try {
      await updateStatus({ workflowId: w._id, status: next });
      toast.success(`${w.title} ${next === "active" ? "activated" : "paused"} ✅`, {
        description: next === "active" ? "Workflow is now running" : "Workflow has been paused",
      });
    } catch (e: any) {
      // Revert optimistic update on error
      if (optimisticIndex >= 0) {
        const reverted = [...optimisticWorkflows];
        reverted[optimisticIndex] = { ...reverted[optimisticIndex], status: w.status };
        setOptimisticWorkflows(reverted);
      }
      toast.error("Failed to update workflow", {
        description: e?.message || "Please try again",
      });
    }
  };

  const handleDelete = async (workflowId: Id<"workflows">) => {
    const workflow = displayWorkflows.find(w => w._id === workflowId);
    if (!workflow) return;

    // Optimistic delete
    setOptimisticWorkflows(prev => prev.filter(ow => ow._id !== workflowId));

    try {
      await deleteWorkflow({ workflowId });
      toast.success(`${workflow.title} deleted ✅`, {
        description: "Workflow has been removed",
      });
    } catch (e: any) {
      // Revert optimistic delete on error
      setOptimisticWorkflows(prev => [...prev, workflow]);
      toast.error("Failed to delete workflow", {
        description: e?.message || "Please try again",
      });
    }
  };

  return (
    <div className="space-y-3">
      {workflows.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-4">No workflows yet</p>
          <Button
            size="sm"
            onClick={() => navigate("/workflow/new")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Your First Workflow
          </Button>
        </div>
      ) : (
        workflows.map((workflow) => (
          <div
            key={workflow._id}
            className="flex items-center justify-between border rounded-md p-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(workflow.status)}
                <Badge variant={getStatusVariant(workflow.status)}>
                  {workflow.status}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="font-medium">{workflow.title}</div>
                <div className="text-xs text-muted-foreground">
                  {workflow.category}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate(`/workflow/${workflow._id}`)}
                title="Edit workflow"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleToggleStatus(workflow)}
              >
                {workflow.status === "active" ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(workflow._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}