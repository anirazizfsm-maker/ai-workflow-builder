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
      {/* Animated Neon Chipset Background */}
      <ChipsetBackground />
      {/* Subtle vertical gradient overlay for depth */}
      {/* (previously: <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black" />) */}
      {/* Removed solid black overlay to reveal chipset animation */}
      {/* (previously: <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black" />) */}
      {/* ... keep existing code (rest of the JSX remains unchanged) */}
    </div>
  );
}