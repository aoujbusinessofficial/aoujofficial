"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Truck } from "lucide-react";

const announcements = [
  "NEW IN: THE ELEGANT SPRING/SUMMER '26 LAWN COLLECTION",
  "NATIONWIDE EXPRESS COURIER DELIVERY ACROSS PAKISTAN",
  "BESPOKE & HEIRLOOM ATELIER CREATIONS HANDCRAFTED TO PERFECTION",
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  return (
    <aside
      aria-label="Announcements"
      className="bg-[#151007] text-[#F7F1E8] border-b border-[#3A2E21]/50 h-8 sm:h-9 flex items-center justify-between px-3 sm:px-8 select-none transition-colors duration-300 z-50 relative"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-[#DBCEBD]/70 hover:text-[#FAF7F2] p-1 transition-colors cursor-pointer"
        >
          <ChevronLeft size={13} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-[#DBCEBD]/70 hover:text-[#FAF7F2] p-1 transition-colors cursor-pointer"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      <div className="overflow-hidden flex items-center justify-center text-center px-2 flex-1">
        <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F7F1E8] truncate">
          {announcements[currentIndex]}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/track-order"
          className="hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase font-sans tracking-widest text-[#D8C9B6] hover:text-[#FAF7F2] transition-colors"
        >
          <Truck size={12} className="text-[#907553]" />
          <span>Track Order</span>
        </Link>
      </div>
    </aside>
  );
};
