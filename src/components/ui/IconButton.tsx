import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "circle-dark" | "circle-light" | "wishlist";
  size?: "sm" | "md" | "lg";
  ariaLabel: string;
  isActive?: boolean;
  children: React.ReactNode;
  badge?: number | string;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = "ghost",
  size = "md",
  ariaLabel,
  isActive = false,
  children,
  badge,
  className = "",
  ...props
}) => {
  const sizeStyles = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const variantStyles = {
    ghost:
      "text-[#211A12] hover:text-[#907553] hover:bg-[#F2EAE0]/50 active:scale-95 transition-all duration-200",
    "circle-dark":
      "bg-[#151007] text-[#FAF7F2] border border-[#3A2E21] hover:bg-[#3A2E21] hover:border-[#907553] active:scale-95 transition-all duration-200 shadow-sm",
    "circle-light":
      "bg-[#FAF7F2] text-[#151007] border border-[#D8C9B6] hover:bg-[#F7F1E8] hover:border-[#907553] active:scale-95 transition-all duration-200 shadow-sm",
    wishlist: `rounded-full transition-all duration-300 ${
      isActive
        ? "bg-[#FAF7F2] text-[#907553] shadow-md"
        : "bg-[#FAF7F2]/80 backdrop-blur-sm text-[#151007] hover:bg-[#FAF7F2] hover:text-[#907553]"
    }`,
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`relative inline-flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#907553] ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-[#151007] text-[#FAF7F2] text-[10px] font-sans font-medium flex items-center justify-center px-1 border border-[#FAF7F2]">
          {badge}
        </span>
      )}
    </button>
  );
};
