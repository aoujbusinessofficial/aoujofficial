"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { fetchCustomerProducts } from "@/services/catalogService";
import {
  Product,
  ProductCategory,
  standardWomenSizes,
  standardGirlsSizes,
} from "@/data/products";
import { ChevronRight, Sparkles, Users, PlusCircle } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get("category") as ProductCategory | null;

  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategoryParam || "all"
  );
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setIsLoading(true);
      const items = await fetchCustomerProducts();
      if (isMounted) {
        setProducts(items);
        setIsLoading(false);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: "all", label: "ALL PRODUCTS" },
    { id: "women", label: "WOMEN (S - XL)" },
    { id: "girls", label: "GIRLS (NEW BORN - XL)" },
    { id: "family", label: "FAMILY (DUAL SIZING)" },
  ];

  // Dynamic size filters based on selected category
  const availableFilters = useMemo(() => {
    if (activeCategory === "women") {
      return ["all", ...standardWomenSizes];
    } else if (activeCategory === "girls") {
      return [
        "all",
        "New Born (0-3 Months)",
        "3-6 Months",
        "6-12 Months",
        "1 Year",
        "2-3 Years",
        "3-4 Years",
        "4-5 Years",
        "5-6 Years",
        "7-8 Years",
        "9-10 Years",
        "11-12 Years",
        "Extra Large (Teen XL)",
        "Customized Size",
      ];
    } else if (activeCategory === "family") {
      return [
        "all",
        "Mother (Small)",
        "Mother (Medium)",
        "Mother (Large)",
        "Mother (Extra Large)",
        "Customized Family Sizing",
      ];
    }
    // "all" category
    return [
      "all",
      "New Born (0-3 Months)",
      "1 Year",
      "2-3 Years",
      "3-4 Years",
      "Small (S)",
      "Medium (M)",
      "Large (L)",
      "Extra Large (XL)",
      "Customized Size",
    ];
  }, [activeCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Filter by size
    if (selectedSizeFilter !== "all") {
      list = list.filter((p) => {
        return (
          p.sizes.some((s) => s.toLowerCase().includes(selectedSizeFilter.toLowerCase())) ||
          (p.womenSizes &&
            p.womenSizes.some((s) => s.toLowerCase().includes(selectedSizeFilter.toLowerCase()))) ||
          (p.girlsSizes &&
            p.girlsSizes.some((s) => s.toLowerCase().includes(selectedSizeFilter.toLowerCase())))
        );
      });
    }

    // Sort
    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, activeCategory, selectedSizeFilter, sortBy]);

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
                ? "Women's Collection (Small to Extra Large)"
                : activeCategory === "girls"
                ? "Girls Pret (New Born to Extra Large)"
                : activeCategory === "family"
                ? "Family & Coordinated Edits"
                : "All Collections"}
            </h1>
            <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21]/80 mt-2 max-w-xl">
              {activeCategory === "women"
                ? "Elegant silhouettes tailored from Small (S) to Extra Large (XL) with bespoke measurements."
                : activeCategory === "girls"
                ? "Full age spectrum from New Born (0-3 Months) through 16 Years (Extra Large Teen) with growth margins."
                : activeCategory === "family"
                ? "Matching mother & daughter ensembles with independent size selection for both woman and child."
                : "Explore our complete range for women, girls, and coordinated families with comprehensive size options."}
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
                    setSelectedSizeFilter("all");
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

        {/* Products Grid / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-6 py-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="aspect-[4/5] bg-[#E8DEC8]/60 w-full" />
                <div className="h-4 bg-[#E8DEC8]/60 w-3/4" />
                <div className="h-3 bg-[#E8DEC8]/40 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center max-w-xl mx-auto px-4 space-y-6 bg-[#F7F1E8]/70 border border-[#D8C9B6] my-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#907553] flex items-center justify-center text-[#907553]">
              <Sparkles size={28} />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#907553] font-semibold">
                CURATING NEW ATELIER COLLECTIONS
              </p>
              <h2
                className="text-2xl sm:text-3xl text-[#151007] font-normal"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                No Products Published Yet
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 max-w-md mx-auto leading-relaxed">
                All mock listings have been removed from the client catalog. Products added and published from the Admin Portal will be displayed here live.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/products?action=add"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#151007] text-[#FAF7F2] text-xs uppercase tracking-widest font-sans font-medium hover:bg-[#907553] transition-colors shadow-sm"
              >
                <PlusCircle size={14} />
                <span>Add First Product in Admin</span>
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-lg font-serif text-[#151007]">
              No products found matching the selected filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSelectedSizeFilter("all");
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
