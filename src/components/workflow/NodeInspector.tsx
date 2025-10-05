import { Node } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";

interface NodeInspectorProps {
  node: Node;
  onClose: () => void;
  onUpdate: (node: Node) => void;
}

export function NodeInspector({ node, onClose, onUpdate }: NodeInspectorProps) {
  const [label, setLabel] = useState(node.data.label);
  const [parameters, setParameters] = useState(node.data.parameters || {});

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        label,
        parameters,
      },
    });
  };

  return (
    <div className="w-80 border-l border-white/10 bg-background/60 backdrop-blur overflow-y-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Node Configuration</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Node Type</Label>
            <Input value={node.data.type} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter node label"
            />
          </div>

          <div className="space-y-2">
            <Label>Parameters</Label>
            <div className="space-y-2">
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{key}</Label>
                  <Input
                    value={String(value)}
                    onChange={(e) =>
                      setParameters({ ...parameters, [key]: e.target.value })
                    }
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Credentials</Label>
            <Button variant="outline" className="w-full">
              Connect Account
            </Button>
            <p className="text-xs text-muted-foreground">
              Connect your account to enable this integration
            </p>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
