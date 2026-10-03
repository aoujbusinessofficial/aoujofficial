"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { ProductBadge } from "./ProductBadge";
import { ColorSwatches } from "./ColorSwatches";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");

  const hasSecondImage = product.images.length > 1;

  // Format price in Pakistani Rupees
  const formattedPrice = `Rs. ${product.price.toLocaleString("en-PK")}`;
  const formattedOriginalPrice = product.originalPrice
    ? `Rs. ${product.originalPrice.toLocaleString("en-PK")}`
    : null;

  return (
    <div
      className={`group flex flex-col w-full text-left transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EAE0] mb-3">
        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`object-cover object-top transition-all duration-700 ease-out ${
            hasSecondImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100 group-hover:scale-103"
          }`}
        />

        {/* Secondary Image on Hover */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={`object-cover object-top transition-all duration-700 ease-out ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-98 pointer-events-none"
            }`}
          />
        )}

        {/* Badge in Top Left */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <ProductBadge type={product.badge} />
          </div>
        )}

        {/* Wishlist Button in Top Right */}
        <div className="absolute top-2.5 right-2.5 z-10 transition-opacity duration-300 sm:opacity-90 sm:group-hover:opacity-100">
          <WishlistButton initialState={product.isWishlisted} />
        </div>

        {/* Quick Add Overlay on hover for desktop */}
        <div
          className={`hidden sm:flex absolute inset-x-2 bottom-2 z-10 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <button
            type="button"
            className="w-full py-2 bg-[#FAF7F2]/95 hover:bg-[#151007] hover:text-[#FAF7F2] text-[#151007] text-[10px] tracking-[0.18em] uppercase font-sans font-medium backdrop-blur-sm transition-colors duration-200 border border-[#D8C9B6] cursor-pointer"
          >
            QUICK ADD
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1">
        <Link href={`#product-${product.id}`} className="group-hover:text-[#907553] transition-colors">
          <h3 className="text-xs sm:text-[13px] font-sans font-normal text-[#211A12] leading-snug line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs sm:text-[13px] font-sans font-medium text-[#151007]">
            {formattedPrice}
          </span>
          {formattedOriginalPrice && (
            <span className="text-[11px] sm:text-xs font-sans text-[#3A2E21]/60 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        <div className="mt-1">
          <ColorSwatches
            colors={product.colors}
            onSelectColor={(color) => setSelectedColor(color.name)}
          />
        </div>
      </div>
    </div>
  );
};
