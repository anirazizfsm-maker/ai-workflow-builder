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
import { Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
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
  const updateStatus = useMutation(api.workflows.updateWorkflowStatus);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);
  const createWorkflow = useMutation(api.workflows.createWorkflow);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [wfForm, setWfForm] = useState({
    title: "",
    description: "",
    category: "",
    prompt: "",
    jsonConfig: "{}",
  });

  const onToggle = async (w: Workflow) => {
    const next = w.status === "active" ? "paused" : "active";
    try {
      await updateStatus({ workflowId: w._id, status: next });
      toast.success(`${w.title} ${next === "active" ? "activated" : "paused"} ✅`, {
        description: next === "active" ? "Workflow is now running" : "Workflow has been paused",
      });
    } catch (e: any) {
      toast.error("Failed to update workflow", {
        description: e?.message || "Please try again",
      });
    }
  };

  const onDelete = async (w: Workflow) => {
    try {
      await deleteWorkflow({ workflowId: w._id });
      toast.success(`${w.title} deleted ✅`, {
        description: "Workflow has been removed",
      });
    } catch (e: any) {
      toast.error("Failed to delete workflow", {
        description: e?.message || "Please try again",
      });
    }
  };

  const openCreateWorkflow = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    setWfForm({
      title: "",
      description: "",
      category: "",
      prompt: "",
      jsonConfig: "{}",
    });
    setCreateOpen(true);
  };

  const saveWorkflow = async () => {
    if (!wfForm.title || !wfForm.description) {
      toast("Title and description are required");
      return;
    }
    try {
      await createWorkflow({
        title: wfForm.title,
        description: wfForm.description,
        prompt: wfForm.prompt || wfForm.description,
        jsonConfig: wfForm.jsonConfig || "{}",
        category: wfForm.category || "general",
      });
      toast.success("Workflow created successfully ✅", {
        description: "You can now activate and run your workflow",
      });
      setCreateOpen(false);
    } catch (e: any) {
      toast.error("Failed to create workflow", {
        description: e?.message || "Please try again",
      });
    }
  };

  return (
    <>
      <div className="space-y-3">
        {workflows.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {isAuthenticated ? "No workflows yet. Create one to get started." : "Sign in to create and manage workflows."}
          </p>
        )}
        {workflows.map((w) => (
          <div key={w._id} className="flex items-center justify-between border rounded-md p-3">
            <div>
              <div className="font-medium">{w.title}</div>
              <div className="text-xs text-muted-foreground">{w.category}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={w.status === "active" ? "default" : "secondary"}>{w.status}</Badge>
              <Button size="icon" variant="ghost" onClick={() => onToggle(w)} title={w.status === "active" ? "Pause" : "Activate"}>
                {w.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDelete(w)} title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Workflow</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input
                value={wfForm.title}
                onChange={(e) => setWfForm({ ...wfForm, title: e.target.value })}
                placeholder="Welcome Email Automation"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={wfForm.description}
                onChange={(e) => setWfForm({ ...wfForm, description: e.target.value })}
                placeholder="Sends a welcome email when a user signs up"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Input
                value={wfForm.category}
                onChange={(e) => setWfForm({ ...wfForm, category: e.target.value })}
                placeholder="email | data | social | automation"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Prompt (optional)</Label>
              <Textarea
                value={wfForm.prompt}
                onChange={(e) => setWfForm({ ...wfForm, prompt: e.target.value })}
                placeholder="In natural language, describe the workflow steps"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>JSON Config (optional)</Label>
              <Textarea
                className="font-mono"
                value={wfForm.jsonConfig}
                onChange={(e) => setWfForm({ ...wfForm, jsonConfig: e.target.value })}
                placeholder='{"steps":[...]}'
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveWorkflow}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button className="w-full mt-3" onClick={openCreateWorkflow}>
        New Workflow
      </Button>
    </>
  );
}
