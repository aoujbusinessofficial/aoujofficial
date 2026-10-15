"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Search, Heart, User, ShoppingBag, ArrowRight } from "lucide-react";
import { navigationData } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

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

            {/* Search Input in Mobile Drawer */}
            <div className="p-4 border-b border-[#D8C9B6]/40 bg-[#F7F1E8]/60">
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-[#3A2E21]/60" />
                <input
                  type="text"
                  placeholder="Search for lawn, pret, kids..."
                  className="w-full bg-[#FAF7F2] border border-[#D8C9B6] text-xs py-2.5 pl-9 pr-3 text-[#211A12] placeholder:text-[#3A2E21]/50 focus:outline-none focus:border-[#907553]"
                />
              </div>
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
                  href="#wishlist"
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
