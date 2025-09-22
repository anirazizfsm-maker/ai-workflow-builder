import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-white font-extrabold text-xl tracking-tight">Lethimdo</div>
            <p className="text-[#9db2e9] text-sm mt-1">
              Automate your business with AI-powered workflows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white"
              onClick={() => navigate("/auth")}
            >
              Start Free
            </Button>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="text-[#8fa2c9]">© {new Date().getFullYear()} Lethimdo. All rights reserved.</div>
          <nav className="flex items-center gap-4 text-[#9db2e9]">
            <button onClick={() => navigate("/")} className="hover:text-white">Home</button>
            <button onClick={() => navigate("/pricing")} className="hover:text-white">Pricing</button>
            <button onClick={() => navigate("/dashboard")} className="hover:text-white">Dashboard</button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
