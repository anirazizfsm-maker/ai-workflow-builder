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

  // Data
  const faqResults =
    useQuery(
      api.faqs.searchFAQs,
      committedQuery ? { searchTerm: committedQuery } : "skip",
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

      {/* Header - glass */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6 pt-[env(safe-area-inset-top)]">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer select-none text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow group"
          >
            {/* Base logo text */}
            <span className="relative z-10">LETHIMDO</span>
            {/* Glitch layer 1 - replace colored text with neutral */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-white/60 opacity-0 blur-[1px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2200ms_infinite]"
            >
              LETHIMDO
            </span>
            {/* Glitch layer 2 - replace colored text with neutral */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-white/40 opacity-0 blur-[0.5px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2000ms_infinite]"
            >
              LETHIMDO
            </span>
          </motion.h1>
          <nav className="hidden items-center gap-3 md:flex">
            <a
              href="#workflows"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              Workflows
            </a>
            <a
              href="#faq"
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              FAQ
            </a>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-2 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:shadow-lg hover:shadow-white/20"
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
              <SheetContent side="right" className="bg-black/70 border-white/10 backdrop-blur-xl">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href="#workflows"
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    Workflows
                  </a>
                  <a
                    href="#faq"
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    FAQ
                  </a>
                  <Button
                    onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                    className="mt-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/20"
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
      <section className="px-4 py-12 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 max-w-4xl rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-xl"
          >
            <h1 className="mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-4xl md:text-7xl font-extrabold tracking-tight text-transparent">
              Build AI Workflows Instantly
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base md:text-lg font-medium text-white/80">
              Describe your automation in plain English. We'll turn it into a working workflow in seconds.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/auth")
                }
                size="lg"
                className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-white/25"
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
                className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                See How it Works
              </Button>
            </div>

            {/* Global search (hero) → reuses FAQ search */}
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
                className="h-12 flex-1 rounded-xl border-white/20 bg-white/5 font-medium text-white placeholder:text-white/50 backdrop-blur-sm"
              />
              <Button
                type="submit"
                disabled={isSearching || !faqQuery.trim()}
                aria-busy={isSearching}
                aria-label="Search FAQs"
                title="Search FAQs"
                className="h-12 group w-full sm:w-12 sm:h-12 rounded-xl sm:rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition
                           hover:bg-white/20 hover:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_65%,transparent)]
                           focus-visible:ring-ring/60 focus-visible:ring-[3px]
                           disabled:opacity-60
                           sm:p-0 sm:grid sm:place-items-center
                           hover:scale-[1.03] active:scale-95"
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
                className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6 text-left text-white backdrop-blur-md"
              >
                <feature.icon className="mb-3 md:mb-4 h-7 w-7 md:h-8 md:w-8 text-white" />
                <h3 className="mb-1 text-lg md:text-xl font-bold">{feature.title}</h3>
                <p className="text-white/75 text-sm md:text-base">{feature.desc}</p>
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
            className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-extrabold text-white">
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
                  className="min-h-[120px] resize-none rounded-xl border-white/20 bg-white/5 font-medium text-white placeholder:text-white/50 backdrop-blur-sm"
                />
                {/* Prompt character counter */}
                <div className="flex items-center justify-end text-xs text-white/70">
                  <span className={workflowPrompt.length > 450 ? "text-amber-300" : "text-white/60"}>
                    {workflowPrompt.length}/500
                  </span>
                </div>
                <Button
                  onClick={handleGenerateWorkflow}
                  disabled={isGenerating || !workflowPrompt.trim()}
                  aria-busy={isGenerating}
                  className="w-full rounded-xl border border-white/15 bg-white/10 py-3 font-bold text-white backdrop-blur-md hover:bg-white/20 disabled:opacity-60"
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
                    className="mt-2 rounded-xl border border-white/15 bg-black/40 p-4 text-white backdrop-blur-sm"
                  >
                    <h4 className="mb-2 text-sm font-bold tracking-tight">
                      Generated workflow
                    </h4>
                    <p className="mb-2 text-sm">{workflowResult.title}</p>
                    <pre className="max-h-64 overflow-auto rounded-lg bg-black/60 p-3 text-xs text-[#C8F6FF]">
                      {JSON.stringify(workflowResult.workflowJSON, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Popular workflows */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="mb-4 text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Popular Workflows
            </h3>
            {[
              {
                title: "Welcome Email Automation",
                desc: "Automatically send personalized welcome emails.",
                tag: "Email",
              },
              {
                title: "Daily Sales Report",
                desc: "Generate and send a daily KPI summary.",
                tag: "Reporting",
              },
              {
                title: "Lead Follow-up Sequence",
                desc: "Automated outreach for new leads.",
                tag: "Marketing",
              },
              {
                title: "Social Media Posting",
                desc: "Schedule cross-platform posts.",
                tag: "Social",
              },
            ].map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 p-4 md:p-5 text-white backdrop-blur-md transition hover:bg-white/10"
              >
                <div className="mb-1 flex items-start justify-between">
                  <h4 className="text-lg font-bold">{w.title}</h4>
                  <Badge className="rounded-full border border-white/20 bg-white/10 text-white">
                    {w.tag}
                  </Badge>
                </div>
                <p className="text-white/75">{w.desc}</p>
              </motion.div>
            ))}
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
            <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-white">
              FAQ Chatbot
            </h2>
            <p className="text-white/80">
              Ask questions and get instant answers from our knowledge base.
            </p>
          </motion.div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 md:p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                ref={faqInputRef}
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="What is Lethimdo? How do I create workflows?"
                className="h-12 flex-1 rounded-xl border-white/20 bg-white/5 font-medium text-white placeholder:text-white/50 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && handleFAQSearch()}
              />
              <Button
                onClick={handleFAQSearch}
                disabled={isSearching || !faqQuery.trim()}
                aria-busy={isSearching}
                aria-label="Search FAQs"
                title="Search FAQs"
                className="h-12 group w-full sm:w-12 sm:h-12 rounded-xl sm:rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition
                           hover:bg-white/20 hover:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_65%,transparent)]
                           focus-visible:ring-ring/60 focus-visible:ring-[3px]
                           disabled:opacity-60
                           sm:p-0 sm:grid sm:place-items-center
                           hover:scale-[1.03] active:scale-95"
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
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="h-4 w-1/3 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-2/3 bg-white/10 rounded mb-1.5" />
                    <div className="h-3 w-1/2 bg-white/10 rounded" />
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
                <h4 className="text-sm font-bold text-white/80">
                  Search Results
                </h4>
                {faqResults.map((faq, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4 md:p-4 text-white backdrop-blur-md"
                  >
                    <h5 className="mb-1 font-semibold">{faq.question}</h5>
                    <p className="text-sm text-white/80">{faq.answer}</p>
                    <Badge className="mt-2 border border-white/20 bg-white/10 text-white">
                      {faq.category}
                    </Badge>
                  </div>
                ))}
              </motion.div>
            )}

            {!isSearching && faqQuery && faqResults.length === 0 && (
              <div className="py-8 text-center text-white/80">
                No results found. Try a different question!
              </div>
            )}
          </div>
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
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Why LETHIMDO
            </h2>
            <p className="mt-2 text-white/80 max-w-2xl mx-auto">
              Launch automations faster, collaborate better, and stay in control.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5" />
                <h3 className="font-bold text-lg">From Idea to Live in Minutes</h3>
              </div>
              <p className="text-white/75 text-sm">
                Turn a plain-English prompt into a structured, working workflow—
                no glue code, no setup tax.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-bold text-lg">Built with AI Assistance</h3>
              </div>
              <p className="text-white/75 text-sm">
                Smart defaults and suggestions help you configure steps, parameters,
                and triggers with confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-md text-white"
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-bold text-lg">Scale Without the Drag</h3>
              </div>
              <p className="text-white/75 text-sm">
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
          className="mx-auto max-w-7xl rounded-2xl border border-white/15 bg-white/5 p-6 md:p-8 backdrop-blur-xl text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Build your first workflow today
          </h3>
          <p className="mt-2 text-white/80 max-w-2xl mx-auto">
            Get started free. No credit card required.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/20 hover:shadow-lg hover:shadow-white/25"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start free
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                document.getElementById("workflows")?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-white/15 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition hover:bg-white/10"
            >
              See it in action
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-8 md:pb-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 text-center text-white backdrop-blur-xl">
          <p className="font-semibold">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/40 underline-offset-4 hover:text-white"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}