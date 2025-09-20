import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import PlansPlanList from "./PlansPlanList";
import PlansBillingForm from "./PlansBillingForm";

export default function Plans() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen dark bg-[#0b1120]">
      {/* Background tint */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6">
          <button
            onClick={() => navigate("/")}
            className="text-white font-extrabold tracking-tight text-xl md:text-2xl hover:opacity-90 transition flex items-center gap-2"
          >
            <span>LETHIMDO</span>
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-[#1a2a55] bg-[#0b1120]/60 text-white hover:bg-[#0f1730]/70"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button className="rounded-xl px-5 py-2.5 text-white bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] shadow-[0_0_24px_rgba(37,99,235,0.25)]">
              Continue
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Plans column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <PlansPlanList />
          </motion.div>

          {/* Billing column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 lg:col-span-2"
          >
            <PlansBillingForm />
          </motion.div>
        </div>
      </main>
    </div>
  );
}