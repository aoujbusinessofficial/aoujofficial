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
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("Lahore");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery (COD)");

  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.phone && !customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Handle promo code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const cleaned = promoCode.trim().toUpperCase();
    if (cleaned === "AOUJ10" || cleaned === "WELCOME10") {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      setPromoError("Invalid promotional privilege code. Try code: AOUJ10");
    }
  };

  const finalPayable = Math.max(0, grandTotal - promoDiscount);

  // Free shipping progress calculation (Free above PKR 5,000)
  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) return;

    setIsPlacingOrder(true);
    try {
      const res = await placeOrder({
        customerName,
        customerEmail: user?.email,
        customerPhone,
        customerCity,
        customerAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        discountAmount: promoDiscount,
        grandTotal: finalPayable,
        isGuest: !isAuthenticated,
        userId: null,
        items,
      });

      setConfirmedOrderNumber(res.orderNumber);
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
              {/* Free Shipping Progress Notification */}
              <div className="p-4 bg-[#F2EAE0] border border-[#D8C9B6] space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-medium text-[#151007] flex items-center gap-1.5">
                    <Truck size={15} className="text-[#907553]" />
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-[#3F6212] font-semibold">
                        Congratulations! You unlocked FREE SHIPPING across Pakistan.
                      </span>
                    ) : (
                      <span>
                        Add <strong>{formatPrice(amountToFreeShipping)}</strong> more to qualify for FREE SHIPPING!
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#3A2E21]/70">{Math.round(progressPercent)}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#FAF7F2] h-1.5 overflow-hidden">
                  <div
                    className="bg-[#907553] h-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
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
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-[#3F6212] font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-[#3F6212] font-medium">
                    <span>Privilege Code Discount (10%)</span>
                    <span>-{formatPrice(promoDiscount)}</span>
                  </div>
                )}

                <div className="border-t border-[#D8C9B6] pt-3 flex justify-between text-sm sm:text-base font-medium text-[#151007]">
                  <span>Estimated Total</span>
                  <span>{formatPrice(finalPayable)}</span>
                </div>
                <p className="text-[10px] text-[#3A2E21]/60 italic">
                  Taxes and tailoring included. Delivery within 2-4 working days across Pakistan.
                </p>
              </div>

              {/* Privilege Promo Code Box */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-2 border-t border-[#D8C9B6]/60">
                <label className="block text-[10px] uppercase font-sans tracking-wider text-[#3A2E21]">
                  Privilege Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. AOUJ10"
                    className="flex-1 bg-[#FAF7F2] border border-[#D8C9B6] text-xs px-3 py-2 text-[#211A12] focus:outline-none focus:border-[#907553] uppercase font-sans"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#151007] hover:text-[#FAF7F2] border border-[#D8C9B6] text-xs font-sans uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-[#3F6212] font-sans flex items-center gap-1">
                    <Tag size={12} /> Privilege code applied: 10% discount subtracted.
                  </p>
                )}
                {promoError && (
                  <p className="text-[11px] text-[#9E5B4B] font-sans">{promoError}</p>
                )}
              </form>

              {/* PROCEED TO CHECKOUT BUTTON */}
              <button
                type="button"
                onClick={() => setShowCheckoutModal(true)}
                className="w-full py-4 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={14} />
              </button>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 border-t border-[#D8C9B6]/60 text-[11px] font-sans text-[#3A2E21]/80">
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#907553]" />
                  <span>Free shipping on orders above PKR 5,000</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} className="text-[#907553]" />
                  <span>14-day hassle-free exchange guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#907553]" />
                  <span>Cash on Delivery (COD) available nationwide</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
                  Thank you, <strong>{customerName}</strong>! Your order for AOUJ heirloom pieces has been received. Our concierge team will call you on <strong>{customerPhone}</strong> to confirm dispatch and custom measurements.
                </p>
                {confirmedOrderNumber && (
                  <div className="p-2.5 bg-[#FAF7F2] border border-[#907553] text-xs font-sans text-[#151007] max-w-sm mx-auto">
                    Order Reference: <strong className="font-mono text-[#907553]">{confirmedOrderNumber}</strong>
                  </div>
                )}
                <div className="p-3 bg-[#F2EAE0] border border-[#D8C9B6] text-xs font-sans text-[#151007] max-w-sm mx-auto">
                  Payment Method: <strong>{paymentMethod}</strong>
                  <br />
                  Estimated Delivery: <strong>2 - 4 Working Days</strong>
                </div>
                <div className="pt-4">
                  <Link
                    href="/"
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setOrderPlaced(false);
                    }}
                    className="inline-block px-8 py-3.5 bg-[#151007] text-[#FAF7F2] text-xs uppercase font-sans tracking-widest hover:bg-[#3A2E21]"
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
                      FAST CHECKOUT
                    </p>
                    <h3
                      className="text-xl sm:text-2xl font-serif text-[#151007]"
                      style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                    >
                      Delivery &amp; Customer Details
                    </h3>
                    <p className="text-[10px] text-[#3A2E21]/70 font-sans mt-0.5">
                      {isAuthenticated
                        ? `Logged in as ${user?.name}`
                        : "Guest Checkout • No registration needed"}
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                        Mobile Number *
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
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Complete Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House / Apartment number, Street, Area..."
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2.5 focus:outline-none focus:border-[#907553]"
                    />
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#3A2E21] mb-1 font-medium">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      {[
                        "Cash on Delivery (COD)",
                        "Direct Bank Transfer",
                        "EasyPaisa / JazzCash",
                      ].map((method) => (
                        <label
                          key={method}
                          className="flex items-center gap-2.5 p-2.5 bg-[#F2EAE0] border border-[#D8C9B6] cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="accent-[#151007]"
                          />
                          <span className="font-medium text-[#151007]">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="pt-2 border-t border-[#D8C9B6] flex justify-between items-center text-sm font-sans font-medium">
                  <span>Payable Amount:</span>
                  <span className="text-base text-[#151007] font-semibold">
                    {formatPrice(finalPayable)}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full py-3.5 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans uppercase tracking-widest font-medium transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isPlacingOrder ? "SAVING ORDER TO DATABASE..." : "CONFIRM & PLACE ORDER"}
                  </button>
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
