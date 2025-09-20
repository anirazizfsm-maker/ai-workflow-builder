import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Showcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[22px] border border-[#18264c] bg-[#0a1327]/80 backdrop-blur-xl overflow-hidden shadow-[0_20px_80px_-24px_rgba(30,64,175,0.55)]"
      >
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background:
              "linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.75) 35%, rgba(147,197,253,0.9) 50%, rgba(59,130,246,0.75) 65%, rgba(59,130,246,0) 100%)",
          }}
        />
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
                <div className="pt-1 text-xs text-[#8fa2c9]">
                  Get access to no‑code templates with <span className="text-[#79a2ff]">Premium</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Center canvas */}
          <div className="relative">
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
              <div className="flex items-center gap-2 text-[#9db2e9]">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↺</div>
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 grid place-items-center">↻</div>
                <div className="ml-2 text-sm">—</div>
                <div className="rounded-lg bg-[#0f1730] border border-white/10 px-2.5 h-8 grid place-items-center text-white text-sm">100 %</div>
                <div className="text-sm">＋</div>
              </div>

              {/* Nodes */}
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

                <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

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

                <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />
                <div className="mx-auto h-8 w-8 rounded-full grid place-items-center text-white/70 border border-white/10 bg-white/5">＋</div>
                <div className="mx-auto h-12 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent my-2" />

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
                <Button className="mt-3 w-full rounded-lg bg-[#1f51ff] hover:bg-[#1b45da] text-white">Change account</Button>
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
  );
}
