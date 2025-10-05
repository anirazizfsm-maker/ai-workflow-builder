import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface Notification {
  _id: Id<"notifications">;
  message: string;
  severity: "info" | "warning" | "error";
  _creationTime: number;
  readAt?: number;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isLoading?: boolean;
}

export function NotificationPanel({ notifications, isLoading }: NotificationPanelProps) {
  const markRead = useMutation(api.workflows.markNotificationRead);

  const handleDismiss = async (notificationId: Id<"notifications">) => {
    try {
      await markRead({ notificationId });
    } catch (error) {
      console.error("Failed to dismiss notification:", error);
    }
  };

  // Filter out notifications older than 24 hours that are already read
  const recentNotifications = notifications.filter((n) => {
    const age = Date.now() - n._creationTime;
    const isOld = age > 24 * 60 * 60 * 1000;
    return !isOld || !n.readAt;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-md p-3 animate-pulse">
            <div className="h-5 w-16 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentNotifications.length === 0 && (
        <p className="text-sm text-muted-foreground">No notifications.</p>
      )}
      {recentNotifications.map((n) => (
        <div key={n._id} className="border rounded-md p-3 relative group">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge
                variant={
                  n.severity === "error"
                    ? "destructive"
                    : n.severity === "warning"
                    ? "default"
                    : "secondary"
                }
                className="mb-2"
              >
                {n.severity}
              </Badge>
              <div className="text-sm">{n.message}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(n._creationTime).toLocaleString()}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDismiss(n._id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}