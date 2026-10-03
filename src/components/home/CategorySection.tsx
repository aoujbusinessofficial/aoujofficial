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
          actionText="EXPLORE ALL"
          actionHref="#collections"
        />

        {/* 4 Cards Grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
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
                className="group relative block aspect-[3/4] w-full overflow-hidden bg-[#F2EAE0] select-none"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={`AOUJ ${cat.title} collection`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/85 via-[#151007]/25 to-transparent transition-opacity duration-300 group-hover:from-[#151007]/90" />

                {/* Text Content at Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col justify-end text-[#FAF7F2]">
                  <h3
                    className="text-lg sm:text-2xl font-normal tracking-wide text-white uppercase"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {cat.title}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.2em] text-[#DBCEBD] mt-1 group-hover:text-white transition-colors duration-200">
                    <span>{cat.subtitle}</span>
                    <ArrowRight
                      size={12}
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
