"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { OrderInvoiceModal } from "@/components/invoice/OrderInvoiceModal";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AdminOrder } from "@/services/adminService";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  MapPin,
  Phone,
  FileText,
  AlertCircle,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

const formatPrice = (amount: number) =>
  `PKR ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const STEPS = [
  { key: "PENDING", label: "Order Received", desc: "Awaiting confirmation" },
  { key: "CONFIRMED", label: "Confirmed", desc: "Fabric assigned" },
  { key: "PROCESSING", label: "Master Tailoring", desc: "In atelier crafting" },
  { key: "DISPATCHED", label: "Dispatched", desc: "With insured courier" },
  { key: "DELIVERED", label: "Delivered", desc: "Heirloom received" },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderParam = searchParams.get("order") || "";
  const initialPhoneParam = searchParams.get("phone") || "";

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderParam);
  const [phoneInput, setPhoneInput] = useState(initialPhoneParam);
  const [isSearching, setIsSearching] = useState(false);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [searchError, setSearchError] = useState("");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryOrder = orderNumberInput.trim().toUpperCase();

    if (!queryOrder) {
      setSearchError("Please enter your Order Reference (e.g. AOUJ-20261017-1234).");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setOrder(null);

    // 1. Check Supabase Live Orders
    if (isSupabaseConfigured) {
      const supabase = createClient();
      if (supabase) {
        try {
          const { data, error } = await (supabase as any)
            .from("orders")
            .select("*, order_items(*)")
            .ilike("order_number", queryOrder)
            .single();

          if (!error && data) {
            // If phone provided, verify match
            if (
              phoneInput.trim() &&
              !data.customer_phone
                .replace(/\D/g, "")
                .includes(phoneInput.trim().replace(/\D/g, ""))
            ) {
              setSearchError(
                "Order found, but phone number does not match order record. Please verify."
              );
              setIsSearching(false);
              return;
            }

            const mapped: AdminOrder = {
              id: data.id,
              orderNumber: data.order_number,
              customerName: data.customer_name,
              customerEmail: data.customer_email,
              customerPhone: data.customer_phone,
              shippingAddress: data.shipping_address,
              city: data.city,
              paymentMethod: data.payment_method,
              paymentStatus: data.payment_status,
              orderStatus: data.order_status,
              subtotal: Number(data.subtotal),
              shippingFee: Number(data.shipping_fee),
              discountAmount: Number(data.discount_amount),
              grandTotal: Number(data.grand_total),
              isGuest: data.is_guest,
              createdAt: data.created_at,
              items: (data.order_items || []).map((it: any) => ({
                id: it.id,
                productName: it.product_name,
                productImage: it.product_image,
                unitPrice: Number(it.unit_price),
                quantity: it.quantity,
                selectedWomanSize: it.selected_woman_size,
                selectedGirlSize: it.selected_girl_size,
                isCustomSize: it.is_custom_size,
                customMeasurements: it.custom_measurements,
                lineTotal: Number(it.line_total),
              })),
            };

            setOrder(mapped);
            setIsSearching(false);
            return;
          }
        } catch (err) {
          console.error("Supabase order lookup error:", err);
        }
      }
    }

    // 2. Check Local Storage Orders Fallback
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
      const match = local.find(
        (o: any) =>
          o.orderNumber?.toUpperCase() === queryOrder ||
          o.id?.toUpperCase() === queryOrder
      );

      if (match) {
        setOrder({
          id: match.orderNumber,
          orderNumber: match.orderNumber,
          customerName: match.customerName,
          customerEmail: match.customerEmail || null,
          customerPhone: match.customerPhone,
          shippingAddress: match.customerAddress,
          city: match.customerCity || "Lahore",
          paymentMethod: match.paymentMethod,
          paymentStatus: "PENDING",
          orderStatus: match.orderStatus || "PENDING",
          subtotal: match.subtotal,
          shippingFee: match.shippingFee,
          discountAmount: match.discountAmount,
          grandTotal: match.grandTotal,
          isGuest: match.isGuest,
          createdAt: match.createdAt || new Date().toISOString(),
          items: (match.items || []).map((it: any, i: number) => ({
            id: `item-${i}`,
            productName: it.name,
            productImage: it.image,
            unitPrice: it.price,
            quantity: it.quantity,
            selectedWomanSize: it.womanSize || null,
            selectedGirlSize: it.girlSize || null,
            isCustomSize: Boolean(it.isCustomSize),
            customMeasurements: it.customMeasurements || null,
            lineTotal: it.price * it.quantity,
          })),
        });
        setIsSearching(false);
        return;
      }
    } catch {
      // ignore
    }

    setSearchError(
      `No order found with reference "${queryOrder}". Please double check your order number.`
    );
    setIsSearching(false);
  };

  useEffect(() => {
    if (initialOrderParam) {
      handleSearch();
    }
  }, [initialOrderParam]);

  const getStepProgressIndex = (status: string) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "PROCESSING":
        return 2;
      case "DISPATCHED":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIndex = order ? getStepProgressIndex(order.orderStatus) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-10">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70"
        >
          <Link href="/" className="hover:text-[#907553] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#151007] font-medium">Order Tracking</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#907553] font-semibold">
            LOGISTICS &amp; HEIRLOOM CONCIERGE
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#151007] tracking-wide uppercase"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 leading-relaxed">
            Enter your order reference code and phone number to view live crafting and courier status.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="max-w-xl mx-auto bg-[#F7F1E8] border border-[#D8C9B6] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-semibold mb-1">
                Order Reference Code *
              </label>
              <input
                type="text"
                required
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                placeholder="e.g. AOUJ-20261017-1234"
                className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-3 text-xs sm:text-sm font-mono uppercase focus:outline-none focus:border-[#907553]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#151007] font-semibold mb-1">
                Phone Number (Optional verification)
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-3 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#907553]"
              />
            </div>

            {searchError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-3 bg-[#151007] text-[#FAF7F2] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#907553] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Search size={14} />
              <span>{isSearching ? "LOCATING DOSSIER..." : "TRACK CONSIGNMENT"}</span>
            </button>
          </form>
        </div>

        {/* Live Order Result Details */}
        {order && (
          <div className="bg-[#FAF7F2] border border-[#D8C9B6] p-6 sm:p-10 space-y-8 animate-fadeIn shadow-md">
            {/* Top Bar with Number & Print Receipt */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#D8C9B6] pb-5">
              <div>
                <p className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#907553] font-semibold">
                  LIVE CONSIGNMENT PROGRESS
                </p>
                <h3
                  className="text-2xl sm:text-3xl text-[#151007] font-normal"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Order #{order.orderNumber}
                </h3>
                <p className="text-xs font-sans text-[#3A2E21]/70 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F1E8] border border-[#D8C9B6] text-xs font-sans uppercase tracking-wider text-[#151007] hover:bg-[#907553] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <FileText size={14} />
                  <span>View / Print Invoice</span>
                </button>

                <a
                  href={`https://wa.me/923000000000?text=${encodeURIComponent(
                    `Hello AOUJ Concierge, I would like to inquire regarding my order ${order.orderNumber}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white text-xs font-sans uppercase tracking-wider hover:bg-emerald-900 transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-4">
              <div className="relative">
                {/* Connecting Track Line */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-0.5 bg-[#D8C9B6] -z-0" />
                <div
                  className="hidden sm:block absolute top-5 left-8 h-0.5 bg-[#907553] transition-all duration-700 -z-0"
                  style={{
                    width: `${(currentStepIndex / (STEPS.length - 1)) * 85}%`,
                  }}
                />

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {STEPS.map((step, idx) => {
                    const isPassed = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    return (
                      <div
                        key={step.key}
                        className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-all border ${
                            isCurrent
                              ? "bg-[#907553] text-[#FAF7F2] border-[#151007] ring-4 ring-[#907553]/20 scale-110"
                              : isPassed
                              ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                              : "bg-[#FAF7F2] text-[#3A2E21]/40 border-[#D8C9B6]"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 size={18} /> : idx + 1}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-sans uppercase tracking-wider font-semibold ${
                              isCurrent
                                ? "text-[#907553]"
                                : isPassed
                                ? "text-[#151007]"
                                : "text-[#3A2E21]/50"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] font-sans text-[#3A2E21]/70">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Shipping & Consignment Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans">
              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6] space-y-1.5">
                <p className="text-[10px] uppercase font-sans tracking-widest text-[#907553] font-semibold">
                  DELIVERY DESTINATION
                </p>
                <p className="font-semibold text-sm text-[#151007]">{order.customerName}</p>
                <p className="text-[#3A2E21]">{order.shippingAddress}</p>
                <p className="text-[#3A2E21]">City: {order.city}</p>
                <p className="text-[#3A2E21]">Phone: {order.customerPhone}</p>
              </div>

              <div className="p-4 bg-[#F7F1E8] border border-[#D8C9B6] space-y-1.5">
                <p className="text-[10px] uppercase font-sans tracking-widest text-[#907553] font-semibold">
                  PAYMENT &amp; LOGISTICS
                </p>
                <p className="text-[#151007]">
                  Payment Method: <strong>{order.paymentMethod}</strong>
                </p>
                <p className="text-[#151007]">
                  Courier: <strong>TCS / Leopards Insured Express</strong>
                </p>
                <p className="text-[#151007]">
                  Grand Total: <strong>{formatPrice(order.grandTotal)}</strong>
                </p>
                <p className="text-emerald-800 font-medium">
                  Estimated Dispatch: 2 - 4 Business Days
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#151007]">
                Enclosed Pieces ({order.items.length})
              </h4>

              <div className="border border-[#D8C9B6] divide-y divide-[#D8C9B6]/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex gap-4 items-start bg-[#FAF7F2]">
                    {item.productImage && (
                      <div className="relative w-16 h-20 bg-[#F2EAE0] border border-[#D8C9B6] shrink-0 overflow-hidden">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-1 text-xs font-sans">
                      <div className="flex justify-between items-start">
                        <h5 className="font-semibold text-[#151007]">{item.productName}</h5>
                        <p className="font-medium text-[#151007]">
                          {formatPrice(item.lineTotal)}
                        </p>
                      </div>

                      <p className="text-[#3A2E21]/80">
                        Qty: {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>

                      <div className="pt-1 space-y-1">
                        {item.selectedWomanSize && (
                          <div className="inline-block mr-2 px-2 py-0.5 bg-[#F2EAE0] border border-[#D8C9B6] text-[11px] text-[#151007]">
                            Woman Size: <strong>{item.selectedWomanSize}</strong>
                          </div>
                        )}
                        {item.selectedGirlSize && (
                          <div className="inline-block mr-2 px-2 py-0.5 bg-[#F2EAE0] border border-[#D8C9B6] text-[11px] text-[#151007]">
                            Girl Size: <strong>{item.selectedGirlSize}</strong>
                          </div>
                        )}
                        {item.isCustomSize && (
                          <div className="mt-1 p-2 bg-[#F7F1E8] border border-[#907553] text-[11px] text-[#907553]">
                            Bespoke Tailoring Request Confirmed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Invoice Modal */}
      {showInvoiceModal && order && (
        <OrderInvoiceModal
          order={order}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <p className="font-serif text-xl text-[#907553]">Loading Order Tracking...</p>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
