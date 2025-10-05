import { Badge } from "@/components/ui/badge";
import type { Id } from "@/convex/_generated/dataModel";

interface Notification {
  _id: Id<"notifications">;
  message: string;
  severity: "info" | "warning" | "error";
}

interface NotificationPanelProps {
  notifications: Notification[];
}

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  return (
    <div className="space-y-3">
      {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications.</p>}
      {notifications.map((n) => (
        <div key={n._id} className="border rounded-md p-3">
          <Badge
            variant={n.severity === "error" ? "destructive" : n.severity === "warning" ? "default" : "secondary"}
            className="mb-2"
          >
            {n.severity}
          </Badge>
          <div className="text-sm">{n.message}</div>
        </div>
      ))}
    </div>
  );
}
