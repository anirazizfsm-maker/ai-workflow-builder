import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

const templates = [
  {
    id: "social-media-poster",
    name: "Social Media Auto Poster",
    description: "Automatically post content to multiple social media platforms on a schedule",
    icon: Share2,
    category: "social",
  },
  {
    id: "lead-tracker",
    name: "Lead Tracker",
    description: "Track and manage leads from multiple sources in one centralized system",
    icon: Users,
    category: "crm",
  },
  {
    id: "email-reminder-bot",
    name: "Email Reminder Bot",
    description: "Send automated email reminders based on triggers and schedules",
    icon: Mail,
    category: "email",
  },
];

export function StarterTemplates() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleUseTemplate = (template: typeof templates[0]) => {
    if (!isAuthenticated) {
      toast.info("Sign in to use this template", {
        description: "Create an account to start building workflows",
      });
      navigate("/auth");
      return;
    }

    toast.success(`${template.name} template loaded ✅`, {
      description: "You can now customize and activate this workflow",
    });
  };

  return (
    <div className="space-y-3">
      {templates.map((template) => {
        const Icon = template.icon;
        return (
          <Card
            key={template.id}
            className="bg-background/60 backdrop-blur border hover:border-primary/50 transition-all"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="w-full sm:w-auto"
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
