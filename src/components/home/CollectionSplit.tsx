"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const CollectionSplit: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: WOMEN'S COLLECTION */}
          <div
            id="women-collection"
            className="group relative overflow-hidden bg-[#E2D5C7] min-h-[380px] sm:min-h-[440px] flex flex-col justify-end"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=1200&auto=format&fit=crop"
                alt="AOUJ Women's Collection - Modern Elegance"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-[70%_25%] transition-transform duration-700 ease-out group-hover:scale-103"
              />
              {/* Soft warm ivory / sand gradient overlay on the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#E2D5C7]/95 via-[#E2D5C7]/75 to-transparent w-[80%] sm:w-[70%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#E2D5C7]/90 via-transparent to-transparent sm:hidden" />
            </div>

            {/* Content Box */}
            <div className="relative z-10 p-6 sm:p-10 max-w-xs sm:max-w-sm space-y-3">
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl text-[#151007] font-normal uppercase leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                WOMEN&apos;S
                <br />
                COLLECTION
              </h3>
              <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21] leading-relaxed">
                Modern elegance for the modern woman.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  href="#women"
                  withArrow
                >
                  SHOP WOMEN
                </Button>
              </div>
            </div>
          </div>

          {/* Card 2: KIDS COLLECTION */}
          <div
            id="kids-collection"
            className="group relative overflow-hidden bg-[#EADFD5] min-h-[380px] sm:min-h-[440px] flex flex-col justify-end"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=85&w=1200&auto=format&fit=crop"
                alt="AOUJ Kids Collection - Little Styles for Big Personalities"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-[75%_25%] transition-transform duration-700 ease-out group-hover:scale-103"
              />
              {/* Soft warm gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#EADFD5]/95 via-[#EADFD5]/75 to-transparent w-[80%] sm:w-[70%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#EADFD5]/90 via-transparent to-transparent sm:hidden" />
            </div>

            {/* Content Box */}
            <div className="relative z-10 p-6 sm:p-10 max-w-xs sm:max-w-sm space-y-3">
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl text-[#151007] font-normal uppercase leading-tight"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                KIDS
                <br />
                COLLECTION
              </h3>
              <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21] leading-relaxed">
                Little styles for big personalities.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  href="#kids"
                  withArrow
                >
                  SHOP KIDS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
