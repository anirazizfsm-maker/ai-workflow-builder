import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Bot,
  Rocket,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Send,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import ChipsetBackground from "@/components/ChipsetBackground";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQ } from "@/types/faq";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [workflowPrompt, setWorkflowPrompt] = useState("");
  const faqInputRef = useRef<HTMLInputElement | null>(null);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [faqQuery, setFaqQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [aiOpen, setAiOpen] = useState(false); // Floating chatbot / AI builder modal
  const [selectedWorkflow, setSelectedWorkflow] = useState<number | null>(null); // highlight selection

  // Keyboard shortcut: '/' focuses FAQ input (like many apps)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || (e.ctrlKey || e.metaKey || e.altKey)) return;
      if (e.key === "/") {
        e.preventDefault();
        faqInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Debounced search-as-you-type
  useEffect(() => {
    if (!faqQuery.trim()) {
      setCommittedQuery("");
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(() => setCommittedQuery(faqQuery), 350);
    return () => clearTimeout(t);
  }, [faqQuery]);

  // Data
  const faqResults =
    useQuery(
      api.faqs.searchFAQs,
      committedQuery ? { query: committedQuery } : "skip",
    ) ?? [];

  const generateWorkflowJSON = useAction(
    api.workflowActions.generateWorkflowJSON,
  );

  // Handlers
  const handleGenerateWorkflow = async () => {
    if (!workflowPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateWorkflowJSON({ prompt: workflowPrompt });
      setWorkflowResult(result);
      toast("Workflow generated successfully! 🚀");
    } catch {
      toast("Failed to generate workflow. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleFAQSearch = () => {
    if (!faqQuery.trim()) return;
    setIsSearching(true);
    setCommittedQuery(faqQuery);
  };

  // Turn off searching when results update or query changes
  // keeps UX snappy; useQuery reactivity will trigger this
  useEffect(() => {
    if (!committedQuery) {
      setIsSearching(false);
      return;
    }
    // whenever results refresh, stop the loading state
    setIsSearching(false);
  }, [committedQuery, faqResults]);

  return (
    <div className="relative min-h-screen overflow-hidden dark">
      {/* Animated Neon Chipset Background (replaces static image) */}
      <ChipsetBackground />
      {/* Subtle vertical gradient overlay for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/80"
      />

      {/* Global AI Assistant / Builder Modal */}
      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-foreground overflow-hidden rounded-2xl w-[92vw] sm:max-w-2xl sm:w-full p-0">
          {/* Animated modal content */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
            className="p-4 sm:p-6"
          >
            <DialogHeader>
              <DialogTitle>Ask or Describe Your Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Textarea
                value={workflowPrompt}
                onChange={(e) => {
                  const next = e.target.value.slice(0, 500);
                  setWorkflowPrompt(next);
                }}
                placeholder="Ask a question or describe a workflow. Example: 'When a user signs up, send a welcome email and notify Slack'."
                className="min-h[120px] resize-none rounded-xl border border-border bg-card font-medium text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className={workflowPrompt.length > 450 ? "text-amber-600" : "text-muted-foreground"}>
                  {workflowPrompt.length}/500
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setFaqQuery(workflowPrompt);
                      setCommittedQuery(workflowPrompt);
                      setAiOpen(false);
                      setTimeout(() => {
                        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    }}
                    variant="outline"
                    className="rounded-xl border border-border bg-card hover:bg-accent/10 shadow-sm"
                  >
                    Search FAQs
                  </Button>
                  <Button
                    onClick={handleGenerateWorkflow}
                    disabled={isGenerating || !workflowPrompt.trim()}
                    aria-busy={isGenerating}
                    className="rounded-xl shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {workflowResult && (
                <div className="mt-1 rounded-xl border border-border bg-card p-3 text-foreground shadow-sm">
                  <h4 className="mb-1 text-xs font-bold tracking-tight">Generated workflow</h4>
                  <p className="mb-2 text-xs text-muted-foreground">{workflowResult.title}</p>
                  <pre className="max-h-40 overflow-auto rounded-lg bg-background p-3 text-[11px] text-foreground">
                    {JSON.stringify(workflowResult.workflowJSON, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Header - glass */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6 pt-[env(safe-area-inset-top)]">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer select-none text-2xl md:text-3xl font-extrabold tracking-tight text-foreground drop-shadow group"
          >
            {/* Base logo text */}
            <span className="relative z-10">LETHIMDO</span>
            {/* Glitch layer 1 - replace colored text with neutral */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-muted-foreground opacity-0 blur-[1px] mix-blend-normal group-hover:opacity-100 animate-[glitch_2200ms_infinite]"
            >
              LETHIMDO
            </span>
            {/* Glitch layer 2 - replace colored text with neutral */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-muted-foreground opacity-0 blur-[0.5px] mix-blend-normal group-hover:opacity-100 animate-[glitch_2000ms_infinite]"
            >
              LETHIMDO
            </span>
          </motion.h1>
          <nav className="hidden items-center gap-3 md:flex">
            <a
              href="#workflows"
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 font-semibold text-foreground transition hover:bg-white/15 shadow-sm"
            >
              Workflows
            </a>
            <a
              href="#faq"
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 font-semibold text-foreground transition hover:bg-white/15 shadow-sm"
            >
              FAQ
            </a>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="rounded-xl px-5 py-2 font-semibold shadow-md border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </Button>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 rounded-xl border border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white/10 backdrop-blur-md border border-white/20 w-[85vw] max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="#workflows"
                    className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 font-semibold text-foreground transition hover:bg-white/15 shadow-sm"
                  >
                    Workflows
                  </a>
                  <a
                    href="#faq"
                    className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 font-semibold text-foreground transition hover:bg-white/15 shadow-sm"
                  >
                    FAQ
                  </a>
                  <Button
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                    className="mt-2 rounded-xl px-5 py-3 font-bold shadow-md border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
                  >
                    {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-4 py-12 sm:py-20 md:py-24">
        {/* Slow animated gradient behind hero (20s loop) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        >
          <div className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
               style={{
                 background:
                   "conic-gradient(from 0deg, color-mix(in oklab, var(--ring) 80%, transparent), transparent 25%, color-mix(in oklab, var(--accent) 70%, transparent), transparent 50%, color-mix(in oklab, white 25%, transparent), transparent 75%, color-mix(in oklab, var(--ring) 80%, transparent))"
               }}
          />
          <div className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 max-w-4xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg"
          >
            <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl md:text-7xl font-extrabold tracking-tight text-transparent">
              Build AI Workflows Instantly
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base md:text-lg font-medium text-muted-foreground">
              Describe your automation in plain English. We'll turn it into a working workflow in seconds.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/auth")
                }
                size="lg"
                className="w-full sm:w-auto rounded-xl px-8 py-4 text-lg font-bold shadow-md hover:scale-[1.02] border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Building
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document.getElementById("workflows")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="w-full sm:w-auto rounded-xl border border-border bg-card px-8 py-4 text-lg font-bold text-foreground hover:bg-accent/10 shadow-sm"
              >
                See How it Works
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!faqQuery.trim()) return;
                handleFAQSearch();
                document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-4 flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="Search FAQs, e.g. pricing, workflows, onboarding…"
                className="h-12 flex-1 rounded-xl border border-border bg-card font-medium text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={isSearching || !faqQuery.trim()}
                aria-busy={isSearching}
                aria-label="Search FAQs"
                title="Search FAQs"
                className="h-12 group w-full sm:w-12 sm:h-12 rounded-xl sm:rounded-full shadow-md focus-visible:ring-ring/60 focus-visible:ring-[3px] disabled:opacity-60 sm:p-0 sm:grid sm:place-items-center hover:scale-[1.03] active:scale-95"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </Button>
            </form>
          </motion.div>

          {/* Feature cards - glass */}
          <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate workflows in seconds, not hours.",
              },
              {
                icon: Bot,
                title: "AI Powered",
                desc: "Natural language to automation magic.",
              },
              {
                icon: Sparkles,
                title: "No Code",
                desc: "Build complex workflows without coding.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 md:p-6 text-left text-foreground shadow-sm"
              >
                <feature.icon className="mb-3 md:mb-4 h-7 w-7 md:h-8 md:w-8 text-foreground" />
                <h3 className="mb-1 text-lg md:text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Builder */}
      <section id="workflows" className="px-4 py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Generator card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-foreground">
                  <Bot className="h-7 w-7" />
                  Describe your workflow
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={workflowPrompt}
                  onChange={(e) => {
                    const next = e.target.value.slice(0, 500);
                    setWorkflowPrompt(next);
                  }}
                  placeholder="Example: Send a welcome email when someone signs up..."
                  className="min-h-[120px] resize-none rounded-xl border border-border bg-card font-medium text-foreground placeholder:text-muted-foreground"
                />
                {/* Prompt character counter */}
                <div className="flex items-center justify-end text-xs text-muted-foreground">
                  <span className={workflowPrompt.length > 450 ? "text-amber-600" : "text-muted-foreground"}>
                    {workflowPrompt.length}/500
                  </span>
                </div>
                <Button
                  onClick={handleGenerateWorkflow}
                  disabled={isGenerating || !workflowPrompt.trim()}
                  aria-busy={isGenerating}
                  className="w-full rounded-xl py-3 font-bold shadow-md disabled:opacity-60"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Workflow
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                {workflowResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 rounded-xl border border-border bg-card p-4 text-foreground shadow-sm"
                  >
                    <h4 className="mb-2 text-sm font-bold tracking-tight">
                      Generated workflow
                    </h4>
                    <p className="mb-2 text-sm text-muted-foreground">{workflowResult.title}</p>
                    <pre className="max-h-64 overflow-auto rounded-lg bg-background p-3 text-xs text-foreground">
                      {JSON.stringify(workflowResult.workflowJSON, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right column: Popular workflows with previews and AI Builder shortcut */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="mb-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Popular Workflows
              </h3>
              <Button
                onClick={() => setAiOpen(true)}
                variant="outline"
                className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15 shadow-sm transition"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Describe Your Workflow
              </Button>
            </div>

            <TooltipProvider>
              {[
                {
                  title: "Welcome Email Automation",
                  desc: "Automatically send personalized welcome emails.",
                  tag: "Email",
                  steps: ["Webhook Trigger", "Fetch user", "Send Email"],
                },
                {
                  title: "Daily Sales Report",
                  desc: "Generate and send a daily KPI summary.",
                  tag: "Reporting",
                  steps: ["Cron 9:00", "Query Sales", "Email Report"],
                },
                {
                  title: "Lead Follow-up Sequence",
                  desc: "Automated outreach for new leads.",
                  tag: "Marketing",
                  steps: ["New Lead", "Wait 1d", "Send Follow-up"],
                },
                {
                  title: "Social Media Posting",
                  desc: "Schedule cross-platform posts.",
                  tag: "Social",
                  steps: ["Schedule", "Prepare Post", "Publish"],
                },
              ].map((w, i) => {
                const isSelected = selectedWorkflow === i;
                return (
                  <Tooltip key={w.title}>
                    <TooltipTrigger asChild>
                      <motion.div
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedWorkflow((prev) => (prev === i ? null : i));
                          }
                        }}
                        onClick={() =>
                          setSelectedWorkflow((prev) => (prev === i ? null : i))
                        }
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`cursor-pointer rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 text-foreground transition
                          hover:bg-white/15 active:scale-95 touch-manipulation
                          ${isSelected ? "ring-2 ring-[color:var(--ring)]" : ""}`}
                      >
                        <div className="mb-1 flex items-start justify-between">
                          <h4 className="text-lg font-bold">{w.title}</h4>
                          <Badge className="rounded-full border border-border bg-card text-foreground">
                            {w.tag}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{w.desc}</p>
                        {isSelected && (
                          <div className="mt-3 text-xs text-muted-foreground grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {w.steps.map((s, idx) => (
                              <div
                                key={idx}
                                className="rounded-md border border-border bg-background px-2 py-1 text-center"
                              >
                                {s}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-lg">
                      <div className="text-xs">
                        <div className="font-semibold mb-1">Steps Preview</div>
                        <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
                          {w.steps.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </motion.div>
        </div>
      </section>

      {/* FAQ Chatbot */}
      <section id="faq" className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">
              FAQ Chatbot
            </h2>
            <p className="text-muted-foreground">
              Ask questions and get instant answers from our knowledge base.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 md:p-6 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                ref={faqInputRef}
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="What is Lethimdo? How do I create workflows?"
                className="h-12 flex-1 rounded-xl border border-border bg-card font-medium text-foreground placeholder:text-muted-foreground"
                onKeyPress={(e) => e.key === "Enter" && handleFAQSearch()}
              />
              <Button
                onClick={handleFAQSearch}
                disabled={isSearching || !faqQuery.trim()}
                aria-busy={isSearching}
                aria-label="Search FAQs"
                title="Search FAQs"
                className="h-12 group w-full sm:w-12 sm:h-12 rounded-xl sm:rounded-full shadow-md focus-visible:ring-ring/60 focus-visible:ring-[3px] disabled:opacity-60 sm:p-0 sm:grid sm:place-items-center hover:scale-[1.03] active:scale-95"
              >
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
                )}
              </Button>
            </div>

            {isSearching && (
              <div className="mt-6 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="h-4 w-1/3 bg-muted rounded mb-2" />
                    <div className="h-3 w-2/3 bg-muted rounded mb-1.5" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                ))}
              </div>
            )}

            {!isSearching && faqResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-4"
              >
                <h4 className="text-sm font-bold text-muted-foreground">
                  Search Results
                </h4>
                <Accordion type="multiple" className="w-full">
                  {faqResults.map((faq: FAQ) => (
                    <AccordionItem key={faq._id as unknown as string} value={String(faq._id)}>
                      <AccordionTrigger className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-4 py-3 text-foreground hover:bg-white/15">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="rounded-b-2xl border-x border-b border-white/20 bg-white/10 backdrop-blur-md p-4 text-foreground">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        <Badge className="mt-3 border border-border bg-card text-foreground">
                          {faq.category}
                        </Badge>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}

            {!isSearching && faqQuery && faqResults.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No results found. Try a different question!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Section - short muted autoplay video */}
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 md:p-4 shadow-lg"
          >
            <div className="overflow-hidden rounded-xl border border-border">
              <video
                src="https://cdn.coverr.co/videos/coverr-working-on-laptop-typing-typing-5175/1080p.mp4"
                className="w-full h-[220px] md:h-[360px] object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/logo_bg.png"
              />
            </div>
            <p className="mt-3 text-center text-muted-foreground text-sm">
              See workflows in action: trigger → AI step → email/report delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Value Props section */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Why LETHIMDO
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Launch automations faster, collaborate better, and stay in control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-sm text-foreground"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <h3 className="font-bold text-lg">From Idea to Live in Minutes</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Turn a plain-English prompt into a structured, working workflow—
                no glue code, no setup tax.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-sm text-foreground"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold text-lg">Built with AI Assistance</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Smart defaults and suggestions help you configure steps, parameters,
                and triggers with confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-5 shadow-sm text-foreground"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-bold text-lg">Scale Without the Drag</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Designed for reliability and speed, so your team ships workflows and
                iterates without friction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-4 pb-8 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg text-foreground text-center"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Build your first workflow today
          </h3>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Get started free. No credit card required.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="rounded-xl px-6 py-3 font-bold shadow-md hover:scale-[1.02] border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start free
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                document.getElementById("workflows")?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-accent/10 shadow-sm"
            >
              See it in action
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Trust badges row above footer */}
      <section className="px-4 pb-6 md:pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "GDPR Ready", icon: "✔" },
              { label: "Secure Payments", icon: "✔" },
              { label: "AI Powered", icon: "✔" },
            ].map((b) => (
              <div
                key={b.label}
                className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-3 text-center text-muted-foreground shadow-sm"
              >
                <span className="mr-2">{b.icon}</span>
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-8 md:pb-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 md:p-6 text-center text-foreground shadow-sm">
          <p className="font-semibold">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground"
            >
              vly.ai
            </a>
          </p>
          <p className="mt-2 text-muted-foreground text-sm">
            Need help?{" "}
            <a href="mailto:support@lethimdo.com" className="underline hover:text-foreground">
              support@lethimdo.com
            </a>{" "}
            | Live Chat
          </p>
        </div>
      </footer>

      {/* Floating Chatbot Button (bottom-right) */}
      <div className="fixed z-[60] right-5 bottom-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <Button
          onClick={() => setAiOpen(true)}
          size="icon"
          className="size-12 rounded-full shadow-xl border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
          aria-label="Open Assistant"
          title="Ask AI / FAQ"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}