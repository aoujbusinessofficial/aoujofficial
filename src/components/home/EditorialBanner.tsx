"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export const EditorialBanner: React.FC = () => {
  return (
    <section
      id="the-everyday-edit"
      className="w-full bg-[#E5DACE] my-6 sm:my-10 overflow-hidden relative"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[420px] lg:h-[500px]">
        {/* Left Editorial Copy Area */}
        <div className="lg:col-span-5 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 z-10">
          <div className="space-y-4 max-w-md">
            <div>
              <p
                className="text-xs sm:text-sm font-sans font-medium uppercase tracking-[0.25em] text-[#907553] mb-1"
              >
                THE
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#151007] font-normal leading-[1.1] uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                EVERYDAY EDIT
              </h2>
            </div>

            <p className="text-sm sm:text-base font-sans font-light text-[#3A2E21] leading-relaxed">
              Effortless silhouettes, timeless designs and versatile pieces for every moment.
            </p>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                href="#collections"
                withArrow
              >
                EXPLORE COLLECTION
              </Button>
            </div>
          </div>
        </div>

        {/* Right / Background Editorial Image */}
        <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full w-full overflow-hidden bg-[#D8C9B6]">
          <Image
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=1400&auto=format&fit=crop"
            alt="The Everyday Edit - Luxury Pakistani Pret by AOUJ"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[center_35%]"
          />
          {/* Subtle gradient blending on desktop */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#E5DACE] to-transparent" />
        </div>
      </div>
    </section>
  );
};
