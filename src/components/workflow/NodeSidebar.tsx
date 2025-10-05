import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Zap,
  Mail,
  Database,
  Calendar,
  MessageSquare,
  FileText,
  Globe,
  Webhook,
} from "lucide-react";

const nodeTemplates = [
  { type: "trigger", label: "Google Form", icon: FileText, category: "Triggers" },
  { type: "trigger", label: "Webhook", icon: Webhook, category: "Triggers" },
  { type: "trigger", label: "Schedule", icon: Calendar, category: "Triggers" },
  { type: "action", label: "Send Email", icon: Mail, category: "Actions" },
  { type: "action", label: "Update Sheet", icon: Database, category: "Actions" },
  { type: "action", label: "Create Event", icon: Calendar, category: "Actions" },
  { type: "action", label: "Send Message", icon: MessageSquare, category: "Actions" },
  { type: "action", label: "HTTP Request", icon: Globe, category: "Actions" },
];

export function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("label", label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r border-white/10 bg-background/60 backdrop-blur">
      <Card className="border-0 rounded-none h-full">
        <CardHeader>
          <CardTitle className="text-base">Node Library</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Triggers
                </h4>
                <div className="space-y-2">
                  {nodeTemplates
                    .filter((n) => n.category === "Triggers")
                    .map((node, i) => {
                      const Icon = node.icon;
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start gap-2"
                          draggable
                          onDragStart={(e) => onDragStart(e, node.type, node.label)}
                        >
                          <Icon className="h-4 w-4" />
                          {node.label}
                        </Button>
                      );
                    })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                  Actions
                </h4>
                <div className="space-y-2">
                  {nodeTemplates
                    .filter((n) => n.category === "Actions")
                    .map((node, i) => {
                      const Icon = node.icon;
                      return (
                        <Button
                          key={i}
                          variant="outline"
                          className="w-full justify-start gap-2"
                          draggable
                          onDragStart={(e) => onDragStart(e, node.type, node.label)}
                        >
                          <Icon className="h-4 w-4" />
                          {node.label}
                        </Button>
                      );
                    })}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
