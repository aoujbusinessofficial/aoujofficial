"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingBag, ArrowRight, Sparkles, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, totalWishlistCount, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      <Header />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70 mb-6"
        >
          <Link href="/" className="hover:text-[#907553] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#151007] font-medium">My Wishlist</span>
        </nav>

        {/* Page Title */}
        <div className="border-b border-[#D8C9B6]/60 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.24em] text-[#907553] mb-1.5 flex items-center gap-2">
              <Sparkles size={13} />
              CURATED FAVORITES
            </p>
            <h1
              className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              My Saved Pieces ({totalWishlistCount})
            </h1>
          </div>

          {totalWishlistCount > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs uppercase font-sans tracking-widest text-[#9E5B4B] hover:text-[#6A382A] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 size={13} />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {totalWishlistCount === 0 ? (
          /* Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#F2EAE0] text-[#907553] flex items-center justify-center mx-auto border border-[#D8C9B6]">
              <Heart size={26} strokeWidth={1.5} />
            </div>

            <div className="space-y-2">
              <h2
                className="text-2xl font-serif text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Your Wishlist is Empty
              </h2>
              <p className="text-xs font-sans text-[#3A2E21]/80 leading-relaxed">
                Explore our pret, festive lawn, and matching family collections to save your favorite heirloom pieces.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#151007] text-[#FAF7F2] hover:bg-[#3A2E21] text-xs font-sans uppercase tracking-[0.2em] font-medium transition-all shadow-sm"
              >
                <ShoppingBag size={14} />
                <span>Explore Collections</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Populated Wishlist Grid */
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="pt-8 border-t border-[#D8C9B6]/60 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs uppercase font-sans tracking-[0.2em] text-[#907553] hover:text-[#151007] font-medium transition-colors"
              >
                <span>Continue Shopping Entire Atelier</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
