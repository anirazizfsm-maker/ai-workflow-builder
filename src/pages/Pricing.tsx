import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function Pricing() {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Perfect for trying out the platform",
      features: [
        "3 workflows",
        "100 runs per month",
        "Basic templates",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Starter",
      monthlyPrice: 9,
      yearlyPrice: 86.4, // 20% off
      description: "For individuals getting started",
      features: [
        "10 workflows",
        "1,000 runs per month",
        "All templates",
        "Priority email support",
        "Basic analytics",
      ],
      cta: "Start 7-Day Free Trial",
      popular: false,
      trial: true,
    },
    {
      name: "Pro",
      monthlyPrice: 29,
      yearlyPrice: 278.4, // 20% off
      description: "For teams that need more power",
      features: [
        "Unlimited workflows",
        "10,000 runs per month",
        "All templates + custom",
        "Priority support",
        "Advanced analytics",
        "Team collaboration",
        "API access",
      ],
      cta: "Start 7-Day Free Trial",
      popular: true,
      trial: true,
    },
    {
      name: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 950.4, // 20% off
      description: "Advanced needs & dedicated support",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Onboarding assistance",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return "Free";
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const period = isYearly ? "yr" : "mo";
    return `$${price}/${period}`;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0) return null;
    const yearlyCost = plan.monthlyPrice * 12;
    const savings = yearlyCost - plan.yearlyPrice;
    return Math.round(savings);
  };

  return (
    <div className="min-h-screen dark bg-[#0b1120]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-[#0b1120]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6">
          <button
            onClick={() => navigate("/")}
            className="text-white font-extrabold tracking-tight text-xl md:text-2xl hover:opacity-90 transition"
          >
            LETHIMDO
          </button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-[#1a2a55] bg-[#0b1120]/60 text-white hover:bg-[#0f1730]/70"
          >
            Back
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-[#9bb1e9] mb-8">
              Start with a 7-day free trial. No credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={!isYearly ? "text-white font-semibold" : "text-[#9bb1e9]"}>
                Monthly
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="billing-toggle" className={isYearly ? "text-white font-semibold" : "text-[#9bb1e9]"}>
                Yearly
              </Label>
              {isYearly && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Save 20%
                </Badge>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full bg-gradient-to-b from-[#0e1a38] to-[#0b142b] border-[#1a2a55] backdrop-blur-xl ${
                    plan.popular ? "ring-2 ring-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  {plan.trial && isYearly && getSavings(plan) && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Save ${getSavings(plan)}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-white text-2xl mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="text-4xl font-bold text-white mb-2">
                      {getPrice(plan)}
                    </div>
                    <p className="text-sm text-[#9bb1e9]">{plan.description}</p>
                    {plan.trial && (
                      <Badge variant="outline" className="mt-2 border-[#1a2a55] text-[#9bb1e9]">
                        7-day free trial
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-[#c6d4f7]">
                          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white"
                      onClick={() => {
                        if (plan.name === "Enterprise") {
                          window.location.href = "mailto:sales@lethimdo.com";
                        } else {
                          navigate("/plans", { state: { selectedPlan: plan.name, isYearly } });
                        }
                      }}
                    >
                      {plan.cta}
                    </Button>

                    {plan.trial && (
                      <p className="text-xs text-center text-[#9bb1e9]">
                        No credit card required for trial
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-16 text-center">
            <p className="text-[#9bb1e9]">
              All plans include automatic invoicing and can be cancelled anytime.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}