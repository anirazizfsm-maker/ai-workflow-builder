import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import ChipsetBackground from "@/components/ChipsetBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Pricing() {
  const navigate = useNavigate();

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
    <div className="relative min-h-screen overflow-hidden dark">
      <ChipsetBackground />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6 pt-[env(safe-area-inset-top)]">
          <button
            onClick={() => navigate("/")}
            className="relative cursor-pointer select-none text-2xl md:text-3xl font-extrabold tracking-tight text-foreground drop-shadow flex items-center gap-2"
          >
            <span>LETHIMDO</span>
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button
              className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center rounded-2xl border border-white/10 bg-[#0a1429]/70 backdrop-blur-xl p-6 md:p-8 shadow-[0_12px_48px_-16px_rgba(30,64,175,0.45)]"
        >
          <div className="mb-2 text-xs font-semibold tracking-wide text-[#9bb1e9]">
            ✦ Pricing ✦
          </div>
          <h1 className="mb-3 text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            The Best Pricing Plans
          </h1>
          <p className="mx-auto max-w-2xl text-sm md:text-base text-[#9bb1e9]">
            Find the perfect plan to streamline your workflow and unlock powerful tools designed to save time and boost productivity.
          </p>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => {
            // Feature icon + cleaned label from emoji prefix
            const renderFeature = (f: string) => {
              const isGood = f.trim().startsWith("✅");
              const isBad = f.trim().startsWith("❌");
              const label = f.replace(/^✅\s*/,"").replace(/^❌\s*/,"");
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
      </section>

      {/* CTA Bar */}
      <section className="px-4 pb-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#0a1429]/70 backdrop-blur-xl p-5 md:p-6 shadow-[0_12px_48px_-16px_rgba(30,64,175,0.45)]"
        >
          <div className="flex flex-col gap-3 items-center justify-between text-center md:flex-row">
            <p className="text-white font-semibold">Your workflow upgrade starts here</p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/auth")}
                className="rounded-xl bg-[#1f51ff] hover:bg-[#1b45da] text-white"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-4 pb-10">
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
            Questions?{" "}
            <a href="mailto:support@lethimdo.com" className="underline hover:text-foreground">
              support@lethimdo.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}