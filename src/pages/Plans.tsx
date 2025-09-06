import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import TesseractLogo from "@/components/TesseractLogo";

export default function Plans() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState("us");

  return (
    <div className="relative min-h-screen dark">
      {/* Background tint */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6">
          <button
            onClick={() => navigate("/")}
            className="text-white font-extrabold tracking-tight text-xl md:text-2xl hover:opacity-90 transition flex items-center gap-2"
          >
            <TesseractLogo className="h-6 w-6 md:h-7 md:w-7" />
            <span>LETHIMDO</span>
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button className="bg-white/10 text-white border border-white/15 hover:bg-white/20 hover:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_60%,transparent)]">
              Continue
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-8 md:py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Plans column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 lg:col-span-1"
          >
            <Card className="bg-white/5 text-white border-white/15">
              <CardHeader>
                <CardTitle className="text-white">Choose a plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Plan: Starter */}
                <label className="group block rounded-xl border border-white/15 bg-white/5 p-4 hover:bg-white/10 hover:border-white/25 transition">
                  <input
                    type="radio"
                    name="plan"
                    defaultChecked
                    value="starter"
                    className="peer sr-only"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Starter</h4>
                        <Badge className="border-white/20 bg-white/10 text-white">
                          $9/mo
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        For individuals getting started.
                      </p>
                      <ul className="mt-2 text-xs text-white/70 space-y-1">
                        <li>✅ Auto invoice sent to your email</li>
                        <li>✅ Cancel anytime</li>
                      </ul>
                    </div>
                    <div className="relative mt-1">
                      <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                        <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                      </div>
                      <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_65%,transparent)] transition" />
                    </div>
                  </div>
                </label>

                {/* Plan: Pro (Most Popular) */}
                <label className="group relative block rounded-xl border border-white/15 bg-white/5 p-4 hover:bg-white/10 hover:border-white/25 transition">
                  {/* Most Popular badge */}
                  <div className="absolute -top-3 right-3">
                    <Badge className="rounded-full border-white/20 bg-white/10 text-white shadow-[0_0_14px_color-mix(in_oklab,var(--ring)_55%,transparent)]">
                      Most Popular
                    </Badge>
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="pro"
                    className="peer sr-only"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Pro</h4>
                        <Badge className="border-white/20 bg-white/10 text-white">
                          $29/mo
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        For teams that need more power.
                      </p>
                      <ul className="mt-2 text-xs text-white/70 space-y-1">
                        <li>✅ Auto invoice sent to your email</li>
                        <li>✅ Cancel anytime</li>
                      </ul>
                    </div>
                    <div className="relative mt-1">
                      <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                        <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                      </div>
                      <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_65%,transparent)] transition" />
                    </div>
                  </div>
                </label>

                {/* Plan: Enterprise */}
                <label className="group block rounded-xl border border-white/15 bg-white/5 p-4 hover:bg-white/10 hover:border-white/25 transition">
                  <input
                    type="radio"
                    name="plan"
                    value="enterprise"
                    className="peer sr-only"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Enterprise</h4>
                        <Badge className="border-white/20 bg-white/10 text-white">
                          Custom
                        </Badge>
                      </div>
                      <p className="text-white/70 text-sm mt-1">
                        Advanced needs & dedicated support.
                      </p>
                      <ul className="mt-2 text-xs text-white/70 space-y-1">
                        <li>✅ Auto invoice sent to your email</li>
                        <li>✅ Cancel anytime</li>
                      </ul>
                    </div>
                    <div className="relative mt-1">
                      <div className="size-5 rounded-full border border-white/30 bg-transparent grid place-items-center transition">
                        <span className="size-2 rounded-full bg-transparent peer-checked:bg-[oklch(0.79_0.18_210)] transition" />
                      </div>
                      <span className="pointer-events-none absolute -inset-2 rounded-full opacity-0 peer-checked:opacity-100 peer-checked:shadow-[0_0_18px_color-mix(in_oklab,var(--ring)_65%,transparent)] transition" />
                    </div>
                  </div>
                </label>
              </CardContent>
            </Card>

            <Card className="bg-white/5 text-white border-white/15">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/80">
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
          </motion.div>

          {/* Billing column */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 lg:col-span-2"
          >
            <Card className="bg-white/5 text-white border-white/15">
              <CardHeader>
                <CardTitle className="text-white">Billing address</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const fd = new FormData(form);

                    const fullName = (fd.get("fullName") as string)?.trim() || "";
                    const address1 = (fd.get("address1") as string)?.trim() || "";
                    const city = (fd.get("city") as string)?.trim() || "";
                    const state = (fd.get("state") as string)?.trim() || "";
                    const postal = (fd.get("postal") as string)?.trim() || "";
                    const email = (fd.get("email") as string)?.trim() || "";

                    const nextErrors: Record<string, string> = {};

                    if (!fullName) nextErrors.fullName = "Full name is required.";
                    if (!address1) nextErrors.address1 = "Address line 1 is required.";
                    if (!city) nextErrors.city = "City is required.";

                    // Country-specific state/ZIP checks
                    if (country === "us" || country === "ca") {
                      if (!state) nextErrors.state = "State/Province is required.";
                    }

                    if (!postal) {
                      nextErrors.postal = "Postal code is required.";
                    } else if (country === "us") {
                      const usZip = /^\d{5}(-\d{4})?$/;
                      if (!usZip.test(postal)) nextErrors.postal = "Enter a valid US ZIP (e.g., 94105 or 94105-1234).";
                    } else if (country === "ca") {
                      const caPost = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
                      if (!caPost.test(postal)) nextErrors.postal = "Enter a valid Canadian postal code (e.g., A1A 1A1).";
                    } else if (postal.length < 3) {
                      nextErrors.postal = "Postal code looks too short.";
                    }

                    if (!email) {
                      nextErrors.email = "Email is required.";
                    } else {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(email)) nextErrors.email = "Enter a valid email address.";
                    }

                    setErrors(nextErrors);
                    if (Object.keys(nextErrors).length === 0) {
                      // Valid; you can proceed with submission logic here.
                      // For now, just keep the form as-is without navigation.
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Full name</label>
                      <Input
                        name="fullName"
                        placeholder="Jane Doe"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        required
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Company (optional)</label>
                      <Input
                        name="company"
                        placeholder="Acme Inc."
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Country</label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="w-full bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/80 border-white/15 text-white backdrop-blur-xl">
                          <SelectGroup>
                            <SelectLabel>Popular</SelectLabel>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="gb">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* Hidden input to submit country since Radix Select isn't a native element */}
                      <input type="hidden" name="country" value={country} />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">State / Province</label>
                      <Input
                        name="state"
                        placeholder="CA"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        aria-invalid={!!errors.state}
                      />
                      {errors.state && (
                        <p className="text-xs text-red-400 mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Address line 1</label>
                      <Input
                        name="address1"
                        placeholder="123 Main St"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        required
                        aria-invalid={!!errors.address1}
                      />
                      {errors.address1 && (
                        <p className="text-xs text-red-400 mt-1">{errors.address1}</p>
                      )}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Address line 2 (optional)</label>
                      <Input
                        name="address2"
                        placeholder="Apt, suite, unit, building, floor, etc."
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">City</label>
                      <Input
                        name="city"
                        placeholder="San Francisco"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        required
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p className="text-xs text-red-400 mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Postal code</label>
                      <Input
                        name="postal"
                        placeholder="94105"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        required
                        aria-invalid={!!errors.postal}
                      />
                      {errors.postal && (
                        <p className="text-xs text-red-400 mt-1">{errors.postal}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Phone</label>
                      <Input
                        name="phone"
                        placeholder="+1 555 123 4567"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-white/70">Email for receipt</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                        required
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="submit" className="bg-white/10 text-white border border-white/15 hover:bg-white/20">
                      Save billing details
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                      onClick={() => navigate("/dashboard")}
                    >
                      Continue to dashboard
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}