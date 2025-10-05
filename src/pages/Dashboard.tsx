import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, DollarSign, Bell, Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { WorkflowList } from "@/components/dashboard/WorkflowList";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { TemplateManager } from "@/components/dashboard/TemplateManager";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { OnboardingTooltip } from "@/components/OnboardingTooltip";
import { StarterTemplates } from "@/components/dashboard/StarterTemplates";
import { UpgradePlanCard } from "@/components/dashboard/UpgradePlanCard";
import { NotificationSidebar } from "@/components/NotificationSidebar";

// Simple section wrapper
function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <Card className="bg-background/60 backdrop-blur border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Demo data generator
function useDemoData() {
  const days = 14;
  const runsPerDay = useMemo(() => {
    const today = new Date();
    const data: Array<{ date: string; count: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      data.push({
        date: d.toISOString().split("T")[0].slice(5),
        count: Math.floor(Math.random() * 10) + 2,
      });
    }
    return data;
  }, []);
  const workflows = [
    { id: "w1", title: "Welcome Email Automation", status: "active", category: "email" },
    { id: "w2", title: "Data Synchronization", status: "paused", category: "data" },
    { id: "w3", title: "Social Media Posting", status: "active", category: "social" },
  ] as const;
  const notifications = [
    { id: "n1", message: "You're approaching your daily usage limit. Consider upgrading your plan.", severity: "warning" as const },
    { id: "n2", message: "Workflow has failed 3 times in the last 24 hours.", severity: "error" as const },
  ];
  const stats = {
    todayRuns: runsPerDay[runsPerDay.length - 1]?.count ?? 0,
    activeWorkflows: workflows.filter((w) => w.status === "active").length,
    hoursSaved: 3.6,
    dollarsSaved: 90,
  };
  return { days, runsPerDay, workflows, notifications, stats };
}

function ConvexDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const ORG_ID = "demo-org";

  const runs = useQuery(api.workflows.runsPerDay, { orgId: ORG_ID, days: 14 });
  const notifications = useQuery(api.workflows.getNotifications, { orgId: ORG_ID });
  const settings = useQuery(api.workflows.getSettings, { orgId: ORG_ID });
  const myWorkflows = useQuery(api.workflows.getUserWorkflows, {});
  const templates = useQuery(api.aiBuilder.listTemplates, {});

  // Loading states
  const isLoadingRuns = runs === undefined;
  const isLoadingWorkflows = myWorkflows === undefined;
  const isLoadingTemplates = templates === undefined;

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (isAuthenticated && !hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  const todayCount = runs?.length ? runs[runs.length - 1].count : 0;
  const activeCount = myWorkflows?.filter((w) => w.status === "active").length ?? 0;
  const hourlyRate = settings?.hourlyRate ?? 25;
  const hoursSaved = Math.round((todayCount * 0.25 + activeCount * 0.5) * 10) / 10;
  const dollarsSaved = Math.round(hoursSaved * hourlyRate);

  const handleRunDemoWorkflow = () => {
    toast.loading("Running demo workflow...", { id: "demo-workflow" });
    
    setTimeout(() => {
      toast.success("Demo workflow completed successfully ✅", {
        id: "demo-workflow",
        description: "Sign in to create and run real workflows",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] dark:bg-[#0b1120] px-4 md:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <div className="flex items-center gap-2">
          <NotificationSidebar orgId={ORG_ID} />
          {isAuthenticated && (
            <Button variant="outline" onClick={() => navigate("/profile")}>
              Profile
            </Button>
          )}
          {!isAuthenticated && (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </div>
      </div>

      {/* Upgrade Plan Card - show for free users */}
      {isAuthenticated && (
        <div className="mb-4">
          <UpgradePlanCard />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Clock className="h-5 w-5 text-muted-foreground" />} 
          label="Today's Runs" 
          value={todayCount} 
          accent="blue"
          isLoading={isLoadingRuns}
        />
        <StatCard 
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} 
          label="Active Workflows" 
          value={activeCount} 
          accent="violet"
          isLoading={isLoadingWorkflows}
        />
        <StatCard 
          icon={<Clock className="h-5 w-5 text-muted-foreground" />} 
          label="Hours Saved" 
          value={hoursSaved} 
          accent="green"
          isLoading={isLoadingRuns}
        />
        <StatCard 
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} 
          label="Savings ($)" 
          value={dollarsSaved} 
          accent="green"
          isLoading={isLoadingRuns}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Section title="Runs (last 14 days)">
          {isLoadingRuns ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading chart...</div>
            </div>
          ) : (
            <AnalyticsChart data={runs ?? []} />
          )}
        </Section>

        <Section title="My Workflows" action={
          <div className="relative">
            <Button size="sm" onClick={() => !isAuthenticated ? navigate("/auth") : navigate("/workflow/new")}>
              New
            </Button>
            <OnboardingTooltip
              show={showOnboarding}
              onClose={handleCloseOnboarding}
              message="Click here to create your first workflow! Our AI will help you build it step by step."
              position="bottom"
            />
          </div>
        }>
          <WorkflowList workflows={myWorkflows ?? []} />
        </Section>

        <Section title="Notifications">
          <NotificationPanel notifications={notifications ?? []} isLoading={notifications === undefined} />
        </Section>
      </div>

      {/* Starter Templates Section */}
      <div className="mt-4">
        <Section title="Starter Templates">
          <StarterTemplates />
        </Section>
      </div>

      {/* AI Templates Section */}
      <div className="mt-4">
        <Section title="AI Templates">
          {isLoadingTemplates ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-md p-3 animate-pulse">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <TemplateManager templates={templates ?? []} />
          )}
        </Section>
      </div>

      {/* Run Demo Workflow for guests */}
      {!isAuthenticated && (
        <div className="mt-4">
          <Card className="bg-background/60 backdrop-blur border">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2 text-white">Try a Demo Workflow</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how workflows work without signing in
              </p>
              <Button onClick={handleRunDemoWorkflow}>
                Run Demo Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Demo dashboard shown if Convex isn't configured
function DemoDashboard() {
  const navigate = useNavigate();
  const { runsPerDay, workflows, notifications, stats } = useDemoData();

  return (
    <div className="min-h-screen dark bg-[#0b1120] px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Dashboard (Demo)</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign in
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Clock className="h-5 w-5 text-muted-foreground" />} label="Today's Runs" value={stats.todayRuns} accent="blue" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} label="Active Workflows" value={stats.activeWorkflows} accent="violet" />
        <StatCard icon={<Clock className="h-5 w-5 text-muted-foreground" />} label="Hours Saved" value={stats.hoursSaved} accent="green" />
        <StatCard icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} label="Savings ($)" value={stats.dollarsSaved} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Section title="Runs (last 14 days)">
          <AnalyticsChart data={runsPerDay} />
        </Section>

        <Section title="My Workflows" action={<Button size="sm" onClick={() => toast("Connect backend to create real workflows.")}>New</Button>}>
          <div className="space-y-3">
            {workflows.map((w) => (
              <div key={w.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{w.title}</div>
                  <div className="text-xs text-muted-foreground">{w.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={w.status === "active" ? "default" : "secondary"}>{w.status}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => toast("Demo: toggle status")}>
                    {w.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => toast("Demo: delete workflow")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Notifications" action={<Button size="icon" variant="ghost"><Bell className="h-4 w-4" /></Button>}>
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="border rounded-md p-3">
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
        </Section>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Connect Backend</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>To enable live data:</p>
          <ul className="list-disc pl-5">
            <li>Set VITE_CONVEX_URL in your environment</li>
            <li>Run Convex dev server and seed data (demo-org)</li>
            <li>Sign in to start creating real workflows</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const hasConvex = !!import.meta.env.VITE_CONVEX_URL;
  return hasConvex ? <ConvexDashboard /> : <DemoDashboard />;
}