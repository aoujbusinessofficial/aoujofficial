"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroSlide {
  id: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  image: string;
  imageAlt: string;
}

const slides: HeroSlide[] = [
  {
    id: "slide-1",
    eyebrow: "THE NEW COLLECTION",
    titleLine1: "RISE IN YOUR",
    titleLine2: "OWN WAY",
    subtitle: "Elegance for every chapter of your life.",
    primaryCtaText: "SHOP WOMEN",
    primaryCtaHref: "#women",
    secondaryCtaText: "SHOP KIDS",
    secondaryCtaHref: "#kids",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=85&w=1800&auto=format&fit=crop",
    imageAlt: "AOUJ Rise in Your Own Way - Editorial fashion model in embroidered lawn",
  },
  {
    id: "slide-2",
    eyebrow: "SUMMER LUXURY '26",
    titleLine1: "POETIC",
    titleLine2: "MINIMALISM",
    subtitle: "Artisanal hand-embroidered raw silks and breathable linens.",
    primaryCtaText: "EXPLORE EDIT",
    primaryCtaHref: "#new-arrivals",
    secondaryCtaText: "VIEW CATALOG",
    secondaryCtaHref: "#collections",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=1800&auto=format&fit=crop",
    imageAlt: "AOUJ Summer Luxury campaign",
  },
  {
    id: "slide-3",
    eyebrow: "AOUJ JUNIOR",
    titleLine1: "LITTLE HEIRS OF",
    titleLine2: "GRACE",
    subtitle: "Soft festive coordinates tailored for young dreamers.",
    primaryCtaText: "SHOP GIRLS",
    primaryCtaHref: "#kids",
    secondaryCtaText: "SHOP BOYS",
    secondaryCtaHref: "#kids",
    image:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=85&w=1800&auto=format&fit=crop",
    imageAlt: "AOUJ Junior festive pret collection",
  },
];

export const Hero: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const activeSlide = slides[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative w-full bg-[#EFE9DF] overflow-hidden min-h-[580px] sm:min-h-[640px] lg:h-[78vh] max-h-[860px] flex items-center">
      {/* Background Image Carousel with subtle scale & fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={activeSlide.image}
            alt={activeSlide.imageAlt}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-[center_28%] lg:object-[68%_25%]"
          />

          {/* Editorial Gradient Overlay for legibility: warm ivory to transparent */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent sm:via-[#FAF7F2]/50 sm:to-transparent lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/60 via-transparent to-transparent sm:hidden" />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id + "-content"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Eyebrow */}
              <p className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.25em] text-[#907553]">
                {activeSlide.eyebrow}
              </p>

              {/* Editorial Large Serif Heading */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#151007] font-normal leading-[1.05] tracking-tight uppercase"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {activeSlide.titleLine1}
                <br />
                <span className="italic font-light">{activeSlide.titleLine2}</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base md:text-lg font-sans font-light text-[#3A2E21] max-w-md leading-relaxed">
                {activeSlide.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button
                  variant="primary"
                  size="md"
                  href={activeSlide.primaryCtaHref}
                  withArrow
                >
                  {activeSlide.primaryCtaText}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href={activeSlide.secondaryCtaHref}
                  withArrow
                >
                  {activeSlide.secondaryCtaText}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Hero Controls */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Slide Indicators: -- 01 02 03 */}
          <div className="flex items-center gap-3 pointer-events-auto">
            {slides.map((slide, index) => {
              const isActive = currentSlideIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlideIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="flex items-center gap-2 group cursor-pointer focus:outline-none py-1"
                >
                  <span
                    className={`h-[1.5px] transition-all duration-300 ${
                      isActive ? "w-7 sm:w-9 bg-[#151007]" : "w-3 sm:w-4 bg-[#3A2E21]/30 group-hover:bg-[#3A2E21]/60"
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-sans font-medium transition-colors ${
                      isActive ? "text-[#151007]" : "text-[#3A2E21]/50 group-hover:text-[#151007]"
                    }`}
                  >
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Prev / Next Circular Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Hero slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#151007] text-[#FAF7F2] border border-[#3A2E21] flex items-center justify-center hover:bg-[#3A2E21] hover:border-[#907553] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Hero slide"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#151007] text-[#FAF7F2] border border-[#3A2E21] flex items-center justify-center hover:bg-[#3A2E21] hover:border-[#907553] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
