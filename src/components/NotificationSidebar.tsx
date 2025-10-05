import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface NotificationSidebarProps {
  orgId: string;
}

export function NotificationSidebar({ orgId }: NotificationSidebarProps) {
  const notifications = useQuery(api.workflows.getNotifications, { orgId });
  const isLoading = notifications === undefined;

  // Count unread notifications from last 24h
  const unreadCount = notifications?.filter((n) => {
    const age = Date.now() - n._creationTime;
    const isRecent = age <= 24 * 60 * 60 * 1000;
    return isRecent && !n.readAt;
  }).length || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <NotificationPanel notifications={notifications || []} isLoading={isLoading} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
