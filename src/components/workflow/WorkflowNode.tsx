import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Play,
  GitBranch,
  Mail,
  Database,
  Calendar,
  MessageSquare,
} from "lucide-react";

const iconMap: Record<string, any> = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  email: Mail,
  database: Database,
  calendar: Calendar,
  message: MessageSquare,
};

export const WorkflowNode = memo(({ data, selected }: NodeProps) => {
  const Icon = iconMap[data.type] || Play;
  
  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "from-green-500/20 to-green-600/20 border-green-500/50";
      case "action":
        return "from-blue-500/20 to-blue-600/20 border-blue-500/50";
      case "condition":
        return "from-yellow-500/20 to-yellow-600/20 border-yellow-500/50";
      default:
        return "from-gray-500/20 to-gray-600/20 border-gray-500/50";
    }
  };

  return (
    <Card
      className={`
        min-w-[200px] bg-gradient-to-br backdrop-blur border-2 transition-all
        ${getNodeColor(data.type)}
        ${selected ? "ring-2 ring-primary shadow-lg scale-105" : ""}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-background/40">
            <Icon className="h-4 w-4" />
          </div>
          <Badge variant="outline" className="text-xs">
            {data.type}
          </Badge>
        </div>
        
        <div className="font-medium text-sm">{data.label}</div>
        
        {data.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {Object.keys(data.parameters).length} parameter(s)
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary"
      />
    </Card>
  );
});

WorkflowNode.displayName = "WorkflowNode";
