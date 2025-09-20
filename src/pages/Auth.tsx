import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

import FixedBrand from "@/components/FixedBrand";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const otpFormRef = useRef<HTMLFormElement | null>(null);

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const isValidEmail = (val: string) => emailRegex.test(val.trim());
  const isValidOtp = (val: string) => /^\d{6}$/.test(val);

  const isEmailValid = isValidEmail(email);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const id = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendSeconds]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!isEmailValid) {
      setEmailTouched(true);
      setEmailError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    setEmailError(null);

    try {
      const formData = new FormData();
      formData.set("email", email.trim());
      await signIn("email-otp", formData);
      setStep({ email: email.trim() });
      setResendSeconds(30);
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (!isValidOtp(otp)) {
      setOtpError("Enter the 6-digit code.");
      setIsLoading(false);
      return;
    }
    setOtpError(null);

    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);

      console.log("signed in");

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);

      setError("The verification code you entered is incorrect.");
      setIsLoading(false);

      setOtp("");
    }
  };

  const handleResendCode = async () => {
    if (resendSeconds > 0 || isLoading || step === "signIn") return;
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", step.email);
      await signIn("email-otp", formData);
      setResendSeconds(30);
    } catch (error) {
      console.error("Resend code error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to resend code. Please try again."
      );
    }
    setIsLoading(false);
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting anonymous sign in...");
      await signIn("anonymous");
      console.log("Anonymous sign in successful");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-white">
      <FixedBrand />
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex items-center justify-center h-full flex-col">
        <Card className="min-w[350px] pb-0 border-[#1a2a55] bg-gradient-to-b from-[#0e1a38] to-[#0b142b] text-white backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(59,130,246,0.35)] rounded-2xl">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
              <div className="flex justify-center">
                    <img
                      src="/assets/lethimdo-wordmark.svg"
                      alt="LETHIMDO"
                      width={160}
                      height={40}
                      className="mb-2 mt-4 cursor-pointer"
                      onClick={() => navigate("/")}
                    />
                  </div>
                <CardTitle className="text-xl text-white">Get Started</CardTitle>
                <CardDescription className="text-[#9bb1e9]">
                  Enter your email to log in or sign up
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSubmit}>
                <CardContent>
                  
                  <div className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-[#9bb1e9]" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 bg-[#0b1120]/60 border-[#1a2a55] text-white placeholder:text-[#9bb1e9]"
                        disabled={isLoading}
                        required
                        value={email}
                        onChange={(e) => {
                          const next = e.target.value.replace(/\s+/g, "");
                          setEmail(next);
                          if (emailTouched) {
                            if (!isValidEmail(next)) {
                              setEmailError("Please enter a valid email address.");
                            } else {
                              setEmailError(null);
                            }
                          }
                        }}
                        onBlur={() => {
                          setEmailTouched(true);
                          if (!isValidEmail(email)) {
                            setEmailError("Please enter a valid email address.");
                          } else {
                            setEmailError(null);
                          }
                        }}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? "email-error" : undefined}
                      />
                      {emailError && (
                        <p id="email-error" className="mt-2 text-xs text-red-400">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      size="icon"
                      className="border-[#1a2a55] bg-[#0b1120]/60 text-white hover:bg-[#0f1730]/70"
                      disabled={isLoading || !isEmailValid}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                  )}
                  
                  <div className="mt-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#1a2a55]" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-transparent px-2 text-[#9bb1e9]">
                          Or
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-4 border-[#1a2a55] bg-[#0b1120]/60 text-white hover:bg-[#0f1730]/70"
                      onClick={handleGuestLogin}
                      disabled={isLoading}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Continue as Guest
                    </Button>
                  </div>
                </CardContent>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle className="text-white">Check your email</CardTitle>
                <CardDescription className="text-[#9bb1e9]">
                  We've sent a code to {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit} ref={otpFormRef}>
                <CardContent className="pb-4">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={(val) => {
                        const next = (val || "").replace(/\D/g, "").slice(0, 6);
                        setOtp(next);
                        if (otpError && /^\d{0,6}$/.test(next)) {
                          setOtpError(null);
                        }
                        if (next.length === 6 && isValidOtp(next) && !isLoading) {
                          otpFormRef.current?.requestSubmit();
                        }
                      }}
                      maxLength={6}
                      disabled={isLoading}
                      onPaste={(e) => {
                        const text = e.clipboardData.getData("text") ?? "";
                        const digits = text.replace(/\D/g, "").slice(0, 6);
                        if (!digits) return;
                        e.preventDefault();
                        setOtp(digits);
                        if (digits.length === 6 && !isLoading) {
                          otpFormRef.current?.requestSubmit();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) {
                            form.requestSubmit();
                          }
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {otpError && (
                    <p className="mt-2 text-sm text-red-400 text-center">
                      {otpError}
                    </p>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-red-400 text-center">
                      {error}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                    <span className="text-[#9bb1e9]">
                      Didn't receive a code?
                    </span>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-[#9bb1e9] hover:text-white"
                      onClick={handleResendCode}
                      disabled={isLoading || resendSeconds > 0}
                    >
                      {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
                    </Button>
                  </div>

                  <p className="text-sm text-[#9bb1e9] text-center mt-2">
                    Wrong email?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#9bb1e9] hover:text-white"
                      onClick={() => {
                        setStep("signIn");
                        setOtp("");
                        setOtpError(null);
                        setError(null);
                      }}
                    >
                      Try again
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#1e40af] to-[#2563eb] hover:from-[#19368e] hover:to-[#1f4fd3] text-white border border-white/10"
                    disabled={isLoading || !isValidOtp(otp)}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full text-white hover:bg-white/5"
                  >
                    Use different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}