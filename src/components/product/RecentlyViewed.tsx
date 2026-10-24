"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/data/products";
import { Clock, Eye, ArrowRight } from "lucide-react";

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aouj_recently_viewed");
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        // Exclude the current product being viewed
        const filtered = parsed.filter((item) => item.id !== currentProductId);
        setRecentProducts(filtered.slice(0, 6));
      }
    } catch {
      // Local storage disabled or error
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  const formatPrice = (amount: number) =>
    `Rs. ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

  return (
    <section className="mt-16 pt-10 border-t border-[#D8C9B6]/60">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#907553]" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-sans text-[#907553] font-semibold">
              YOUR ATELIER JOURNEY
            </p>
            <h3
              className="text-xl sm:text-2xl text-[#151007]"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Recently Viewed Creations
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {recentProducts.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group block bg-[#FAF7F2] border border-[#D8C9B6]/70 p-2 sm:p-2.5 transition-all hover:border-[#907553] hover:shadow-md"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EAE0] mb-2">
              <Image
                src={p.images[0] || "/images/placeholder.jpg"}
                alt={p.name}
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-[#151007]/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={12} />
              </span>
            </div>

            <p className="text-[10px] uppercase tracking-wider text-[#907553] font-sans truncate">
              {p.category}
            </p>
            <h4
              className="text-xs sm:text-sm text-[#151007] font-medium truncate group-hover:text-[#907553] transition-colors"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              {p.name}
            </h4>
            <p className="text-[11px] font-sans font-semibold text-[#151007] mt-1">
              {formatPrice(p.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * Utility function to record product view in localStorage
 */
export function recordProductView(product: Product) {
  if (typeof window === "undefined" || !product) return;
  try {
    const key = "aouj_recently_viewed";
    const existing = localStorage.getItem(key);
    let list: Product[] = existing ? JSON.parse(existing) : [];
    
    // Remove if already exists so we can move it to the front
    list = list.filter((item) => item.id !== product.id);
    list.unshift(product);
    
    // Keep max 10 items
    list = list.slice(0, 10);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }
}
