import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from './stores/useAppStore';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import DashboardCard from './components/DashboardCard';
import ApiStatus from './components/ApiStatus';
import ApiTestPage from './components/ApiTestPage';
import ProfessionalStyling from './components/ProfessionalStyling';
import AgencySection from './components/AgencySection';
import MarketingPage from './components/MarketingPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import WorkflowPerformanceDetail from './components/analytics/WorkflowPerformanceDetail';
import WorkflowsPage from './components/WorkflowsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { useIntegrations, useConnectIntegration } from './hooks/useApi';
import WorkflowBuilder from './components/WorkflowBuilder';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useRef } from 'react';
import './App.css';

// Import icons from lucide-react (similar to VLY.AI design)
import { 
  Zap, 
  Bot, 
  Rocket, 
  ArrowRight, 
  Sparkles, 
  MessageCircle, 
  Send, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Menu,
  Home,
  CreditCard,
  LayoutDashboard
} from 'lucide-react';

// Import framer-motion for animations (similar to VLY.AI design)
import { motion } from 'framer-motion';

// Add the custom Button component to replace the missing ui/button
const Button = ({ 
  onClick, 
  className, 
  children, 
  variant 
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  variant?: 'outline';
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = variant === 'outline' 
    ? "border border-input hover:bg-accent hover:text-accent-foreground" 
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  
  const classes = `${baseClasses} ${variantClasses} ${className || ''}`;
  
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

// Simple Landing Page Component with VLY.AI design elements
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden dark bg-[#0b1120]">
      <main className="relative z-0">
        
        {/* HERO - Updated with VLY.AI design elements */}
        <section ref={heroRef} className="relative mx-auto max-w-[100rem] px-6 md:px-8 pt-12 md:pt-24 pb-12 md:pb-20 overflow-hidden rounded-2xl min-h-[620px] md:min-h-[900px]">
          {/* Top-left Logo */}
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={() => navigate("/")}
              aria-label="Go to home"
              className="px-0 py-0 bg-transparent text-white"
            >
              <span className="leading-none text-2xl font-bold">
                Lethimdo
              </span>
            </button>
          </div>

          {/* Navigation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full px-6 md:px-8">
            <div className="mx-auto max-w-6xl hidden md:flex justify-center space-x-8">
              <button 
                onClick={() => navigate("/")} 
                className="text-[#cfe0ff] hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => navigate("/pricing")} 
                className="text-[#cfe0ff] hover:text-white transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => navigate("/dashboard")} 
                className="text-[#cfe0ff] hover:text-white transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="absolute top-4 right-4 z-30 md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white p-2.5 hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#0b1120] border border-[#142554] shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => { navigate("/"); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-[#cfe0ff] hover:bg-white/5"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => { navigate("/pricing"); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-[#cfe0ff] hover:bg-white/5"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-[#cfe0ff] hover:bg-white/5"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Background effects */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {/* Dark overlay */}
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

          <div className="flex flex-col items-center text-center">
            {/* Customer pill */}
            <div className="rounded-full bg-white/5 border border-white/10 px-3.5 py-2 flex items-center gap-3 shadow-[0_10px_32px_-12px_rgba(37,99,235,0.45)]">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-blue-500 ring-2 ring-[#0a1429]"></div>
                <div className="h-6 w-6 rounded-full bg-indigo-500 ring-2 ring-[#0a1429]"></div>
                <div className="h-6 w-6 rounded-full bg-cyan-500 ring-2 ring-[#0a1429]"></div>
              </div>
              <span className="text-[#cfe0ff] text-sm md:text-[15px]">Join 15,725+ other loving customers</span>
            </div>

            {/* Headline */}
            <h1 className="relative mt-6 font-normal leading-[1.08] text-white text-[28px] sm:text-[38px] md:text-[54px] lg:text-[64px] tracking-tight text-balance px-1">
              Automation will grow your business 2x faster.
            </h1>

            {/* Subcopy */}
            <p className="mt-5 max-w-3xl text-[#a6b3cf] text-lg md:text-xl">
              Manage customer calls, manage social media posts, daily reports, appointments, and automate anything with a single prompt.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto rounded-xl px-7 py-6 text-base font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_0_24px_rgba(255,255,255,0.06)]"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>

        {/* SHOWCASE - Updated with VLY.AI design */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[22px] border border-[#18264c] bg-[#0a1327]/80 backdrop-blur-xl overflow-hidden shadow-[0_20px_80px_-24px_rgba(30,64,175,0.55)]"
          >
            {/* Top highlight beam */}
            <div
              aria-hidden
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.75) 35%, rgba(147,197,253,0.9) 50%, rgba(59,130,246,0.75) 65%, rgba(59,130,246,0) 100%)" }}
            />
            
            {/* Main 3-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-0 border-t border-[#152247]">
              {/* Left sidebar */}
              <aside className="hidden lg:block border-r border-[#152247] p-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="h-6 w-6 rounded-md bg-[#0f1730] border border-[#1b2a55] grid place-items-center">
                    <span className="text-[#76a3ff] text-xs">⎔</span>
                  </div>
                  <div>
                    <div className="font-medium">Automation Hiring</div>
                    <div className="text-xs text-[#8fa2c9]">Last edited 5 mins ago</div>
                  </div>
                </div>
                <div className="mt-5 text-[#9db2e9] text-sm">Templates</div>
                <div className="mt-3 space-y-1">
                  <div className="text-[#9db2e9] text-sm py-2">Social Media</div>
                  <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-3 space-y-2">
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">📄</div>
                        <div className="text-sm">Send email for new Google Forms</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">📊</div>
                        <div className="text-sm">Insert data into Google Sheets</div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3">
                      <div className="flex items-center gap-2 text-white">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">🗓️</div>
                        <div className="text-sm">Create Google Calendar event</div>
                      </div>
                    </div>
                    <div className="pt-1 text-xs text-[#8fa2c9]">Get access to no‑code templates with <span className="text-[#79a2ff]">Premium</span></div>
                  </div>
                </div>
              </aside>

              {/* Center canvas */}
              <div className="relative">
                {/* dotted grid */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(rgba(255,255,255,0.08) 1px, rgba(0,0,0,0) 1px), radial-gradient(rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
                    backgroundSize: "16px 16px, 32px 32px",
                    backgroundPosition: "0 0, 8px 8px",
                  }}
                />
                <div className="relative p-6 md:p-10 min-h-[520px]">
                  {/* Zoom controls */}
                  <div className="flex items-center gap-2 text-[#9db2e9]">
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↺</div>
                    <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↻</div>
                    <div className="ml-2 text-sm">—</div>
                    <div className="rounded-lg bg-[#0f1730] border border-white/10 px-2.5 h-8 grid place-items-center text-white text-sm">100 %</div>
                    <div className="text-sm">＋</div>
                  </div>

                  {/* Workflow visualization */}
                  <div className="mt-10 mx-auto max-w-2xl">
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#3b82f6]/20 grid place-items-center text-[#8ab4ff] text-xs">G</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#1b2a55] text-[#8ab4ff]">Trigger</span>
                          <span className="text-white font-medium text-sm">New data input in Google Forms</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>

                    {/* connector */}
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                    <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

                    {/* Node 2 */}
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#10b981]/20 grid place-items-center text-[#7de9c0] text-xs">S</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#1b2a55] text-[#8ab4ff]">Trigger</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#3b2746] text-[#ff7aa8]">Action</span>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#3b2746] text-[#ff7aa8]">Action</span>
                          <span className="text-white font-medium text-sm">Insert data to sheet in a new row</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>

                    {/* connector */}
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                    <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                    <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

                    {/* Node 3 */}
                    <div className="rounded-2xl border border-[#2a3d77] bg-gradient-to-b from-[#101b39] to-[#0d162f] shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)]">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-md bg-[#ef4444]/20 grid place-items-center text-[#ff9a9a] text-xs">C</div>
                          <span className="text-xs px-2 py-0.5 rounded-md bg-[#3b2746] text-[#ff7aa8]">Action</span>
                          <span className="text-white font-medium text-sm">Generate meeting in Google Calendar</span>
                        </div>
                        <div className="h-5 w-8 rounded bg-white/5 border border-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar */}
              <aside className="hidden lg:block border-l border-[#152247] p-4">
                <div className="text-white font-semibold">Step Configuration</div>
                <div className="mt-4">
                  <div className="text-[#9db2e9] text-sm mb-1">Applications</div>
                  <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-3">
                    <div className="text-[#9db2e9] text-sm">Account Connections</div>
                    <p className="text-xs text-[#8fa2c9] mt-1">
                      Gmail is a secure partner with Aflow. Manage your accounts{" "}
                      <span className="text-[#79a2ff] underline underline-offset-2">here</span>.
                    </p>
                    <div className="mt-3 rounded-lg bg-[#0f1a35] border border-[#1a2a55] p-3 text-white text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-md bg-white/10 grid place-items-center">✉️</div>
                        elisanapitupulu@gmail.com
                      </div>
                    </div>
                    <Button className="mt-3 w-full rounded-lg bg-[#1f51ff] hover:bg-[#1b45da] text-white">
                      Change account
                    </Button>
                    <Button variant="outline" className="mt-2 w-full rounded-lg border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70">
                      Add account
                    </Button>
                  </div>

                  <div className="mt-4">
                    <div className="text-[#9db2e9] text-sm mb-1">Trigger</div>
                    <div className="rounded-xl bg-[#0d162e] border border-[#152247] p-4 text-white/90 text-sm">
                      When new Google Form response is received
                    </div>
                  </div>
                </div>
              </aside>
            </div>
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
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Why teams choose Lethimdo</h3>
              <ul className="space-y-3 text-[#b6c5e6] text-lg">
                <li className="flex items-start gap-3"><span>📞</span><span>Automatically manage customer calls</span></li>
                <li className="flex items-start gap-3"><span>📣</span><span>Schedule & publish social media posts</span></li>
                <li className="flex items-start gap-3"><span>📊</span><span>Daily business reports delivered</span></li>
                <li className="flex items-start gap-3"><span>🤖</span><span>Build workflows by writing a prompt</span></li>
                <li className="flex items-start gap-3"><span>🔄</span><span>Self-healing workflows that auto-fix errors</span></li>
                <li className="flex items-start gap-3"><span>🔐</span><span>Enterprise-grade security & privacy</span></li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* PRICING - Updated with VLY.AI design */}
        <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
          <div className="flex items-center justify-center mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
            <span className="mx-2 text-[#9db2e9] text-sm">Pricing</span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#94b8ff]/70" />
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center">
            Plans and Pricing
          </h3>
          <p className="text-center text-[#8fa2c9] max-w-2xl mx-auto mt-2">
            Find the perfect plan to streamline your content creation workflow and unlock powerful tools designed to save time and boost productivity.
          </p>

          {/* Pricing plans */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
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
                cta: () => navigate("/register"),
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
                cta: () => navigate("/pricing"),
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
                cta: () => navigate("/pricing"),
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
                cta: () => navigate("/pricing"),
                ctaLabel: "Contact Sales",
                accent: false,
              },
            ].map((plan, i) => {
              const renderFeature = (f: string) => {
                const isGood = f.trim().startsWith("✅");
                const isBad = f.trim().startsWith("❌");
                const label = f.replace(/^✅\s*/, "").replace(/^❌\s*/, "");
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
                  <div className="border-0 bg-transparent shadow-none">
                    <div className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="text-white text-xl font-extrabold tracking-tight">
                          {plan.name}
                        </div>
                        {plan.accent && (
                          <span className="rounded-full border border-white/15 bg-white/10 text-[#9bb1e9] px-2 py-1 text-xs">
                            Popular
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-end gap-1">
                          <div className="text-3xl font-extrabold text-white">{plan.price}</div>
                          <div className="text-[#9bb1e9]">{plan.cadence}</div>
                        </div>
                        <div className="mt-1 text-xs text-[#9bb1e9]">{plan.highlight}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
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
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA bar */}
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

        {/* CTA Section */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-16">
          <div className="rounded-2xl border border-[#1a2a55] bg-gradient-to-b from-[#0b1120] to-[#0a0f1e] p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to automate your business?</h3>
            <Button
              onClick={() => navigate("/register")}
              className="rounded-xl px-8 py-6 text-base font-bold text-white bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] shadow-[0_0_30px_rgba(37,99,235,0.25)]"
            >
              Get Started Now
            </Button>
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Example using Headless UI */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Quick Action
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This modal demonstrates the use of Headless UI components for accessible UI.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Header title="Lethimdo Dashboard" subtitle="" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your API integrations and workflows</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Settings
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Create Workflow
            </button>
          </div>
        </div>
        
        {/* API Connection Status */}
        <ApiStatus />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Integrations"
            description="150+ API integrations ready to use"
            icon="🔌"
            link="/integrations"
            stat="24"
          />
          <DashboardCard
            title="Workflows"
            description="Manage your automation workflows"
            icon="🔄"
            link="/workflows"
          />
          <DashboardCard
            title="Auto-Discovery"
            description="Discover any API automatically"
            icon="🔍"
            link="/discover"
            badge="New"
          />
          <DashboardCard
            title="Custom Builder"
            description="Build custom integrations"
            icon="🛠️"
            link="/builder"
          />
          <DashboardCard
            title="Marketplace"
            description="Community integrations"
            icon="🏪"
            link="/marketplace"
          />
          <DashboardCard
            title="Analytics"
            description="Business intelligence dashboard"
            icon="📊"
            link="/analytics"
            badge="New"
          />
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Choose Your Integration Method</h3>
                  <p className="text-gray-600">Browse pre-built integrations, use auto-discovery, or build custom ones</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Configure Authentication</h3>
                  <p className="text-gray-600">Set up OAuth, API keys, or custom authentication methods</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Start Using in Workflows</h3>
                  <p className="text-gray-600">Begin automating with your connected APIs immediately</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Simple Integrations Page
const IntegrationsPage: React.FC = () => {
  const { data: integrationsResponse, isLoading, error } = useIntegrations();
  const connectMutation = useConnectIntegration();

  const integrations = integrationsResponse?.data?.data || [
    { id: 'salesforce', name: 'Salesforce', icon: '🔹', category: 'CRM', status: 'Available' },
    { id: 'google', name: 'Google Workspace', icon: '🌐', category: 'Productivity', status: 'Available' },
    { id: 'slack', name: 'Slack', icon: '💬', category: 'Communication', status: 'Available' },
    { id: 'stripe', name: 'Stripe', icon: '💳', category: 'Payments', status: 'Available' },
    { id: 'github', name: 'GitHub', icon: '🐙', category: 'Developer', status: 'Available' },
    { id: 'shopify', name: 'Shopify', icon: '🛒', category: 'E-commerce', status: 'Available' },
  ];

  const handleConnect = (id: string) => {
    connectMutation.mutate(id, {
      onSuccess: () => {
        toast.success(`Successfully connected to ${id}!`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Connection failed');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Integrations" subtitle="Connect with 150+ popular services" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Integrations</h1>
            <p className="mt-2 text-gray-600">Connect with the tools your clients use every day</p>
          </div>
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Dashboard
          </Link>
        </div>
        
        {/* API Connection Status */}
        <ApiStatus />
        
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading integrations...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Failed to load integrations. Using fallback data.
          </div>
        )}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration: any) => (
            <div key={integration.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <span className="text-sm text-gray-500">{integration.category}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">{integration.status}</span>
                <button 
                  onClick={() => handleConnect(integration.id)}
                  disabled={connectMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {connectMutation.isPending ? 'Connecting...' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<Dashboard />} />
          <Route path="/builder" element={<WorkflowBuilder />} />
          <Route path="/marketplace" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/analytics/workflow/:workflowId" element={<WorkflowPerformanceDetail />} />
          <Route path="/docs" element={<Dashboard />} />
          <Route path="/test-api" element={<ApiTestPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/pricing" element={
            <div className="min-h-screen bg-[#0b1120]">
              <Header title="Pricing" subtitle="Choose the perfect plan for your needs" />
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                  <h1 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h1>
                  <p className="text-[#a6b3cf] max-w-2xl mx-auto">
                    Everything you need to automate your business, nothing you don't.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
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
                      cta: () => window.location.hash = "/register",
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
                      cta: () => window.location.hash = "/pricing",
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
                      cta: () => window.location.hash = "/pricing",
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
                      cta: () => window.location.hash = "/pricing",
                      ctaLabel: "Contact Sales",
                      accent: false,
                    },
                  ].map((plan, i) => {
                    const renderFeature = (f: string) => {
                      const isGood = f.trim().startsWith("✅");
                      const isBad = f.trim().startsWith("❌");
                      const label = f.replace(/^✅\s*/, "").replace(/^❌\s*/, "");
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
                      <div
                        key={plan.name}
                        className={`rounded-2xl border bg-gradient-to-b from-[#0e1a38] to-[#0b142b] backdrop-blur-xl shadow-[0_18px_60px_-20px_rgba(37,99,235,0.45)] ${
                          plan.accent ? "ring-1 ring-[color:var(--ring)]/40" : "border-white/10"
                        }`}
                      >
                        <div className="border-0 bg-transparent shadow-none">
                          <div className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="text-white text-xl font-extrabold tracking-tight">
                                {plan.name}
                              </div>
                              {plan.accent && (
                                <span className="rounded-full border border-white/15 bg-white/10 text-[#9bb1e9] px-2 py-1 text-xs">
                                  Popular
                                </span>
                              )}
                            </div>
                            <div className="mt-2">
                              <div className="flex items-end gap-1">
                                <div className="text-3xl font-extrabold text-white">{plan.price}</div>
                                <div className="text-[#9bb1e9]">{plan.cadence}</div>
                              </div>
                              <div className="mt-1 text-xs text-[#9bb1e9]">{plan.highlight}</div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="text-xs uppercase tracking-wide text-[#9bb1e9]">
                              Included Benefits
                            </div>
                            <ul className="space-y-1.5">
                              {plan.features.map(renderFeature)}
                            </ul>
                            <div className="text-xs text-[#8fa2c9]">{plan.bestFor}</div>
                            <button
                              onClick={plan.cta}
                              className="w-full rounded-xl py-2.5 font-bold bg-[#1f51ff] hover:bg-[#1b45da] text-white"
                            >
                              {plan.ctaLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Footer />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;