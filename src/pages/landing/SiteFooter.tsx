import { useNavigate } from "react-router";

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/70 backdrop-blur-xl text-white">
        <div className="px-6 md:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm text-[#9db2e9]">Made with ❤️</div>
            <div className="text-lg font-extrabold tracking-tight">LETHIMDO</div>
            <p className="text-[#8fa2c9] text-sm">
              Automation will grow your business 2x faster.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
            >
              Dashboard
            </button>
          </nav>
        </div>

        <div className="border-t border-[#1a2a55] px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <span className="text-xs text-[#8fa2c9]">
            © {new Date().getFullYear()} Lethimdo. All rights reserved.
          </span>
          <div className="flex items-center gap-3 text-xs text-[#8fa2c9]">
            <a href="#" className="hover:text-[#c6d4f7]">Terms</a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-[#c6d4f7]">Privacy</a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-[#c6d4f7]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
