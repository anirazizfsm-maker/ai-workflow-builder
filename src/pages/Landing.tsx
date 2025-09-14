import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
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
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FAQ } from "@/types/faq";
import VariableProximity from "@/components/VariableProximity";
import GooeyNav from "@/components/GooeyNav";
import Prism from "@/components/Prism";
import "@/components/Prism.css";
import GradualBlur from "@/components/GradualBlur";

const LazyPrism = lazy(() => import("@/components/Prism"));

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // API base URL from .env
  const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

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
  // Add: ref for hero container to scope proximity effect
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Add: mobile detection to tune Prism for small screens
  const [isMobile, setIsMobile] = useState(false);
  // NEW: Safely enable Prism only when supported
  const [canRenderPrism, setCanRenderPrism] = useState(false);

  // NEW: Local FAQ results state replacing Convex useQuery
  const [faqResults, setFaqResults] = useState<FAQ[]>([]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches);
    };
    setIsMobile(mql.matches);
    // Support older browsers
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange as (e: MediaQueryListEvent) => void);
      return () => mql.removeEventListener("change", onChange as (e: MediaQueryListEvent) => void);
    } else {
      // @ts-expect-error legacy
      mql.addListener(onChange);
      // @ts-expect-error legacy
      return () => mql.removeListener(onChange);
    }
  }, []);

  // ADD: Detect WebGL support + reduced motion preference and enable Prism safely
  useEffect(() => {
    try {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)")?.matches;

      if (prefersReducedMotion) {
        setCanRenderPrism(false);
        return;
      }

      const canvas = document.createElement("canvas");
      const gl =
        (canvas.getContext("webgl2") ||
          canvas.getContext("webgl") ||
          // @ts-ignore - "experimental-webgl" exists in some browsers but isn't typed
          (canvas.getContext as any)("experimental-webgl")) as WebGLRenderingContext | null;

      setCanRenderPrism(!!gl);
    } catch {
      setCanRenderPrism(false);
    }
  }, []);

  // Remove typing animation state and effects; use a static headline instead
  const staticHeadline = "Automation will grow your business 2x faster.";

  // Handlers
  const handleGenerateWorkflow = async () => {
    if (!workflowPrompt.trim()) return;
    if (!API_BASE) {
      toast("Backend URL is not set (VITE_API_BASE_URL).");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/workflows/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: workflowPrompt }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      setWorkflowResult(result);
      toast("Workflow generated successfully! 🚀");
    } catch (err) {
      toast("Failed to generate workflow. Please try again.");
    }
    setIsGenerating(false);
  };

  const handleFAQSearch = async () => {
    if (!faqQuery.trim()) return;
    if (!API_BASE) {
      toast("Backend URL is not set (VITE_API_BASE_URL).");
      return;
    }
    setIsSearching(true);
    setCommittedQuery(faqQuery);
    try {
      const res = await fetch(`${API_BASE}/faqs/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: faqQuery }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FAQ[] = await res.json();
      setFaqResults(Array.isArray(data) ? data : []);
    } catch {
      toast("FAQ search failed. Please try again.");
      setFaqResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Turn off searching when results update or query changes
  useEffect(() => {
    if (!committedQuery) {
      setIsSearching(false);
      return;
    }
    // whenever results refresh, stop the loading state
    setIsSearching(false);
  }, [committedQuery, faqResults]);

  const plans = [
    {
      name: "Free",
      price: "$0",
      cadence: "Trial",
      highlight: "5 workflows, 15 days",
      features: [
        "✅ 5 workflows max.",
        "✅ Run for 15 days (trial).",
        "❌ No auto-fix or advanced agent support.",
        "❌ Limited to 2 connected apps.",
      ],
      bestFor: "Best for trying Lethimdo risk-free.",
      cta: () => navigate("/auth"),
      ctaLabel: "Start Free",
      accent: false,
    },
    {
      name: "Starter Pack",
      price: "$19",
      cadence: "/month",
      highlight: "For freelancers/startups",
      features: [
        "✅ Up to 20 workflows.",
        "✅ Run for 30 days rolling.",
        "✅ Basic AI Builder support.",
        "✅ Email reporting.",
      ],
      bestFor: "Best for freelancers/startups.",
      cta: () => navigate("/plans"),
      ctaLabel: "Choose Starter",
      accent: true,
    },
    {
      name: "Pro Pack",
      price: "$49",
      cadence: "/month",
      highlight: "Scale & reliability",
      features: [
        "✅ Up to 100 workflows.",
        "✅ Daily execution (cron-style).",
        "✅ Custom workflow creation by AI.",
        "✅ Auto-fix failed workflows.",
        "✅ Multi-app integration (Google, Slack, Airtable, Notion, Pinecone, etc.).",
        "✅ Time & cost saving reports.",
      ],
      bestFor: "Best for service-based companies.",
      cta: () => navigate("/plans"),
      ctaLabel: "Choose Pro",
      accent: true,
    },
    {
      name: "Business Pack",
      price: "$199",
      cadence: "/month",
      highlight: "Unlimited & concierge",
      features: [
        "✅ Unlimited workflows.",
        "✅ Full AI Builder (autonomous upgrades & personalized workflows).",
        "✅ Workflow concierge: \"Just describe business, we automate.\"",
        "✅ Full analytics dashboard (savings, usage, logs).",
        "✅ Premium integrations (enterprise tools, CRMs).",
        "✅ Priority support.",
        "✅ 1 year subscription.",
      ],
      bestFor: "Best for SMBs and enterprises.",
      cta: () => navigate("/plans"),
      ctaLabel: "Contact Sales",
      accent: false,
    },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden dark bg-[#0b1120]">
      <main className="relative z-0">
        

        {/* HERO (restore Prism to hero-scoped background with original 3drotate) */}
        <section ref={heroRef} className="relative mx-auto max-w-[100rem] px-6 md:px-8 pt-12 md:pt-24 pb-12 md:pb-20 overflow-hidden rounded-2xl min-h-[620px] md:min-h-[900px]">
          {/* Top-left Logo with same VariableProximity effect as headline */}
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={() => navigate("/")}
              aria-label="Go to home"
              className="px-0 py-0 bg-transparent text-white"
            >
              <span className="leading-none">
                <VariableProximity
                  label="Lethimdo"
                  fromFontVariationSettings="'wght' 400, 'wdth' 100"
                  toFontVariationSettings="'wght' 500, 'wdth' 85"
                  containerRef={heroRef as any}
                  radius={160}
                  falloff="gaussian"
                />
              </span>
            </button>
          </div>

          {/* Hero-centered Navigation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full px-6 md:px-8">
            <div className="mx-auto max-w-6xl hidden md:flex justify-center">
              <GooeyNav
                items={[
                  { label: "Home", href: "/" },
                  { label: "Pricing", href: "/pricing" },
                  { label: "Dashboard", href: "/dashboard" },
                ]}
              />
            </div>
          </div>

          {/* Mobile Menu (hamburger) */}
          <div className="absolute top-4 right-4 z-30 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white p-3 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0b1120]/90 backdrop-blur-xl border-[#142554] text-white w-72 sm:w-80">
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 grid gap-2.5">
                  <SheetClose asChild>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Home
                    </button>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      onClick={() => navigate("/pricing")}
                      className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Pricing
                    </button>
                  </SheetClose>
                  <SheetClose asChild>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      Dashboard
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Hero-scoped cosmic background sized to full hero layer */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/* Prism background with hover interaction (render only if supported) */}
            {canRenderPrism && (
              <Suspense fallback={null}>
                <LazyPrism
                  animationType="hover"
                  transparent
                  suspendWhenOffscreen
                  className="prism-container"
                  height={3.5}
                  baseWidth={5.5}
                  scale={1.2}
                  glow={1.25}
                  noise={0}
                  hueShift={0.2}
                  colorFrequency={1.35}
                  bloom={1.25}
                  timeScale={0.42}
                  hoverStrength={1.15}
                  inertia={0.08}
                />
              </Suspense>
            )}
            {/* Dark overlay to ensure text contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
            >
              {/* Soft vertical fade to keep transparency while blending into background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#030611]/25 via-transparent to-[#030611]/25" />
              {/* Subtle vignette for smoother edges */}
              <div
                className="absolute inset-0"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(120% 85% at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0) 100%)",
                  maskImage:
                    "radial-gradient(120% 85% at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.65) 85%, rgba(0,0,0,0) 100%)",
                  backgroundColor: "rgba(3, 6, 17, 0.15)",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            {/* Animated Headline wrapper without video overlay */}
            <div className="relative w-full max-w-5xl mt-2 flex justify-center">
              {/* Removed hero animation video per request */}
              <h1
                className="relative mt-6 font-normal leading-[1.08] text-white text-[28px] sm:text-[38px] md:text-[54px] lg:text-[64px] tracking-tight text-balance px-1"
                aria-live="off"
              >
                <VariableProximity
                  label={staticHeadline}
                  fromFontVariationSettings="'wght' 400, 'wdth' 100"
                  toFontVariationSettings="'wght' 500, 'wdth' 85"
                  containerRef={heroRef as any}
                  radius={160}
                  falloff="gaussian"
                />
              </h1>
            </div>

            {/* Subcopy */}
            <p className="mt-5 max-w-3xl text-[#a6b3cf] text-lg md:text-xl">
              Manage customer calls, manage social media posts, daily reports, appointments, and automate anything with a single prompt.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                className="w-full sm:w-auto rounded-xl px-7 py-6 text-base font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_0_24px_rgba(255,255,255,0.06)]"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* BRAND LOGO SAMPLES */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="flex items-center justify-center mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
            <span className="mx-2 text-[#9db2e9] text-sm">Brand</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center">
            Brand Logo Samples
          </h3>
          <p className="text-center text-[#8fa2c9] max-w-2xl mx-auto mt-2">
            Three cohesive options matching the dark, glassy, blue-gradient aesthetic.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Mark */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-4 text-white"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b1120]">
                <img
                  src="/assets/lethimdo-mark.svg"
                  alt="Lethimdo Mark"
                  className="w-full aspect-square object-contain"
                />
              </div>
              <div className="mt-3 text-[#c6d4f7] font-semibold">Mark</div>
              <div className="text-[#9db2e9] text-sm">App icon, avatar, favicon</div>
              <div className="mt-3">
                <a
                  href="/assets/lethimdo-mark.svg"
                  download
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                >
                  Download SVG
                </a>
              </div>
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-4 text-white"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b1120]">
                <img
                  src="/assets/lethimdo-wordmark.svg"
                  alt="Lethimdo Wordmark"
                  className="w-full h-40 object-contain"
                />
              </div>
              <div className="mt-3 text-[#c6d4f7] font-semibold">Wordmark</div>
              <div className="text-[#9db2e9] text-sm">Headers, hero, documents</div>
              <div className="mt-3">
                <a
                  href="/assets/lethimdo-wordmark.svg"
                  download
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                >
                  Download SVG
                </a>
              </div>
            </motion.div>

            {/* Combined */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-4 text-white"
            >
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0b1120]">
                <img
                  src="/assets/lethimdo-combined.svg"
                  alt="Lethimdo Combined"
                  className="w-full h-48 object-contain"
                />
              </div>
              <div className="mt-3 text-[#c6d4f7] font-semibold">Combined</div>
              <div className="text-[#9db2e9] text-sm">Landing hero, social banners</div>
              <div className="mt-3">
                <a
                  href="/assets/lethimdo-combined.svg"
                  download
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm"
                >
                  Download SVG
                </a>
              </div>
            </motion.div>
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
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Why teams choose Lethimdo</h3>
              <ul className="space-y-3 text-[#b6c5e6] text-lg">
                <li className="flex items-start gap-3"><span>📞</span><span>Automatically manage customer calls</span></li>
                <li className="flex items-start gap-3"><span>📣</span><span>Schedule & publish social media posts</span></li>
                <li className="flex items-start gap-3"><span>📊</span><span>Daily business reports delivered</span></li>
                <li className="flex items-start gap-3"><span>🤖</span><span>Build workflows by writing a prompt</span></li>
                <li className="flex items-start gap-3"><span>🔄</span><span>Self-healing workflows that auto-fix errors</span></li>
                <li className="flex items-start gap-3"><span>🔐</span><span>Enterprise-grade security & privacy</span></li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* AI ADVISOR */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 text-white"
          >
            <div className="flex items-start gap-4">
              {/* Replace image logo with text wordmark 'Lethimdo' */}
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">
                  L
                </div>
                <span className="text-white font-extrabold text-xl tracking-tight">Lethimdo</span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold">Your AI business assistant</h3>
                <p className="text-[#9db2e9] mt-1">Lethimdo learns your business and suggests automations to help you grow faster.</p>
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[#c6d4f7]">
                  <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Automate weekly report delivery</li>
                  <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Send Slack alerts for new leads</li>
                  <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Auto-schedule social media campaigns</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">How it works in 3 steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "📝", title: "Write your prompt", desc: "Describe what you want automated." },
              { icon: "⚡", title: "AI builds the workflow", desc: "Instantly creates automation for you." },
              { icon: "🚀", title: "Run & scale", desc: "Save hours weekly and focus on growth." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white"
              >
                <div className="text-2xl">{s.icon}</div>
                <div className="mt-2 font-semibold">{s.title}</div>
                <p className="text-[#9db2e9] mt-1">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TRUST & WORKFLOW CARDS */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Other Agencies */}
            <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-5 text-white">
              <div aria-hidden className="absolute right-[-40px] top-[-40px] size-[180px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/90 font-semibold">Other Agencies</span>
                <span className="text-[#94b8ff] text-xs border border-[#2b3f7a] px-2 py-1 rounded-full">Legacy</span>
              </div>
              <div className="rounded-2xl border border-[#3c50a1] p-4 bg-[#0b1120]">
                <ul className="space-y-3 text-[#c6d4f7]">
                  {[
                    "Slow onboarding",
                    "High costs",
                    "Rigid processes",
                    "Delayed feedback",
                    "Low transparency",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-rose-400">✕</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lethimdo */}
            <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/90 backdrop-blur-xl p-5 text-white">
              <div aria-hidden className="absolute right-[-40px] top-[-40px] size-[180px] rounded-full bg-gradient-to-br from-[#2563eb]/30 to-transparent blur-2xl" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">
                    L
                  </div>
                  <span className="text-white/90 font-semibold">Lethimdo</span>
                </div>
                <span className="text-emerald-300 text-xs border border-emerald-800/50 px-2 py-1 rounded-full bg-emerald-500/10">
                  Modern
                </span>
              </div>
              <div className="rounded-2xl border border-white/10 p-4 bg-[#0b1120]">
                <ul className="space-y-3 text-[#c6d4f7]">
                  {[
                    "Instant setup",
                    "Affordable plans",
                    "Flexible workflows",
                    "Real‑time updates",
                    "Full visibility",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="text-emerald-400">✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
              { title: "CRM Updates", desc: "Keep contacts in sync across systems" },
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

        {/* ANALYTICS */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">See your ROI in real time</h3>
          <p className="text-[#8fa2c9] mb-6">Track time and money saved with automation.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Workflows run over time" },
              { title: "Workflow distribution" },
              { title: "Hours saved per workflow" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-40 md:h-48 rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-4 text-white"
              >
                <div className="h-full w-full rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_55%)] grid place-items-center text-[#9db2e9]">
                  {c.title}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="flex items-center justify-center mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
            <span className="mx-2 text-[#9db2e9] text-sm">Pricing</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center">
            Plans and Pricing
          </h3>
          <p className="text-center text-[#8fa2c9] max-w-2xl mx-auto mt-2">
            Find the perfect plan to streamline your content creation workflow and unlock powerful tools designed to save time and boost productivity.
          </p>

          {/* Replaced old two-card layout with 4-plan grid from Pricing page */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, i) => {
              const renderFeature = (f: string) => {
                const isGood = f.trim().startsWith("✅");
                const isBad = f.trim().startsWith("❌");
                const label = f.replace(/^✅\s*/, "").replace(/^❌\s*/, "");
                return (
                  <li
                    key={f}
                    className="flex items-start gap-2 rounded-md border border-white/10 bg-[#0b1120]/60 px-2 py-2"
                  >
                    {isGood ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#60a5fa]" />
                    ) : isBad ? (
                      <XCircle className="mt-0.5 h-4 w-4 text-[#ef4444]" />
                    ) : (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#9bb1e9]" />
                    )}
                    <span className="text-sm text-[#c6d4f7]">{label}</span>
                  </li>
                );
              };

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border bg-gradient-to-b from-[#0e1a38] to-[#0b142b] backdrop-blur-xl shadow-[0_18px_60px_-20px_rgba(37,99,235,0.45)] ${
                    plan.accent ? "ring-1 ring-[color:var(--ring)]/40" : "border-white/10"
                  }`}
                >
                  <Card className="border-0 bg-transparent shadow-none">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white text-xl font-extrabold tracking-tight">
                          {plan.name}
                        </CardTitle>
                        {plan.accent && (
                          <Badge className="rounded-full border border-white/15 bg-white/10 text-[#9bb1e9]">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-end gap-1">
                          <div className="text-3xl font-extrabold text-white">{plan.price}</div>
                          <div className="text-[#9bb1e9]">{plan.cadence}</div>
                        </div>
                        <div className="mt-1 text-xs text-[#9bb1e9]">{plan.highlight}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs uppercase tracking-wide text-[#9bb1e9]">
                        Included Benefits
                      </div>
                      <ul className="space-y-1.5">
                        {plan.features.map(renderFeature)}
                      </ul>
                      <div className="text-xs text-[#8fa2c9]">{plan.bestFor}</div>
                      <Button
                        onClick={plan.cta}
                        className="w-full rounded-xl py-2.5 font-bold bg-[#1f51ff] hover:bg-[#1b45da] text-white"
                      >
                        {plan.ctaLabel}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Keep simple CTA bar consistent with site styling */}
          <div className="mt-6 rounded-2xl border border-[#1a2a55] bg-[#0b1120]/70 backdrop-blur-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-white/90">Your workflow upgrade starts here</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* CASE STUDIES */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">See real results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🚀", title: "E-commerce store", result: "Saved 15 hours/week automating order updates" },
              { icon: "🏢", title: "Consulting firm", result: "Increased leads by 30% with LinkedIn automation" },
              { icon: "📊", title: "Startup team", result: "Reduced reporting time by 90% using Google Sheets automation" },
            ].map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white"
              >
                <div className="text-2xl">{cs.icon}</div>
                <div className="mt-2 font-semibold">{cs.title}</div>
                <p className="text-[#9db2e9] mt-1">{cs.result}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL BANNER */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/90 backdrop-blur-xl p-6">
            {/* subtle waves/backdrop */}
            <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 90% at 10% 30%, rgba(30,64,175,0.35), transparent 60%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "conic-gradient(from 260deg at 60% 60%, rgba(59,130,246,0.15), rgba(15,23,42,0) 45%, rgba(59,130,246,0.15) 75%, rgba(15,23,42,0))",
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
              {/* Quote */}
              <div className="text-white">
                <div className="text-[#9db2e9] text-sm mb-3">Trusted by teams</div>
                <p className="text-xl md:text-2xl leading-relaxed text-[#d7e3ff]">
                  "We used to spend hours juggling reports and chasing updates. After
                  switching to Lethimdo, real‑time tracking saved us time and increased
                  our conversion rate by 35%."
                </p>
                <div className="mt-4 text-[#9db2e9]">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-amber-300">★</span>
                    ))}
                  </div>
                  <div className="text-sm mt-1">Mariana, Digital Marketing Director</div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <button
                    className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white"
                    aria-label="Previous testimonial"
                  >
                    ←
                  </button>
                  <button
                    className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white"
                    aria-label="Next testimonial"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(30,64,175,0.55)]">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
                    alt="Happy customer"
                    className="w-full h-[260px] md:h-[300px] object-cover"
                  />
                </div>
              </div>
            </div>
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

        {/* NEWSLETTER */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="rounded-2xl border border-[#1a2a55] bg-gradient-to-b from-[#0b1120] to-[#0a0f1e] p-6 md:p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-extrabold">Stay ahead with automation tips</h3>
            <p className="text-[#9db2e9] mt-1">Get weekly insights on AI-powered productivity.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Input placeholder="Enter your email" className="bg-[#0f1730]/70 border-white/10 text-white" />
              <Button className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white">Subscribe</Button>
            </div>
          </div>
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

        {/* Fixed page footer blur overlay for a soft edge while scrolling */}
        <GradualBlur
          preset="page-footer"
          animated="scroll"
          height="3.5rem"
          divCount={6}
          strength={1.4}
          opacity={0.7}
          curve="bezier"
          className="pointer-events-none"
          style={{ zIndex: 20 }}
        />
      </main>
    </div>
  );
}