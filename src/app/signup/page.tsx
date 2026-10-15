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
  User,
  Phone,
  Heart,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, continueAsGuest } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [preference, setPreference] = useState<string>("all");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, phone);
      setSuccessMessage("Your AOUJ account has been created. Redirecting...");
      setTimeout(() => {
        router.push("/products");
      }, 1000);
    } catch {
      setError("Unable to create account. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    router.push("/products");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 w-full py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Optional Notice Banner */}
          <div className="mb-8 p-4 sm:p-5 bg-[#F7F1E8] border border-[#D8C9B6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#907553]/15 text-[#907553] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                  Account Creation is Optional
                </p>
                <p className="text-xs font-sans text-[#3A2E21]/80 mt-0.5">
                  You can purchase any outfit, select custom sizes, and complete your order without making an account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGuestContinue}
              className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.18em] text-[#907553] hover:text-[#151007] border-b border-[#907553] pb-0.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Skip & Shop as Guest</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#FAF7F2] border border-[#D8C9B6]">
            {/* Left Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full space-y-6">
                <div>
                  <p className="text-xs font-sans uppercase tracking-[0.22em] text-[#907553] font-medium mb-1.5">
                    JOIN THE ATELIER
                  </p>
                  <h1
                    className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Create an Account
                  </h1>
                  <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 mt-2 leading-relaxed">
                    Enjoy faster checkouts, saved custom measurements, and tailored private previews. (Always optional)
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
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="fullname"
                      className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                    >
                      Full Name *
                    </label>
                    <div className="relative flex items-center">
                      <User size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="fullname"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ayesha Khan"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                    >
                      Email Address *
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ayesha@example.com"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number (Optional) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="phone"
                        className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                      >
                        Mobile / WhatsApp (Optional)
                      </label>
                      <span className="text-[10px] text-[#3A2E21]/60 font-sans">For delivery updates</span>
                    </div>
                    <div className="relative flex items-center">
                      <Phone size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] py-2.5 pl-9 pr-3 text-xs font-sans text-[#211A12] focus:outline-none focus:border-[#907553] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="password"
                      className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]"
                    >
                      Create Password *
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={15} className="absolute left-3 text-[#3A2E21]/50" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
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

                  {/* Shopping Preference Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.18em] text-[#151007]">
                      Primary Style Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-sans">
                      {[
                        { id: "all", label: "All Collections" },
                        { id: "women", label: "Women's Pret" },
                        { id: "girls", label: "Girls & Family" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPreference(item.id)}
                          className={`py-2 px-2 text-[11px] border text-center transition-all cursor-pointer ${
                            preference === item.id
                              ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                              : "bg-[#FAF7F2] text-[#3A2E21] border-[#D8C9B6] hover:border-[#907553]"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                    <input
                      id="agreeTerms"
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-[#D8C9B6] text-[#907553] focus:ring-[#907553] accent-[#907553]"
                    />
                    <label htmlFor="agreeTerms" className="text-[11px] font-sans text-[#3A2E21]/80 select-none cursor-pointer leading-tight">
                      Receive occasional invitations to preview limited festive collections.
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
                      {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-[#D8C9B6] w-full" />
                  <span className="bg-[#FAF7F2] px-3 text-[10px] uppercase tracking-[0.2em] font-sans text-[#3A2E21]/60 absolute">
                    OR
                  </span>
                </div>

                {/* Skip and Continue as Guest */}
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

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-xs font-sans text-[#3A2E21]/80">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-[#907553] hover:text-[#151007] underline underline-offset-4 transition-colors"
                    >
                      Sign In here
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side Editorial Preview */}
            <div className="lg:col-span-5 bg-[#F2EAE0] p-8 sm:p-12 border-t lg:border-t-0 lg:border-l border-[#D8C9B6] flex flex-col justify-between">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-64 w-full overflow-hidden bg-[#D8C9B6] border border-[#D8C9B6] mb-8">
                <Image
                  src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=85&w=900&auto=format&fit=crop"
                  alt="AOUJ Little Petals Editorial"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-[#FAF7F2]">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#FAF7F2]/80">
                    LITTLE PETALS & FAMILY
                  </p>
                  <p
                    className="text-lg font-normal italic"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Heirloom memories in every stitch.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#907553]">
                  WHY CREATE AN ACCOUNT?
                </p>
                <p className="text-xs font-sans font-light text-[#3A2E21] leading-relaxed">
                  While guest shopping is always available, having an account simplifies tailored orders:
                </p>

                <div className="space-y-2.5 text-xs font-sans text-[#3A2E21]">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-[#907553] shrink-0" />
                    <span>Save your favorite seasonal picks to a personalized wishlist</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[#907553] shrink-0" />
                    <span>Store bespoke bust, waist, and length measurements for easy reorders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#907553] shrink-0" />
                    <span>Single-click checkout with your preferred shipping address</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D8C9B6]/60">
                  <p className="text-[11px] font-sans text-[#3A2E21]/70 italic">
                    Prefer not to register? No problem at all—you can proceed to checkout directly as a guest anytime!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
