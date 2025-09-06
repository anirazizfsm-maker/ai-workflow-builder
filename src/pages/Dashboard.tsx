import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Play, Pause, Trash2, Settings, Zap, BarChart3, TrendingUp, Bell, BellOff, Download, DollarSign, Clock, Target, Lightbulb } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Input as TextInput } from "@/components/ui/input";
import { Pencil, PlusCircle } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { FAQ } from "@/types/faq";
import ChipsetBackground from "@/components/ChipsetBackground";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Add a one-time redirect guard to prevent repeated navigations causing re-renders
  const [didRedirect, setDidRedirect] = useState(false);

  // Add redirect effect with guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !didRedirect) {
      setDidRedirect(true);
      navigate("/auth", { replace: true });
    }
  }, [isLoading, isAuthenticated, didRedirect, navigate]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Add: memoized time windows to avoid changing useQuery args on each render
  const thirtyDaysAgo = useMemo(() => Date.now() - 30 * 24 * 60 * 60 * 1000, []);
  const monthStart = thirtyDaysAgo;

  const workflows = useQuery(api.workflows.getUserWorkflows);
  const createWorkflow = useMutation(api.workflows.createWorkflow);
  const updateWorkflowStatus = useMutation(api.workflows.updateWorkflowStatus);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);
  const generateWorkflowJSON = useAction(api.workflowActions.generateWorkflowJSON);
  const upgradeWithAI = useAction(api.workflowActions.upgradeWithAI);

  // Analytics data
  const runsPerDay = useQuery(api.workflows.runsPerDay, { orgId: "demo-org", days: 30 });
  const distributionByCategory = useQuery(api.workflows.distributionByCategory, { 
    orgId: "demo-org", 
    since: thirtyDaysAgo, // changed: memoized
  });
  const settings = useQuery(api.workflows.getSettings, { orgId: "demo-org" });
  const savingsOverTime = useQuery(api.workflows.savingsOverTime, {
    orgId: "demo-org",
    since: thirtyDaysAgo, // changed: memoized
    hourlyRate: settings?.hourlyRate || 25,
  });
  const perWorkflowSavings = useQuery(api.workflows.perWorkflowSavings, {
    orgId: "demo-org",
    month: monthStart, // changed: memoized
  });
  // moved: useAction hook defined below as fetchBusinessSuggestions
  const notifications = useQuery(api.workflows.getNotifications, { orgId: "demo-org" });

  const updateSettings = useMutation(api.workflows.updateSettings);
  const markNotificationRead = useMutation(api.workflows.markNotificationRead);

  const faqs = useQuery(api.faqs.getAllFAQs);
  const createFAQ = useMutation(api.faqs.createFAQ);
  const updateFAQ = useMutation(api.faqs.updateFAQ);
  const removeFAQ = useMutation(api.faqs.deleteFAQ);

  const isAdmin = user?.role === "admin";

  const [newWorkflow, setNewWorkflow] = useState({
    title: "",
    description: "",
    prompt: "",
    category: "automation",
  });

  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "General",
    tags: "" as string, // comma separated in UI
    isActive: true,
  });

  // Loading and UI state for FAQs
  const isFaqsLoading = faqs === undefined;
  const [isSavingFaq, setIsSavingFaq] = useState(false);
  const [deletingFaqId, setDeletingFaqId] = useState<string | null>(null);

  const [workflowErrors, setWorkflowErrors] = useState<{ title?: string; prompt?: string; category?: string; description?: string }>({});
  const [faqErrors, setFaqErrors] = useState<{ question?: string; answer?: string; category?: string; tags?: string }>({});
  const [hourlyRateInput, setHourlyRateInput] = useState("");

  // Chart configurations
  const chartConfig = {
    count: { label: "Workflows", color: "#8b5cf6" },
    automation: { label: "Automation", color: "#8b5cf6" },
    email: { label: "Email", color: "#06b6d4" },
    data: { label: "Data", color: "#10b981" },
    social: { label: "Social", color: "#f59e0b" },
    reporting: { label: "Reporting", color: "#ef4444" },
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  const validateWorkflow = (w: typeof newWorkflow) => {
    const errs: typeof workflowErrors = {};
    const title = (w.title || "").trim();
    const prompt = (w.prompt || "").trim();
    const description = (w.description || "").trim();
    const category = (w.category || "").trim();

    if (!title) errs.title = "Title is required";
    else if (title.length < 3) errs.title = "Title must be at least 3 characters";
    else if (title.length > 80) errs.title = "Title must be at most 80 characters";

    if (!prompt) errs.prompt = "Description of your workflow is required";
    else if (prompt.length < 10) errs.prompt = "Please provide at least 10 characters";
    else if (prompt.length > 1000) errs.prompt = "Please keep under 1000 characters";

    if (!category) errs.category = "Category is required";

    if (description && description.length > 200) errs.description = "Description must be at most 200 characters";

    return errs;
  };

  const validateFaq = (f: typeof faqForm) => {
    const errs: typeof faqErrors = {};
    const question = (f.question || "").trim();
    const answer = (f.answer || "").trim();
    const category = (f.category || "").trim();
    const tagsArray = (f.tags || "")
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!question) errs.question = "Question is required";
    else if (question.length > 300) errs.question = "Max 300 characters";

    if (!answer) errs.answer = "Answer is required";
    else if (answer.length > 5000) errs.answer = "Max 5000 characters";

    if (!category) errs.category = "Category is required";

    if (tagsArray.length > 20) errs.tags = "Too many tags (max 20)";
    else if (tagsArray.some((t) => t.length > 40)) errs.tags = "Each tag must be ≤ 40 characters";

    return errs;
  };

  type Suggestion = {
    type: "new_automation" | "bottleneck" | "profit_idea" | string;
    message: string;
    action: string;
  };

  const fetchBusinessSuggestions = useAction(api.workflowActions.getBusinessSuggestions);
  const [businessSuggestions, setBusinessSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchBusinessSuggestions({ orgId: "demo-org" })
      .then((res) => {
        if (isMounted && Array.isArray(res)) setBusinessSuggestions(res as Suggestion[]);
      })
      .catch(() => {
        if (isMounted) setBusinessSuggestions([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FF0080] flex items-center justify-center">
        <div className="text-4xl font-bold text-black">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleCreateWorkflow = async () => {
    const errs = validateWorkflow(newWorkflow);
    setWorkflowErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.values(errs)[0];
      if (first) toast(first);
      return;
    }

    try {
      // Generate workflow JSON using AI
      const result = await generateWorkflowJSON({ prompt: newWorkflow.prompt });
      
      if (result.success) {
        await createWorkflow({
          title: newWorkflow.title || result.title,
          description: newWorkflow.description || result.description,
          prompt: newWorkflow.prompt,
          jsonConfig: JSON.stringify(result.workflowJSON, null, 2),
          category: newWorkflow.category,
        });
        
        toast("Workflow created successfully! 🚀");
        setIsCreateDialogOpen(false);
        setNewWorkflow({ title: "", description: "", prompt: "", category: "automation" });
        setWorkflowErrors({});
      }
    } catch (error) {
      toast("Failed to create workflow. Please try again.");
    }
  };

  const handleStatusToggle = async (workflowId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      await updateWorkflowStatus({ workflowId: workflowId as any, status: newStatus as any });
      toast(`Workflow ${newStatus === "active" ? "activated" : "paused"}!`);
    } catch (error) {
      toast("Failed to update workflow status.");
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    try {
      await deleteWorkflow({ workflowId: workflowId as any });
      toast("Workflow deleted successfully!");
    } catch (error) {
      toast("Failed to delete workflow.");
    }
  };

  const handleUpgradeWithAI = async (workflowId: string) => {
    try {
      const result = await upgradeWithAI({ workflowId: workflowId as any });
      if (result.success) {
        toast(`✨ ${result.message}`);
      }
    } catch (error) {
      toast("Failed to upgrade workflow.");
    }
  };

  const handleUpdateHourlyRate = async () => {
    const rate = parseFloat(hourlyRateInput);
    if (isNaN(rate) || rate <= 0) {
      toast("Please enter a valid hourly rate");
      return;
    }

    try {
      await updateSettings({ orgId: "demo-org", hourlyRate: rate });
      toast("Hourly rate updated successfully!");
      setHourlyRateInput("");
    } catch (error) {
      toast("Failed to update hourly rate.");
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch("/v1/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: "demo-org" }),
      });
      
      const result = await response.json();
      if (result.success) {
        window.open(result.reportUrl, '_blank');
        toast("Report exported successfully!");
      }
    } catch (error) {
      toast("Failed to export report.");
    }
  };

  const totalSavings = perWorkflowSavings?.reduce((sum, s) => sum + s.dollars, 0) || 0;
  const totalHours = perWorkflowSavings?.reduce((sum, s) => sum + s.hours, 0) || 0;
  const roi = settings ? Math.round((totalSavings / (settings.planPriceCents / 100)) * 100) / 100 : 0;
  const unreadNotifications = notifications?.filter(n => !n.readAt) || [];

  // FAQ functions (keep existing)
  const openCreateFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: "", answer: "", category: "General", tags: "", isActive: true });
    setFaqErrors({});
    setIsFaqDialogOpen(true);
  };

  const openEditFaq = (faq: any) => {
    setEditingFaqId(faq._id);
    setFaqForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      tags: (faq.tags || []).join(", "),
      isActive: faq.isActive,
    });
    setFaqErrors({});
    setIsFaqDialogOpen(true);
  };

  const handleSaveFaq = async () => {
    const errs = validateFaq(faqForm);
    setFaqErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.values(errs)[0];
      if (first) toast(first);
      return;
    }

    try {
      setIsSavingFaq(true);
      const tagsArray = faqForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingFaqId) {
        await updateFAQ({
          id: editingFaqId as any,
          question: faqForm.question.trim(),
          answer: faqForm.answer.trim(),
          category: faqForm.category.trim(),
          tags: tagsArray,
          isActive: faqForm.isActive,
        });
        toast("FAQ updated");
      } else {
        await createFAQ({
          question: faqForm.question.trim(),
          answer: faqForm.answer.trim(),
          category: faqForm.category.trim(),
          tags: tagsArray,
        });
        toast("FAQ created");
      }

      setIsFaqDialogOpen(false);
    } catch (e: any) {
      toast(e?.message || "Failed to save FAQ. Check your connection and try again.");
    } finally {
      setIsSavingFaq(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      setDeletingFaqId(id);
      await removeFAQ({ id: id as any });
      toast("FAQ deleted");
    } catch (e: any) {
      toast(e?.message || "Failed to delete FAQ.");
    } finally {
      setDeletingFaqId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden dark">
      <ChipsetBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/80"
      />

      <header className="sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6 pt-[env(safe-area-inset-top)]">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer select-none text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow group"
            onClick={() => navigate("/")}
          >
            <span className="relative z-10">LETHIMDO</span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-white/60 opacity-0 blur-[1px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2200ms_infinite]"
            >
              LETHIMDO
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-white/40 opacity-0 blur-[0.5px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2000ms_infinite]"
            >
              LETHIMDO
            </span>
          </motion.h1>

          <div className="flex items-center gap-3">
            <div className="text-white/90 font-semibold hidden md:block">
              Welcome, {user?.name || user?.email || "User"}!
            </div>
            <Button
              onClick={() => signOut()}
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-2 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:shadow-lg hover:shadow-white/20"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4 md:p-6 text-white">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 md:mb-8 w-full overflow-x-auto bg-white/10 backdrop-blur-xl border border-white/15 inline-flex items-center md:grid md:grid-cols-5 gap-1 rounded-xl p-1 no-scrollbar h-10">
            <TabsTrigger value="overview" className="shrink-0 px-3 py-2 text-sm text-white data-[state=active]:text-black">
              <Zap className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="shrink-0 px-3 py-2 text-sm text-white data-[state=active]:text-black">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="savings" className="shrink-0 px-3 py-2 text-sm text-white data-[state=active]:text-black">
              <DollarSign className="w-4 h-4 mr-2" />
              Savings
            </TabsTrigger>
            <TabsTrigger value="advisor" className="shrink-0 px-3 py-2 text-sm text-white data-[state=active]:text-black">
              <Lightbulb className="w-4 h-4 mr-2" />
              AI Advisor
            </TabsTrigger>
            <TabsTrigger value="notifications" className="relative shrink-0 px-3 py-2 text-sm text-white data-[state=active]:text-black">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                  {unreadNotifications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-extrabold flex items-center gap-2">
                      <Zap className="h-6 w-6" />
                      Total Workflows
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold text-white">
                      {workflows?.length || 0}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-extrabold flex items-center gap-2">
                      <Play className="h-6 w-6" />
                      Active
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold text-white">
                      {workflows?.filter(w => w.status === "active").length || 0}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white font-extrabold flex items-center gap-2">
                      <BarChart3 className="h-6 w-6" />
                      Executions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-extrabold text-white">247</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Create Workflow Button */}
            <div className="mb-8">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-white/25">
                    <Plus className="mr-2 h-6 w-6" />
                    Create New Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl max-w-2xl text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-extrabold">Create AI Workflow</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="font-semibold mb-2 block">Workflow Title</label>
                        <Input
                          value={newWorkflow.title}
                          onChange={(e) => {
                            setNewWorkflow({ ...newWorkflow, title: e.target.value });
                            if (workflowErrors.title) setWorkflowErrors((p) => ({ ...p, title: undefined }));
                          }}
                          aria-invalid={!!workflowErrors.title}
                          aria-describedby={workflowErrors.title ? "wf-title-error" : undefined}
                          placeholder="Enter workflow title..."
                          className={`rounded-xl border ${workflowErrors.title ? "border-red-500/70" : "border-white/20"} bg-white/10 text-white placeholder:text-white/50`}
                        />
                        {workflowErrors.title && (
                          <p id="wf-title-error" className="mt-1 text-sm text-red-300">{workflowErrors.title}</p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold mb-2 block">Category</label>
                        <Select
                          value={newWorkflow.category}
                          onValueChange={(value) => {
                            setNewWorkflow({ ...newWorkflow, category: value });
                            if (workflowErrors.category) setWorkflowErrors((p) => ({ ...p, category: undefined }));
                          }}
                        >
                          <SelectTrigger className={`rounded-xl border ${workflowErrors.category ? "border-red-500/70" : "border-white/20"} bg-white/10 text-white`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-black/60 border border-white/20 text-white">
                            <SelectItem value="automation">Automation</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="data">Data Processing</SelectItem>
                            <SelectItem value="social">Social Media</SelectItem>
                            <SelectItem value="reporting">Reporting</SelectItem>
                          </SelectContent>
                        </Select>
                        {workflowErrors.category && (
                          <p className="mt-1 text-sm text-red-300">{workflowErrors.category}</p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold mb-2 block">Describe your workflow</label>
                        <Textarea
                          value={newWorkflow.prompt}
                          onChange={(e) => {
                            setNewWorkflow({ ...newWorkflow, prompt: e.target.value });
                            if (workflowErrors.prompt) setWorkflowErrors((p) => ({ ...p, prompt: undefined }));
                          }}
                          aria-invalid={!!workflowErrors.prompt}
                          aria-describedby={workflowErrors.prompt ? "wf-prompt-error" : undefined}
                          placeholder="Describe what you want to automate..."
                          className={`rounded-xl border ${workflowErrors.prompt ? "border-red-500/70" : "border-white/20"} bg-white/10 text-white placeholder:text-white/50 min-h-[120px]`}
                        />
                        {workflowErrors.prompt && (
                          <p id="wf-prompt-error" className="mt-1 text-sm text-red-300">{workflowErrors.prompt}</p>
                        )}
                      </div>
                      <div>
                        <label className="font-semibold mb-2 block">Description (optional)</label>
                        <Input
                          value={newWorkflow.description}
                          onChange={(e) => {
                            setNewWorkflow({ ...newWorkflow, description: e.target.value });
                            if (workflowErrors.description) setWorkflowErrors((p) => ({ ...p, description: undefined }));
                          }}
                          aria-invalid={!!workflowErrors.description}
                          aria-describedby={workflowErrors.description ? "wf-desc-error" : undefined}
                          placeholder="Brief description..."
                          className={`rounded-xl border ${workflowErrors.description ? "border-red-500/70" : "border-white/20"} bg-white/10 text-white placeholder:text-white/50`}
                        />
                        {workflowErrors.description && (
                          <p id="wf-desc-error" className="mt-1 text-sm text-red-300">{workflowErrors.description}</p>
                        )}
                      </div>
                      <Button
                        onClick={handleCreateWorkflow}
                        className="w-full rounded-xl border border-white/15 bg-white/10 py-3 font-bold text-white backdrop-blur-md hover:bg-white/20 disabled:opacity-60"
                        disabled={!newWorkflow.prompt}
                      >
                        Generate Workflow
                      </Button>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Workflows Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {workflows?.map((workflow, index) => (
                <motion.div
                  key={workflow._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white font-extrabold text-lg">
                          {workflow.title}
                        </CardTitle>
                        <Badge
                          className={`rounded-full border border-white/20 ${
                            workflow.status === "active"
                              ? "bg-emerald-400/20 text-emerald-200"
                              : workflow.status === "paused"
                              ? "bg-amber-400/20 text-amber-200"
                              : "bg-white/10 text-white/80"
                          }`}
                        >
                          {workflow.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-white/80 font-medium text-sm">{workflow.description}</p>
                      <Badge className="rounded-full border border-white/20 bg-white/10 text-white w-fit">
                        {workflow.category.toUpperCase()}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onClick={() => handleStatusToggle(workflow._id, workflow.status)}
                          className={`rounded-xl border border-white/20 font-semibold text-white ${
                            workflow.status === "active"
                              ? "bg-white/10 hover:bg-white/20"
                              : "bg-emerald-500/20 hover:bg-emerald-500/30"
                          }`}
                        >
                          {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleUpgradeWithAI(workflow._id)}
                          className="rounded-xl border border-white/20 bg-purple-500/20 text-purple-100 hover:bg-purple-500/30"
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteWorkflow(workflow._id)}
                          className="rounded-xl bg-rose-500/20 text-rose-100 border border-white/20 hover:bg-rose-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {workflows?.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-extrabold text-white mb-4">No workflows yet</h3>
                  <p className="text-white/80 mb-6">
                    Create your first AI-powered workflow to get started!
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="rounded-xl border border-white/15 bg-white/10 px-5 py-2 font-semibold text-white backdrop-blur-md hover:bg-white/20"
                  >
                    Create Workflow
                  </Button>
                </div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-white">Analytics & Reports</h2>
              <Button
                onClick={handleExportReport}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur-md hover:bg-white/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Workflows per Day */}
              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-extrabold">Workflows per Day (Last 30 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[220px] md:h-[300px]">
                    <BarChart
                      data={runsPerDay || []}
                      margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                      barCategoryGap="20%"
                      barGap={2}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Distribution by Category */}
              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white font-extrabold">Workflows by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[220px] md:h-[300px]">
                    <PieChart>
                      <Pie
                        data={distributionByCategory || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(distributionByCategory || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Savings Over Time */}
              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white font-extrabold">Savings Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[220px] md:h-[300px]">
                    <LineChart data={savingsOverTime || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="t" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="dollarsSaved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-white">Savings Dashboard</h2>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Hourly rate ($)"
                  value={hourlyRateInput}
                  onChange={(e) => setHourlyRateInput(e.target.value)}
                  className="w-32 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50"
                />
                <Button
                  onClick={handleUpdateHourlyRate}
                  className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur-md hover:bg-white/20"
                >
                  Update Rate
                </Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-extrabold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Hours Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-white">
                    {Math.round(totalHours)}h
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-extrabold flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Money Saved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-white">
                    ${Math.round(totalSavings)}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-extrabold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-white">
                    {roi}x
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-extrabold flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Hourly Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-white">
                    ${settings?.hourlyRate || 25}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Per-Workflow Savings */}
            <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-extrabold">Savings by Workflow (This Month)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {perWorkflowSavings?.map((saving, index) => (
                    <div key={saving.workflowId} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <h4 className="font-semibold text-white">{saving.title}</h4>
                        <p className="text-white/70 text-sm">{Math.round(saving.hours * 10) / 10} hours saved</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${Math.round(saving.dollars)}</div>
                      </div>
                    </div>
                  ))}
                  {(!perWorkflowSavings || perWorkflowSavings.length === 0) && (
                    <div className="text-center py-8 text-white/70">
                      No workflow savings data available yet. Run some workflows to see your savings!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advisor" className="space-y-8">
            <h2 className="text-3xl font-extrabold text-white">AI Business Advisor</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessSuggestions?.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white font-extrabold text-lg">
                          <Badge className={`rounded-full mr-2 ${
                            suggestion.type === "new_automation" ? "bg-blue-500/20 text-blue-200" :
                            suggestion.type === "bottleneck" ? "bg-red-500/20 text-red-200" :
                            suggestion.type === "profit_idea" ? "bg-green-500/20 text-green-200" :
                            "bg-purple-500/20 text-purple-200"
                          }`}>
                            {suggestion.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </CardTitle>
                      </div>
                      <p className="text-white/80 font-medium text-sm">{suggestion.message}</p>
                    </CardHeader>
                    <CardContent>
                      <Button
                        size="sm"
                        onClick={() => toast(`${suggestion.action} clicked! Feature coming soon.`)}
                        className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                      >
                        {suggestion.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {(!businessSuggestions || businessSuggestions.length === 0) && (
                <div className="col-span-2 text-center py-16">
                  <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
                    <Lightbulb className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold text-white mb-4">No suggestions yet</h3>
                    <p className="text-white/80">
                      Create and run some workflows to get personalized AI recommendations!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-white">Smart Notifications</h2>
              <Badge className="bg-white/10 text-white border border-white/20">
                {unreadNotifications.length} unread
              </Badge>
            </div>

            <div className="space-y-4">
              {notifications?.map((notification) => (
                <Card
                  key={notification._id}
                  className={`rounded-2xl border backdrop-blur-xl transition ${
                    notification.readAt
                      ? "border-white/10 bg-white/5"
                      : "border-white/20 bg-white/10"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`rounded-full ${
                            notification.severity === "error" ? "bg-red-500/20 text-red-200" :
                            notification.severity === "warning" ? "bg-amber-500/20 text-amber-200" :
                            "bg-blue-500/20 text-blue-200"
                          }`}>
                            {notification.kind.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={`rounded-full ${
                            notification.severity === "error" ? "bg-red-500/20 text-red-200" :
                            notification.severity === "warning" ? "bg-amber-500/20 text-amber-200" :
                            "bg-blue-500/20 text-blue-200"
                          }`}>
                            {notification.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-white font-medium">{notification.message}</p>
                        <p className="text-white/50 text-sm mt-1">
                          {new Date(notification._creationTime).toLocaleString()}
                        </p>
                      </div>
                      {!notification.readAt && (
                        <Button
                          size="sm"
                          onClick={() => markNotificationRead({ notificationId: notification._id })}
                          className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          <BellOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {(!notifications || notifications.length === 0) && (
                <div className="text-center py-16">
                  <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-8">
                    <Bell className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <h3 className="text-2xl font-extrabold text-white mb-4">No notifications</h3>
                    <p className="text-white/80">
                      You're all caught up! Notifications will appear here when workflows fail or need attention.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Admin: FAQ Management */}
        {isAdmin && (
          <div className="mb-10 mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                FAQ Management
              </h2>
              <Button
                onClick={openCreateFaq}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 font-semibold text-white backdrop-blur-md hover:bg-white/20"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add FAQ
              </Button>
            </div>

            {isFaqsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-4 animate-pulse">
                    <div className="h-4 w-2/3 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-white/10 rounded mb-1.5" />
                    <div className="h-3 w-1/3 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs?.map((faq: FAQ) => (
                <Card
                  key={faq._id}
                  className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-[#0D1164] font-extrabold text-lg tracking-tight">
                        {faq.question}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="rounded-full border border-white/20 bg-white/15 text-[#0D1164] font-semibold backdrop-blur-sm">
                          {faq.category}
                        </Badge>
                        <Badge
                          className={`rounded-full border border-white/20 font-semibold backdrop-blur-sm ${
                            faq.isActive
                              ? "bg-[#00ff80]/20 text-emerald-900"
                              : "bg-white/10 text-neutral-700"
                          }`}
                        >
                          {faq.isActive ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-800 font-medium text-sm mb-3">
                      {faq.answer}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(faq.tags || []).map((t: string, i: number) => (
                        <Badge
                          key={i}
                          className="rounded-full bg-[#640D5F]/20 text-[#640D5F] border border-white/20 backdrop-blur-sm font-semibold"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border border-white/20 text-[#1f2937] bg-white/10 hover:bg-white/20 backdrop-blur-md font-semibold"
                        onClick={() => openEditFaq(faq)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="rounded-xl bg-[#EA2264] text-white border border-white/20 hover:bg-[#d01d58] backdrop-blur-md font-semibold"
                            disabled={deletingFaqId === (faq._id as unknown as string)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#0D1164]">Delete FAQ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove the FAQ.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteFaq(faq._id as unknown as string)}
                              className="bg-[#EA2264] hover:bg-[#d01d58]"
                            >
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
              <DialogContent className="max-w-2xl rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-xl">
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold tracking-tight text-[#0D1164]">
                      {editingFaqId ? "EDIT FAQ" : "ADD FAQ"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        QUESTION
                      </label>
                      <TextInput
                        value={faqForm.question}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, question: e.target.value });
                          if (faqErrors.question) setFaqErrors((p) => ({ ...p, question: undefined }));
                        }}
                        aria-invalid={!!faqErrors.question}
                        aria-describedby={faqErrors.question ? "faq-question-error" : undefined}
                        className={`rounded-xl border ${faqErrors.question ? "border-red-500/70" : "border-white/20"} bg-white/10 backdrop-blur-md font-medium placeholder:text-neutral-500`}
                        placeholder="Enter question..."
                      />
                      {faqErrors.question && (
                        <p id="faq-question-error" className="mt-1 text-sm text-red-600">{faqErrors.question}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        ANSWER
                      </label>
                      <Textarea
                        value={faqForm.answer}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, answer: e.target.value });
                          if (faqErrors.answer) setFaqErrors((p) => ({ ...p, answer: undefined }));
                        }}
                        aria-invalid={!!faqErrors.answer}
                        aria-describedby={faqErrors.answer ? "faq-answer-error" : undefined}
                        className={`rounded-xl border ${faqErrors.answer ? "border-red-500/70" : "border-white/20"} bg-white/10 backdrop-blur-md font-medium min-h-[120px] placeholder:text-neutral-500`}
                        placeholder="Enter answer..."
                      />
                      {faqErrors.answer && (
                        <p id="faq-answer-error" className="mt-1 text-sm text-red-600">{faqErrors.answer}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        CATEGORY
                      </label>
                      <Select
                        value={faqForm.category}
                        onValueChange={(value) => {
                          setFaqForm({ ...faqForm, category: value });
                          if (faqErrors.category) setFaqErrors((p) => ({ ...p, category: undefined }));
                        }}
                      >
                        <SelectTrigger className={`rounded-xl border ${faqErrors.category ? "border-red-500/70" : "border-white/20"} bg-white/10 backdrop-blur-md font-medium`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/40 border border-white/20">
                          <SelectItem value="General">GENERAL</SelectItem>
                          <SelectItem value="Workflows">WORKFLOWS</SelectItem>
                          <SelectItem value="Pricing">PRICING</SelectItem>
                          <SelectItem value="Security">SECURITY</SelectItem>
                        </SelectContent>
                      </Select>
                      {faqErrors.category && (
                        <p className="mt-1 text-sm text-red-600">{faqErrors.category}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        TAGS (comma separated)
                      </label>
                      <TextInput
                        value={faqForm.tags}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, tags: e.target.value });
                          if (faqErrors.tags) setFaqErrors((p) => ({ ...p, tags: undefined }));
                        }}
                        aria-invalid={!!faqErrors.tags}
                        aria-describedby={faqErrors.tags ? "faq-tags-error" : undefined}
                        className={`rounded-xl border ${faqErrors.tags ? "border-red-500/70" : "border-white/20"} bg-white/10 backdrop-blur-md font-medium placeholder:text-neutral-500`}
                        placeholder="e.g. automation, ai, email"
                      />
                      {faqErrors.tags && (
                        <p id="faq-tags-error" className="mt-1 text-sm text-red-600">{faqErrors.tags}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-semibold text-[#1f2937]">
                        ACTIVE
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        className={`rounded-xl border border-white/20 font-semibold backdrop-blur-md ${
                          faqForm.isActive
                            ? "bg-[#00ff80]/20 text-emerald-900"
                            : "bg-white/10 text-neutral-700"
                        }`}
                        onClick={() =>
                          setFaqForm({ ...faqForm, isActive: !faqForm.isActive })
                        }
                      >
                        {faqForm.isActive ? "YES" : "NO"}
                      </Button>
                    </div>

                    <Button
                      onClick={handleSaveFaq}
                      className="w-full rounded-xl bg-gradient-to-r from-[#EA2264] via-[#F78D60] to-[#0D1164] text-white font-bold py-3 shadow-lg shadow-[#EA2264]/25 hover:from-[#EA2264] hover:to-[#640D5F] border border-white/20 backdrop-blur-md"
                      disabled={
                        isSavingFaq || !faqForm.question.trim() || !faqForm.answer.trim()
                      }
                    >
                      {isSavingFaq ? "Saving..." : editingFaqId ? "SAVE CHANGES" : "CREATE FAQ"}
                    </Button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}