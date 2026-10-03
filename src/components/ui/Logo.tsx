import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "dark",
  size = "md",
  showTagline = true,
  className = "",
}) => {
  const isLight = variant === "light";
  const textColor = isLight ? "text-[#FAF7F2]" : "text-[#151007]";
  const taglineColor = isLight ? "text-[#DBCEBD]" : "text-[#907553]";
  const lineColor = isLight ? "bg-[#907553]/40" : "bg-[#907553]/50";

  const sizeClasses = {
    sm: "text-2xl tracking-[0.08em]",
    md: "text-3xl sm:text-4xl tracking-[0.1em]",
    lg: "text-4xl sm:text-5xl tracking-[0.12em]",
  };

  const taglineSizeClasses = {
    sm: "text-[7px] tracking-[0.28em]",
    md: "text-[8px] sm:text-[9px] tracking-[0.32em]",
    lg: "text-[10px] sm:text-[11px] tracking-[0.36em]",
  };

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center text-center group select-none transition-opacity duration-300 hover:opacity-90 ${className}`}
      aria-label="AOUJ Homepage - Rise In Your Own Way"
    >
      {/* Brand Wordmark */}
      <span
        className={`font-serif font-normal ${textColor} ${sizeClasses[size]} leading-none transition-transform duration-300 group-hover:scale-[1.01]`}
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        <span className="italic font-light">A</span>OUJ
      </span>

      {/* Tagline with hairline divider lines */}
      {showTagline && (
        <div className="flex items-center gap-2 mt-1 sm:mt-1.5 w-full justify-center">
          <span className={`h-[0.5px] w-4 sm:w-6 ${lineColor}`} />
          <span
            className={`uppercase font-sans font-medium ${taglineColor} ${taglineSizeClasses[size]} whitespace-nowrap`}
          >
            RISE IN YOUR OWN WAY
          </span>
          <span className={`h-[0.5px] w-4 sm:w-6 ${lineColor}`} />
        </div>
      )}
    </Link>
  );
};
