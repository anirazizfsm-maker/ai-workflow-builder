import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlansPlanList() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-b from-[#0e1a38] to-[#0b142b] text-white border-[#1a2a55] backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)] rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white">Choose a plan</CardTitle>
          <p className="text-sm text-[#9bb1e9] mt-2">
            All paid plans include a 7-day free trial
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Starter */}
          <label className="group block rounded-xl border border-[#1a2a55] bg-[#0b1120]/60 p-4 hover:bg-[#0b1120]/80 hover:border-[#27407c] transition">
            <input type="radio" name="plan" defaultChecked value="starter" className="peer sr-only" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Starter</h4>
                  <Badge className="border-white/15 bg-white/10 text-[#9bb1e9]"> $9/mo </Badge>
                  <Badge className="border-green-500/30 bg-green-500/10 text-green-400 text-xs">
                    7-day trial
                  </Badge>
                </div>
                <p className="text-[#9bb1e9] text-sm mt-1">For individuals getting started.</p>
                <ul className="mt-2 text-xs text-[#c6d4f7]/80 space-y-1">
                  <li>✅ 7-day free trial included</li>
                  <li>✅ Auto invoice sent to your email</li>
                  <li>✅ Cancel anytime</li>
                </ul>
              </div>
              <div className="relative mt-1">
                <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                  <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                </div>
                <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_rgba(37,99,235,0.45)] transition" />
              </div>
            </div>
          </label>

          {/* Pro */}
          <label className="group relative block rounded-xl border border-[#1a2a55] bg-[#0b1120]/60 p-4 hover:bg-[#0b1120]/80 hover:border-[#27407c] transition">
            <div className="absolute -top-3 right-3">
              <Badge className="rounded-full border border-white/15 bg-white/10 text-[#9bb1e9] shadow-[0_0_14px_rgba(37,99,235,0.35)]">
                Most Popular
              </Badge>
            </div>
            <input type="radio" name="plan" value="pro" className="peer sr-only" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Pro</h4>
                  <Badge className="border-white/15 bg-white/10 text-[#9bb1e9]"> $29/mo </Badge>
                </div>
                <p className="text-[#9bb1e9] text-sm mt-1">For teams that need more power.</p>
                <ul className="mt-2 text-xs text-[#c6d4f7]/80 space-y-1">
                  <li>✅ Auto invoice sent to your email</li>
                  <li>✅ Cancel anytime</li>
                </ul>
              </div>
              <div className="relative mt-1">
                <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                  <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                </div>
                <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_rgba(37,99,235,0.45)] transition" />
              </div>
            </div>
          </label>

          {/* Enterprise */}
          <label className="group block rounded-xl border border-[#1a2a55] bg-[#0b1120]/60 p-4 hover:bg-[#0b1120]/80 hover:border-[#27407c] transition">
            <input type="radio" name="plan" value="enterprise" className="peer sr-only" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">Enterprise</h4>
                  <Badge className="border-white/15 bg-white/10 text-[#9bb1e9]"> Custom </Badge>
                </div>
                <p className="text-[#9bb1e9] text-sm mt-1">Advanced needs & dedicated support.</p>
                <ul className="mt-2 text-xs text-[#c6d4f7]/80 space-y-1">
                  <li>✅ Auto invoice sent to your email</li>
                  <li>✅ Cancel anytime</li>
                </ul>
              </div>
              <div className="relative mt-1">
                <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                  <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                </div>
                <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_rgba(37,99,235,0.45)] transition" />
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-b from-[#0e1a38] to-[#0b142b] text-white border-[#1a2a55] backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)] rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white">Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-[#c6d4f7]">
          <div className="flex justify-between">
            <span>Plan</span>
            <span>Starter</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>$9.00</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>—</span>
          </div>
          <div className="mt-2 h-px bg-white/10" />
          <div className="flex justify-between font-semibold text-white">
            <span>Total</span>
            <span>$9.00 / mo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}