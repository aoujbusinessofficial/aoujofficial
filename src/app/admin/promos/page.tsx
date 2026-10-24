"use client";

import React, { useState, useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Tag,
  Plus,
  Percent,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PromoCodeItem {
  id: string;
  code: string;
  discount_percent: number;
  min_order_amount: number;
  is_active: boolean;
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoCodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Promo form state
  const [newCode, setNewCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(5000);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadPromos = async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      try {
        const local = JSON.parse(localStorage.getItem("aouj_local_promos") || "[]");
        if (local.length === 0) {
          const defaults = [
            {
              id: "local-1",
              code: "AOUJ10",
              discount_percent: 10,
              min_order_amount: 5000,
              is_active: true,
            },
            {
              id: "local-2",
              code: "AOUJ25",
              discount_percent: 25,
              min_order_amount: 0,
              is_active: true,
            },
          ];
          localStorage.setItem("aouj_local_promos", JSON.stringify(defaults));
          setPromos(defaults);
        } else {
          setPromos(local);
        }
      } catch {
        setPromos([]);
      }
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    if (supabase) {
      const { data } = await (supabase as any)
        .from("promo_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setPromos(data);
        try {
          localStorage.setItem("aouj_local_promos", JSON.stringify(data));
        } catch {}
      } else {
        setPromos([]);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    setIsSaving(true);
    const cleanedCode = newCode.trim().toUpperCase();

    // 1. Save to Supabase if configured
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        const { error } = await (supabase as any).from("promo_codes").insert({
          code: cleanedCode,
          discount_percent: discountPercent,
          min_order_amount: minOrder,
          is_active: true,
        });

        if (error) {
          setFeedback(`Error: ${error.message}`);
          setIsSaving(false);
          return;
        }
      }
    }

    // 2. Also sync to localStorage
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_promos") || "[]");
      const filtered = local.filter((p: any) => p.code?.toUpperCase() !== cleanedCode);
      filtered.unshift({
        id: "promo-" + Date.now(),
        code: cleanedCode,
        discount_percent: Number(discountPercent),
        min_order_amount: Number(minOrder),
        is_active: true,
      });
      localStorage.setItem("aouj_local_promos", JSON.stringify(filtered));
    } catch {}

    setFeedback(`Promo code ${cleanedCode} (${discountPercent}% OFF) created successfully!`);
    setNewCode("");
    await loadPromos();
    setIsSaving(false);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleTogglePromo = async (promo: PromoCodeItem) => {
    const updatedStatus = !promo.is_active;
    setPromos((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, is_active: updatedStatus } : p))
    );

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_promos") || "[]");
      const updated = local.map((p: any) =>
        p.id === promo.id || p.code?.toUpperCase() === promo.code?.toUpperCase()
          ? { ...p, is_active: updatedStatus }
          : p
      );
      localStorage.setItem("aouj_local_promos", JSON.stringify(updated));
    } catch {}

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await (supabase as any)
          .from("promo_codes")
          .update({ is_active: updatedStatus })
          .eq("id", promo.id);
      }
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== promoId));

    // Sync localStorage
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_promos") || "[]");
      const updated = local.filter((p: any) => p.id !== promoId);
      localStorage.setItem("aouj_local_promos", JSON.stringify(updated));
    } catch {}

    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        await (supabase as any).from("promo_codes").delete().eq("id", promoId);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#D8C9B6] pb-5">
        <p className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553] font-semibold mb-1">
          MARKETING &amp; PROMOTIONAL PRIVILEGES
        </p>
        <h1
          className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Promo Codes &amp; Feature Toggles
        </h1>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Create Promo */}
        <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#D8C9B6] p-6 space-y-4">
          <div>
            <h3
              className="text-2xl text-[#151007] font-normal uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Generate New Privilege Code
            </h3>
            <p className="text-xs font-sans text-[#3A2E21]/70 mt-1">
              Create discount coupons that clients can apply in their shopping bag.
            </p>
          </div>

          <form onSubmit={handleCreatePromo} className="space-y-4 text-xs font-sans">
            <div className="space-y-1">
              <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                Promo Code *
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. EID2026, FESTIVE15"
                required
                className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 font-mono uppercase focus:outline-none focus:border-[#907553]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Discount (%) *
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  min={1}
                  max={90}
                  required
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-medium">
                  Min. Order (PKR)
                </label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(Number(e.target.value))}
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? "SAVING..." : "CREATE PROMO CODE"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right List: Active Promo Codes */}
        <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#D8C9B6] p-6 space-y-4">
          <h3
            className="text-2xl text-[#151007] font-normal uppercase"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Active &amp; Expired Promo Codes
          </h3>

          {isLoading ? (
            <div className="py-12 text-center text-xs font-sans text-[#3A2E21]/60">
              Loading promo codes...
            </div>
          ) : promos.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Tag size={28} className="mx-auto text-[#907553]" />
              <p className="text-sm font-sans font-medium text-[#151007]">No Promo Codes</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D8C9B6]/50">
              {promos.map((p) => (
                <div
                  key={p.id}
                  className="py-3.5 flex items-center justify-between text-xs font-sans"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F7F1E8] border border-[#D8C9B6] flex items-center justify-center text-[#907553]">
                      <Tag size={16} />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-sm text-[#151007]">{p.code}</p>
                      <p className="text-[11px] text-[#3A2E21]/70">
                        {p.discount_percent}% Discount on orders above PKR {p.min_order_amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePromo(p)}
                      className={`px-2.5 py-1 text-[10px] uppercase font-semibold border cursor-pointer ${
                        p.is_active
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                    >
                      {p.is_active ? "ACTIVE" : "INACTIVE"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 cursor-pointer"
                      title="Delete Promo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
