import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Newsletter() {
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    const email = subscribeEmail.trim();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    try {
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      if (!convexUrl) {
        toast.success("Subscribed! (Demo mode - backend not configured)");
        setSubscribeEmail("");
        return;
      }

      const response = await fetch(`${convexUrl}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Subscription failed");
      }

      toast.success("Thanks for subscribing! Check your email for a welcome message. 🎉");
      setSubscribeEmail("");
    } catch (error: any) {
      toast.error(error.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
      <div className="rounded-2xl border border-[#1a2a55] bg-gradient-to-b from-[#0b1120] to-[#0a0f1e] p-6 md:p-8 text-white">
        <h3 className="text-2xl md:text-3xl font-extrabold">Stay ahead with automation tips</h3>
        <p className="text-[#9db2e9] mt-1">Get weekly insights on AI-powered productivity.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Enter your email"
            className="bg-[#0f1730]/70 border-white/10 text-white"
            type="email"
            value={subscribeEmail}
            onChange={(e) => setSubscribeEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            aria-label="Email address"
          />
          <Button
            className="rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] text-white"
            onClick={handleSubscribe}
            disabled={isSubscribing}
          >
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </div>
    </section>
  );
}