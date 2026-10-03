"use client";

import React, { useRef } from "react";
import { Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface ProductSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  products: Product[];
  className?: string;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  actionText = "VIEW ALL",
  actionHref = "#",
  products,
  className = "",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id={id} className={`py-12 sm:py-16 bg-[#FAF7F2] ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header with Carousel Controls */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          actionText={actionText}
          actionHref={actionHref}
          showCarouselArrows={true}
          onPrev={scrollLeft}
          onNext={scrollRight}
        />

        {/* Product Carousel / Grid Container */}
        {/* On desktop: 5-column grid or smooth scrollable row. Let's make it responsive:
            mobile: 2 columns grid or horizontal scroll
            desktop: 5 items row perfectly proportioned like reference */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 gap-3.5 sm:gap-5 scrollbar-none scroll-smooth snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:overflow-visible"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[170px] sm:min-w-[220px] md:min-w-[240px] lg:min-w-0 flex-shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
