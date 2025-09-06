import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import ChipsetBackground from "@/components/ChipsetBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg"
        >
          <h1 className="mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl md:text-6xl font-extrabold tracking-tight text-transparent">
            Simple, market‑aligned pricing
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg font-medium text-muted-foreground">
            Pick a plan that fits your stage. Upgrade or cancel anytime.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-xl px-6 py-3 font-bold shadow-md border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
            >
              Start Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/plans")}
              className="rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-accent/10 shadow-sm"
            >
              Go to Checkout
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="px-4 py-10 md:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg ${
                plan.accent ? "ring-1 ring-[color:var(--ring)]/50" : ""
              }`}
            >
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-foreground text-xl font-extrabold tracking-tight">
                      {plan.name}
                    </CardTitle>
                    {plan.accent && (
                      <Badge className="rounded-full border border-border bg-card text-foreground">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-end gap-1">
                      <div className="text-3xl font-extrabold text-foreground">{plan.price}</div>
                      <div className="text-muted-foreground">{plan.cadence}</div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{plan.highlight}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="rounded-md border border-border bg-background/60 px-2 py-1">
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-muted-foreground">{plan.bestFor}</div>
                  <Button
                    onClick={plan.cta}
                    className="w-full rounded-xl py-2.5 font-bold border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
                  >
                    {plan.ctaLabel}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-10 md:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg text-center text-foreground"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Not sure where to start?
          </h3>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Start free, then scale with Starter, Pro, or Business as you grow.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/auth")}
              className="rounded-xl px-6 py-3 font-bold shadow-md border border-white/20 bg-white/10 backdrop-blur-md text-foreground hover:bg-white/15"
            >
              Start Free
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/plans")}
              className="rounded-xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-accent/10 shadow-sm"
            >
              Go to Checkout
            </Button>
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