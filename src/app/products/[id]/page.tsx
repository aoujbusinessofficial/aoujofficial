"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductReviews } from "@/components/product/ProductReviews";
import { WishlistButton } from "@/components/product/WishlistButton";
import { RecentlyViewed, recordProductView } from "@/components/product/RecentlyViewed";
import { FabricGuaranteeBadge } from "@/components/ui/FabricGuaranteeBadge";
import { ReturnExchangeModal } from "@/components/ui/ReturnExchangeModal";
import { fetchProductByIdOrSlug, fetchCustomerProducts } from "@/services/catalogService";
import { getProductSchema } from "@/lib/seo/structuredData";
import {
  allProducts,
  Product,
  standardWomenSizes,
  standardGirlsSizes,
} from "@/data/products";
import {
  ChevronRight,
  ChevronLeft,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ShoppingBag,
  Sparkles,
  Users,
  Heart,
  Star,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Interactive Zoom & Lightbox State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  // Sizing selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedWomanSize, setSelectedWomanSize] = useState<string>("Medium (M)");
  const [selectedGirlSize, setSelectedGirlSize] = useState<string>("3-4 Years");
  const [includeGirlPiece, setIncludeGirlPiece] = useState<boolean>(true);
  const [selectedSingleSize, setSelectedSingleSize] = useState<string>("Medium (M)");
  const [quantity, setQuantity] = useState(1);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [sizeModalTab, setSizeModalTab] = useState<"girls" | "women">("girls");
  const [addedToBag, setAddedToBag] = useState(false);

  // Custom size form state
  const [customAge, setCustomAge] = useState("");
  const [customChest, setCustomChest] = useState("");
  const [customLength, setCustomLength] = useState("");
  const [customWaist, setCustomWaist] = useState("");
  const [customNotes, setCustomNotes] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProductData() {
      setIsLoading(true);
      // Fetch strictly from live database collection (no demo mock fallback)
      const p = await fetchProductByIdOrSlug(resolvedParams.id);

      if (isMounted) {
        setProduct(p);
        if (p) {
          // Record product view for Recently Viewed carousel
          recordProductView(p);

          setSelectedColor(p.colors[0]?.name || "Ivory");
          setSelectedSingleSize(
            p.sizes[0] || (p.category === "girls" ? "3-4 Years" : "Medium (M)")
          );

          // Fetch related pieces ("Complete the Look" / "You May Also Like")
          const allItems = await fetchCustomerProducts();
          const related = allItems
            .filter((item) => item.id !== p!.id)
            .sort((a, b) => (a.category === p!.category ? -1 : 1))
            .slice(0, 4);
          setRelatedProducts(related);
        }
        setIsLoading(false);
      }
    }

    loadProductData();
    return () => {
      isMounted = false;
    };
  }, [resolvedParams.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#907553] border-t-transparent rounded-full animate-spin" />
          <p className="font-serif text-lg text-[#151007]">Loading Atelier Creation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-4 my-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#907553] font-semibold">
            ATELIER ARCHIVE
          </p>
          <h2
            className="text-3xl text-[#151007]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Product Not Found
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 leading-relaxed">
            The requested design may have been archived or is no longer in the active catalog.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-[#151007] text-[#FAF7F2] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#907553] transition-colors"
          >
            View Available Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isCustomSelected =
    product.category === "family"
      ? selectedWomanSize.toLowerCase().includes("custom") ||
        (includeGirlPiece && selectedGirlSize.toLowerCase().includes("custom"))
      : selectedSingleSize.toLowerCase().includes("custom");

  const selectedSizeDescription =
    product.category === "family"
      ? includeGirlPiece
        ? `Woman: ${selectedWomanSize} + Girl: ${selectedGirlSize}`
        : `Woman Only: ${selectedWomanSize}`
      : selectedSingleSize;

  const currentPrice =
    product.category === "family" && !includeGirlPiece
      ? Math.round(product.price * 0.65)
      : product.price;

  const handleAddToBag = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      color: selectedColor,
      colorHex: product.colors.find((c) => c.name === selectedColor)?.hex,
      category: product.category,
      sizeDescription: selectedSizeDescription,
      womanSize:
        product.category === "family"
          ? selectedWomanSize
          : product.category === "women"
          ? selectedSingleSize
          : undefined,
      girlSize:
        product.category === "family"
          ? includeGirlPiece
            ? selectedGirlSize
            : undefined
          : product.category === "girls"
          ? selectedSingleSize
          : undefined,
      includeGirlPiece: product.category === "family" ? includeGirlPiece : undefined,
      isCustomSize: isCustomSelected,
      customMeasurements: isCustomSelected
        ? {
            ageOrHeight: customAge,
            chest: customChest,
            shirtLength: customLength,
            waistOrTrouser: customWaist,
            notes: customNotes,
          }
        : undefined,
      quantity: quantity,
    });
    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 5000);
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      color: selectedColor,
      colorHex: product.colors.find((c) => c.name === selectedColor)?.hex,
      category: product.category,
      sizeDescription: selectedSizeDescription,
      womanSize:
        product.category === "family"
          ? selectedWomanSize
          : product.category === "women"
          ? selectedSingleSize
          : undefined,
      girlSize:
        product.category === "family"
          ? includeGirlPiece
            ? selectedGirlSize
            : undefined
          : product.category === "girls"
          ? selectedSingleSize
          : undefined,
      includeGirlPiece: product.category === "family" ? includeGirlPiece : undefined,
      isCustomSize: isCustomSelected,
      customMeasurements: isCustomSelected
        ? {
            ageOrHeight: customAge,
            chest: customChest,
            shirtLength: customLength,
            waistOrTrouser: customWaist,
            notes: customNotes,
          }
        : undefined,
      quantity: quantity,
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      {/* Product JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProductSchema(product)),
        }}
      />

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

            {/* Main Featured Image with Interactive Zoom */}
            <div
              onMouseEnter={() => setIsHoverZooming(true)}
              onMouseLeave={() => setIsHoverZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[3/4] sm:aspect-[4/5] flex-1 w-full overflow-hidden bg-[#F2EAE0] cursor-zoom-in group select-none border border-[#D8C9B6]/60"
            >
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={`object-cover object-top transition-transform duration-150 ease-out ${
                  isHoverZooming ? "scale-225" : "scale-100 group-hover:scale-102"
                }`}
                style={
                  isHoverZooming
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : undefined
                }
                unoptimized
              />

              {product.badge && (
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] uppercase font-sans tracking-[0.2em] bg-[#151007] text-[#FAF7F2] font-medium shadow-sm">
                  {product.badge}
                </span>
              )}

              {/* Top-Right Expand Icon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-[#FAF7F2]/90 hover:bg-[#151007] hover:text-[#FAF7F2] text-[#151007] rounded-none border border-[#D8C9B6] backdrop-blur-sm transition-colors cursor-pointer shadow-sm"
                title="Click to Zoom Fullscreen"
              >
                <Maximize2 size={15} />
              </button>

              {/* Bottom Interactive Hover & Zoom Pill */}
              <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between pointer-events-none">
                <span className="bg-[#151007]/80 backdrop-blur-md text-[#FAF7F2] text-[10px] font-sans px-2.5 py-1 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <ZoomIn size={12} className="text-[#D8C9B6]" />
                  <span>Hover to zoom • Click to expand ({activeImageIndex + 1}/{product.images.length})</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Purchasing Column */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            <div>
              <p className="text-[11px] font-sans font-medium uppercase tracking-[0.24em] text-[#907553] mb-1.5">
                {product.category === "family"
                  ? "FAMILY & MATCHING EDIT"
                  : `${product.category} COLLECTION`}
              </p>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl text-[#151007] font-normal leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {product.name}
              </h1>

              {/* Star Rating Badge linking to Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <a
                  href="#reviews"
                  className="flex items-center gap-1.5 text-xs font-sans text-[#907553] hover:text-[#151007] transition-colors cursor-pointer group"
                >
                  <div className="flex text-[#907553]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-[#907553]" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#151007]">4.9</span>
                  <span className="text-[#3A2E21]/60 underline underline-offset-2 group-hover:text-[#907553]">
                    (Client Reflections)
                  </span>
                </a>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xl sm:text-2xl font-sans font-medium text-[#151007]">
                  Rs. {currentPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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

            {/* ========================================================= */}
            {/* SIZING SECTION: GIRLS, WOMEN, OR DUAL FAMILY SIZING */}
            {/* ========================================================= */}

            {product.category === "family" ? (
              /* DUAL SIZE SELECTOR FOR FAMILY (WOMAN + GIRL) */
              <div className="space-y-5 pt-3 border-t border-[#D8C9B6]/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#151007] font-semibold flex items-center gap-1.5">
                    <Users size={15} className="text-[#907553]" />
                    Family Sizing (Select Both Sizes)
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSizeModalTab("women");
                      setShowSizeModal(true);
                    }}
                    className="text-[11px] font-sans text-[#907553] hover:text-[#151007] flex items-center gap-1 underline cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Size Guide</span>
                  </button>
                </div>

                {/* 1. WOMAN'S SIZE SELECTOR */}
                <div className="bg-[#FAF7F2] p-3.5 border border-[#D8C9B6] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-medium text-[#151007] uppercase tracking-wider">
                      1. Woman&apos;s Size: <span className="text-[#907553]">{selectedWomanSize}</span>
                    </label>
                    <span className="text-[10px] text-[#3A2E21]/70 font-sans">Small to Extra Large</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {standardWomenSizes.map((sz) => {
                      const isSelected = selectedWomanSize === sz;
                      const isCustom = sz.toLowerCase().includes("custom");
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedWomanSize(sz)}
                          className={`py-2 px-2.5 text-xs font-sans text-center transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#151007] text-[#FAF7F2] border-[#151007] font-medium"
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
                </div>

                {/* 2. GIRL'S / DAUGHTER'S SIZE SELECTOR (OPTIONAL / INCLUDED) */}
                <div className="bg-[#FAF7F2] p-3.5 border border-[#D8C9B6] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-sans font-medium text-[#151007] uppercase tracking-wider flex items-center gap-1.5">
                      <span>2. Girl&apos;s / Daughter&apos;s Size:</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIncludeGirlPiece(true)}
                        className={`text-[11px] px-2 py-0.5 border font-sans cursor-pointer ${
                          includeGirlPiece
                            ? "bg-[#907553] text-[#FAF7F2] border-[#907553]"
                            : "bg-[#FAF7F2] text-[#3A2E21] border-[#D8C9B6]"
                        }`}
                      >
                        Include Girl
                      </button>
                      <button
                        type="button"
                        onClick={() => setIncludeGirlPiece(false)}
                        className={`text-[11px] px-2 py-0.5 border font-sans cursor-pointer ${
                          !includeGirlPiece
                            ? "bg-[#151007] text-[#FAF7F2] border-[#151007]"
                            : "bg-[#FAF7F2] text-[#3A2E21] border-[#D8C9B6]"
                        }`}
                      >
                        Woman Only
                      </button>
                    </div>
                  </div>

                  {includeGirlPiece ? (
                    <>
                      <p className="text-[11px] font-sans text-[#3A2E21]/70">
                        Available from <strong>New Born (0-3 Months)</strong> up to <strong>Extra Large (Teen)</strong>:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                        {standardGirlsSizes.map((sz) => {
                          const isSelected = selectedGirlSize === sz;
                          const isCustom = sz.toLowerCase().includes("custom");
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setSelectedGirlSize(sz)}
                              className={`py-2 px-2 text-xs font-sans text-center transition-all border cursor-pointer ${
                                isSelected
                                  ? "bg-[#151007] text-[#FAF7F2] border-[#151007] font-medium"
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
                    </>
                  ) : (
                    <p className="text-xs font-sans text-[#907553] italic">
                      Daughter piece omitted. You will receive only the Woman&apos;s tailored outfit.
                    </p>
                  )}
                </div>
              </div>
            ) : product.category === "girls" ? (
              /* GIRLS SIZING (NEW BORN TO EXTRA LARGE) */
              <div className="space-y-3 pt-2 border-t border-[#D8C9B6]/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#151007] font-semibold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#907553]" />
                    Select Girl&apos;s Size (New Born to Extra Large):
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSizeModalTab("girls");
                      setShowSizeModal(true);
                    }}
                    className="text-[11px] font-sans text-[#907553] hover:text-[#151007] flex items-center gap-1 underline cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Age &amp; Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                  {standardGirlsSizes.map((sz) => {
                    const isSelected = selectedSingleSize === sz;
                    const isCustom = sz.toLowerCase().includes("custom");

                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSingleSize(sz)}
                        className={`py-2.5 px-2 text-xs font-sans text-center transition-all duration-200 border cursor-pointer ${
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
              </div>
            ) : (
              /* WOMEN'S SIZING (SMALL TO EXTRA LARGE) */
              <div className="space-y-3 pt-2 border-t border-[#D8C9B6]/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-[0.18em] text-[#151007] font-semibold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#907553]" />
                    Select Woman&apos;s Size (Small to Extra Large):
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSizeModalTab("women");
                      setShowSizeModal(true);
                    }}
                    className="text-[11px] font-sans text-[#907553] hover:text-[#151007] flex items-center gap-1 underline cursor-pointer"
                  >
                    <Ruler size={13} />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {standardWomenSizes.map((sz) => {
                    const isSelected = selectedSingleSize === sz;
                    const isCustom = sz.toLowerCase().includes("custom");

                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSingleSize(sz)}
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
              </div>
            )}

            {/* CUSTOMIZED MEASUREMENT FIELDS (shown when Customized Size is selected) */}
            {isCustomSelected && (
              <div className="p-4 bg-[#F2EAE0] border border-[#907553]/40 space-y-3 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-[#151007]">
                  <Sparkles size={14} className="text-[#907553]" />
                  <span>Bespoke / Customized Sizing Details</span>
                </div>
                <p className="text-[11px] font-sans text-[#3A2E21]/80">
                  Please provide body measurements or age details in inches. Our master atelier will hand-tailor your order with generous comfort margins.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                      Age or Height
                    </label>
                    <input
                      type="text"
                      value={customAge}
                      onChange={(e) => setCustomAge(e.target.value)}
                      placeholder="e.g. 3 Years or 5 ft 4 in"
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
                      placeholder="e.g. 24 in"
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
                      placeholder="e.g. 26 in"
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
                      placeholder="e.g. 22 in"
                      className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#3A2E21] mb-1">
                    Special Tailoring Notes
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="e.g. Keep 1.5 inch growth margin, loose straight fit"
                    className="w-full bg-[#FAF7F2] border border-[#D8C9B6] p-2 text-xs focus:outline-none focus:border-[#907553]"
                  />
                </div>
              </div>
            )}

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
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToBag}
                  className="sm:col-span-5 py-3.5 px-5 bg-[#151007] text-[#FAF7F2] hover:text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>ADD TO BAG</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="sm:col-span-5 py-3.5 px-5 bg-[#907553] text-[#FAF7F2] hover:text-[#FAF7F2] hover:bg-[#7D6444] text-xs font-sans font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>BUY NOW</span>
                </button>

                <div className="sm:col-span-2 flex items-center justify-center">
                  <WishlistButton
                    product={product}
                    size={17}
                    className="!w-full !h-full py-3.5 border border-[#D8C9B6] rounded-none hover:border-[#907553]"
                  />
                </div>
              </div>

              {/* Added to Bag confirmation banner */}
              {addedToBag && (
                <div className="p-3 bg-[#EAE2D5] border border-[#907553] text-[#151007] flex items-center justify-between text-xs font-sans animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#907553]" />
                    <span>
                      Added <strong>{product.name}</strong> ({selectedSizeDescription}) to your bag!
                    </span>
                  </div>
                  <Link
                    href="/cart"
                    className="underline font-medium text-[#907553] hover:text-[#151007]"
                  >
                    View Bag →
                  </Link>
                </div>
              )}
            </div>

            {/* Service & Delivery Notes */}
            <div className="border-t border-[#D8C9B6]/60 pt-4 space-y-3 text-xs font-sans text-[#3A2E21]/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#151007]">
                  <Truck size={16} className="text-[#907553] shrink-0" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Delivery &amp; Handcrafting Timeline (20-30 Working Days)
                  </span>
                </div>
                <p className="text-[11.5px] leading-relaxed text-[#3A2E21] pl-6 font-light">
                  Each Piece is meticulously hand made to fit your need of excellence. These are designed to be timeless, not only for a specific event. That craftsmanship takes time and responsibility. We aim to fulfill all orders within <strong>20-30 working days</strong>.
                </p>
                <p className="text-[11px] leading-relaxed text-[#665a4a] pl-6 italic">
                  Our Artisans only work Monday to Friday. Orders placed on Friday begin processing the following Monday. During peak periods and nationwide uncertainties, timelines may be slightly longer.
                </p>
              </div>

              <div className="pt-2 border-t border-[#D8C9B6]/40 flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#907553] shrink-0" />
                <span><strong>Cash on Delivery:</strong> Available across Pakistan (Fixed Rs. 350 shipping)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-[#907553] shrink-0" />
                  <span><strong>Exchange &amp; Return:</strong> Within 72 hours of delivery</span>
                </div>
                <ReturnExchangeModal />
              </div>
            </div>

            {/* Atelier 100% Original Fabric Guarantee Badge */}
            <div className="pt-2">
              <FabricGuaranteeBadge variant="full" />
            </div>

            {/* Product Details & Fabric Specs */}
            <div className="border-t border-[#D8C9B6]/60 pt-5 space-y-4">
              <div>
                <h3 className="text-xs font-sans font-medium uppercase tracking-[0.18em] text-[#151007] mb-2">
                  Fabric &amp; Craftsmanship
                </h3>
                {product.description && (
                  <p className="text-xs font-sans font-light leading-relaxed text-[#3A2E21]">
                    {product.description}
                  </p>
                )}
                {product.fabric && (
                  <p className="text-xs font-sans font-medium text-[#907553] mt-2">
                    Fabric Composition: {product.fabric}
                  </p>
                )}
              </div>

              {product.details && product.details.length > 0 && (
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
              )}
            </div>
          </div>
        </div>

        {/* CUSTOMER REVIEWS & STAR RATINGS */}
        <ProductReviews productId={product.id} productName={product.name} />

        {/* RELATED PRODUCTS ("Complete The Look" / "You May Also Like") */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#D8C9B6]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-sans text-[#907553] font-semibold">
                  COMPLETE THE LOOK • COMPLEMENTARY EDITS
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

        {/* RECENTLY VIEWED PRODUCTS CAROUSEL */}
        <RecentlyViewed currentProductId={product.id} />
      </main>

      {/* SIZE & AGE GUIDE MODAL WITH TABS */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151007]/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] max-w-xl w-full p-6 sm:p-8 border border-[#D8C9B6] shadow-2xl relative max-h-[90vh] overflow-y-auto">
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

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-[#D8C9B6]/60 pb-3 mb-4">
              <button
                type="button"
                onClick={() => setSizeModalTab("girls")}
                className={`text-xs font-sans px-3 py-1.5 uppercase tracking-wider cursor-pointer ${
                  sizeModalTab === "girls"
                    ? "bg-[#151007] text-[#FAF7F2]"
                    : "bg-[#F2EAE0] text-[#3A2E21]"
                }`}
              >
                Girls (New Born to XL)
              </button>
              <button
                type="button"
                onClick={() => setSizeModalTab("women")}
                className={`text-xs font-sans px-3 py-1.5 uppercase tracking-wider cursor-pointer ${
                  sizeModalTab === "women"
                    ? "bg-[#151007] text-[#FAF7F2]"
                    : "bg-[#F2EAE0] text-[#3A2E21]"
                }`}
              >
                Women (Small to XL)
              </button>
            </div>

            {sizeModalTab === "girls" ? (
              <div className="space-y-4 text-xs font-sans text-[#211A12]">
                <p className="text-[#3A2E21]/80">
                  Measurements in inches. Children&apos;s pieces are tailored with gentle comfort linings and growth seam margins.
                </p>

                <div className="overflow-x-auto max-h-72">
                  <table className="w-full border-collapse border border-[#D8C9B6] text-center text-xs">
                    <thead className="sticky top-0 bg-[#F2EAE0]">
                      <tr className="text-[#151007]">
                        <th className="p-2 border border-[#D8C9B6]">Age / Size</th>
                        <th className="p-2 border border-[#D8C9B6]">Chest (in)</th>
                        <th className="p-2 border border-[#D8C9B6]">Length (in)</th>
                        <th className="p-2 border border-[#D8C9B6]">Trouser (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">New Born (0-3 M)</td>
                        <td className="p-2 border border-[#D8C9B6]">17 - 18</td>
                        <td className="p-2 border border-[#D8C9B6]">13 - 14</td>
                        <td className="p-2 border border-[#D8C9B6]">12 - 13</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">3-6 Months</td>
                        <td className="p-2 border border-[#D8C9B6]">18 - 19</td>
                        <td className="p-2 border border-[#D8C9B6]">14 - 15</td>
                        <td className="p-2 border border-[#D8C9B6]">13 - 14</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">6-12 Months</td>
                        <td className="p-2 border border-[#D8C9B6]">19 - 20</td>
                        <td className="p-2 border border-[#D8C9B6]">15 - 16</td>
                        <td className="p-2 border border-[#D8C9B6]">14 - 15</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">1 Year</td>
                        <td className="p-2 border border-[#D8C9B6]">20 - 21</td>
                        <td className="p-2 border border-[#D8C9B6]">17 - 18</td>
                        <td className="p-2 border border-[#D8C9B6]">16 - 17</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">2 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">22 - 23</td>
                        <td className="p-2 border border-[#D8C9B6]">19 - 20</td>
                        <td className="p-2 border border-[#D8C9B6]">18 - 19</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">2-3 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">23 - 24</td>
                        <td className="p-2 border border-[#D8C9B6]">21 - 22</td>
                        <td className="p-2 border border-[#D8C9B6]">20 - 21</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">3-4 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">24 - 25</td>
                        <td className="p-2 border border-[#D8C9B6]">23 - 24</td>
                        <td className="p-2 border border-[#D8C9B6]">22 - 23</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">4-5 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">25 - 26</td>
                        <td className="p-2 border border-[#D8C9B6]">25 - 26</td>
                        <td className="p-2 border border-[#D8C9B6]">24 - 25</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">5-6 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">26 - 27</td>
                        <td className="p-2 border border-[#D8C9B6]">27 - 28</td>
                        <td className="p-2 border border-[#D8C9B6]">26 - 27</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">7-8 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">28 - 29</td>
                        <td className="p-2 border border-[#D8C9B6]">29 - 30</td>
                        <td className="p-2 border border-[#D8C9B6]">28 - 29</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">9-10 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">30 - 31</td>
                        <td className="p-2 border border-[#D8C9B6]">32 - 33</td>
                        <td className="p-2 border border-[#D8C9B6]">31 - 32</td>
                      </tr>
                      <tr className="bg-[#FAF7F2]">
                        <td className="p-2 border border-[#D8C9B6] font-medium">11-12 Years</td>
                        <td className="p-2 border border-[#D8C9B6]">32 - 33</td>
                        <td className="p-2 border border-[#D8C9B6]">34 - 35</td>
                        <td className="p-2 border border-[#D8C9B6]">33 - 34</td>
                      </tr>
                      <tr>
                        <td className="p-2 border border-[#D8C9B6] font-medium">Extra Large (Teen)</td>
                        <td className="p-2 border border-[#D8C9B6]">34 - 36</td>
                        <td className="p-2 border border-[#D8C9B6]">36 - 38</td>
                        <td className="p-2 border border-[#D8C9B6]">35 - 37</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-[#F2EAE0] border border-[#907553]/30">
                  <p className="text-[11px] text-[#3A2E21]">
                    <strong>Custom Tailored Sizing:</strong> Select &quot;Customized Size&quot; and enter your child&apos;s height, chest, or length to receive a tailor-made fit without additional charges.
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
                      <th className="p-2 border border-[#D8C9B6]">Shirt Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#D8C9B6] font-medium">Small (S)</td>
                      <td className="p-2 border border-[#D8C9B6]">38</td>
                      <td className="p-2 border border-[#D8C9B6]">34</td>
                      <td className="p-2 border border-[#D8C9B6]">40</td>
                      <td className="p-2 border border-[#D8C9B6]">38</td>
                    </tr>
                    <tr className="bg-[#FAF7F2]">
                      <td className="p-2 border border-[#D8C9B6] font-medium">Medium (M)</td>
                      <td className="p-2 border border-[#D8C9B6]">41</td>
                      <td className="p-2 border border-[#D8C9B6]">37</td>
                      <td className="p-2 border border-[#D8C9B6]">43</td>
                      <td className="p-2 border border-[#D8C9B6]">39</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#D8C9B6] font-medium">Large (L)</td>
                      <td className="p-2 border border-[#D8C9B6]">44</td>
                      <td className="p-2 border border-[#D8C9B6]">40</td>
                      <td className="p-2 border border-[#D8C9B6]">46</td>
                      <td className="p-2 border border-[#D8C9B6]">40</td>
                    </tr>
                    <tr className="bg-[#FAF7F2]">
                      <td className="p-2 border border-[#D8C9B6] font-medium">Extra Large (XL)</td>
                      <td className="p-2 border border-[#D8C9B6]">47</td>
                      <td className="p-2 border border-[#D8C9B6]">43</td>
                      <td className="p-2 border border-[#D8C9B6]">49</td>
                      <td className="p-2 border border-[#D8C9B6]">41</td>
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

      {/* FULLSCREEN LIGHTBOX ZOOM MODAL */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn select-none"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <p className="text-[10px] uppercase font-sans tracking-[0.2em] text-[#D8C9B6]">
                HIGH-RESOLUTION ZOOM VIEW
              </p>
              <h4
                className="text-lg sm:text-xl font-serif text-[#FAF7F2]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {product.name}
              </h4>
              <p className="text-xs text-white/60 font-sans">
                Photograph {activeImageIndex + 1} of {product.images.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Zoom Level Switcher */}
              <div className="flex items-center bg-white/10 rounded-none border border-white/20 overflow-hidden text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setLightboxZoom(1)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    lightboxZoom === 1
                      ? "bg-[#907553] text-[#FAF7F2] font-semibold"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  1x
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(2)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    lightboxZoom === 2
                      ? "bg-[#907553] text-[#FAF7F2] font-semibold"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  2x Zoom
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxZoom(3)}
                  className={`px-3 py-1.5 transition-colors cursor-pointer ${
                    lightboxZoom === 3
                      ? "bg-[#907553] text-[#FAF7F2] font-semibold"
                      : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  3x Ultra
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-none border border-white/20 transition-colors cursor-pointer"
                title="Close Zoom View (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image & Navigation */}
          <div className="relative flex-1 flex items-center justify-center overflow-auto p-4 my-2">
            {/* Prev Image Button */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) =>
                    prev > 0 ? prev - 1 : product.images.length - 1
                  );
                }}
                className="absolute left-2 sm:left-6 z-20 p-3 bg-black/60 hover:bg-[#907553] text-white rounded-full transition-colors cursor-pointer border border-white/20 shadow-lg"
                title="Previous Photograph"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Interactive Zoomable Image */}
            <div
              onClick={() =>
                setLightboxZoom((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1))
              }
              className="relative max-w-full max-h-full transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${lightboxZoom})`,
                cursor: lightboxZoom > 1 ? "grab" : "zoom-in",
              }}
              title="Click photo to cycle 1x ➔ 2x ➔ 3x zoom"
            >
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                width={1200}
                height={1600}
                className="max-h-[72vh] w-auto object-contain shadow-2xl select-none"
                unoptimized
                priority
              />
            </div>

            {/* Next Image Button */}
            {product.images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((prev) =>
                    prev < product.images.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-2 sm:right-6 z-20 p-3 bg-black/60 hover:bg-[#907553] text-white rounded-full transition-colors cursor-pointer border border-white/20 shadow-lg"
                title="Next Photograph"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails Carousel (Up to 7 images) */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10">
            {product.images.map((img, idx) => (
              <button
                key={img + idx}
                type="button"
                onClick={() => {
                  setActiveImageIndex(idx);
                  setLightboxZoom(1);
                }}
                className={`relative w-12 h-16 sm:w-14 sm:h-18 rounded-none overflow-hidden transition-all cursor-pointer border ${
                  activeImageIndex === idx
                    ? "border-[#907553] ring-2 ring-[#907553] scale-105 opacity-100"
                    : "border-white/20 opacity-40 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
