"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NavItem } from "@/data/navigation";
import { ArrowRight } from "lucide-react";

interface MegaMenuProps {
  item: NavItem | null;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  item,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!item || !item.megaMenu) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-full left-0 w-full bg-[#FAF7F2] border-t border-b border-[#D8C9B6] shadow-xl shadow-black/5 z-40 py-8 px-6 sm:px-12"
        >
          <div className="max-w-[1360px] mx-auto grid grid-cols-12 gap-8 items-start">
            {/* Nav Columns */}
            <div className="col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {item.megaMenu.columns.map((column, colIdx) => (
                <div key={column.title + colIdx} className="space-y-4">
                  <h4
                    className="text-[12px] font-sans font-medium uppercase tracking-[0.2em] text-[#907553] border-b border-[#D8C9B6]/40 pb-2"
                  >
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.items.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className="group inline-flex items-center gap-2 text-[13px] font-sans text-[#211A12]/80 hover:text-[#151007] hover:translate-x-0.5 transition-all duration-200"
                        >
                          <span className="group-hover:text-[#907553] transition-colors">
                            {subItem.name}
                          </span>
                          {subItem.badge && (
                            <span className="text-[8px] uppercase tracking-wider bg-[#151007] text-[#FAF7F2] px-1.5 py-0.5 font-medium">
                              {subItem.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Featured Editorial Card */}
            {item.megaMenu.featured && (
              <div className="col-span-4 pl-6 border-l border-[#D8C9B6]/50">
                <Link
                  href={item.megaMenu.featured.href}
                  className="group block relative overflow-hidden bg-[#F2EAE0]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={item.megaMenu.featured.image}
                      alt={item.megaMenu.featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="380px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/80 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4 text-[#FAF7F2]">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#DBCEBD]">
                        FEATURED CAMPAIGN
                      </p>
                      <h5
                        className="text-lg font-normal text-white mt-0.5"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        {item.megaMenu.featured.title}
                      </h5>
                      <p className="text-xs text-[#FAF7F2]/80 font-sans mt-0.5 line-clamp-1">
                        {item.megaMenu.featured.subtitle}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#FAF7F2] mt-2 group-hover:text-[#DBCEBD] transition-colors">
                        EXPLORE NOW
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
