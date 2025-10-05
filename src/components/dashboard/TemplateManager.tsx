import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel";

interface Template {
  _id: Id<"aiTemplates">;
  name: string;
  description: string;
  category?: string;
  minPlan?: string;
  isActive?: boolean;
  slug?: string;
  jsonSchema?: string;
  tags?: string[];
}

interface TemplateManagerProps {
  templates: Template[];
}

export function TemplateManager({ templates }: TemplateManagerProps) {
  const upsertTemplate = useMutation(api.aiBuilder.upsertTemplate);
  const removeTemplate = useMutation(api.aiBuilder.deleteTemplate);

  const [isTplOpen, setTplOpen] = useState(false);
  const [tplForm, setTplForm] = useState<any>(null);

  const openNewTemplate = () => {
    setTplForm({
      id: undefined,
      slug: "",
      name: "",
      description: "",
      category: "",
      jsonSchema: "",
      minPlan: "free",
      isActive: true,
      tags: [],
    });
    setTplOpen(true);
  };

  const openEditTemplate = (t: Template) => {
    setTplForm({
      id: t._id,
      slug: t.slug ?? "",
      name: t.name ?? "",
      description: t.description ?? "",
      category: t.category ?? "",
      jsonSchema: t.jsonSchema ?? "",
      minPlan: t.minPlan ?? "free",
      isActive: t.isActive ?? true,
      tags: Array.isArray(t.tags) ? t.tags : [],
    });
    setTplOpen(true);
  };

  const saveTemplate = async () => {
    if (!tplForm?.name || !tplForm?.description) {
      toast("Name and description are required");
      return;
    }
    await upsertTemplate({
      id: tplForm.id,
      slug: tplForm.slug || undefined,
      name: tplForm.name,
      description: tplForm.description,
      category: tplForm.category || undefined,
      jsonSchema: tplForm.jsonSchema || undefined,
      minPlan: tplForm.minPlan || undefined,
      isActive: !!tplForm.isActive,
      tags: tplForm.tags?.filter((x: string) => !!x) ?? [],
    });
    toast("Template saved");
    setTplOpen(false);
  };

  const onDeleteTemplate = async (t: Template) => {
    await removeTemplate({ id: t._id });
    toast("Template deleted");
  };

  return (
    <>
      <div className="space-y-3">
        {templates.length === 0 && <p className="text-sm text-muted-foreground">No templates yet.</p>}
        {templates.map((t) => (
          <div key={t._id} className="flex items-center justify-between border rounded-md p-3">
            <div className="min-w-0">
              <div className="font-medium truncate">{t.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {t.category ?? "uncategorized"} • {t.minPlan ?? "free"} • {t.isActive ? "active" : "inactive"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => openEditTemplate(t)}>
                Edit
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onDeleteTemplate(t)} title="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isTplOpen} onOpenChange={setTplOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{tplForm?.id ? "Edit Template" : "New Template"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Name</Label>
              <Input
                value={tplForm?.name ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, name: e.target.value })}
                placeholder="Welcome Email Automation"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={tplForm?.description ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, description: e.target.value })}
                placeholder="Send personalized welcome emails to new users"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Slug (optional)</Label>
              <Input
                value={tplForm?.slug ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, slug: e.target.value })}
                placeholder="welcome_email"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Category (optional)</Label>
              <Input
                value={tplForm?.category ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, category: e.target.value })}
                placeholder="email"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Min Plan (optional)</Label>
              <Input
                value={tplForm?.minPlan ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, minPlan: e.target.value })}
                placeholder="free | pro | enterprise"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Tags (comma separated)</Label>
              <Input
                value={(tplForm?.tags ?? []).join(", ")}
                onChange={(e) =>
                  setTplForm({
                    ...tplForm,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="welcome, onboarding"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>JSON Schema (optional)</Label>
              <Textarea
                value={tplForm?.jsonSchema ?? ""}
                onChange={(e) => setTplForm({ ...tplForm, jsonSchema: e.target.value })}
                placeholder='{"trigger":"user_signup","actions":["send_email","add_to_crm"]}'
                className="font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                checked={!!tplForm?.isActive}
                onChange={(e) => setTplForm({ ...tplForm, isActive: e.target.checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setTplOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button className="w-full mt-3" onClick={openNewTemplate}>
        New Template
      </Button>
    </>
  );
}
