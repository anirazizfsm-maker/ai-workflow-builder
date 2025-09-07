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
  const [menuOpen, setMenuOpen] = useState(false);

  // Typing animation for hero header
  const headlineWords = ["Supercharge", "your", "productivity", "and", "workflow", "with", "AI."] as const;
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = headlineWords[wordIndex];
    const typeSpeed = isDeleting ? 50 : 85;

    const tick = () => {
      if (!isDeleting) {
        // typing forward
        const next = currentWord.slice(0, displayText.length + 1);
        setDisplayText(next);
        if (next === currentWord) {
          // full word typed, hold before deleting
          setTimeout(() => setIsDeleting(true), 700);
          return;
        }
      } else {
        // deleting
        const next = currentWord.slice(0, displayText.length - 1);
        setDisplayText(next);
        if (next.length === 0) {
          // move to next word
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % headlineWords.length);
        }
      }
    };

    const t = setTimeout(tick, typeSpeed);
    return () => clearTimeout(t);
  }, [displayText, isDeleting, wordIndex]);

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
      {/* Keep chipset animation locked in the background */}
      <ChipsetBackground />

      {/* Replace the overlay to a deep-blue beam backdrop matching the screenshot */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base night backdrop */}
        <div className="absolute inset-0 bg-[#030611]" />
        {/* top-center deep blue glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-[520px] w-[1200px] rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(29,78,216,0.55) 0%, rgba(3,6,17,0.0) 70%)" }}
        />
        {/* soft beams */}
        <div className="absolute top-0 left-0 right-0 h-[520px] [background:conic-gradient(from_180deg_at_50%_0%,rgba(59,130,246,0.25),transparent_35%,rgba(96,165,250,0.2)_60%,transparent_85%)] blur-2xl opacity-50" />
      </div>

      <main className="relative z-0">
        {/* NEW: Pill Navbar to match screenshot */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 pt-8">
          <div className="mx-auto w-full md:w-auto rounded-2xl md:rounded-[22px] border border-white/10 bg-[#0a1429]/80 backdrop-blur-xl px-4 md:px-6 py-3.5 flex items-center justify-between gap-4 shadow-[0_8px_40px_-12px_rgba(30,64,175,0.45)]">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <span className="text-white font-extrabold text-base sm:text-lg tracking-tight">LETHIMDO</span>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 text-[15px]">
              <button className="text-[#9bb1e9] hover:text-white transition-colors">Home</button>
              <button className="text-[#9bb1e9] hover:text-white transition-colors">Integrations</button>
              <button onClick={() => navigate('/pricing')} className="text-[#9bb1e9] hover:text-white transition-colors">Pricing</button>
              <button className="text-[#9bb1e9] hover:text-white transition-colors">Contact Us</button>
            </nav>

            {/* CTA + Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="hidden md:inline-flex rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1f4fd3] hover:to-[#2563eb] text-white px-5 py-5 h-10 md:h-11 font-bold shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_28px_rgba(37,99,235,0.35)]"
              >
                Subscribe ↗
              </Button>

              {/* Mobile menu */}
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d1731]/70 text-white/80 hover:text-white">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] sm:w-[360px] bg-[#0a1429] text-white border-white/10">
                  <SheetHeader>
                    <SheetTitle className="text-white">Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 grid gap-2">
                    <button className="w-full text-left rounded-lg px-3 py-2 text-[#9bb1e9] hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>Home</button>
                    <button className="w-full text-left rounded-lg px-3 py-2 text-[#9bb1e9] hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>Integrations</button>
                    <button className="w-full text-left rounded-lg px-3 py-2 text-[#9bb1e9] hover:text-white hover:bg-white/5" onClick={() => { navigate('/pricing'); setMenuOpen(false); }}>Pricing</button>
                    <button className="w-full text-left rounded-lg px-3 py-2 text-[#9bb1e9] hover:text-white hover:bg-white/5" onClick={() => setMenuOpen(false)}>Contact Us</button>
                    <Button
                      onClick={() => { navigate(isAuthenticated ? "/dashboard" : "/auth"); setMenuOpen(false); }}
                      className="mt-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1f4fd3] hover:to-[#2563eb] text-white"
                    >
                      Subscribe ↗
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* HERO (replaced content to match screenshot) */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 pt-14 md:pt-20 pb-10">
          <div className="flex flex-col items-center text-center">
            {/* Customer pill */}
            <div className="rounded-full bg-white/5 border border-white/10 backdrop-blur-xl px-3.5 py-2 flex items-center gap-3 shadow-[0_10px_32px_-12px_rgba(37,99,235,0.45)]">
              <div className="flex -space-x-2">
                <img src="/logo_bg.png" alt="a1" className="h-6 w-6 rounded-full ring-2 ring-[#0a1429]" />
                <img src="/logo.png" alt="a2" className="h-6 w-6 rounded-full ring-2 ring-[#0a1429]" />
                <img src="/logo_bg.svg" alt="a3" className="h-6 w-6 rounded-full ring-2 ring-[#0a1429]" />
              </div>
              <span className="text-[#cfe0ff] text-sm md:text-[15px]">Join 15,725+ other loving customers</span>
            </div>

            {/* Animated Headline wrapper without video overlay */}
            <div className="relative w-full max-w-5xl mt-2 flex justify-center">
              {/* Removed hero animation video per request */}
              <h1
                className="relative mt-6 font-extrabold leading-[1.08] text-white text-[30px] sm:text-[42px] md:text-[60px] lg:text-[72px] tracking-tight text-balance px-1"
                style={{ fontFamily: "Space Grotesk, ui-sans-serif, system-ui", textShadow: "0 8px 40px rgba(37,99,235,0.35), 0 2px 14px rgba(15, 23, 42, 0.4)" }}
                aria-live="polite"
              >
                {displayText}
                <span
                  className="ml-1 inline-block align-baseline h-[0.9em] w-[0.6ch] rounded-[2px] animate-pulse"
                  style={{ background: "linear-gradient(180deg, rgba(147,197,253,0.95), rgba(59,130,246,0.95))" }}
                  aria-hidden
                />
              </h1>
            </div>

            {/* Subcopy */}
            <p className="mt-5 max-w-3xl text-[#a6b3cf] text-lg md:text-xl">
              Automate the busywork, eliminate bottlenecks, and focus on what matters most — powered
              by intelligent automation that learns with you.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="rounded-xl px-7 py-6 text-base font-bold text-white bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] shadow-[0_0_36px_0_rgba(37,99,235,0.35)]"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="rounded-xl px-7 py-6 text-base font-bold border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              >
                Try Live Demo
              </Button>
            </div>
          </div>
        </section>

        {/* SHOWCASE */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[22px] border border-[#18264c] bg-[#0a1327]/80 backdrop-blur-xl overflow-hidden shadow-[0_20px_80px_-24px_rgba(30,64,175,0.55)]"
          >
            {/* Top highlight beam */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.75) 35%, rgba(147,197,253,0.9) 50%, rgba(59,130,246,0.75) 65%, rgba(59,130,246,0) 100%)" }}
            />
            {/* App top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <span className="text-white/90 font-semibold tracking-tight">LETHIMDO</span>
                <div className="hidden md:flex items-center gap-5 ml-6 text-[#9db2e9]">
                  <span className="hover:text-white transition-colors">Dashboard</span>
                  <span className="hover:text-white transition-colors">History</span>
                  <span className="text-white">Workflows</span>
                  <span className="hover:text-white transition-colors">Settings</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="h-8 rounded-lg bg-[#1f51ff] hover:bg-[#1b45da] text-white px-3">Upgrade now</Button>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10" />
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10" />
                  <div className="h-8 w-8 rounded-full bg-[url('/logo.png')] bg-cover border border-white/10" />
                </div>
              </div>
            </div>

            {/* Main 3-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-0 border-t border-[#152247]">
              {/* Left sidebar */}
              <aside className="hidden lg:block border-r border-[#152247] p-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="h-6 w-6 rounded-md bg-[#0f1730] border border-[#1b2a55] grid place-items-center">
                    <span className="text-[#76a3ff] text-xs">⎔</span>
                  </div>
                  <div>
                    <div className="font-medium">Automation Hiring</div>
                    <div className="text-xs text-[#8fa2c9]">Last edited 5 mins ago</div>
                  </div>
                </div>
                <div className="mt-5 text-[#9db2e9] text-sm">Templates</div>
                <div className="mt-3 space-y-1">
                  <div className="text-[#9db2e9] text-sm py-2">Social Media</div>
                  <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-3 space-y-2">
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">📄</div>
                        <div className="text-sm">Send email for new Google Forms</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">📊</div>
                        <div className="text-sm">Insert data into Google Sheets</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">🗓️</div>
                        <div className="text-sm">Create Google Calendar event</div>
                      </div>
                    </div>
                    <div className="pt-1 text-xs text-[#8fa2c9]">Get access to no‑code templates with <span className="text-[#79a2ff]">Premium</span></div>
                  </div>
                </div>
              </aside>

              {/* Center canvas */}
              <div className="relative">
                {/* dotted grid */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.08) 1px, rgba(0,0,0,0) 1px), radial-gradient(rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
                    backgroundSize: "16px 16px, 32px 32px",
                    backgroundPosition: "0 0, 8px 8px",
                  }}
                />
                <div className="relative p-6 md:p-10 min-h-[520px]">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-2 text-[#9db2e9]">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↺</div>
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↻</div>
                    <div className="ml-2 text-sm">—</div>
                    <div className="rounded-lg bg-[#0f1730] border border-white/10 px-2.5 h-8 grid place-items-center text-white text-sm">100 %</div>
                    <div className="text-sm">＋</div>
                  </div>

                  {/* Node 1 */}
                  <div className="mt-10 mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#3b82f6]/20 grid place-items-center text-[#8ab4ff] text-xs">G</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#1b2a55] text-[#8ab4ff]">Trigger</span>
                          <span className="text-white font-medium text-sm">New data input in Google Forms</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>

                    {/* connector */}
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                    <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

                    {/* Node 2 */}
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#10b981]/20 grid place-items-center text-[#7de9c0] text-xs">S</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#1b2a55] text-[#8ab4ff]">Trigger</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#3b2746] text-[#ff7aa8]">Action</span>
                          <span className="text-white font-medium text-sm">Insert data to sheet in a new row</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>

                    {/* connector */}
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                    <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

                    {/* Node 3 */}
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#ef4444]/20 grid place-items-center text-[#ff9a9a] text-xs">C</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#3b2746] text-[#ff7aa8]">Action</span>
                          <span className="text-white font-medium text-sm">Generate meeting in Google Calendar</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="hidden lg:block border-l border-[#152247] p-4">
                <div className="text-white font-semibold">Step Configuration</div>
                <div className="mt-4">
                  <div className="text-[#9db2e9] text-sm mb-1">Applications</div>
                  <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-3">
                    <div className="text-[#9db2e9] text-sm">Account Connections</div>
                    <p className="text-xs text-[#8fa2c9] mt-1">
                      Gmail is a secure partner with Aflow. Manage your accounts{" "}
                      <span className="text-[#79a2ff] underline underline-offset-2">here</span>.
                    </p>
                    <div className="mt-3 rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3 text-white text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">✉️</div>
                        elisanapitupulu@gmail.com
                      </div>
                    </div>
                    <Button className="mt-3 w-full rounded-lg bg-[#1f51ff] hover:bg-[#1b45da] text-white">
                      Change account
                    </Button>
                    <Button variant="outline" className="mt-2 w-full rounded-lg border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70">
                      Add account
                    </Button>
                  </div>

                  <div className="mt-4">
                    <div className="text-[#9db2e9] text-sm mb-1">Trigger</div>
                    <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-4 text-white/90 text-sm">
                      When new Google Form response is received
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[320px] rounded-2xl border border-[#1a2a55] bg-gradient-to-br from-[#0b1120] to-[#0a0f1e]"
            >
              <div className="h-full w-full rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_55%)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Why Choose Lethimdo?</h3>
              <ul className="space-y-3 text-[#b6c5e6] text-lg">
                <li className="flex items-start gap-3"><span>📞</span><span>Automatically manage customer calls</span></li>
                <li className="flex items-start gap-3"><span>📣</span><span>Schedule & publish social media posts</span></li>
                <li className="flex items-start gap-3"><span>📊</span><span>Daily business reports & insights</span></li>
                <li className="flex items-start gap-3"><span>🤖</span><span>No coding needed, just a prompt</span></li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* WORKFLOW TEMPLATES */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Prebuilt Workflow Templates</h3>
          <p className="text-[#8fa2c9] mb-6">Start instantly with automation templates built for every business.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Customer Support Bot", desc: "Answer FAQs & support tickets automatically" },
              { title: "RAG Chatbot", desc: "Summarize & search documents instantly" },
              { title: "Google Sheets Automation", desc: "Sync, update, and analyze spreadsheets" },
              { title: "Social Media Scheduler", desc: "Automate multi-platform posting" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white hover:shadow-[0_0_28px_rgba(37,99,235,0.35)] transition-shadow"
              >
                <h4 className="font-bold text-lg mb-1.5">{item.title}</h4>
                <p className="text-[#8fa2c9] mb-4">{item.desc}</p>
                <Button
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                  className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white"
                >
                  Use Template
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Plans and Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Free", price: "$0", desc: "For individuals starting out", features: ["5 workflows", "15-day trial", "Basic templates"], cta: "Start Free" },
              { name: "Starter", price: "$29/month", desc: "For small teams", features: ["20 workflows/month", "Access to templates", "Basic dashboard"], cta: "Choose Starter" },
              { name: "Pro", price: "$79/month", desc: "For growing businesses", features: ["100 workflows/month", "AI-customized workflows", "Auto-fix & upgrades", "Analytics dashboard", "Priority support"], cta: "Choose Pro", highlight: true },
              { name: "Business Pack", price: "$199/month or $1999/year", desc: "For enterprises", features: ["Unlimited workflows", "AI Execution Broker", "Dedicated advisor", "Team collaboration", "White-label option"], cta: "Choose Business" },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-2xl border p-6 text-white ${plan.highlight ? "border-[#2563eb] bg-[#0b1120]" : "border-[#1a2a55] bg-[#0b1120]/70"} backdrop-blur-xl`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xl">{plan.name}</h4>
                  {plan.highlight && <span className="text-xs px-2 py-1 rounded-full bg-[#2563eb] text-white">Popular</span>}
                </div>
                <div className="text-3xl font-extrabold mt-2">{plan.price}</div>
                <p className="text-[#8fa2c9] mt-1">{plan.desc}</p>
                <ul className="mt-4 space-y-2 text-[#c6d4f7]">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><span className="text-[#3b82f6]">•</span>{f}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate("/plans")}
                  className={`mt-5 w-full rounded-xl ${plan.highlight ? "bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3]" : "bg-[#0f1730] hover:bg-[#131f3f]"} text-white`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">What Our Customers Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "Jane Doe", quote: "Lethimdo saved me 10+ hours weekly!" },
              { name: "John Smith", quote: "We scaled our customer support with zero hires." },
              { name: "Amir Khan", quote: "The AI Builder makes automation effortless." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#0f1730] border border-[#1a2a55] flex items-center justify-center text-[#3b82f6] font-bold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="font-semibold">{t.name}</div>
                </div>
                <p className="text-[#c6d4f7]">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-4 text-white">
            <AccordionItem value="q1">
              <AccordionTrigger className="text-white">How does it work?</AccordionTrigger>
              <AccordionContent className="text-[#cbd5e1]">
                Just describe your needs in a prompt, the AI Builder generates workflows for you.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger className="text-white">What happens after the free trial?</AccordionTrigger>
              <AccordionContent className="text-[#cbd5e1]">
                You can choose a subscription plan that fits your needs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger className="text-white">Can I cancel anytime?</AccordionTrigger>
              <AccordionContent className="text-[#cbd5e1]">
                Yes, cancel or upgrade at any time in your dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger className="text-white">Is my data secure?</AccordionTrigger>
              <AccordionContent className="text-[#cbd5e1]">
                Yes, all workflows run in a secure cloud environment.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
          <div className="rounded-2xl border border-[#1a2a55] bg-gradient-to-b from-[#0b1120] to-[#0a0f1e] p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to automate your business?</h3>
            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
              className="rounded-xl px-8 py-6 text-base font-bold text-white bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] shadow-[0_0_30px_rgba(37,99,235,0.25)]"
            >
              Get Started Now
            </Button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#142554]">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {/* Removed footer logo image */}
              {/* <img src="/logo.png" alt="logo" className="h-8 w-8" /> */}
              <span className="text-[#8fa2c9]">© {new Date().getFullYear()} Lethimdo</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[#8fa2c9]">
              <button className="hover:text-white" onClick={() => navigate("/")}>About</button>
              <button className="hover:text-white" onClick={() => navigate("/pricing")}>Pricing</button>
              <button className="hover:text-white" onClick={() => navigate("/docs")}>Documentation</button>
              <button className="hover:text-white" onClick={() => navigate("/support")}>Support</button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}