import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/lethimdo-mark.svg"
              alt="Lethimdo logo"
              className="h-8 w-8"
            />
            <div>
              <div className="font-extrabold tracking-tight">Lethimdo</div>
              <div className="text-xs text-[#9db2e9]">Automation that grows your business</div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70"
              onClick={() => navigate("/plans")}
            >
              Plans
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </nav>
        </div>

        <div className="border-t border-white/10 px-6 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#9db2e9]">
            © {new Date().getFullYear()} Lethimdo. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#9db2e9]">
            <button
              className="hover:text-white"
              onClick={() => navigate("/auth")}
              aria-label="Sign in"
            >
              Sign in
            </button>
            <a
              className="hover:text-white"
              href="mailto:support@lethimdo.com"
              aria-label="Contact support"
            >
              Contact
            </a>
            <a
              className="hover:text-white"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Privacy"
            >
              Privacy
            </a>
            <a
              className="hover:text-white"
              href="#"
              onClick={(e) => e.preventDefault()}
              aria-label="Terms"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
