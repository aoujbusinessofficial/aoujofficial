"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder } from "@/services/orderService";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { OrderInvoiceModal } from "@/components/invoice/OrderInvoiceModal";
import { ReturnExchangeModal } from "@/components/ui/ReturnExchangeModal";
import { AdminOrder, validatePromoCode } from "@/services/adminService";
import {
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Users,
  CheckCircle2,
  Tag,
  FileText,
  Building2,
  Smartphone,
  Copy,
  AlertCircle,
  Check,
  MessageCircle,
} from "lucide-react";

// Deterministic price format
const formatPrice = (amount: number) =>
  `Rs. ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    shippingFee,
    grandTotal,
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [appliedPercent, setAppliedPercent] = useState<number>(0);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  // Recalculate discount whenever subtotal changes if promo is applied
  useEffect(() => {
    if (promoApplied && appliedPercent > 0) {
      const discount = Math.round(subtotal * (appliedPercent / 100));
      setPromoDiscount(discount);
    }
  }, [subtotal, promoApplied, appliedPercent]);

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [confirmedPayable, setConfirmedPayable] = useState<number>(0);
  const [whatsappUrl, setWhatsappUrl] = useState<string>("");
  const [orderSummaryAmounts, setOrderSummaryAmounts] = useState<{ total: number; advance: number; remaining: number }>({
    total: 0,
    advance: 0,
    remaining: 0,
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // 100% Customer & Delivery Information
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Lahore");
  const [customerProvince, setCustomerProvince] = useState("Punjab");
  const [customerPostalCode, setCustomerPostalCode] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery (COD)");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Printable Invoice Modal state
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [placedInvoiceOrder, setPlacedInvoiceOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Handle dynamic promo code application
  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    if (!promoCode.trim()) {
      setPromoError("Please enter a privilege promo code.");
      return;
    }

    setPromoLoading(true);
    const result = await validatePromoCode(promoCode, subtotal);
    setPromoLoading(false);

    if (result.valid && result.discountPercent !== undefined) {
      const percent = result.discountPercent;
      const discount = result.discountAmount !== undefined
        ? result.discountAmount
        : Math.round(subtotal * (percent / 100));

      setAppliedPromoCode(result.code || promoCode.trim().toUpperCase());
      setAppliedPercent(percent);
      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError(result.error || "Invalid privilege code. Please verify and try again.");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setAppliedPromoCode("");
    setAppliedPercent(0);
    setPromoDiscount(0);
    setPromoCode("");
    setPromoError("");
  };

  const finalPayable = Math.max(0, grandTotal - promoDiscount);
  const displayPayable = confirmedPayable > 0 ? confirmedPayable : finalPayable;
  const advancePaidAmount = Math.round(displayPayable / 2);
  const remainingPayable = displayPayable - advancePaidAmount;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !customerEmail.trim()) {
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = await placeOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity.trim(),
        customerProvince: customerProvince.trim(),
        customerPostalCode: customerPostalCode.trim() || undefined,
        customerAddress: customerAddress.trim(),
        orderNotes: orderNotes.trim() || undefined,
        paymentMethod,
        subtotal,
        shippingFee,
        discountAmount: promoDiscount,
        grandTotal: finalPayable,
        isGuest: !isAuthenticated,
        userId: user?.id || null,
        items,
      });

      const orderPayableAmount = finalPayable;
      const advance = Math.round(orderPayableAmount / 2);
      const remaining = orderPayableAmount - advance;

      setOrderSummaryAmounts({
        total: orderPayableAmount,
        advance,
        remaining,
      });

      const formattedTotal = `Rs. ${orderPayableAmount.toLocaleString()}`;
      const formattedAdvance = `Rs. ${advance.toLocaleString()}`;
      const formattedRemaining = `Rs. ${remaining.toLocaleString()}`;

      const whatsappMsg = paymentMethod === "Cash on Delivery (COD)"
        ? `Assalam o Alaikum Adnan Bhai (AOUJ Atelier),\nMaine Cash on Delivery par order place kiya hai.\nOrder Reference: ${res.orderNumber}\nClient Name: ${customerName.trim()}\nTotal Order Amount: ${formattedTotal}\n50% Advance Paid Amount: ${formattedAdvance} (Receipt Attached)\nRemaining Payment on Delivery: ${formattedRemaining}\n\nMain apni 50% advance payment ki receipt attach kar raha/rahi hoon. Baraye meherbani order confirm karein.`
        : `Assalam o Alaikum Adnan Bhai (AOUJ Atelier),\nMaine Direct Bank Transfer se order place kiya hai.\nOrder Reference: ${res.orderNumber}\nClient Name: ${customerName.trim()}\nTotal Payable: ${formattedTotal}\nPayment Method: Direct Bank Transfer (Meezan Bank)\n\nMain apni full payment ki receipt attach kar raha/rahi hoon. Baraye meherbani order verify karein.`;

      setWhatsappUrl(`https://wa.me/923426300002?text=${encodeURIComponent(whatsappMsg)}`);
      setConfirmedPayable(orderPayableAmount);
      setConfirmedOrderNumber(res.orderNumber);

      // Build invoice object for instant printing/download
      const invoiceData: AdminOrder = {
        id: res.orderId || res.orderNumber,
        orderNumber: res.orderNumber,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: customerAddress.trim(),
        city: customerCity.trim(),
        paymentMethod,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",
        subtotal,
        shippingFee,
        discountAmount: promoDiscount,
        grandTotal: finalPayable,
        isGuest: !isAuthenticated,
        createdAt: new Date().toISOString(),
        items: items.map((it, idx) => ({
          id: `item-${idx}`,
          productName: it.name,
          productImage: it.image || null,
          unitPrice: it.price,
          quantity: it.quantity,
          selectedWomanSize: it.womanSize || null,
          selectedGirlSize: it.girlSize || null,
          isCustomSize: Boolean(it.isCustomSize),
          customMeasurements: it.customMeasurements || null,
          lineTotal: it.price * it.quantity,
        })),
      };

      setPlacedInvoiceOrder(invoiceData);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Order submission error:", err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-6"
        >
          <Link href="/" className="hover:text-[#907553] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#907553] transition-colors">
            Collections
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#151007] font-medium">Shopping Bag</span>
        </nav>

        {/* Page Title */}
        <div className="border-b border-[#D8C9B6]/60 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#907553] mb-1">
              REVIEW YOUR SELECTIONS
            </p>
            <h1
              className="text-3xl sm:text-4xl text-[#151007] font-normal leading-tight uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Shopping Bag
            </h1>
          </div>
          <div className="text-xs font-sans text-[#3A2E21]/80">
            Total Items: <span className="font-semibold text-[#151007]">{totalCount}</span>
          </div>
        </div>

        {items.length === 0 ? (
          /* EMPTY CART VIEW */
          <div className="py-20 px-4 text-center max-w-md mx-auto space-y-5 bg-[#F7F1E8] border border-[#D8C9B6] p-8">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#907553] mx-auto flex items-center justify-center border border-[#D8C9B6]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2
                className="text-2xl font-normal text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Your Shopping Bag is Empty
              </h2>
              <p className="text-xs font-sans text-[#3A2E21]/80 mt-2 leading-relaxed">
                You haven&apos;t added any luxury pieces to your bag yet. Explore our curated collections for women, girls (New Born to XL), and matching family coordinates.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans uppercase tracking-[0.2em] transition-all cursor-pointer"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* POPULATED CART VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT: LIST OF CART ITEMS */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Information Banner */}
              <div className="p-3.5 bg-[#F2EAE0] border border-[#D8C9B6] flex items-center justify-between text-xs font-sans text-[#3A2E21]">
                <span className="font-medium text-[#151007] flex items-center gap-2">
                  <Truck size={15} className="text-[#907553]" />
                  <span>Standard Express Delivery across Pakistan</span>
                </span>
                <span className="font-semibold text-[#151007] bg-[#FAF7F2] px-2.5 py-0.5 border border-[#D8C9B6]">
                  Fixed Rs. 350
                </span>
              </div>

              {/* Items Card List */}
              <div className="divide-y divide-[#D8C9B6]/60 border-t border-b border-[#D8C9B6]/60">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-6 flex flex-col sm:flex-row gap-5 items-start justify-between"
                  >
                    {/* Item Thumbnail & Main Details */}
                    <div className="flex gap-4 items-start flex-1">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.productId}`}
                        className="relative w-20 h-26 sm:w-24 sm:h-32 shrink-0 bg-[#F2EAE0] overflow-hidden border border-[#D8C9B6]"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="100px"
                          className="object-cover object-top hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Product Spec Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase tracking-[0.2em] text-[#907553] font-medium bg-[#F2EAE0] px-1.5 py-0.5 border border-[#D8C9B6]/60">
                            {item.category}
                          </span>
                        </div>

                        <Link
                          href={`/products/${item.productId}`}
                          className="hover:text-[#907553] transition-colors"
                        >
                          <h3
                            className="text-base sm:text-lg font-serif text-[#151007] leading-snug"
                            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                          >
                            {item.name}
                          </h3>
                        </Link>

                        {/* Color */}
                        <div className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/80">
                          <span>Color:</span>
                          <span className="font-medium text-[#151007]">{item.color}</span>
                          {item.colorHex && (
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: item.colorHex }}
                            />
                          )}
                        </div>

                        {/* ================================================= */}
                        {/* CLEAR SIZES DISPLAY (AS REQUESTED BY USER) */}
                        {/* ================================================= */}
                        <div className="p-3 bg-[#FAF7F2] border border-[#D8C9B6] rounded-none space-y-1.5 my-2 max-w-md">
                          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#151007]">
                            <Sparkles size={13} className="text-[#907553]" />
                            <span>Selected Size Configuration:</span>
                          </div>

                          {/* Family Category Dual Size Breakdown */}
                          {item.category === "family" ? (
                            <div className="space-y-1 text-xs font-sans text-[#211A12] pl-2 border-l-2 border-[#907553]">
                              <p>
                                👩 <strong>Woman Size:</strong>{" "}
                                <span className="text-[#907553] font-medium">
                                  {item.womanSize || "Standard"}
                                </span>
                              </p>
                              <p>
                                👧 <strong>Girl Size:</strong>{" "}
                                <span className="text-[#907553] font-medium">
                                  {item.includeGirlPiece ? item.girlSize : "Omitted (Woman Only)"}
                                </span>
                              </p>
                            </div>
                          ) : item.category === "girls" ? (
                            /* Girls Category Age Size */
                            <div className="text-xs font-sans text-[#211A12] pl-2 border-l-2 border-[#907553]">
                              <p>
                                👧 <strong>Girl Age/Size:</strong>{" "}
                                <span className="text-[#907553] font-medium">
                                  {item.sizeDescription}
                                </span>
                              </p>
                            </div>
                          ) : (
                            /* Women Category Size */
                            <div className="text-xs font-sans text-[#211A12] pl-2 border-l-2 border-[#907553]">
                              <p>
                                👩 <strong>Woman Size:</strong>{" "}
                                <span className="text-[#907553] font-medium">
                                  {item.sizeDescription}
                                </span>
                              </p>
                            </div>
                          )}

                          {/* Bespoke / Custom Size Details if provided */}
                          {item.isCustomSize && item.customMeasurements && (
                            <div className="mt-2 pt-2 border-t border-[#D8C9B6]/40 text-[11px] font-sans text-[#3A2E21] space-y-0.5 bg-[#F2EAE0] p-2">
                              <p className="font-semibold text-[#151007]">
                                ✂️ Custom Measurements:
                              </p>
                              {item.customMeasurements.ageOrHeight && (
                                <p>• Age/Height: {item.customMeasurements.ageOrHeight}</p>
                              )}
                              {item.customMeasurements.chest && (
                                <p>• Chest: {item.customMeasurements.chest}</p>
                              )}
                              {item.customMeasurements.shirtLength && (
                                <p>• Shirt Length: {item.customMeasurements.shirtLength}</p>
                              )}
                              {item.customMeasurements.waistOrTrouser && (
                                <p>• Waist/Trouser: {item.customMeasurements.waistOrTrouser}</p>
                              )}
                              {item.customMeasurements.notes && (
                                <p>• Tailoring Note: {item.customMeasurements.notes}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price per item */}
                        <div className="text-xs font-sans text-[#3A2E21]/80">
                          Unit Price: <span className="font-medium text-[#151007]">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 self-center sm:self-start">
                      {/* Subtotal for line item */}
                      <span className="text-sm sm:text-base font-sans font-medium text-[#151007]">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Quantity buttons */}
                      <div className="flex items-center border border-[#D8C9B6] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#F2EAE0] cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-sans font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center text-xs hover:bg-[#F2EAE0] cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-[#9E5B4B] hover:text-[#6A382A] flex items-center gap-1 font-sans cursor-pointer underline"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/products"
                  className="text-xs uppercase font-sans tracking-widest text-[#151007] hover:text-[#907553] underline flex items-center gap-1.5"
                >
                  ← Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-sans text-[#3A2E21]/70 hover:text-[#9E5B4B] cursor-pointer"
                >
                  Clear Bag
                </button>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY & CHECKOUT */}
            <div className="lg:col-span-4 bg-[#F7F1E8] p-6 sm:p-7 border border-[#D8C9B6] space-y-6">
              <h2
                className="text-xl font-serif text-[#151007] border-b border-[#D8C9B6]/60 pb-3"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Order Summary
              </h2>

              {/* Price Breakdown */}
              <div className="space-y-3 text-xs font-sans text-[#3A2E21]">
                <div className="flex justify-between">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-medium text-[#151007]">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Standard Express Shipping</span>
                  <span className="font-medium text-[#151007]">
                    {formatPrice(shippingFee)}
                  </span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-[#3F6212] font-medium">
                    <span className="flex items-center gap-1">
                      <Tag size={13} /> Privilege Code ({appliedPromoCode} - {appliedPercent}%)
                    </span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-[#D8C9B6] pt-3 flex justify-between text-sm sm:text-base font-medium text-[#151007]">
                  <span>Estimated Total</span>
                  <span>{formatPrice(finalPayable)}</span>
                </div>
                <p className="text-[10px] text-[#3A2E21]/70 italic leading-normal">
                  Handcrafted pieces are fulfilled within 20-30 working days. Cash on delivery available across Pakistan.
                </p>
              </div>

              {/* Privilege Promo Code Box */}
              {promoApplied ? (
                <div className="pt-2 border-t border-[#D8C9B6]/60">
                  <div className="p-3 bg-[#F2F7ED] border border-[#A3D9A5] flex items-center justify-between text-xs font-sans text-[#276749]">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-[#3F6212]" />
                      <span>
                        Privilege Code <strong>{appliedPromoCode}</strong> applied ({appliedPercent}% OFF: -{formatPrice(promoDiscount)})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] uppercase tracking-wider text-red-700 hover:text-red-900 font-semibold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-2 border-t border-[#D8C9B6]/60">
                  <label className="block text-[10px] uppercase font-sans tracking-wider text-[#3A2E21]">
                    Privilege Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g. AOUJ25, AOUJ10"
                      className="flex-1 bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3 py-2 text-[#211A12] focus:outline-none focus:border-[#907553] uppercase font-sans"
                    />
                    <button
                      type="submit"
                      disabled={promoLoading}
                      className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#151007] hover:text-[#FAF7F2] border border-[#D8C9B6] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {promoLoading ? "Checking..." : "Apply"}
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-[#9E5B4B] font-sans">{promoError}</p>
                  )}
                </form>
              )}

              {/* PROCEED TO CHECKOUT BUTTON */}
              <button
                type="button"
                onClick={() => setShowCheckoutModal(true)}
                className="w-full py-4 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={14} />
              </button>

              {/* Trust Badges */}
              <div className="space-y-2.5 pt-2 border-t border-[#D8C9B6]/60 text-[11px] font-sans text-[#3A2E21]/80">
                <div className="flex items-start gap-2">
                  <Truck size={14} className="text-[#907553] shrink-0 mt-0.5" />
                  <span><strong>Delivery:</strong> Handcrafted &amp; fulfilled in <strong>20-30 working days</strong> (Mon-Fri)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#907553] shrink-0" />
                  <span><strong>Cash on Delivery:</strong> Available across Pakistan (Fixed Rs. 350)</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-[#907553] shrink-0" />
                  <span><strong>Exchange &amp; Return:</strong> Within 72 hours of delivery</span>
                </div>
                <div className="pt-1">
                  <ReturnExchangeModal />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {orderPlaced ? (
              /* ORDER CONFIRMATION SUCCESS */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E5F3D6] text-[#3F6212] mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-serif text-[#151007]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Order Placed Successfully!
                </h3>
                <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{customerName}</strong>! Your order for AOUJ heirloom pieces has been saved directly to our database. A confirmation receipt has been dispatched to <strong>{customerEmail}</strong>.
                </p>
                {confirmedOrderNumber && (
                  <div className="p-3 bg-[#F7F1E8] border border-[#907553] text-xs font-sans text-[#151007] max-w-sm mx-auto">
                    Order Reference: <strong className="font-mono text-[#907553] text-sm">{confirmedOrderNumber}</strong>
                  </div>
                )}
                <div className="p-3 bg-[#F2EAE0] border border-[#D8C9B6] text-xs font-sans text-[#151007] max-w-sm mx-auto space-y-1 text-left">
                  <p>Client: <strong>{customerName}</strong> ({customerPhone})</p>
                  <p>Destination: <strong>{customerAddress}, {customerCity}</strong></p>
                  <p>Payment: <strong>{paymentMethod}</strong> (Payable: {formatPrice(orderSummaryAmounts.total || displayPayable)})</p>
                </div>

                {/* WhatsApp Receipt Submission Callout */}
                <div className="p-3.5 bg-[#E7F6DF] border border-emerald-300 text-emerald-950 text-xs font-sans text-left max-w-sm mx-auto space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <MessageCircle size={15} className="text-emerald-700" />
                    <span>WhatsApp Order Confirmation &amp; Receipt:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {paymentMethod === "Cash on Delivery (COD)"
                      ? `Apka order register ho chuka hai. Cash on Delivery confirm karwane ke liye baraye meherbani 50% advance payment (${formatPrice(orderSummaryAmounts.advance || advancePaidAmount)}) Meezan Bank mein transfer kar ke receipt hamaray WhatsApp par share karein. Baqi remaining payment (${formatPrice(orderSummaryAmounts.remaining || remainingPayable)}) parcel wasool karne par rider ko ada karein.`
                      : "Apka order register ho chuka hai. Baraye meherbani apni bank transfer payment ka screenshot/receipt hamaray official WhatsApp par share karein taakay order confirm ho kar foran deliver kiya ja sakay."}
                  </p>
                  <a
                    href={
                      whatsappUrl ||
                      `https://wa.me/923426300002?text=${encodeURIComponent(
                        paymentMethod === "Cash on Delivery (COD)"
                          ? `Assalam o Alaikum Adnan Bhai (AOUJ Atelier),\nMaine Cash on Delivery par order place kiya hai.\nOrder Reference: ${confirmedOrderNumber}\nClient Name: ${customerName}\nTotal Order Amount: ${formatPrice(orderSummaryAmounts.total || displayPayable)}\n50% Advance Paid Amount: ${formatPrice(orderSummaryAmounts.advance || advancePaidAmount)} (Receipt Attached)\nRemaining Payment on Delivery: ${formatPrice(orderSummaryAmounts.remaining || remainingPayable)}\n\nMain apni 50% advance payment ki receipt attach kar raha/rahi hoon. Baraye meherbani order confirm karein.`
                          : `Assalam o Alaikum Adnan Bhai (AOUJ Atelier),\nMaine Direct Bank Transfer se order place kiya hai.\nOrder Reference: ${confirmedOrderNumber}\nClient Name: ${customerName}\nTotal Payable: ${formatPrice(orderSummaryAmounts.total || displayPayable)}\nPayment Method: Direct Bank Transfer (Meezan Bank)\n\nMain apni full payment ki receipt attach kar raha/rahi hoon. Baraye meherbani order verify karein.`
                      )}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-700 text-white font-medium text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={14} />
                    <span>
                      {paymentMethod === "Cash on Delivery (COD)"
                        ? "Share 50% Advance Receipt (+92 342-6300002)"
                        : "Share Bank Transfer Receipt (+92 342-6300002)"}
                    </span>
                  </a>
                </div>

                {/* Tracking & Invoice Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#907553] text-[#FAF7F2] text-xs uppercase font-sans tracking-wider hover:bg-[#A38662] transition-colors cursor-pointer"
                  >
                    <FileText size={14} />
                    <span>Print / Save Invoice</span>
                  </button>

                  <Link
                    href={`/track-order?order=${confirmedOrderNumber}&phone=${customerPhone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#151007] text-[#FAF7F2] text-xs uppercase font-sans tracking-wider hover:bg-[#3A2E21] transition-colors"
                  >
                    <Truck size={14} />
                    <span>Track Order Live</span>
                  </Link>
                </div>

                <div className="pt-2">
                  <Link
                    href="/"
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setOrderPlaced(false);
                      setConfirmedPayable(0);
                      setWhatsappUrl("");
                      setOrderSummaryAmounts({ total: 0, advance: 0, remaining: 0 });
                    }}
                    className="text-xs font-sans text-[#3A2E21]/70 underline hover:text-[#151007]"
                  >
                    Return to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM */
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-3">
                  <div>
                    <p className="text-[10px] uppercase font-sans tracking-wider text-[#907553]">
                      OFFICIAL ATELIER CHECKOUT
                    </p>
                    <h3
                      className="text-xl sm:text-2xl font-serif text-[#151007]"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      Customer &amp; Shipping Details
                    </h3>
                    <p className="text-[10px] text-[#3A2E21]/70 font-sans mt-0.5">
                      {isAuthenticated
                        ? `Logged in as ${user?.name}`
                        : "Guest Checkout • 100% Secure database record"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="text-xs font-sans uppercase tracking-widest text-[#3A2E21] hover:text-[#907553] cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                        Email Address (For Receipt) *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. ayesha@example.com"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                        WhatsApp / Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="e.g. 0300-1234567"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                      />
                    </div>
                  </div>

                  {/* City & Province */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        placeholder="e.g. Lahore / Karachi / Islamabad"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                        Province / Region
                      </label>
                      <select
                        value={customerProvince}
                        onChange={(e) => setCustomerProvince(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Khyber Pakhtunkhwa">KPK</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Islamabad Capital">Islamabad</option>
                        <option value="Azad Kashmir">Azad Kashmir</option>
                      </select>
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Complete Street &amp; House Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House / Apartment number, Street name, Block / Area..."
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                    />
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Tailoring Notes / Special Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, extra sleeve margin..."
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 focus:outline-none focus:border-[#907553]"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Select Payment Method *
                    </label>
                    <div className="space-y-2.5">
                      {/* Option 1: Cash on Delivery */}
                      <label
                        className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                          paymentMethod === "Cash on Delivery (COD)"
                            ? "bg-[#FAF7F2] border-[#907553] ring-1 ring-[#907553]"
                            : "bg-[#F2EAE0]/70 border-[#D8C9B6] hover:bg-[#F2EAE0]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "Cash on Delivery (COD)"}
                          onChange={() => setPaymentMethod("Cash on Delivery (COD)")}
                          className="accent-[#151007] mt-0.5"
                        >
                        </input>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#151007] text-xs">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#907553]/15 text-[#907553] font-semibold">
                              Advance Required
                            </span>
                          </div>
                          <p className="text-[11px] text-[#3A2E21]/80 mt-1 leading-relaxed">
                            Pay the remaining amount to courier rider at your doorstep upon delivery.
                          </p>
                        </div>
                      </label>

                      {/* Option 2: Bank Transfer */}
                      <label
                        className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                          paymentMethod === "Direct Bank Transfer"
                            ? "bg-[#FAF7F2] border-[#907553] ring-1 ring-[#907553]"
                            : "bg-[#F2EAE0]/70 border-[#D8C9B6] hover:bg-[#F2EAE0]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "Direct Bank Transfer"}
                          onChange={() => setPaymentMethod("Direct Bank Transfer")}
                          className="accent-[#151007] mt-0.5"
                        >
                        </input>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#151007] text-xs">
                              Direct Bank Transfer (Meezan Bank)
                            </span>
                            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold">
                              Instant Priority
                            </span>
                          </div>
                          <p className="text-[11px] text-[#3A2E21]/80 mt-1 leading-relaxed">
                            Transfer directly from any Banking App, EasyPaisa, or JazzCash to our Meezan Bank account and share the receipt on WhatsApp.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* POLICY ALERT: 50% ADVANCE PAYMENT NOTICE (FOR COD) */}
                    {paymentMethod === "Cash on Delivery (COD)" && (
                      <div className="mt-3 p-3.5 bg-[#FFF8EE] border-l-3 border-[#907553] border border-[#D8C9B6]/80 text-[#151007] space-y-2.5 animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#907553]">
                          <AlertCircle size={14} />
                          <span>Important Order Confirmation Policy:</span>
                        </div>
                        <p className="text-[11px] text-[#3A2E21] leading-relaxed">
                          All AOUJ bespoke creations and luxury pret articles are handcrafted exclusively by master artisans. <strong>To confirm and dispatch your order, a 50% advance deposit ({formatPrice(advancePaidAmount)}) is required.</strong>
                        </p>
                        <p className="text-[11px] text-[#665a4a] leading-normal pt-1.5 border-t border-[#D8C9B6]/60">
                          The remaining balance ({formatPrice(remainingPayable)}) is payable in cash to the courier rider upon delivery. Please transfer the 50% advance to our official Meezan Bank account:
                        </p>

                        {/* Account Box inside COD */}
                        <div className="bg-[#FAF7F2] p-2.5 border border-[#D8C9B6] space-y-1.5 text-[11px]">
                          <div className="flex justify-between items-center">
                            <strong className="text-xs text-[#151007]">Meezan Bank Limited</strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("40010107788132", "cod_meezan")}
                              className="text-[10px] text-[#907553] hover:text-[#151007] flex items-center gap-1 font-mono uppercase cursor-pointer"
                            >
                              {copiedKey === "cod_meezan" ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                              <span>{copiedKey === "cod_meezan" ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p className="text-[#3A2E21]">Account Title: <strong>Muhammad Adnan Choudhry</strong></p>
                          <p className="text-[#3A2E21] font-mono">Account Number: <strong>40010107788132</strong></p>
                          <p className="text-[10px] text-[#907553] pt-0.5">
                            💡 You can transfer the 50% advance via any Mobile Banking App, EasyPaisa, or JazzCash by selecting &quot;Bank Transfer &gt; Meezan Bank&quot;.
                          </p>
                          <div className="pt-2 border-t border-[#D8C9B6]/60 flex items-center gap-1 text-[11px] text-emerald-900 font-medium">
                            <MessageCircle size={13} className="text-emerald-700 shrink-0" />
                            <span>Share Payment Receipt on WhatsApp: <strong>+92 342-6300002 (Adnan)</strong></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BANK DETAILS BOX (FOR DIRECT BANK TRANSFER) */}
                    {paymentMethod === "Direct Bank Transfer" && (
                      <div className="mt-3 p-3.5 bg-[#F7F1E8] border border-[#907553] text-[#151007] space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-2">
                          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#907553] flex items-center gap-1.5">
                            <Building2 size={13} />
                            Official Atelier Bank Account
                          </span>
                          <span className="text-[10px] text-[#3A2E21]/70 font-sans">
                            Instant Verification
                          </span>
                        </div>

                        {/* Official Meezan Bank Account */}
                        <div className="bg-[#FAF7F2] p-3 border border-[#D8C9B6] space-y-1.5 text-[11px]">
                          <div className="flex justify-between items-center">
                            <strong className="text-xs text-[#151007]">Meezan Bank Limited</strong>
                            <button
                              type="button"
                              onClick={() => copyToClipboard("40010107788132", "meezan_direct")}
                              className="text-[10px] text-[#907553] hover:text-[#151007] flex items-center gap-1 font-mono uppercase cursor-pointer"
                            >
                              {copiedKey === "meezan_direct" ? <Check size={11} className="text-emerald-600" /> : <Copy size={11} />}
                              <span>{copiedKey === "meezan_direct" ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p className="text-[#3A2E21]">
                            Account Title: <strong className="text-sm text-[#151007]">Muhammad Adnan Choudhry</strong>
                          </p>
                          <p className="text-[#3A2E21] font-mono text-xs">
                            Account Number: <strong className="text-sm text-[#151007]">40010107788132</strong>
                          </p>
                          <div className="pt-1.5 border-t border-[#D8C9B6]/60 text-[10.5px] text-[#665a4a] leading-relaxed">
                            💡 <strong>To transfer via EasyPaisa, JazzCash, or any Banking App:</strong>
                            <br />
                            Open your App &gt; Select <strong>&quot;Bank Transfer&quot;</strong> &gt; Select <strong>&quot;Meezan Bank&quot;</strong> &gt; Enter Account Number <strong>40010107788132</strong>.
                          </div>
                        </div>

                        {/* WhatsApp Verification Step */}
                        <div className="p-2.5 bg-[#E7F6DF] border border-emerald-300 text-[11px] text-emerald-950 flex items-start gap-2">
                          <MessageCircle size={15} className="shrink-0 text-emerald-700 mt-0.5" />
                          <p className="leading-snug">
                            After transferring the payment, please share a screenshot or transfer receipt along with your Order Reference to our official WhatsApp Concierge at <strong>+92 342-6300002 (Adnan)</strong> for immediate verification and expedited dispatch.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Summary & Exchange Guarantee Notice */}
                <div className="pt-2 border-t border-[#D8C9B6] space-y-2">
                  <div className="flex justify-between items-center text-sm font-sans font-medium">
                    <span>Payable Amount:</span>
                    <span className="text-base text-[#151007] font-semibold">
                      {formatPrice(finalPayable)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-sans text-[#3A2E21]/80">
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={13} className="text-[#907553]" /> 72-Hours Exchange Protection
                    </span>
                    <ReturnExchangeModal />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full py-3.5 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans uppercase tracking-widest font-medium transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPlacingOrder ? "SAVING ORDER TO DATABASE..." : "CONFIRM & PLACE ORDER"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Instant Printable Invoice Modal */}
      {showInvoiceModal && placedInvoiceOrder && (
        <OrderInvoiceModal
          order={placedInvoiceOrder}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      <Footer />
    </div>
  );
}
