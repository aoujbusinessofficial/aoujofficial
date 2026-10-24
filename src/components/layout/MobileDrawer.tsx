"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Search, Heart, User, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { navigationData } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { searchProducts } from "@/services/catalogService";
import { Product } from "@/data/products";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [mobileQuery, setMobileQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = mobileQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchProducts(q);
        setSearchResults(results);
      } catch (e) {
        console.error("Mobile search error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [mobileQuery]);

  const toggleExpand = (label: string) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#151007]/50 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-[360px] bg-[#FAF7F2] text-[#211A12] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-[#D8C9B6]/60">
              <Logo size="sm" showTagline={false} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#211A12] hover:bg-[#F2EAE0] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input in Mobile Drawer with Live Auto-Suggestions */}
            <div className="p-4 border-b border-[#D8C9B6]/40 bg-[#F7F1E8]/60 relative">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-[#3A2E21]/60" />
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={(e) => setMobileQuery(e.target.value)}
                  placeholder="Search for lawn, pret, kids..."
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs py-2.5 pl-9 pr-8 text-[#211A12] placeholder:text-[#3A2E21]/50 focus:outline-none focus:border-[#907553]"
                />
                {mobileQuery && (
                  <button
                    type="button"
                    onClick={() => setMobileQuery("")}
                    className="absolute right-2.5 text-[#3A2E21]/50 hover:text-[#151007]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Auto-Suggestions Results */}
              {mobileQuery.trim() && (
                <div className="mt-2 bg-[#FAF7F2] border border-[#D8C9B6] p-2 max-h-60 overflow-y-auto">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#D8C9B6]/60 mb-1.5">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#907553] font-semibold flex items-center gap-1">
                      <Sparkles size={11} />
                      {isSearching ? "Searching..." : "Suggestions"}
                    </span>
                    <span className="text-[10px] text-[#3A2E21]/60">{searchResults.length} found</span>
                  </div>

                  {isSearching ? (
                    <div className="py-4 text-center text-xs text-[#3A2E21]/60">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-[#D8C9B6]/40">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            onClose();
                            setMobileQuery("");
                          }}
                          className="py-2 px-1 flex items-center gap-2.5 hover:bg-[#F2EAE0] transition-colors"
                        >
                          <div className="relative w-9 h-11 bg-[#D8C9B6] shrink-0 overflow-hidden">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#151007] truncate">{product.name}</p>
                            <p className="text-[11px] font-semibold text-[#907553]">
                              Rs. {product.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="py-3 text-center text-xs text-[#3A2E21]/60">
                      No products found for &quot;{mobileQuery}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-3 px-4 divide-y divide-[#D8C9B6]/30">
              {navigationData.map((item) => {
                const isExpanded = expandedItem === item.label;
                const hasMega = item.hasDropdown && item.megaMenu;

                return (
                  <div key={item.label} className="py-2.5">
                    {hasMega ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.label)}
                          className="w-full flex items-center justify-between text-[13px] font-sans font-medium uppercase tracking-[0.16em] text-[#151007] py-1 cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`text-[#907553] transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-3 pt-2 pb-1 space-y-3"
                            >
                              {item.megaMenu?.columns.map((col, idx) => (
                                <div key={col.title + idx} className="space-y-1.5">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#907553] font-semibold">
                                    {col.title}
                                  </p>
                                  <div className="flex flex-col space-y-1.5 pl-1">
                                    {col.items.map((sub) => (
                                      <Link
                                        key={sub.name}
                                        href={sub.href}
                                        onClick={onClose}
                                        className="text-xs text-[#211A12]/80 hover:text-[#151007] py-0.5"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block text-[13px] font-sans font-medium uppercase tracking-[0.16em] py-1 text-[#151007] hover:text-[#907553] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              <div className="py-2.5">
                <Link
                  href="/about"
                  onClick={onClose}
                  className="block text-[13px] font-sans font-medium uppercase tracking-[0.16em] py-1 text-[#907553] hover:text-[#151007] transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#F7F1E8] border-t border-[#D8C9B6] space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-2 py-2 px-3 bg-[#FAF7F2] border border-[#D8C9B6] text-[#211A12] justify-center"
                >
                  <Heart size={14} className="text-[#907553]" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/account"
                  onClick={onClose}
                  className="flex items-center gap-2 py-2 px-3 bg-[#FAF7F2] border border-[#D8C9B6] text-[#211A12] justify-center"
                >
                  <User size={14} className="text-[#907553]" />
                  <span>Account</span>
                </Link>
              </div>

              <div className="text-center pt-2">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3A2E21]/70 font-sans">
                  Rise In Your Own Way
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
