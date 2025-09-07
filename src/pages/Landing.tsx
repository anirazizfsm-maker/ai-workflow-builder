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

      {/* Dark veil + blue top glow overlay for screenshot theme */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* base dark veil */}
        <div className="absolute inset-0 bg-[#05070d]/92" />
        {/* top-center blue radial glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-[420px] w-[1100px] rounded-full blur-3xl opacity-50"
             style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(37,99,235,0.5) 0%, rgba(2,6,23,0.0) 70%)" }} />
        {/* subtle horizon line glow */}
        <div className="absolute top-[380px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1c3d8a]/40 to-transparent" />
      </div>

      <main className="relative z-0">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-24">
          <div className="grid grid-cols-1 gap-10 items-center">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-extrabold text-[40px] md:text-[56px] leading-tight text-white tracking-tight"
                style={{ fontFamily: "Space Grotesk, ui-sans-serif, system-ui" }}
              >
                Automation will grow your business 2x faster.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.6 }}
                className="mt-5 mx-auto max-w-3xl text-[#a6b3cf] text-[18px] md:text-[20px]"
                style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}
              >
                Manage customer calls, manage social media posts, Daily Update your report, fix an appointment, automate anything by just a prompt.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16, duration: 0.5 }}
                className="mt-8 flex flex-wrap justify-center gap-4"
              >
                <Button
                  onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
                  className="rounded-xl px-7 py-6 text-base font-bold text-white bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e40af] hover:from-[#1b2f6e] hover:via-[#1f4fd3] hover:to-[#19368e] shadow-[0_0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_36px_0_rgba(37,99,235,0.45)] transition-shadow"
                >
                  🚀 Try AI Builder — Free Trial
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                  className="rounded-xl px-7 py-6 text-base font-bold border-[#204a9a] text-[#cfe0ff] bg-[#0b1020]/40 hover:bg-[#0f1730]/60"
                >
                  See Pricing
                </Button>
              </motion.div>
            </div>

            {/* Decorative hero visual panel (dark glass card) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[360px] md:h-[440px] rounded-2xl border border-[#1a2a55] bg-gradient-to-b from-[#0b1120] to-[#0a0f1e] shadow-2xl"
            >
              <div className="h-full w-full rounded-2xl bg-[radial-gradient(60%_60%_at_50%_35%,rgba(37,99,235,0.18),transparent_70%)]" />
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
            className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 md:p-10 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Your Automation Control Panel</h2>
            <p className="text-[#8fa2c9] mb-6">
              A single dashboard to run, monitor, and manage all your workflows.
            </p>
            <div className="h-[340px] rounded-xl border border-[#142554] bg-gradient-to-b from-[#0a0f1e] to-[#0b1120] shadow-inner" />
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
              <img src="/logo.png" alt="logo" className="h-8 w-8" />
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