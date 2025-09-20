import { motion } from "framer-motion";
import Hero from "./landing/Hero";
import Showcase from "./landing/Showcase";
import MarketingSections from "./landing/MarketingSections";
import PricingTeaser from "./landing/PricingTeaser";
import Newsletter from "./landing/Newsletter";
import SiteFooter from "./landing/SiteFooter";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden dark bg-[#0b1120]">
      <main className="relative z-0">
        <Hero />
        <Showcase />
        <MarketingSections />
        <PricingTeaser />
        <Newsletter />
        <SiteFooter />
      </main>
    </div>
  );
}