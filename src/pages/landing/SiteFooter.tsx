import { Button } from "@/components/ui/button";

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-12">
      <div className="rounded-2xl border border-[#1a2a55] bg-[#0b1120]/80 backdrop-blur-xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl grid place-items-center bg-gradient-to-br from-[#1e40af] to-[#2563eb] text-white font-bold">L</div>
              <span className="text-white font-extrabold text-lg tracking-tight">Lethimdo</span>
            </div>
            <p className="text-[#9db2e9] mt-2 text-sm">
              Automate your business with AI-driven workflows.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-white/90 font-semibold mb-2">Product</div>
              <ul className="space-y-1 text-[#c6d4f7]">
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white/90 font-semibold mb-2">Company</div>
              <ul className="space-y-1 text-[#c6d4f7]">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white/90 font-semibold mb-2">Resources</div>
              <ul className="space-y-1 text-[#c6d4f7]">
                <li><a href="#" className="hover:text-white">Docs</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <div className="text-white/90 font-semibold mb-2">Legal</div>
              <ul className="space-y-1 text-[#c6d4f7]">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-[#8fa2c9] text-sm">© {new Date().getFullYear()} Lethimdo. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="rounded-xl border-white/15 text-white bg-[#0b1020]/60 hover:bg-[#0f1730]/70 h-9 px-3">
              Contact
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white h-9 px-3">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
