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
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [workflowPrompt, setWorkflowPrompt] = useState("");
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [faqQuery, setFaqQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");

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
    setCommittedQuery(faqQuery);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background pattern image only (no color gradient layer) */}
      <img
        src="https://harmless-tapir-303.convex.cloud/api/storage/e9a5c497-3bbf-46f7-85fb-366d0672b582"
        alt="Topo pattern"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-40 mix-blend-screen"
      />

      {/* Animated red flowing strings overlay - chaotic, fast veins with continuous morphing */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-80"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FF204E" />
            <stop offset="0.5" stopColor="#EA2264" />
            <stop offset="1" stopColor="#640D5F" />
          </linearGradient>

          {/* Morphing wobble filter – updates every second to change paths without removing them */}
          <filter id="wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="8" result="noise">
              <animate attributeName="baseFrequency" values="0.006;0.012;0.006" dur="1s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" values="6;10;6" dur="1s" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </defs>

        <g filter="url(#wobble)">
          {/* Horizontal clusters */}
          <path className="flow-line-fast" d="M0,90 C280,60 520,120 820,80 S1180,40 1440,70" stroke="url(#flowGrad)" strokeWidth="2.2" fill="none" />
          <path className="flow-line-mid" d="M0,140 C260,120 520,180 820,150 S1180,120 1440,130" stroke="url(#flowGrad)" strokeWidth="1.8" fill="none" style={{ opacity: 0.75 }} />
          <path className="flow-line" d="M0,190 C240,160 520,240 820,200 S1180,160 1440,190" stroke="url(#flowGrad)" strokeWidth="1.6" fill="none" style={{ opacity: 0.6 }} />

          <path className="flow-line-mid" d="M0,280 C300,240 560,320 880,290 S1220,260 1440,300" stroke="url(#flowGrad)" strokeWidth="2.3" fill="none" />
          <path className="flow-line-fast" d="M0,330 C260,300 540,360 860,340 S1200,300 1440,330" stroke="url(#flowGrad)" strokeWidth="1.8" fill="none" style={{ opacity: 0.8 }} />

          <path className="flow-line" d="M0,420 C280,380 560,460 900,420 S1220,380 1440,410" stroke="url(#flowGrad)" strokeWidth="2.4" fill="none" />
          <path className="flow-line-mid" d="M0,470 C280,430 560,510 900,470 S1220,430 1440,460" stroke="url(#flowGrad)" strokeWidth="1.7" fill="none" style={{ opacity: 0.7 }} />

          <path className="flow-line-fast" d="M0,560 C320,520 620,590 960,560 S1280,520 1440,550" stroke="url(#flowGrad)" strokeWidth="2.1" fill="none" />
          <path className="flow-line" d="M0,610 C320,570 620,640 960,600 S1280,560 1440,600" stroke="url(#flowGrad)" strokeWidth="1.7" fill="none" style={{ opacity: 0.75 }} />
          <path className="flow-line-mid" d="M0,660 C320,620 620,680 960,640 S1280,600 1440,650" stroke="url(#flowGrad)" strokeWidth="1.6" fill="none" style={{ opacity: 0.6 }} />

          {/* Diagonal/vein-like paths */}
          <path className="flow-line-mid" d="M-40,100 C220,220 480,60 740,180 S1140,300 1480,220" stroke="url(#flowGrad)" strokeWidth="2.2" fill="none" />
          <path className="flow-line-fast" d="M-40,260 C200,360 520,200 780,300 S1120,420 1480,360" stroke="url(#flowGrad)" strokeWidth="1.9" fill="none" style={{ opacity: 0.85 }} />
          <path className="flow-line" d="M-40,420 C240,540 520,360 820,480 S1120,600 1480,520" stroke="url(#flowGrad)" strokeWidth="2.0" fill="none" />
          <path className="flow-line-mid" d="M-40,580 C220,700 520,520 820,640 S1140,760 1480,700" stroke="url(#flowGrad)" strokeWidth="1.8" fill="none" style={{ opacity: 0.8 }} />

          {/* Reverse diagonals */}
          <path className="flow-line" d="M-40,180 C280,120 540,260 820,200 S1160,140 1480,160" stroke="url(#flowGrad)" strokeWidth="1.8" fill="none" style={{ opacity: 0.7 }} />
          <path className="flow-line-fast" d="M-40,340 C300,280 580,420 880,360 S1180,300 1480,320" stroke="url(#flowGrad)" strokeWidth="2.2" fill="none" />
          <path className="flow-line-mid" d="M-40,500 C280,440 560,580 860,520 S1180,460 1480,480" stroke="url(#flowGrad)" strokeWidth="1.8" fill="none" style={{ opacity: 0.75 }} />
          <path className="flow-line" d="M-40,740 C280,660 560,800 860,720 S1180,640 1480,700" stroke="url(#flowGrad)" strokeWidth="2.0" fill="none" />

          {/* Dense micro-veins */}
          <path className="flow-line-fast" d="M0,760 C200,740 420,780 660,760 S980,720 1440,740" stroke="url(#flowGrad)" strokeWidth="1.2" fill="none" style={{ opacity: 0.6 }} />
          <path className="flow-line-mid" d="M0,800 C220,790 420,820 700,800 S1060,770 1440,790" stroke="url(#flowGrad)" strokeWidth="1.2" fill="none" style={{ opacity: 0.55 }} />
          <path className="flow-line" d="M0,840 C240,840 460,860 740,840 S1100,810 1440,830" stroke="url(#flowGrad)" strokeWidth="1.1" fill="none" style={{ opacity: 0.5 }} />
        </g>
      </svg>

      {/* Header - glass */}
      <header className="sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-6">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="relative cursor-pointer select-none text-3xl font-extrabold tracking-tight text-white drop-shadow group"
          >
            {/* Base logo text */}
            <span className="relative z-10">LETHIMDO</span>
            {/* Glitch layer 1 */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-[#EA2264]/70 opacity-0 blur-[1px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2200ms_infinite]"
            >
              LETHIMDO
            </span>
            {/* Glitch layer 2 */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 translate-x-0 translate-y-0 text-[#F78D60]/70 opacity-0 blur-[0.5px] mix-blend-screen group-hover:opacity-100 animate-[glitch_2000ms_infinite]"
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
              className="rounded-xl bg-gradient-to-r from-[#EA2264] via-[#F78D60] to-[#0D1164] px-5 py-2 font-semibold text-white shadow-lg shadow-[#EA2264]/20 hover:from-[#EA2264] hover:to-[#640D5F]"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 max-w-4xl rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl"
          >
            <h1 className="mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
              Build AI Workflows Instantly
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg font-medium text-white/80">
              Describe your automation in plain English. We'll turn it into a working workflow in seconds.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() =>
                  navigate(isAuthenticated ? "/dashboard" : "/auth")
                }
                className="rounded-xl bg-gradient-to-r from-[#EA2264] via-[#F78D60] to-[#640D5F] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#EA2264]/25 transition hover:scale-[1.02]"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Building
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("workflows")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                className="rounded-xl border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                See How it Works
              </Button>
            </div>
          </motion.div>

          {/* Feature cards - glass */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                className="rounded-2xl border border-white/15 bg-white/5 p-6 text-left text-white backdrop-blur-md"
              >
                <feature.icon className="mb-4 h-8 w-8 text-white" />
                <h3 className="mb-1 text-xl font-bold">{feature.title}</h3>
                <p className="text-white/75">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Builder */}
      <section id="workflows" className="px-6 py-16">
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
                  onChange={(e) => setWorkflowPrompt(e.target.value)}
                  placeholder="Example: Send a welcome email when someone signs up..."
                  className="min-h-[120px] resize-none rounded-xl border-white/20 bg-white/5 font-medium text-white placeholder:text-white/50 backdrop-blur-sm"
                />
                <Button
                  onClick={handleGenerateWorkflow}
                  disabled={isGenerating || !workflowPrompt.trim()}
                  className="w-full rounded-xl bg-gradient-to-r from-[#EA2264] via-[#F78D60] to-[#0D1164] py-3 font-bold text-white shadow-lg shadow-[#EA2264]/20 disabled:opacity-60"
                >
                  {isGenerating ? "Generating..." : "Generate Workflow"}
                  <ArrowRight className="ml-2 h-5 w-5" />
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
            <h3 className="mb-4 text-3xl font-extrabold tracking-tight text-white">
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
                className="cursor-pointer rounded-2xl border border-white/15 bg-white/5 p-5 text-white backdrop-blur-md transition hover:bg-white/10"
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
      <section id="faq" className="px-6 py-16">
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

          <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex gap-2">
              <Input
                value={faqQuery}
                onChange={(e) => setFaqQuery(e.target.value)}
                placeholder="What is Lethimdo? How do I create workflows?"
                className="flex-1 rounded-xl border-white/20 bg-white/5 font-medium text-white placeholder:text-white/50 backdrop-blur-sm"
                onKeyPress={(e) => e.key === "Enter" && handleFAQSearch()}
              />
              <Button
                onClick={handleFAQSearch}
                className="rounded-xl bg-gradient-to-r from-[#EA2264] to-[#640D5F] px-4 font-semibold text-white shadow-lg shadow-[#EA2264]/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            {faqResults.length > 0 && (
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
                    className="rounded-xl border border-white/15 bg-white/5 p-4 text-white backdrop-blur-md"
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

            {faqQuery && faqResults.length === 0 && (
              <div className="py-8 text-center text-white/80">
                No results found. Try a different question!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-10">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white backdrop-blur-xl">
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