"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { allProducts, Product } from "@/data/products";
import {
  ChevronRight,
  Heart,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ShoppingBag,
  Info,
  Sparkles,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = allProducts.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  // Custom size form state
  const isCustomSize = selectedSize.toLowerCase().includes("custom");
  const [customAge, setCustomAge] = useState("");
  const [customChest, setCustomChest] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [customWaist, setCustomWaist] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  const handleAddToBag = () => {
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 4000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-8 overflow-x-auto whitespace-nowrap"
        >
          <Link href="/" className="hover:text-[#907553] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/products" className="hover:text-[#907553] transition-colors">
            Collections
          </Link>
          <ChevronRight size={12} />
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-[#907553] transition-colors uppercase font-medium text-[#907553]"
          >
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-[#151007] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Grid: Left Image Gallery, Right Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-26 overflow-hidden bg-[#F2EAE0] transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "ring-2 ring-[#907553] opacity-100"
                      : "opacity-70 hover:opacity-100 border border-[#D8C9B6]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>

            {/* Main Featured Image */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] flex-1 w-full overflow-hidden bg-[#F2EAE0]">
              <Image
                src={product.images[activeImageIndex]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-top transition-transform duration-500 hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] uppercase font-sans tracking-[0.2em] bg-[#151007] text-[#FAF7F2] font-medium">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Product Purchasing Column */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              <p className="text-[11px] font-sans font-medium uppercase tracking-[0.24em] text-[#907553] mb-1.5">
                {product.category} COLLECTION
              </p>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl text-[#151007] font-normal leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl sm:text-2xl font-sans font-medium text-[#151007]">
                  Rs. {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-sans text-[#3A2E21]/60 line-through">
                    Rs. {product.originalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                )}
                <span className="text-[11px] font-sans px-2 py-0.5 bg-[#F2EAE0] text-[#907553] font-medium border border-[#D8C9B6]">
                  Inclusive of all taxes
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2 pt-2 border-t border-[#D8C9B6]/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-[0.16em] text-[#151007] font-medium">
                  Color: <span className="text-[#907553]">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-7 h-7 rounded-full p-[2px] transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? "ring-2 ring-[#151007] scale-110"
                        : "hover:scale-105"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block w-full h-full rounded-full border border-black/15"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTION BY AGE OR CUSTOMIZED SIZING */}
            <div className="space-y-3 pt-2 border-t border-[#D8C9B6]/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#151007] font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#907553]" />
                  {product.sizeType === "age"
                    ? "Select Kid's Age / Size:"
                    : product.sizeType === "family"
                    ? "Select Family Set Configuration:"
                    : "Select Size:"}
                </span>

                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="text-[11px] font-sans text-[#907553] hover:text-[#151007] flex items-center gap-1 underline cursor-pointer"
                >
                  <Ruler size={13} />
                  <span>Size &amp; Age Guide</span>
                </button>
              </div>

              {/* Age & Size Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  const isCustom = sz.toLowerCase().includes("custom");

                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 px-3 text-xs font-sans text-center transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? "bg-[#151007] text-[#FAF7F2] border-[#151007] font-medium shadow-sm"
                          : isCustom
                          ? "bg-[#F7F1E8] text-[#907553] border-[#907553]/60 hover:border-[#151007]"
                          : "bg-[#FAF7F2] text-[#211A12] border-[#D8C9B6] hover:border-[#907553]"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* CUSTOMIZED MEASUREMENT FIELDS (shown when Customized Size is selected) */}
              {isCustomSize && (
                <div className="p-4 bg-[#F2EAE0] border border-[#907553]/40 space-y-3 mt-3 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-[#151007]">
                    <Sparkles size={14} className="text-[#907553]" />
                    <span>Bespoke / Customized Sizing Details</span>
                  </div>
                  <p className="text-[11px] font-sans text-[#3A2E21]/80">
                    Provide child exact age or body measurements in inches. Our master atelier will hand-tailor this piece specifically for your order.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                        Exact Age / Height
                      </label>
                      <input
                        type="text"
                        value={customAge}
                        onChange={(e) => setCustomAge(e.target.value)}
                        placeholder="e.g. 2.5 Years / 36 inches"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                        Chest (Inches)
                      </label>
                      <input
                        type="text"
                        value={customChest}
                        onChange={(e) => setCustomChest(e.target.value)}
                        placeholder="e.g. 22 in"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                        Shirt Length (Inches)
                      </label>
                      <input
                        type="text"
                        value={customLength}
                        onChange={(e) => setCustomLength(e.target.value)}
                        placeholder="e.g. 24 in"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                        Waist / Trouser Length
                      </label>
                      <input
                        type="text"
                        value={customWaist}
                        onChange={(e) => setCustomWaist(e.target.value)}
                        placeholder="e.g. 20 in"
                        className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                      Custom Fitting Notes / Request
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Keep extra margin for growth, loose comfortable fit"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-[#D8C9B6]/50">
              <div className="flex items-center gap-3">
                <span className="text-xs font-sans uppercase tracking-[0.16em] text-[#151007]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#D8C9B6] bg-[#FAF7F2]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[#F2EAE0] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-sans font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-sm hover:bg-[#F2EAE0] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full py-3.5 px-6 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="w-full py-3.5 px-6 bg-[#907553] text-[#FAF7F2] hover:bg-[#7D6444] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Added to Bag confirmation banner */}
              {addedToBag && (
                <div className="p-3 bg-[#EAE2D5] border border-[#907553] text-[#151007] flex items-center justify-between text-xs font-sans animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#907553]" />
                    <span>
                      Added <strong>{product.name}</strong> ({selectedSize}) to your bag!
                    </span>
                  </div>
                  <Link
                    href="#cart"
                    className="underline font-medium text-[#907553] hover:text-[#151007]"
                  >
                    View Bag
                  </Link>
                </div>
              )}
            </div>

            {/* Service & Delivery Notes */}
            <div className="border-t border-[#D8C9B6]/60 pt-4 space-y-2.5 text-xs font-sans text-[#3A2E21]/80">
              <div className="flex items-center gap-2.5">
                <Truck size={16} className="text-[#907553]" />
                <span>Free delivery across Pakistan on orders above PKR 5,000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={16} className="text-[#907553]" />
                <span>Hassle-free 14-day exchange policy for size adjustments</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#907553]" />
                <span>100% authentic pure fabric &amp; handloom assurance</span>
              </div>
            </div>

            {/* Product Details & Fabric Specs */}
            <div className="border-t border-[#D8C9B6]/60 pt-5 space-y-4">
              <div>
                <h3 className="text-xs font-sans font-medium uppercase tracking-[0.18em] text-[#151007] mb-2">
                  Fabric &amp; Craftsmanship
                </h3>
                <p className="text-xs font-sans font-light leading-relaxed text-[#3A2E21]">
                  {product.description}
                </p>
                <p className="text-xs font-sans font-medium text-[#907553] mt-2">
                  Fabric Composition: {product.fabric}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007] mb-1.5">
                  Package Details:
                </h4>
                <ul className="list-disc list-inside text-xs font-sans space-y-1 text-[#3A2E21]/80">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#D8C9B6]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#907553]">
                  COMPLEMENTARY EDITS
                </p>
                <h2
                  className="text-2xl sm:text-3xl text-[#151007] font-normal"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  You May Also Admire
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs uppercase tracking-widest text-[#151007] hover:text-[#907553] font-sans underline"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* SIZE & AGE GUIDE MODAL */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#D8C9B6] pb-3 mb-4">
              <h3
                className="text-xl sm:text-2xl font-serif text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                AOUJ Size &amp; Age Guide
              </h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-xs font-sans uppercase tracking-widest text-[#3A2E21] hover:text-[#907553] cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {product.sizeType === "age" ? (
              <div className="space-y-4 text-xs font-sans text-[#211A12]">
                <p className="text-[#3A2E21]/80">
                  Our children&apos;s silhouettes are crafted with generous seam margins and breathable linings so kids stay comfortable through active play and growth spurts.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-[#D8C9B6] text-center text-xs">
                    <thead>
                      <tr className="bg-[#F2EAE0] text-[#151007]">
                        <th className="p-2 border border-[#D8C9B6]">Age Size</th>
                        <th className="p-2 border border-[#D8C9B6]">Chest (in)</th>
                        <th className="p-2 border border-[#D8C9B6]">Length (in)</th>
                        <th className="p-2 border border-[#D8C9B6]">Trouser (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">1 Year</td>
                        <td className="p-2 border border-[#D8C9B6]">20 - 21</td>
                        <td className="p-2 border border-[#D8C9B6]">17 - 18</td>
                        <td className="p-2 border border-[#D8C9B6]">16 - 17</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">2 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">22 - 23</td>
                        <td className="p-2 border border-[#D8C9B6]">19 - 20</td>
                        <td className="p-2 border border-[#D8C9B6]">18 - 19</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">2-3 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">23 - 24</td>
                        <td className="p-2 border border-[#D8C9B6]">21 - 22</td>
                        <td className="p-2 border border-[#D8C9B6]">20 - 21</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">3-4 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">24 - 25</td>
                        <td className="p-2 border border-[#D8C9B6]">23 - 24</td>
                        <td className="p-2 border border-[#D8C9B6]">22 - 23</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">4-5 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">25 - 26</td>
                        <td className="p-2 border border-[#D8C9B6]">25 - 26</td>
                        <td className="p-2 border border-[#D8C9B6]">24 - 25</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">5-6 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">26 - 27</td>
                        <td className="p-2 border border-[#D8C9B6]">27 - 28</td>
                        <td className="p-2 border border-[#D8C9B6]">26 - 27</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[#F2EAE0] border border-[#907553]/30">
                  <p className="text-[11px] text-[#3A2E21]">
                    <strong>Need a specific custom length or fit?</strong> Select &quot;Customized Size&quot; on the product page and enter your child&apos;s exact measurements. We craft it without extra charges!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-sans text-[#211A12]">
                <p className="text-[#3A2E21]/80">
                  Standard women sizing in inches. Custom tailored orders available on request.
                </p>
                <table className="w-full border-collapse border border-[#D8C9B6] text-center text-xs">
                  <thead>
                    <tr className="bg-[#F2EAE0] text-[#151007]">
                      <th className="p-2 border border-[#D8C9B6]">Size</th>
                      <th className="p-2 border border-[#D8C9B6]">Chest</th>
                      <th className="p-2 border border-[#D8C9B6]">Waist</th>
                      <th className="p-2 border border-[#D8C9B6]">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#D8C9B6] font-medium">XS</td>
                      <td className="p-2 border border-[#D8C9B6]">36</td>
                      <td className="p-2 border border-[#D8C9B6]">32</td>
                      <td className="p-2 border border-[#D8C9B6]">38</td>
                    </tr>
                    <tr className="bg-[#FAF7F2]">
                      <td className="p-2 border border-[#D8C9B6] font-medium">S</td>
                      <td className="p-2 border border-[#D8C9B6]">38</td>
                      <td className="p-2 border border-[#D8C9B6]">34</td>
                      <td className="p-2 border border-[#D8C9B6]">40</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#D8C9B6] font-medium">M</td>
                      <td className="p-2 border border-[#D8C9B6]">41</td>
                      <td className="p-2 border border-[#D8C9B6]">37</td>
                      <td className="p-2 border border-[#D8C9B6]">43</td>
                    </tr>
                    <tr className="bg-[#FAF7F2]">
                      <td className="p-2 border border-[#D8C9B6] font-medium">L</td>
                      <td className="p-2 border border-[#D8C9B6]">44</td>
                      <td className="p-2 border border-[#D8C9B6]">40</td>
                      <td className="p-2 border border-[#D8C9B6]">46</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#D8C9B6] font-medium">XL</td>
                      <td className="p-2 border border-[#D8C9B6]">47</td>
                      <td className="p-2 border border-[#D8C9B6]">43</td>
                      <td className="p-2 border border-[#D8C9B6]">49</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="px-6 py-2.5 bg-[#151007] text-[#FAF7F2] text-xs uppercase tracking-widest font-sans cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
