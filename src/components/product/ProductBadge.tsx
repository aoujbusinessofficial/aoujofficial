import React from "react";

interface ProductBadgeProps {
  type: string;
  className?: string;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({ type, className = "" }) => {
  const isSoldOut = type === "SOLD OUT" || type === "OUT OF STOCK";
  const isSaleOrDiscount = type === "SALE" || type.includes("%") || type.includes("OFF");

  let badgeStyle = "bg-[#151007] text-[#FAF7F2] border border-[#151007]";
  if (isSoldOut) {
    badgeStyle = "bg-[#8B1E1E] text-[#FAF7F2] border border-[#8B1E1E]";
  } else if (isSaleOrDiscount) {
    badgeStyle = "bg-[#907553] text-[#FAF7F2] border border-[#907553]";
  } else if (type === "BEST SELLER") {
    badgeStyle = "bg-[#3A2E21] text-[#FAF7F2] border border-[#3A2E21]";
  }

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] font-medium shadow-xs ${badgeStyle} ${className}`}
    >
      {type}
    </span>
  );
};
