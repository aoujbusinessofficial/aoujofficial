import React from "react";
import Link from "next/link";
import Image from "next/image";

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
  const taglineColor = isLight ? "text-[#DBCEBD]" : "text-[#907553]";
  const lineColor = isLight ? "bg-[#907553]/40" : "bg-[#907553]/50";

  // Dimensions based on logo image's 945:582 aspect ratio (1.62:1)
  const dimensions = {
    sm: { width: 72, height: 44 },
    md: { width: 104, height: 64 },
    lg: { width: 140, height: 86 },
  };

  const taglineSizeClasses = {
    sm: "text-[7px] tracking-[0.26em]",
    md: "text-[8px] sm:text-[8.5px] tracking-[0.3em]",
    lg: "text-[9.5px] sm:text-[10px] tracking-[0.34em]",
  };

  const { width, height } = dimensions[size];

  return (
    <Link
      href="/"
      className={`inline-flex flex-col items-center justify-center text-center group select-none transition-opacity duration-300 hover:opacity-95 ${className}`}
      aria-label="AOUJ Homepage - Rise In Your Own Way"
    >
      {/* Brand Visual Logo */}
      <div
        className={`relative transition-transform duration-300 group-hover:scale-[1.02] ${
          isLight ? "brightness-110 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" : ""
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Image
          src="/images/aouj-logo.png"
          alt="Aouj - Rise In Your Own Way"
          width={width}
          height={height}
          priority
          className="object-contain w-full h-full"
        />
      </div>

      {/* Tagline with hairline divider lines */}
      {showTagline && (
        <div className="flex items-center gap-2 mt-0.5 sm:mt-1 w-full justify-center">
          <span className={`h-[0.5px] w-3 sm:w-5 ${lineColor}`} />
          <span
            className={`uppercase font-sans font-medium ${taglineColor} ${taglineSizeClasses[size]} whitespace-nowrap`}
          >
            RISE IN YOUR OWN WAY
          </span>
          <span className={`h-[0.5px] w-3 sm:w-5 ${lineColor}`} />
        </div>
      )}
    </Link>
  );
};
