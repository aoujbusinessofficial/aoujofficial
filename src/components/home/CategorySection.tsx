"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { categoriesData } from "@/data/categories";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const CategorySection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <SectionHeading
          eyebrow="DISCOVER AOUJ"
          title="Shop by Category"
          subtitle="Thoughtfully curated collections for women, girls, and coordinated families."
          actionText="EXPLORE ALL"
          actionHref="/products"
        />

        {/* 3 Categories Grid: 1 col on mobile, 3 columns on tablet & desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {categoriesData.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={cat.href}
                className="group relative block aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#F2EAE0] select-none"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={`AOUJ ${cat.title} collection`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/90 via-[#151007]/30 to-transparent transition-opacity duration-300 group-hover:from-[#151007]/95" />

                {/* Text Content at Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex flex-col justify-end text-[#FAF7F2]">
                  <p className="text-[10px] tracking-[0.25em] text-[#DBCEBD] uppercase font-sans font-medium mb-1">
                    COLLECTION
                  </p>
                  <h3
                    className="text-2xl sm:text-3xl font-normal tracking-wide text-white uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {cat.title}
                  </h3>

                  {cat.description && (
                    <p className="text-xs font-sans font-light text-[#FAF7F2]/80 line-clamp-2 mt-1 mb-2">
                      {cat.description}
                    </p>
                  )}

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium tracking-[0.2em] text-[#DBCEBD] group-hover:text-white transition-colors duration-200">
                    <span>{cat.subtitle}</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
