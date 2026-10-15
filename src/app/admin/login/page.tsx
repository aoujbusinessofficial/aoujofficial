"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your administrator email.");
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim());
    setIsLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Access Denied: You do not have administrator privileges.");
    }
  };

  return (
    <div className="min-h-screen bg-[#151007] text-[#FAF7F2] flex flex-col justify-between p-6 sm:p-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans text-[#AF997E] hover:text-[#FAF7F2] tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Return to Storefront</span>
        </Link>
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#907553] px-2.5 py-1 border border-[#907553]/40">
          CONFIDENTIAL ATELIER
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-12 bg-[#1A140A] border border-[#3A2E21] p-8 sm:p-10 shadow-2xl">
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#907553]/20 border border-[#907553]/40 text-[#907553] mx-auto flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1
              className="text-2xl sm:text-3xl text-[#FAF7F2] font-normal uppercase tracking-widest"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Atelier Portal
            </h1>
            <p className="text-[11px] font-sans text-[#AF997E] tracking-wider mt-1 uppercase">
              Administrator Authentication
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800 text-red-200 text-xs font-sans flex items-start gap-2.5 leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-3 text-[#AF997E]/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aouj.luxury"
                required
                className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-3 text-xs font-sans text-[#FAF7F2] placeholder:text-[#AF997E]/40 focus:outline-none focus:border-[#907553] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#AF997E]">
              Master Password
            </label>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3 text-[#AF997E]/60" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#151007] border border-[#3A2E21] py-2.5 pl-9 pr-3 text-xs font-sans text-[#FAF7F2] placeholder:text-[#AF997E]/40 focus:outline-none focus:border-[#907553] transition-colors"
              />
            </div>
          </div>

          <div className="pt-3">
            <Button
              variant="champagne"
              size="md"
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "VERIFYING ADMIN ROLE..." : "SIGN IN AS ADMIN"}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#3A2E21]/60 text-center">
          <p className="text-[11px] font-sans text-[#AF997E]/80 leading-relaxed">
            Role Enforcement: Only users with <strong className="text-[#FAF7F2]">role: &quot;ADMIN&quot;</strong> in the Supabase <strong className="text-[#FAF7F2]">profiles</strong> table are permitted.
          </p>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="text-center text-[10px] font-sans uppercase tracking-[0.25em] text-[#AF997E]/50">
        © 2026 AOUJ Luxury Brand Atelier • Internal System
      </div>
    </div>
  );
}
