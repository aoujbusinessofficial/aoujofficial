"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Package,
  Ruler,
  LogOut,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateMeasurements } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "measurements" | "orders">("profile");

  // Custom Measurements state
  const [bust, setBust] = useState(user?.measurements?.bust || "");
  const [waist, setWaist] = useState(user?.measurements?.waist || "");
  const [hip, setHip] = useState(user?.measurements?.hip || "");
  const [shirtLength, setShirtLength] = useState(user?.measurements?.shirtLength || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    updateMeasurements({
      bust,
      waist,
      hip,
      shirtLength,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 w-full py-10 sm:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-8">
            <Link href="/" className="hover:text-[#907553] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#907553]" />
            <span className="text-[#151007] font-medium tracking-wide">
              {isAuthenticated ? "My Account" : "Client Access"}
            </span>
          </div>

          {!isAuthenticated ? (
            /* Not logged in State: Option to Login, Signup, or Continue as Guest */
            <div className="max-w-xl mx-auto bg-[#FAF7F2] border border-[#D8C9B6] p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#F7F1E8] border border-[#D8C9B6] mx-auto flex items-center justify-center text-[#907553]">
                <User size={28} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] font-sans text-[#907553] font-medium mb-1.5">
                  AOUJ CLIENT PORTAL
                </p>
                <h1
                  className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Account Access
                </h1>
                <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 max-w-md mx-auto mt-2 leading-relaxed">
                  Sign in or create an account to view your saved bespoke measurements, or feel free to continue shopping as a guest anytime.
                </p>
              </div>

              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60 text-xs font-sans text-[#3A2E21]/90 flex items-center justify-center gap-2">
                <Sparkles size={15} className="text-[#907553] shrink-0" />
                <span>Account creation is 100% optional. Guest checkout is always available.</span>
              </div>

              <div className="space-y-3 pt-2">
                <Button variant="primary" size="md" href="/login" className="w-full">
                  SIGN IN TO ACCOUNT
                </Button>
                <Button variant="secondary" size="md" href="/signup" className="w-full">
                  CREATE NEW ACCOUNT (OPTIONAL)
                </Button>
                <Button variant="outline" size="md" href="/products" className="w-full">
                  CONTINUE BROWSING AS GUEST
                </Button>
              </div>
            </div>
          ) : (
            /* Authenticated Account Dashboard */
            <div className="space-y-8">
              {/* Header Card */}
              <div className="bg-[#F7F1E8] border border-[#D8C9B6] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#151007] text-[#FAF7F2] font-serif text-2xl flex items-center justify-center border border-[#907553]">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1
                        className="text-2xl sm:text-3xl text-[#151007] font-normal"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        Salam, {user?.name}
                      </h1>
                      <span className="text-[10px] uppercase font-sans tracking-widest px-2 py-0.5 bg-[#FAF7F2] border border-[#D8C9B6] text-[#907553]">
                        Client Member
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[#3A2E21]/70 mt-0.5">{user?.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 text-xs font-sans text-[#907553] hover:text-[#151007] border border-[#D8C9B6] bg-[#FAF7F2] px-4 py-2 hover:border-[#907553] transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>SIGN OUT</span>
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#D8C9B6] gap-4 sm:gap-8 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "profile"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <User size={15} />
                  <span>Profile Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("measurements")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "measurements"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <Ruler size={15} />
                  <span>Saved Measurements</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 text-xs sm:text-[13px] font-sans uppercase tracking-[0.18em] transition-colors cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-[#151007] text-[#151007] font-medium"
                      : "border-transparent text-[#3A2E21]/60 hover:text-[#151007]"
                  }`}
                >
                  <Package size={15} />
                  <span>Recent Orders</span>
                </button>
              </div>

              {/* Tab 1: Profile Details */}
              {activeTab === "profile" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 max-w-2xl space-y-6">
                  <h2
                    className="text-2xl text-[#151007] font-normal uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60">
                      <p className="text-[10px] uppercase tracking-widest text-[#907553] font-medium mb-1">
                        FULL NAME
                      </p>
                      <p className="text-sm text-[#151007] font-medium">{user?.name}</p>
                    </div>

                    <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60">
                      <p className="text-[10px] uppercase tracking-widest text-[#907553] font-medium mb-1">
                        EMAIL ADDRESS
                      </p>
                      <p className="text-sm text-[#151007] font-medium">{user?.email}</p>
                    </div>

                    <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60">
                      <p className="text-[10px] uppercase tracking-widest text-[#907553] font-medium mb-1">
                        MOBILE / WHATSAPP
                      </p>
                      <p className="text-sm text-[#151007] font-medium">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>

                    <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6]/60">
                      <p className="text-[10px] uppercase tracking-widest text-[#907553] font-medium mb-1">
                        ACCOUNT STATUS
                      </p>
                      <p className="text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                        <CheckCircle2 size={14} /> Active Client
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="primary" size="md" href="/products">
                      START SHOPPING NEW ARRIVALS
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab 2: Saved Bespoke Measurements */}
              {activeTab === "measurements" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 max-w-2xl space-y-6">
                  <div>
                    <h2
                      className="text-2xl text-[#151007] font-normal uppercase"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      Bespoke Tailoring Profile
                    </h2>
                    <p className="text-xs font-sans text-[#3A2E21]/80 mt-1">
                      Save your exact measurements here. When choosing the &ldquo;Custom Size&rdquo; option on any outfit, our master tailors will craft the garment to these exact dimensions.
                    </p>
                  </div>

                  {savedSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>Measurements updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveMeasurements} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Bust (Inches)
                        </label>
                        <input
                          type="text"
                          value={bust}
                          onChange={(e) => setBust(e.target.value)}
                          placeholder="e.g. 36"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Waist (Inches)
                        </label>
                        <input
                          type="text"
                          value={waist}
                          onChange={(e) => setWaist(e.target.value)}
                          placeholder="e.g. 29"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Hip (Inches)
                        </label>
                        <input
                          type="text"
                          value={hip}
                          onChange={(e) => setHip(e.target.value)}
                          placeholder="e.g. 39"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                          Shirt Length (Inches)
                        </label>
                        <input
                          type="text"
                          value={shirtLength}
                          onChange={(e) => setShirtLength(e.target.value)}
                          placeholder="e.g. 42"
                          className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs font-sans focus:outline-none focus:border-[#907553]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="primary" size="md" type="submit">
                        SAVE MEASUREMENTS
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tab 3: Order History */}
              {activeTab === "orders" && (
                <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-8 space-y-6">
                  <h2
                    className="text-2xl text-[#151007] font-normal uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Your Orders
                  </h2>

                  <div className="border border-[#D8C9B6] p-8 text-center bg-[#F7F1E8]/40 space-y-3">
                    <ShoppingBag size={32} className="mx-auto text-[#907553]" strokeWidth={1.5} />
                    <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#151007]">
                      No Orders Placed Yet
                    </p>
                    <p className="text-xs font-sans text-[#3A2E21]/70 max-w-sm mx-auto">
                      Your purchase archive will appear here once you place your first order.
                    </p>
                    <div className="pt-2">
                      <Button variant="primary" size="sm" href="/products" withArrow>
                        EXPLORE THE COLLECTION
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
