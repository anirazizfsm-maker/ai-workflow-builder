import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { Plus, Play, Pause, Trash2, Settings, Zap, BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
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

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const workflows = useQuery(api.workflows.getUserWorkflows);
  const createWorkflow = useMutation(api.workflows.createWorkflow);
  const updateWorkflowStatus = useMutation(api.workflows.updateWorkflowStatus);
  const deleteWorkflow = useMutation(api.workflows.deleteWorkflow);
  const generateWorkflowJSON = useAction(api.workflowActions.generateWorkflowJSON);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FF0080] flex items-center justify-center">
        <div className="text-4xl font-bold text-black">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleCreateWorkflow = async () => {
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

  const openCreateFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: "", answer: "", category: "General", tags: "", isActive: true });
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
    setIsFaqDialogOpen(true);
  };

  const handleSaveFaq = async () => {
    try {
      setIsSavingFaq(true);
      const tagsArray = faqForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (editingFaqId) {
        await updateFAQ({
          id: editingFaqId as any,
          question: faqForm.question,
          answer: faqForm.answer,
          category: faqForm.category,
          tags: tagsArray,
          isActive: faqForm.isActive,
        });
        toast("FAQ updated");
      } else {
        await createFAQ({
          question: faqForm.question,
          answer: faqForm.answer,
          category: faqForm.category,
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
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, title: e.target.value })}
                      placeholder="Enter workflow title..."
                      className="rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-2 block">Category</label>
                    <Select
                      value={newWorkflow.category}
                      onValueChange={(value) => setNewWorkflow({ ...newWorkflow, category: value })}
                    >
                      <SelectTrigger className="rounded-xl border border-white/20 bg-white/10 text-white">
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
                  </div>
                  <div>
                    <label className="font-semibold mb-2 block">Describe your workflow</label>
                    <Textarea
                      value={newWorkflow.prompt}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, prompt: e.target.value })}
                      placeholder="Describe what you want to automate..."
                      className="rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[120px]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold mb-2 block">Description (optional)</label>
                    <Input
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                      placeholder="Brief description..."
                      className="rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-white/50"
                    />
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
              <Card className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition">
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
                  <div className="flex gap-2">
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
                        onChange={(e) =>
                          setFaqForm({ ...faqForm, question: e.target.value })
                        }
                        className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md font-medium placeholder:text-neutral-500"
                        placeholder="Enter question..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        ANSWER
                      </label>
                      <Textarea
                        value={faqForm.answer}
                        onChange={(e) =>
                          setFaqForm({ ...faqForm, answer: e.target.value })
                        }
                        className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md font-medium min-h-[120px] placeholder:text-neutral-500"
                        placeholder="Enter answer..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        CATEGORY
                      </label>
                      <Select
                        value={faqForm.category}
                        onValueChange={(value) =>
                          setFaqForm({ ...faqForm, category: value })
                        }
                      >
                        <SelectTrigger className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="backdrop-blur-xl bg-white/40 border border-white/20">
                          <SelectItem value="General">GENERAL</SelectItem>
                          <SelectItem value="Workflows">WORKFLOWS</SelectItem>
                          <SelectItem value="Pricing">PRICING</SelectItem>
                          <SelectItem value="Security">SECURITY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#1f2937] mb-2 block">
                        TAGS (comma separated)
                      </label>
                      <TextInput
                        value={faqForm.tags}
                        onChange={(e) =>
                          setFaqForm({ ...faqForm, tags: e.target.value })
                        }
                        className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md font-medium placeholder:text-neutral-500"
                        placeholder="e.g. automation, ai, email"
                      />
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