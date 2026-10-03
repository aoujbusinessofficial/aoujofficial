"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="bg-[#151007] text-[#FAF7F2] py-14 sm:py-20 relative overflow-hidden">
      {/* Subtle Botanical / Leaf Motif on Left in warm champagne */}
      <div className="absolute -left-12 -top-12 sm:left-4 sm:top-1/2 sm:-translate-y-1/2 opacity-15 pointer-events-none select-none">
        <svg
          width="260"
          height="260"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M30 170C50 140 70 80 160 30C130 90 90 140 30 170Z"
            stroke="#907553"
            strokeWidth="1.5"
            fill="#907553"
            fillOpacity="0.1"
          />
          <path
            d="M30 170C60 130 110 90 160 30"
            stroke="#907553"
            strokeWidth="1.2"
          />
          <path
            d="M70 120C85 105 105 100 120 100"
            stroke="#907553"
            strokeWidth="0.8"
          />
          <path
            d="M95 95C110 80 130 75 145 75"
            stroke="#907553"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-2">
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#907553]">
              STAY CONNECTED
            </p>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#FAF7F2] tracking-wide"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Join Our Community
            </h2>
            <p className="text-xs sm:text-sm font-sans font-light text-[#DBCEBD]/80 max-w-md pt-1">
              Be the first to know about new collections, exclusive offers and more.
            </p>
          </div>

          {/* Right Input Form */}
          <div className="lg:col-span-6">
            {isSubmitted ? (
              <div className="flex items-center gap-3 p-4 bg-[#3A2E21]/60 border border-[#907553]/40 text-[#FAF7F2]">
                <Check size={18} className="text-[#907553]" />
                <span className="text-xs sm:text-sm font-sans tracking-wide">
                  Welcome to AOUJ. Check your inbox for your welcome privilege code.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your email address"
                  required
                  aria-label="Email address for newsletter"
                  className="flex-1 bg-[#FAF7F2] text-[#211A12] text-xs sm:text-[13px] font-sans px-4 py-3.5 placeholder:text-[#3A2E21]/50 placeholder:font-light focus:outline-none border border-[#FAF7F2] focus:border-[#907553]"
                />
                <button
                  type="submit"
                  className="bg-[#907553] hover:bg-[#7D6444] text-[#FAF7F2] text-[11px] font-sans font-medium uppercase tracking-[0.2em] px-6 py-3.5 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99] border border-[#907553] shrink-0"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
