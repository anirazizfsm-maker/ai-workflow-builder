import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function SiteFooter() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-8 md:py-10">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl text-white p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">
              L
            </div>
            <div className="leading-tight">
              <div className="font-extrabold">Lethimdo</div>
              <div className="text-xs text-[#9db2e9]">Automation that grows your business</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </Button>
            <Button
              className="rounded-xl bg-[#1f51ff] hover:bg-[#1b45da] text-white"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#9db2e9]">
          <div>© {year} Lethimdo. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <button
              className="hover:text-white transition-colors"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button
              className="hover:text-white transition-colors"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </button>
            <a
              className="hover:text-white transition-colors"
              href="mailto:support@lethimdo.com"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
