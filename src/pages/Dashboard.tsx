import { useMemo } from "react";
import { useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, Pause, Trash2, Bell, TrendingUp, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

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

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: "green" | "blue" | "violet";
}) {
  const ring =
    accent === "green"
      ? "ring-emerald-500/20"
      : accent === "blue"
      ? "ring-blue-500/20"
      : "ring-violet-500/20";
  return (
    <Card className={`bg-background/60 backdrop-blur border ${ring}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-muted">{icon}</div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xl font-semibold">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard that uses Convex (only rendered if Convex is configured)
function ConvexDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const ORG_ID = "demo-org";

  const runs = useQuery(api.workflows.runsPerDay, { orgId: ORG_ID, days: 14 }) ?? [];
  const notifications = useQuery(api.workflows.getNotifications, { orgId: ORG_ID }) ?? [];
  const settings = useQuery(api.workflows.getSettings, { orgId: ORG_ID });
  const myWorkflows = useQuery(api.workflows.getUserWorkflows, {}) ?? [];

  const updateStatus = useMutation(api.workflows.updateWorkflowStatus);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);

  const todayCount = runs.length ? runs[runs.length - 1].count : 0;
  const activeCount = myWorkflows.filter((w) => w.status === "active").length;
  const hourlyRate = settings?.hourlyRate ?? 25;
  const hoursSaved = Math.round((todayCount * 0.25 + activeCount * 0.5) * 10) / 10;
  const dollarsSaved = Math.round(hoursSaved * hourlyRate);

  const onToggle = async (w: (typeof myWorkflows)[number]) => {
    const next = w.status === "active" ? "paused" : "active";
    await updateStatus({ workflowId: w._id, status: next as any });
    toast(`${w.title} ${next === "active" ? "activated" : "paused"}.`);
  };

  const onDelete = async (w: (typeof myWorkflows)[number]) => {
    await deleteWorkflow({ workflowId: w._id });
    toast(`${w.title} deleted.`);
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Clock className="h-5 w-5 text-muted-foreground" />} label="Today's Runs" value={todayCount} accent="blue" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} label="Active Workflows" value={activeCount} accent="violet" />
        <StatCard icon={<Clock className="h-5 w-5 text-muted-foreground" />} label="Hours Saved" value={hoursSaved} accent="green" />
        <StatCard icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} label="Savings ($)" value={dollarsSaved} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Section title="Runs (last 14 days)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={runs.map((r) => ({ date: r.date.slice(5), count: r.count }))}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="My Workflows" action={<Button size="sm" onClick={() => toast("Use the AI Builder to create workflows from prompts.")}>New</Button>}>
          <div className="space-y-3">
            {myWorkflows.length === 0 && (
              <p className="text-sm text-muted-foreground">No workflows yet. Create one to get started.</p>
            )}
            {myWorkflows.map((w) => (
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
        </Section>

        <Section title="Notifications" action={<Button size="icon" variant="ghost"><Bell className="h-4 w-4" /></Button>}>
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
        </Section>
      </div>
    </div>
  );
}

// Demo dashboard shown if Convex isn't configured
function DemoDashboard() {
  const navigate = useNavigate();
  const { runsPerDay, workflows, notifications, stats } = useDemoData();

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard (Demo)</h1>
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={runsPerDay}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
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