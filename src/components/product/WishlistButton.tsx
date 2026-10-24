"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/data/products";

interface WishlistButtonProps {
  product?: Product;
  productId?: string;
  initialState?: boolean;
  onToggle?: (isWishlisted: boolean) => void;
  className?: string;
  size?: number;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  productId,
  initialState = false,
  onToggle,
  className = "",
  size = 15,
}) => {
  const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();

  const id = product?.id || productId;
  const isWishlisted = id ? isInWishlist(id) : initialState;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product) {
      const next = toggleWishlist(product);
      onToggle?.(next);
    } else if (id) {
      if (isWishlisted) {
        removeFromWishlist(id);
        onToggle?.(false);
      }
    } else {
      onToggle?.(!isWishlisted);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isWishlisted ? "In your Wishlist" : "Add to Wishlist"}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
        isWishlisted
          ? "bg-[#FAF7F2] text-[#907553] shadow-md border border-[#907553]/40"
          : "bg-[#FAF7F2]/85 text-[#211A12] hover:bg-[#FAF7F2] hover:text-[#907553] shadow-sm"
      } ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={1.75}
        className={`transition-all duration-300 ${
          isWishlisted
            ? "fill-[#907553] text-[#907553] scale-110"
            : "hover:scale-110"
        }`}
      />
    </button>
  );
};
