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
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, continueAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email);
      setSuccessMessage("Welcome back! Redirecting you to your shopping experience...");
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch {
      setError("Unable to sign in. Please verify your credentials.");
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    router.push("/products");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSubmitted(false);
      setForgotEmail("");
    }, 2500);
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
                    CLIENT ACCESS
                  </p>
                  <h1
                    className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Welcome Back
                  </h1>
                  <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 mt-2 leading-relaxed">
                    Sign in to view your bespoke measurements, saved favorites, and order history. Or skip anytime.
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                    <CheckCircle2 size={15} />
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
                        onClick={() => setShowForgotModal(true)}
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
                        placeholder="••••••••"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-10 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        required
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
                      disabled={isLoading}
                    >
                      {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
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

            {/* Right Editorial Image / Luxury Privileges Column */}
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
                    AOUJ ATELIER
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
                  ACCOUNT BENEFITS
                </p>
                <div className="space-y-3 text-xs font-sans text-[#3A2E21]">
                  <div className="flex items-start gap-2.5">
                    <UserCheck size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Saved Bespoke Measurements</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        Store your custom tailoring sizes for effortless repeat orders.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Seamless Order Tracking</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        Real-time courier status and order receipts in one place.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Sparkles size={16} className="text-[#907553] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#151007]">Private Seasonal Edits</p>
                      <p className="text-[11px] text-[#3A2E21]/75">
                        Early access to limited bridal lawn and festive drops.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8C9B6]/60">
                  <p className="text-[11px] font-sans italic text-[#3A2E21]/70">
                    Remember: An account is never required. Every customer is valued equally, whether checking out as a guest or with a client profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/50 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] border border-[#D8C9B6] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <h3
              className="text-2xl text-[#151007] font-normal uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Reset Password
            </h3>
            <p className="text-xs font-sans text-[#3A2E21]/80 leading-relaxed">
              Enter your registered email address below and we will send you a secure link to reset your password.
            </p>

            {forgotSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Password reset link sent to your email.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2 px-3 text-xs font-sans focus:outline-none focus:border-[#907553]"
                />
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-xs font-sans text-[#3A2E21] hover:text-[#151007] px-3 py-2 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button variant="primary" size="sm" type="submit">
                    SEND RESET LINK
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
