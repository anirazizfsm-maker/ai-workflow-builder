import { useNavigate } from "react-router";

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-12">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl text-white p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/lethimdo-mark.svg"
              alt="Lethimdo"
              className="h-8 w-8"
            />
            <div>
              <div className="font-extrabold tracking-tight">Lethimdo</div>
              <div className="text-xs text-[#9db2e9]">
                Automate your business with AI workflows
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <button
              onClick={() => navigate("/")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10"
            >
              Dashboard
            </button>
            <a
              href="mailto:support@lethimdo.com"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-[#8fa2c9] flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Lethimdo. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-white/90">Terms</a>
            <span className="text-white/20">•</span>
            <a href="#" className="hover:text-white/90">Privacy</a>
            <span className="text-white/20">•</span>
            <a href="#" className="hover:text-white/90">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
