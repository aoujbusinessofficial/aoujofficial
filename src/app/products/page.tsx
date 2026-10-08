"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { allProducts, ProductCategory, Product } from "@/data/products";
import { Filter, SlidersHorizontal, ChevronRight, Sparkles } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") as ProductCategory | null;

  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategoryParam || "all"
  );
  const [selectedSizeType, setSelectedSizeType] = useState<string>("all");
  const [selectedAgeSize, setSelectedAgeSize] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const categories = [
    { id: "all", label: "ALL PRODUCTS" },
    { id: "women", label: "WOMEN" },
    { id: "girls", label: "GIRLS (AGES 1-10)" },
    { id: "family", label: "FAMILY MATCHING" },
  ];

  const ageSizes = [
    "all",
    "1 Year",
    "2 Years",
    "2-3 Years",
    "3-4 Years",
    "4-5 Years",
    "5-6 Years",
    "7-8 Years",
    "9-10 Years",
    "Customized Size",
  ];

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Filter by category
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Filter by specific age size if selected
    if (selectedAgeSize !== "all") {
      list = list.filter((p) => p.sizes.includes(selectedAgeSize));
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [activeCategory, selectedAgeSize, sortBy]);

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
          <span className="text-[#151007] font-medium">All Collections</span>
          {activeCategory !== "all" && (
            <>
              <ChevronRight size={12} />
              <span className="text-[#907553] uppercase font-medium">
                {activeCategory}
              </span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="border-b border-[#D8C9B6]/60 pb-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#907553] mb-2">
              AOUJ ARCHIVE &amp; COUTURE
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl text-[#151007] font-normal leading-tight uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {activeCategory === "women"
                ? "Women's Collection"
                : activeCategory === "girls"
                ? "Girls Pret & Traditional Wear"
                : activeCategory === "family"
                ? "Family & Matching Edits"
                : "All Collections"}
            </h1>
            <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 mt-2 max-w-xl">
              Discover graceful ensembles designed for women, age-tailored festive
              pieces for girls (1–10 years), and coordinated family heirlooms with bespoke custom sizing.
            </p>
          </div>

          <div className="text-xs font-sans text-[#3A2E21]/70 self-center sm:self-end">
            Showing <span className="font-semibold text-[#151007]">{filteredProducts.length}</span> pieces
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#D8C9B6]/40 mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedAgeSize("all");
                  }}
                  className={`px-4 sm:px-5 py-2 text-[11px] sm:text-xs font-sans uppercase tracking-[0.18em] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#151007] text-[#FAF7F2] border border-[#151007]"
                      : "bg-[#F7F1E8] text-[#211A12] border border-[#D8C9B6] hover:border-[#151007]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans text-[#3A2E21]/70 uppercase tracking-wider">
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FAF7F2] border border-[#D8C9B6] text-xs font-sans py-2 px-3 text-[#211A12] focus:outline-none focus:border-[#907553] cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Age / Size Quick Filter Bar (especially when Girls is active or for general kids shopping) */}
        {(activeCategory === "girls" || activeCategory === "all") && (
          <div className="bg-[#F7F1E8] p-4 sm:p-5 border border-[#D8C9B6]/60 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#907553] flex items-center gap-1.5">
                <Sparkles size={14} />
                Filter by Age / Kid Size:
              </span>
              <span className="text-[11px] font-sans text-[#3A2E21]/70">
                All sizes are crafted with growth margins &amp; soft pure linings
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ageSizes.map((size) => {
                const isSelected = selectedAgeSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedAgeSize(size)}
                    className={`px-3 py-1.5 text-xs font-sans rounded-none transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#907553] text-[#FAF7F2] border border-[#907553] font-medium"
                        : "bg-[#FAF7F2] text-[#211A12] border border-[#D8C9B6] hover:border-[#907553]"
                    }`}
                  >
                    {size === "all" ? "All Ages" : size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-lg font-serif text-[#151007]">
              No products found matching the selected filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSelectedAgeSize("all");
              }}
              className="text-xs uppercase tracking-widest text-[#907553] underline font-sans cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <p className="font-serif text-xl text-[#907553]">Loading AOUJ Collections...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
