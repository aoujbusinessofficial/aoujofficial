"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  initialState?: boolean;
  onToggle?: (isWishlisted: boolean) => void;
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  initialState = false,
  onToggle,
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialState);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    onToggle?.(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
        isWishlisted
          ? "bg-[#FAF7F2] text-[#907553] shadow-sm"
          : "bg-[#FAF7F2]/80 text-[#211A12] hover:bg-[#FAF7F2] hover:text-[#907553]"
      } ${className}`}
    >
      <Heart
        size={15}
        strokeWidth={1.75}
        className={`transition-all duration-300 ${
          isWishlisted ? "fill-[#907553] text-[#907553] scale-110" : "hover:scale-110"
        }`}
      />
    </button>
  );
};
