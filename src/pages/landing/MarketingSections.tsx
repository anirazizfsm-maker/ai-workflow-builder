import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function MarketingSections() {
  return (
    <>
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

      {/* AI ADVISOR */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">L</div>
              <span className="text-white font-extrabold text-xl tracking-tight">Lethimdo</span>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold">Your AI business assistant</h3>
              <p className="text-[#9db2e9] mt-1">Lethimdo learns your business and suggests automations to help you grow faster.</p>
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[#c6d4f7]">
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Automate weekly report delivery</li>
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Send Slack alerts for new leads</li>
                <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Auto-schedule social media campaigns</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">How it works in 3 steps</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "📝", title: "Write your prompt", desc: "Describe what you want automated." },
            { icon: "⚡", title: "AI builds the workflow", desc: "Instantly creates automation for you." },
            { icon: "🚀", title: "Run & scale", desc: "Save hours weekly and focus on growth." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white"
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-2 font-semibold">{s.title}</div>
              <p className="text-[#9db2e9] mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRUST & WORKFLOW CARDS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-5 text-white">
            <div aria-hidden className="absolute right-[-40px] top-[-40px] size-[180px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/90 font-semibold">Other Agencies</span>
              <span className="text-[#94b8ff] text-xs border border-[#2b3f7a] px-2 py-1 rounded-full">Legacy</span>
            </div>
            <div className="rounded-2xl border border-[#3c50a1] p-4 bg-[#0b1120]">
              <ul className="space-y-3 text-[#c6d4f7]">
                {["Slow onboarding", "High costs", "Rigid processes", "Delayed feedback", "Low transparency"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-rose-400">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/90 backdrop-blur-xl p-5 text-white">
            <div aria-hidden className="absolute right-[-40px] top-[-40px] size-[180px] rounded-full bg-gradient-to-br from-[#2563eb]/30 to-transparent blur-2xl" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">L</div>
                <span className="text-white/90 font-semibold">Lethimdo</span>
              </div>
              <span className="text-emerald-300 text-xs border border-emerald-800/50 px-2 py-1 rounded-full bg-emerald-500/10">Modern</span>
            </div>
            <div className="rounded-2xl border border-white/10 p-4 bg-[#0b1120]">
              <ul className="space-y-3 text-[#c6d4f7]">
                {["Instant setup", "Affordable plans", "Flexible workflows", "Real‑time updates", "Full visibility"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW TEMPLATES */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Prebuilt Workflow Templates</h3>
        <p className="text-[#8fa2c9] mb-6">Start instantly with automation templates built for every business.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { title: "Customer Support Bot", desc: "Answer FAQs & support tickets automatically" },
            { title: "RAG Chatbot", desc: "Summarize & search documents instantly" },
            { title: "Google Sheets Automation", desc: "Sync, update, and analyze spreadsheets" },
            { title: "Social Media Scheduler", desc: "Automate multi-platform posting" },
            { title: "CRM Updates", desc: "Keep contacts in sync across systems" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white hover:shadow-[0_0_28px_rgba(37,99,235,0.35)] transition-shadow"
            >
              <h4 className="font-bold text-lg mb-1.5">{item.title}</h4>
              <p className="text-[#8fa2c9] mb-4">{item.desc}</p>
              <Button className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white">
                Use Template
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ANALYTICS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">See your ROI in real time</h3>
        <p className="text-[#8fa2c9] mb-6">Track time and money saved with automation.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Workflows run over time" },
            { title: "Workflow distribution" },
            { title: "Hours saved per workflow" },
          ].map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-40 md:h-48 rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-4 text-white"
            >
              <div className="h-full w-full rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_55%)] grid place-items-center text-[#9db2e9]">
                {c.title}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">See real results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🚀", title: "E-commerce store", result: "Saved 15 hours/week automating order updates" },
            { icon: "🏢", title: "Consulting firm", result: "Increased leads by 30% with LinkedIn automation" },
            { icon: "📊", title: "Startup team", result: "Reduced reporting time by 90% using Google Sheets automation" },
          ].map((cs, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 p-5 text-white"
            >
              <div className="text-2xl">{cs.icon}</div>
              <div className="mt-2 font-semibold">{cs.title}</div>
              <p className="text-[#9db2e9] mt-1">{cs.result}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL BANNER */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-[22px] border border-[#1a2a55] bg-[#0b1120]/90 backdrop-blur-xl p-6">
          <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(120% 90% at 10% 30%, rgba(30,64,175,0.35), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 260deg at 60% 60%, rgba(59,130,246,0.15), rgba(15,23,42,0) 45%, rgba(59,130,246,0.15) 75%, rgba(15,23,42,0))",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
            <div className="text-white">
              <div className="text-[#9db2e9] text-sm mb-3">Trusted by teams</div>
              <p className="text-xl md:text-2xl leading-relaxed text-[#d7e3ff]">
                "We used to spend hours juggling reports and chasing updates. After switching to Lethimdo, real‑time tracking saved us time and
                increased our conversion rate by 35%."
              </p>
              <div className="mt-4 text-[#9db2e9]">
                <div className="flex items-center gap-1">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-300">★</span>)}</div>
                <div className="text-sm mt-1">Mariana, Digital Marketing Director</div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <button className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white" aria-label="Previous testimonial">←</button>
                <button className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white" aria-label="Next testimonial">→</button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(30,64,175,0.55)]">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop"
                  alt="Happy customer"
                  className="w-full h-[260px] md:h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">What Our Customers Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[
            { name: "Jane Doe", quote: "Lethimdo saved me 10+ hours weekly!" },
            { name: "John Smith", quote: "We scaled our customer support with zero hires." },
            { name: "Amir Khan", quote: "The AI Builder makes automation effortless." },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[#0f1730] border border-[#1a2a55] flex items-center justify-center text-[#3b82f6] font-bold">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="font-semibold">{t.name}</div>
              </div>
              <p className="text-[#c6d4f7]">"{t.quote}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-6">Frequently Asked Questions</h3>
        <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-4 text-white">
          <details className="border-b border-white/10 py-3">
            <summary className="cursor-pointer text-white">How does it work?</summary>
            <p className="text-[#cbd5e1] mt-2">Just describe your needs in a prompt, the AI Builder generates workflows for you.</p>
          </details>
          <details className="border-b border-white/10 py-3">
            <summary className="cursor-pointer text-white">What happens after the free trial?</summary>
            <p className="text-[#cbd5e1] mt-2">You can choose a subscription plan that fits your needs.</p>
          </details>
          <details className="border-b border-white/10 py-3">
            <summary className="cursor-pointer text-white">Can I cancel anytime?</summary>
            <p className="text-[#cbd5e1] mt-2">Yes, cancel or upgrade at any time in your dashboard.</p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer text-white">Is my data secure?</summary>
            <p className="text-[#cbd5e1] mt-2">Yes, all workflows run in a secure cloud environment.</p>
          </details>
        </div>
      </section>
    </>
  );
}
