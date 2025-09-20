import { useState } from "react";
import { useNavigate } from "react-router";
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

export default function PlansBillingForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [country, setCountry] = useState("us");

  return (
    <Card className="bg-gradient-to-b from-[#0e1a38] to-[#0b142b] text-white border-[#1a2a55] backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)] rounded-2xl">
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
              // Valid; keep as-is (no submission).
            }
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Full name</label>
              <Input
                name="fullName"
                placeholder="Jane Doe"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                required
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Company (optional)</label>
              <Input
                name="company"
                placeholder="Acme Inc."
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
              />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="w-full bg-[#0b1120]/60 border-[#1a2a55] text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-[#0b1120]/95 border-[#1a2a55] text-white backdrop-blur-xl">
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
              <input type="hidden" name="country" value={country} />
            </div>

            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">State / Province</label>
              <Input
                name="state"
                placeholder="CA"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                aria-invalid={!!errors.state}
              />
              {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Address line 1</label>
              <Input
                name="address1"
                placeholder="123 Main St"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                required
                aria-invalid={!!errors.address1}
              />
              {errors.address1 && <p className="text-xs text-red-400 mt-1">{errors.address1}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">
                Address line 2 (optional)
              </label>
              <Input
                name="address2"
                placeholder="Apt, suite, unit, building, floor, etc."
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">City</label>
              <Input
                name="city"
                placeholder="San Francisco"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                required
                aria-invalid={!!errors.city}
              />
              {errors.city && <p className="text-xs text-red-400 mt-1">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Postal code</label>
              <Input
                name="postal"
                placeholder="94105"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                required
                aria-invalid={!!errors.postal}
              />
              {errors.postal && <p className="text-xs text-red-400 mt-1">{errors.postal}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Phone</label>
              <Input
                name="phone"
                placeholder="+1 555 123 4567"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#9bb1e9]">Email for receipt</label>
              <Input
                name="email"
                type="email"
                placeholder="jane@example.com"
                className="bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                required
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white border border-white/10"
            >
              Save billing details
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-[#1a2a55] bg-[#0b1120]/60 text-white hover:bg-[#0f1730]/70"
              onClick={() => navigate("/dashboard")}
            >
              Continue to dashboard
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
