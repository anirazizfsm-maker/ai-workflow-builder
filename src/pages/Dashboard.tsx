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
    } catch (e) {
      toast("Failed to save FAQ");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      await removeFAQ({ id: id as any });
      toast("FAQ deleted");
    } catch {
      toast("Failed to delete FAQ");
    }
  };

  return (
    <div className="min-h-screen bg-[#00FF80]">
      {/* Neo Brutalist Header */}
      <header className="bg-[#FF0080] border-b-4 border-black p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-4xl font-black text-black cursor-pointer"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
          >
            LETHIMDO
          </motion.h1>
          <div className="flex items-center gap-4">
            <div className="text-black font-bold">
              Welcome, {user?.name || user?.email || "User"}!
            </div>
            <Button 
              onClick={() => signOut()}
              className="bg-black text-[#FF0080] border-4 border-black font-black hover:bg-[#0080FF] hover:text-black"
            >
              SIGN OUT
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-[#0080FF] border-4 border-black shadow-[8px_8px_0px_#000000]">
              <CardHeader className="pb-2">
                <CardTitle className="text-black font-black flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  TOTAL WORKFLOWS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-black">{workflows?.length || 0}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-[#FF0080] border-4 border-black shadow-[8px_8px_0px_#000000]">
              <CardHeader className="pb-2">
                <CardTitle className="text-black font-black flex items-center gap-2">
                  <Play className="h-6 w-6" />
                  ACTIVE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-black">
                  {workflows?.filter(w => w.status === "active").length || 0}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-[#00FF80] border-4 border-black shadow-[8px_8px_0px_#000000]">
              <CardHeader className="pb-2">
                <CardTitle className="text-black font-black flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  EXECUTIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black text-black">247</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Create Workflow Button */}
        <div className="mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF0080] text-black border-4 border-black font-black text-xl px-8 py-4 shadow-[8px_8px_0px_#000000] hover:bg-[#0080FF]">
                <Plus className="mr-2 h-6 w-6" />
                CREATE NEW WORKFLOW
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#00FF80] border-4 border-black shadow-[8px_8px_0px_#000000] max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black text-black">CREATE AI WORKFLOW</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-black font-black mb-2 block">WORKFLOW TITLE</label>
                    <Input
                      value={newWorkflow.title}
                      onChange={(e) => setNewWorkflow({...newWorkflow, title: e.target.value})}
                      placeholder="Enter workflow title..."
                      className="border-4 border-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-black font-black mb-2 block">CATEGORY</label>
                    <Select value={newWorkflow.category} onValueChange={(value) => setNewWorkflow({...newWorkflow, category: value})}>
                      <SelectTrigger className="border-4 border-black font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="automation">AUTOMATION</SelectItem>
                        <SelectItem value="email">EMAIL</SelectItem>
                        <SelectItem value="data">DATA PROCESSING</SelectItem>
                        <SelectItem value="social">SOCIAL MEDIA</SelectItem>
                        <SelectItem value="reporting">REPORTING</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-black font-black mb-2 block">DESCRIBE YOUR WORKFLOW</label>
                    <Textarea
                      value={newWorkflow.prompt}
                      onChange={(e) => setNewWorkflow({...newWorkflow, prompt: e.target.value})}
                      placeholder="Describe what you want to automate in plain English..."
                      className="border-4 border-black font-bold min-h-[120px]"
                    />
                  </div>
                  <div>
                    <label className="text-black font-black mb-2 block">DESCRIPTION (OPTIONAL)</label>
                    <Input
                      value={newWorkflow.description}
                      onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                      placeholder="Brief description..."
                      className="border-4 border-black font-bold"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateWorkflow}
                    className="w-full bg-[#FF0080] text-black border-4 border-black font-black text-lg py-3 shadow-[4px_4px_0px_#000000] hover:bg-[#0080FF]"
                    disabled={!newWorkflow.prompt}
                  >
                    GENERATE WORKFLOW
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows?.map((workflow, index) => (
            <motion.div
              key={workflow._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[12px_12px_0px_#000000] transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-black font-black text-lg">{workflow.title}</CardTitle>
                    <Badge 
                      className={`font-black border-2 border-black ${
                        workflow.status === "active" ? "bg-[#00FF80] text-black" :
                        workflow.status === "paused" ? "bg-[#FF0080] text-black" :
                        "bg-gray-300 text-black"
                      }`}
                    >
                      {workflow.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-black font-bold text-sm">{workflow.description}</p>
                  <Badge className="bg-[#0080FF] text-black font-black border-2 border-black w-fit">
                    {workflow.category.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleStatusToggle(workflow._id, workflow.status)}
                      className={`border-2 border-black font-black ${
                        workflow.status === "active" 
                          ? "bg-[#FF0080] text-black hover:bg-red-500" 
                          : "bg-[#00FF80] text-black hover:bg-green-400"
                      }`}
                    >
                      {workflow.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 border-black font-black hover:bg-[#0080FF]"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDeleteWorkflow(workflow._id)}
                      className="bg-red-500 text-black border-2 border-black font-black hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {workflows?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-black text-black mb-4">NO WORKFLOWS YET</h3>
              <p className="text-black font-bold mb-6">Create your first AI-powered workflow to get started!</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#FF0080] text-black border-4 border-black font-black shadow-[4px_4px_0px_#000000] hover:bg-[#0080FF]"
              >
                CREATE WORKFLOW
              </Button>
            </div>
          </motion.div>
        )}

        {/* Admin: FAQ Management */}
        {isAdmin && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-black">FAQ MANAGEMENT</h2>
              <Button
                onClick={openCreateFaq}
                className="rounded-xl bg-gradient-to-r from-[#EA2264] via-[#F78D60] to-[#0D1164] text-white font-bold px-4 py-2 shadow-lg shadow-[#EA2264]/25 hover:from-[#EA2264] hover:to-[#640D5F] border border-white/20 backdrop-blur-md"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                ADD FAQ
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs?.map((faq) => (
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
                      <Button
                        size="sm"
                        onClick={() => handleDeleteFaq(faq._id)}
                        className="rounded-xl bg-[#EA2264] text-white border border-white/20 hover:bg-[#d01d58] backdrop-blur-md font-semibold"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                        !faqForm.question.trim() || !faqForm.answer.trim()
                      }
                    >
                      {editingFaqId ? "SAVE CHANGES" : "CREATE FAQ"}
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