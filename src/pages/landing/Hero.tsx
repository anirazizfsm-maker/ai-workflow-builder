import { useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import GooeyNav from "@/components/GooeyNav";
import VariableProximity from "@/components/VariableProximity";
import Beams from "@/components/Beams";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const staticHeadline = "Automation will grow your business 2x faster.";

  const handleDemoWorkflow = () => {
    // Navigate to dashboard in demo mode
    navigate("/dashboard");
  };

  return (
    <section ref={heroRef} className="relative mx-auto max-w-[100rem] px-6 md:px-8 pt-12 md:pt-24 pb-12 md:pb-20 overflow-hidden rounded-2xl min-h-[620px] md:min-h-[900px]">
      {/* Top-left wordmark */}
      <div className="absolute top-4 left-4 z-30">
        <button onClick={() => navigate("/")} aria-label="Go to home" className="px-0 py-0 bg-transparent text-white">
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

      {/* Centered nav */}
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

      {/* Mobile menu */}
      <div className="absolute top-4 right-4 z-30 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              whileTap={{ scale: 0.96 }}
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white p-3 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <Menu className="h-5 w-5" />
            </motion.button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0b1120]/90 backdrop-blur-xl border-[#142554] text-white w-72 sm:w-80">
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <motion.div
              className="mt-6 grid gap-2.5"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
            >
              <SheetClose asChild>
                <motion.button
                  variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/")}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Home
                </motion.button>
              </SheetClose>
              <SheetClose asChild>
                <motion.button
                  variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/pricing")}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Pricing
                </motion.button>
              </SheetClose>
              <SheetClose asChild>
                <motion.button
                  variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-base hover:bg-white/[0.12] focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Dashboard
                </motion.button>
              </SheetClose>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Background with Beams */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#2563eb"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030611]/25 via-transparent to-[#030611]/25" />
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

      {/* Headline + CTA */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-full max-w-5xl mt-2 flex justify-center">
          <h1 className="relative mt-6 font-normal leading-[1.08] text-white text-[28px] sm:text-[38px] md:text-[54px] lg:text-[64px] tracking-tight text-balance px-1" aria-live="off">
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
        <p className="mt-5 max-w-3xl text-[#a6b3cf] text-lg md:text-xl">
          Manage customer calls, manage social media posts, daily reports, appointments, and automate anything with a single prompt.
        </p>
        
        {/* Benefits preview */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-3 max-w-2xl">
          <p className="text-[#9db2e9] text-sm md:text-base">
            ✨ <strong className="text-white">You'll get access to the free workflow builder instantly</strong> — No credit card required
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="w-full sm:w-auto rounded-xl px-7 py-6 text-base font-bold text-white bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] shadow-[0_0_24px_rgba(37,99,235,0.35)]"
          >
            Start Free Trial
          </Button>
          
          <Button
            onClick={handleDemoWorkflow}
            variant="outline"
            className="w-full sm:w-auto rounded-xl px-7 py-6 text-base font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_0_24px_rgba(255,255,255,0.06)]"
          >
            Try Demo Workflow
          </Button>
        </div>
        
        {/* OAuth login options */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-[#9db2e9] text-sm">Or sign in with:</p>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/auth?provider=google")}
              variant="outline"
              className="rounded-xl px-5 py-2.5 text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button
              onClick={() => navigate("/auth?provider=github")}
              variant="outline"
              className="rounded-xl px-5 py-2.5 text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}