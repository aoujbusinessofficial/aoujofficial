"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  requestPasswordResetOTP,
  verifyOTPAndResetPassword,
} from "@/services/authService";
import {
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
  AlertTriangle,
  KeyRound,
  X,
  Clock,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication & Lockout states
  const [error, setError] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Forgot Password & OTP modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState<"request" | "verify">("request");
  const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reason") === "inactivity") {
        setError("Your session has expired due to 2 hours of inactivity. Please sign in again.");
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAttemptsRemaining(null);

    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success && result.user) {
      setError("");
      setIsLocked(false);

      if (result.user.role === "ADMIN") {
        setSuccessMessage(`Welcome, Administrator ${result.user.name}! Redirecting to Atelier Admin Suite...`);
        setTimeout(() => {
          router.push("/admin");
        }, 900);
      } else {
        setSuccessMessage(`Welcome back, ${result.user.name}! Redirecting...`);
        setTimeout(() => {
          router.push("/account");
        }, 900);
      }
    } else {
      if (result.isLocked) {
        setIsLocked(true);
        setLockoutMinutes(result.lockoutRemainingMinutes || 60);
      }
      if (result.attemptsRemaining !== undefined) {
        setAttemptsRemaining(result.attemptsRemaining);
      }
      setError(result.error || "Incorrect credentials. Please verify your email and password.");
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    router.push("/products");
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail.trim()) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    setForgotLoading(true);
    const res = await requestPasswordResetOTP(forgotEmail);
    setForgotLoading(false);

    if (res.success && res.otp) {
      setGeneratedOTP(res.otp);
      setForgotStep("verify");
      setForgotSuccess(
        `A 6-digit verification code has been dispatched to ${forgotEmail}.`
      );
    } else {
      setForgotError(res.error || "Unable to find an account with this email.");
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!enteredOTP.trim()) {
      setForgotError("Please enter the 6-digit OTP code.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError("Passwords do not match. Please verify.");
      return;
    }

    setForgotLoading(true);
    const res = await verifyOTPAndResetPassword(forgotEmail, enteredOTP, newPassword);
    setForgotLoading(false);

    if (res.success) {
      setForgotSuccess("Password reset successfully! Account unlocked. You can now sign in.");
      setIsLocked(false);
      setError("");
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep("request");
        setForgotEmail("");
        setEnteredOTP("");
        setNewPassword("");
        setConfirmPassword("");
        setGeneratedOTP(null);
        setForgotSuccess("");
      }, 2500);
    } else {
      setForgotError(res.error || "Invalid OTP code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 w-full py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Optional Guest Banner */}
          <div className="mb-8 p-4 sm:p-5 bg-[#F7F1E8] border border-[#D8C9B6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#907553]/15 text-[#907553] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                  Account Creation is Entirely Optional
                </p>
                <p className="text-xs font-sans text-[#3A2E21]/80 mt-0.5">
                  You do not need an account to browse, select sizes, or checkout. Guest orders are always welcome.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestContinue}
              className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.18em] text-[#907553] hover:text-[#151007] border-b border-[#907553] pb-0.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Continue as Guest</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#FAF7F2] border border-[#D8C9B6]">
            {/* Left Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-6">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.22em] text-[#907553] font-medium mb-1.5">
                    CLIENT &amp; ATELIER ACCESS
                  </p>
                  <h1
                    className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Sign In
                  </h1>
                  <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 mt-2 leading-relaxed">
                    Enter your email and password to access your account. Administrators will be automatically routed to the Atelier Admin Suite.
                  </p>
                </div>

                {/* Lockout Warning Banner */}
                {isLocked && (
                  <div className="p-4 bg-red-950/10 border-2 border-red-700 text-red-900 text-xs font-sans space-y-2">
                    <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-red-800">
                      <AlertTriangle size={16} />
                      <span>Account Locked (3 Failed Attempts)</span>
                    </div>
                    <p className="leading-relaxed">
                      Your account has been locked for 1 hour for security.
                      {lockoutMinutes && (
                        <span> Approximately <strong>{lockoutMinutes} minute(s)</strong> remaining.</span>
                      )}
                    </p>
                    <p className="pt-1">
                      Forgot your password? Click below to reset it immediately using a 6-digit Email OTP:
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setShowForgotModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 font-semibold underline text-red-900 hover:text-red-700 cursor-pointer pt-1"
                    >
                      <KeyRound size={13} />
                      <span>Reset Password with OTP Now →</span>
                    </button>
                  </div>
                )}

                {/* Incorrect Attempt Warning */}
                {!isLocked && error && (
                  <div className="p-3.5 bg-red-50 border border-red-300 text-red-800 text-xs font-sans flex items-start gap-2.5">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <div className="space-y-1">
                      <p>{error}</p>
                      {attemptsRemaining !== null && attemptsRemaining > 0 && (
                        <p className="font-semibold text-red-700">
                          ⚠️ Warning: Only {attemptsRemaining} attempt(s) left before a 1-hour account lockout.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-sans flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                    >
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. fatima@example.com"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        required
                        disabled={isLocked}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setShowForgotModal(true);
                        }}
                        className="text-[11px] font-sans text-[#907553] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <Lock size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-10 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        required
                        disabled={isLocked}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-[#3A2E21]/60 hover:text-[#151007] cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D8C9B6] text-[#907553] focus:ring-[#907553] accent-[#907553]"
                    />
                    <label htmlFor="rememberMe" className="text-xs font-sans text-[#3A2E21]/80 select-none cursor-pointer">
                      Keep me signed in on this device
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      disabled={isLoading || isLocked}
                    >
                      {isLoading ? "AUTHENTICATING..." : isLocked ? "ACCOUNT LOCKED" : "SIGN IN"}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-[#D8C9B6] w-full" />
                  <span className="bg-[#FAF7F2] px-3 text-[10px] uppercase tracking-[0.2em] font-sans text-[#3A2E21]/60 absolute">
                    OR
                  </span>
                </div>

                {/* Continue as Guest Button */}
                <div>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={handleGuestContinue}
                  >
                    CONTINUE SHOPPING AS GUEST
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-2">
                  <p className="text-xs font-sans text-[#3A2E21]/80">
                    New to AOUJ?{" "}
                    <Link
                      href="/signup"
                      className="font-medium text-[#907553] hover:text-[#151007] underline underline-offset-4 transition-colors"
                    >
                      Create an account (Optional)
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Editorial Image */}
            <div className="lg:col-span-5 bg-[#F2EAE0] p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-[#D8C9B6] flex flex-col justify-between">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-64 w-full overflow-hidden bg-[#D8C9B6] border border-[#D8C9B6] mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=900&auto=format&fit=crop"
                  alt="AOUJ Couture Editorial"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FAF7F2]">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FAF7F2]/80">
                    AUTHENTIC ATELIER
                  </p>
                  <p
                    className="text-lg font-normal italic"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Rise in your own way.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#907553]">
                  ACCOUNT SECURITY &amp; PRIVILEGES
                </p>
                <div className="space-y-3 text-xs font-sans text-[#3A2E21]">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Encrypted Password Protection</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        SHA-256 cryptographic security with automatic 3-attempt lockout.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <KeyRound size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Instant 6-Digit Email OTP Reset</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        Regain immediate access by verifying your email with a one-time passcode.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <UserCheck size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Role-Based Atelier Access</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        Administrators automatically access the executive suite upon sign in.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8C9B6]/60">
                  <p className="text-[11px] font-sans italic text-[#3A2E21]/70">
                    Guest checkout remains 100% available at any time without creating an account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD & EMAIL OTP MODAL                                         */}
      {/* ========================================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] border border-[#D8C9B6] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#907553] font-semibold">
                  SECURITY CREDENTIALS
                </p>
                <h3
                  className="text-2xl text-[#151007] font-normal uppercase"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Reset Password
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-[#3A2E21] hover:text-[#151007] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
                {forgotError}
              </div>
            )}

            {/* Generated OTP Simulation Box */}
            {generatedOTP && (
              <div className="p-3.5 bg-[#F7F1E8] border border-[#907553] text-xs font-sans space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#907553] uppercase tracking-wider">
                  <Mail size={14} />
                  <span>Email Dispatch Notification:</span>
                </div>
                <p className="text-[#151007]">
                  A 6-digit OTP has been sent to <strong>{forgotEmail}</strong>.
                </p>
                <div className="p-2 bg-[#FAF7F2] border border-[#D8C9B6] text-center font-mono text-base font-bold tracking-widest text-[#151007]">
                  {generatedOTP}
                </div>
                <p className="text-[10px] text-[#3A2E21]/70 italic text-center">
                  Enter this code below to authorize your new password. (Valid for 15 minutes)
                </p>
              </div>
            )}

            {forgotSuccess && !generatedOTP && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === "request" ? (
              /* Step 1: Request Email OTP Form */
              <form onSubmit={handleRequestOTP} className="space-y-4 text-xs font-sans">
                <p className="text-[#3A2E21]/80 leading-relaxed">
                  Enter your registered account email address. We will generate and send a secure 6-digit OTP code to verify your identity.
                </p>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#151007]">
                    Account Email Address *
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. islgujrat30@gmail.com"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-[#D8C9B6] text-[#151007] hover:text-[#151007] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button variant="primary" size="sm" type="submit" disabled={forgotLoading}>
                    {forgotLoading ? "SENDING OTP..." : "SEND 6-DIGIT OTP"}
                  </Button>
                </div>
              </form>
            ) : (
              /* Step 2: Enter OTP & Set New Password */
              <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#151007]">
                    Enter 6-Digit OTP Code *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOTP}
                    onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit code (e.g. 849201)"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 font-mono text-center tracking-widest text-base font-bold focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#151007]">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#151007]">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setForgotStep("request")}
                    className="text-[11px] text-[#907553] hover:underline"
                  >
                    ← Change Email
                  </button>
                  <Button variant="primary" size="sm" type="submit" disabled={forgotLoading}>
                    {forgotLoading ? "RESETTING..." : "VERIFY OTP & SAVE NEW PASSWORD"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
