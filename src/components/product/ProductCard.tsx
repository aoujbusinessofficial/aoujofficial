"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { ProductBadge } from "./ProductBadge";
import { ColorSwatches } from "./ColorSwatches";
import { WishlistButton } from "./WishlistButton";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

// Deterministic price formatter to prevent SSR/locale hydration mismatch
const formatPrice = (amount: number) =>
  `Rs. ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");

  const hasSecondImage = product.images.length > 1;

  // Check out of stock status
  const isSoldOut =
    typeof product.stock === "number" && product.stock <= 0;

  // Calculate discount
  const hasDiscount = Boolean(product.saleDiscountPercent && product.saleDiscountPercent > 0);
  const currentPrice = hasDiscount
    ? Math.round(product.price * (1 - (product.saleDiscountPercent || 0) / 100))
    : product.price;

  const formattedPrice = formatPrice(currentPrice);
  const formattedOriginalPrice = hasDiscount
    ? formatPrice(product.price)
    : product.originalPrice
    ? formatPrice(product.originalPrice)
    : null;

  const displayBadge = isSoldOut
    ? "SOLD OUT"
    : hasDiscount
    ? `${product.saleDiscountPercent}% OFF`
    : product.badge;

  const sizeSummary =
    product.category === "girls"
      ? "Sizes: New Born to Extra Large & Custom"
      : product.category === "family"
      ? "Dual Sizing: Woman (S - XL) + Girl (New Born - XL)"
      : "Sizes: Small (S) to Extra Large (XL) & Custom";

  return (
    <div
      className={`group flex flex-col w-full text-left transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with 4:5 aspect ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F2EAE0] mb-3 block">
        {/* Clickable Image Link */}
        <Link
          href={`/products/${product.id}`}
          className="absolute inset-0 z-0 cursor-pointer"
          aria-label={`View details for ${product.name}`}
        >
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

          {/* Quick Shop Overlay on hover for desktop */}
          <div
            className={`hidden sm:flex absolute inset-x-2 bottom-2 z-10 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="w-full py-2.5 bg-[#FAF7F2]/95 hover:bg-[#151007] text-[#151007] hover:text-[#FAF7F2] text-[10px] tracking-[0.2em] uppercase font-sans font-medium backdrop-blur-sm transition-all duration-200 border border-[#D8C9B6] hover:border-[#151007] text-center flex items-center justify-center gap-1.5 shadow-sm">
              <span className="inherit">SELECT SIZE &amp; SHOP</span>
              <ArrowRight size={12} className="inherit" />
            </div>
          </div>
        </Link>

        {/* Badge in Top Left (Outside Link) */}
        {displayBadge && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <ProductBadge type={displayBadge} />
          </div>
        )}

        {/* Wishlist Button in Top Right (Outside Link to avoid nested button in anchor) */}
        <div className="absolute top-2.5 right-2.5 z-10 transition-opacity duration-300 sm:opacity-90 sm:group-hover:opacity-100">
          <WishlistButton product={product} />
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#907553] font-medium">
            {product.category}
          </span>
          <span className="text-[10px] font-sans text-[#3A2E21]/60">
            {product.sizes[0]} {product.sizes.length > 1 ? `+${product.sizes.length - 1} sizes` : ""}
          </span>
        </div>

        <Link href={`/products/${product.id}`} className="group-hover:text-[#907553] transition-colors">
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

        {/* Size Guide summary */}
        <p className="text-[10px] font-sans text-[#3A2E21]/70 tracking-wide truncate">
          {sizeSummary}
        </p>

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
