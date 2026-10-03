import React from "react";

interface ProductBadgeProps {
  type: "NEW" | "SALE" | "BEST SELLER";
  className?: string;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({ type, className = "" }) => {
  const styles = {
    NEW: "bg-[#151007] text-[#FAF7F2] border border-[#151007]",
    SALE: "bg-[#907553] text-[#FAF7F2] border border-[#907553]",
    "BEST SELLER": "bg-[#3A2E21] text-[#FAF7F2] border border-[#3A2E21]",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-medium ${styles[type]} ${className}`}
    >
      {type}
    </span>
  );
};
