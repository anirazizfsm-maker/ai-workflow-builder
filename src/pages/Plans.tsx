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

export default function Plans() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen dark">
      {/* Background tint */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-black" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:p-6">
          <button
            onClick={() => navigate("/")}
            className="text-white font-extrabold tracking-tight text-xl md:text-2xl"
          >
            LETHIMDO
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
            <Button className="bg-white/10 text-white border border-white/15 hover:bg-white/20">
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
                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-start justify-between">
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
                    </div>
                    <Input type="radio" name="plan" defaultChecked className="h-4 w-4" />
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-start justify-between">
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
                    </div>
                    <Input type="radio" name="plan" className="h-4 w-4" />
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-start justify-between">
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
                    </div>
                    <Input type="radio" name="plan" className="h-4 w-4" />
                  </div>
                </div>
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
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Full name</label>
                      <Input placeholder="Jane Doe" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Company (optional)</label>
                      <Input placeholder="Acme Inc." className="bg-white/5 border-white/20 text-white placeholder:text-white/50" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-sm text-white/80">Country</label>
                      <Select defaultValue="us">
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
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-sm text-white/80">State / Province</label>
                      <Input placeholder="CA" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-white/80">Address line 1</label>
                      <Input placeholder="123 Main St" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm text-white/80">Address line 2 (optional)</label>
                      <Input placeholder="Apt, suite, unit, building, floor, etc." className="bg-white/5 border-white/20 text-white placeholder:text-white/50" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-white/80">City</label>
                      <Input placeholder="San Francisco" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Postal code</label>
                      <Input placeholder="94105" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Phone</label>
                      <Input placeholder="+1 555 123 4567" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/80">Email for receipt</label>
                      <Input type="email" placeholder="jane@example.com" className="bg-white/5 border-white/20 text-white placeholder:text-white/50" required />
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
