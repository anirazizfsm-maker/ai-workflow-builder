import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function PricingTeaser() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      cadence: "Trial",
      highlight: "5 workflows, 15 days",
      features: ["✅ 5 workflows max.", "✅ Run for 15 days (trial).", "❌ No auto-fix or advanced agent support.", "❌ Limited to 2 connected apps."],
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
      features: ["✅ Up to 20 workflows.", "✅ Run for 30 days rolling.", "✅ Basic AI Builder support.", "✅ Email reporting."],
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

  const renderFeature = (f: string) => {
    const isGood = f.trim().startsWith("✅");
    const isBad = f.trim().startsWith("❌");
    const label = f.replace(/^✅\s*/, "").replace(/^❌\s*/, "");
    return (
      <li key={f} className="flex items-start gap-2 rounded-md border border-white/10 bg-[#0b1120]/60 px-2 py-2">
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
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="flex items-center justify-center mb-6">
        <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
        <span className="mx-2 text-[#9db2e9] text-sm">Pricing</span>
        <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
      </div>
      <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center">Plans and Pricing</h3>
      <p className="text-center text-[#8fa2c9] max-w-2xl mx-auto mt-2">
        Find the perfect plan to streamline your content creation workflow and unlock powerful tools designed to save time and boost productivity.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => (
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
                  <CardTitle className="text-white text-xl font-extrabold tracking-tight">{plan.name}</CardTitle>
                  {plan.accent && (
                    <Badge className="rounded-full border border-white/15 bg-white/10 text-[#9bb1e9]">Popular</Badge>
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
                <div className="text-xs uppercase tracking-wide text-[#9bb1e9]">Included Benefits</div>
                <ul className="space-y-1.5">{plan.features.map(renderFeature)}</ul>
                <div className="text-xs text-[#8fa2c9]">{plan.bestFor}</div>
                <Button onClick={plan.cta} className="w-full rounded-xl py-2.5 font-bold bg-[#1f51ff] hover:bg-[#1b45da] text-white">
                  {plan.ctaLabel}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
  );
}
