import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import GooeyNav from "@/components/GooeyNav";
import VariableProximity from "@/components/VariableProximity";
import LightRays from "@/components/LightRays";
import "@/components/LightRays.css";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const staticHeadline = "Automation will grow your business 2x faster.";

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

      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <LightRays
          className="absolute inset-0"
          raysOrigin="top-center"
          raysColor="#2563eb"
          raysSpeed={1}
          lightSpread={1}
          rayLength={2}
          pulsating={false}
          fadeDistance={1.0}
          saturation={1.0}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.0}
          distortion={0.1}
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
  );
}
