import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  align?: "left" | "center";
  showCarouselArrows?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  actionText,
  actionHref,
  align = "left",
  showCarouselArrows = false,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10 ${
        align === "center" ? "md:text-center md:items-center" : ""
      } ${className}`}
    >
      <div>
        {eyebrow && (
          <p className="text-[11px] sm:text-[12px] font-sans font-medium uppercase tracking-[0.22em] text-[#907553] mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl text-[#151007] font-normal leading-[1.15]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base font-sans font-light text-[#3A2E21]/80 mt-1.5">
            {subtitle}
          </p>
        )}
      </div>

      {(actionText || showCarouselArrows) && (
        <div className="flex items-center gap-6 self-start md:self-end">
          {actionText && actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-medium uppercase tracking-[0.18em] text-[#151007] hover:text-[#907553] transition-colors duration-200 group"
            >
              <span>{actionText}</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          )}

          {showCarouselArrows && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={prevDisabled}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center text-[#151007] hover:border-[#151007] hover:bg-[#FAF7F2] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center text-[#151007] hover:border-[#151007] hover:bg-[#FAF7F2] active:scale-95 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
