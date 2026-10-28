"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { navigationData } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { MobileDrawer } from "./MobileDrawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/data/products";
import { searchProducts } from "@/services/catalogService";

export const Header: React.FC = () => {
  const { totalCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced live search auto-suggestions
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(q);
        setSearchResults(results);
        setShowSuggestions(true);
      } catch (e) {
        console.error("Search auto-suggestion error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?category=women`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D8C9B6]/60 transition-all duration-300 ${
        isScrolled ? "shadow-sm py-2" : "py-3 sm:py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 text-[#211A12] hover:text-[#907553] cursor-pointer"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>

          {/* Left Navigation (Desktop) - Direct Clean Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 flex-1">
            {navigationData.map((item) => (
              <div key={item.label} className="relative py-2">
                <Link
                  href={item.href}
                  className="text-[12px] xl:text-[13px] font-sans font-medium uppercase tracking-[0.18em] text-[#211A12] hover:text-[#907553] transition-colors duration-200 relative pb-1 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#907553] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Center Brand Logo */}
          <div className="flex items-center justify-center shrink-0 px-4">
            <Logo size="md" />
          </div>

          {/* Right Actions (Search + Icons) */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-6 flex-1">
            {/* Desktop Minimal Search Bar with Live Auto-Suggestions */}
            <div
              ref={searchContainerRef}
              className="hidden md:flex items-center relative w-48 sm:w-56 lg:w-64"
            >
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-2.5 text-[#3A2E21]/50 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => {
                    if (searchQuery.trim().length >= 1) setShowSuggestions(true);
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pret, lawn, suits..."
                  className="w-full bg-[#FAF7F2] border-b border-[#D8C9B6] text-[11px] font-sans py-1.5 pl-7 pr-7 text-[#211A12] placeholder:text-[#3A2E21]/50 focus:outline-none focus:border-[#907553] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                    className="absolute right-1.5 top-2 text-[#3A2E21]/50 hover:text-[#151007] cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </form>

              {/* Live Auto-Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#FAF7F2] border border-[#D8C9B6] shadow-2xl z-50 p-3 rounded-none animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8C9B6]/60 mb-2">
                    <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#907553] font-semibold flex items-center gap-1.5">
                      <Sparkles size={12} />
                      {isSearching ? "Searching Atelier..." : "Matching Creations"}
                    </span>
                    <span className="text-[10px] font-mono text-[#3A2E21]/60">
                      {searchResults.length} found
                    </span>
                  </div>

                  {isSearching ? (
                    <div className="py-6 text-center text-xs font-sans text-[#3A2E21]/60">
                      <div className="w-5 h-5 border-2 border-[#907553] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Searching luxury collection...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-[#D8C9B6]/40 max-h-72 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery("");
                          }}
                          className="py-2.5 px-2 flex items-center gap-3 hover:bg-[#F2EAE0]/70 transition-colors group cursor-pointer"
                        >
                          <div className="relative w-11 h-13 bg-[#D8C9B6] shrink-0 border border-[#D8C9B6]/60 overflow-hidden">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#151007] truncate group-hover:text-[#907553] transition-colors">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 bg-[#F7F1E8] border border-[#D8C9B6] text-[#907553] font-medium">
                                {product.category}
                              </span>
                              <span className="text-xs font-semibold text-[#151007]">
                                Rs. {product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            size={13}
                            className="text-[#907553] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs font-sans text-[#3A2E21]/70 space-y-1">
                      <p>No creations match &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-[10px] text-[#907553]">
                        Try searching for &quot;Silk&quot;, &quot;Lawn&quot;, or &quot;Embroidered&quot;
                      </p>
                    </div>
                  )}

                  <div className="pt-2.5 mt-1 border-t border-[#D8C9B6]/60 text-center">
                    <Link
                      href="/products"
                      onClick={() => setShowSuggestions(false)}
                      className="text-[10px] uppercase tracking-[0.16em] font-sans font-medium text-[#907553] hover:text-[#151007] transition-colors"
                    >
                      Browse Entire Atelier Collection →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Search Icon */}
            <button
              type="button"
              aria-label="Search catalog"
              className="md:hidden p-2 text-[#211A12] hover:text-[#907553] cursor-pointer"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              aria-label="Wishlist items"
              className="p-2 text-[#211A12] hover:text-[#907553] transition-colors relative"
            >
              <Heart size={19} strokeWidth={1.5} />
              {totalWishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#907553] text-[#FAF7F2] text-[10px] font-sans font-medium flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon / Avatar */}
            <Link
              href="/account"
              aria-label={isAuthenticated ? `Account for ${user?.name}` : "Customer account (Login/Signup/Guest)"}
              className="hidden sm:inline-flex items-center p-1.5 text-[#211A12] hover:text-[#907553] transition-colors relative"
            >
              {isAuthenticated && user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || "Account"}
                  className="w-6 h-6 rounded-full object-cover border border-[#907553]"
                />
              ) : (
                <User size={19} strokeWidth={1.5} />
              )}
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#907553] absolute top-1 right-1" />
              )}
            </Link>

            {/* Shopping Bag Icon with Live Badge */}
            <Link
              href="/cart"
              aria-label={`Shopping bag with ${totalCount} items`}
              className="relative p-2 text-[#211A12] hover:text-[#907553] transition-colors"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span className="absolute top-1 right-0 min-w-[16px] h-4 rounded-full bg-[#151007] text-[#FAF7F2] text-[9px] font-sans font-medium flex items-center justify-center px-1 border border-[#FAF7F2]">
                {totalCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </header>
  );
};
