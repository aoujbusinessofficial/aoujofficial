"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const announcements = [
  "FREE SHIPPING ON ORDERS ABOVE PKR 5,000",
  "NEW IN: THE ELEGANT SPRING/SUMMER '26 LAWN COLLECTION",
  "WORLDWIDE EXPRESS COURIER SHIPPING AVAILABLE",
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
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="text-[#DBCEBD]/70 hover:text-[#FAF7F2] p-1 transition-colors cursor-pointer"
      >
        <ChevronLeft size={13} />
      </button>

      <div className="overflow-hidden flex items-center justify-center text-center px-2">
        <p className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#F7F1E8] truncate">
          {announcements[currentIndex]}
        </p>
      </div>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next announcement"
        className="text-[#DBCEBD]/70 hover:text-[#FAF7F2] p-1 transition-colors cursor-pointer"
      >
        <ChevronRight size={13} />
      </button>
    </aside>
  );
};
