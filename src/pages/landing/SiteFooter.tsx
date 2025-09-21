import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function SiteFooter() {
  const navigate = useNavigate();
  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/70 backdrop-blur-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">L</div>
              <span className="text-white font-extrabold text-lg tracking-tight">Lethimdo</span>
            </div>
            <p className="text-[#9db2e9] mt-2 text-sm">
              Automate, scale, and grow your business with AI workflows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
            >
              Pricing
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[#8fa2c9] text-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="hover:text-white">Home</button>
            <button onClick={() => navigate("/pricing")} className="hover:text-white">Pricing</button>
            <a href="mailto:support@lethimdo.com" className="hover:text-white">Support</a>
          </div>
          <div className="text-[#6f83b3]">© {new Date().getFullYear()} Lethimdo. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
