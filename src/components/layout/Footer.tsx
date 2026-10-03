"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
  TikTokIcon,
} from "@/components/ui/SocialIcons";

export const Footer: React.FC = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shop: false,
    help: false,
    about: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const footerLinks = {
    shop: [
      { name: "Women", href: "#women" },
      { name: "Kids", href: "#kids" },
      { name: "New In", href: "#new-arrivals" },
      { name: "Collections", href: "#collections" },
      { name: "Sale", href: "#sale" },
    ],
    help: [
      { name: "Track Order", href: "#" },
      { name: "Shipping Policy", href: "#" },
      { name: "Returns & Exchange", href: "#" },
      { name: "Size Guide", href: "#" },
      { name: "FAQs", href: "#" },
    ],
    about: [
      { name: "Our Story", href: "#" },
      { name: "Sustainability", href: "#" },
      { name: "Contact Us", href: "#" },
    ],
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#D8C9B6] text-[#211A12] pt-14 pb-8 sm:pt-16 sm:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#D8C9B6]/60">
          {/* Brand Info */}
          <div className="md:col-span-4 flex flex-col items-start space-y-4">
            <Logo size="md" />
            <p className="text-xs sm:text-[13px] font-sans text-[#3A2E21]/80 max-w-sm leading-relaxed mt-2">
              Poetic silhouettes and modern heirloom craftsmanship. Celebrating
              the enduring spirit of Eastern elegance for modern women and children.
            </p>
          </div>

          {/* SHOP Column */}
          <div className="md:col-span-2 border-b md:border-b-0 border-[#D8C9B6]/40 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("shop")}
              className="w-full flex items-center justify-between md:cursor-default text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#151007] mb-3 md:mb-4 cursor-pointer"
            >
              <span>SHOP</span>
              <ChevronDown
                size={14}
                className={`md:hidden text-[#907553] transition-transform ${
                  openSections.shop ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs font-sans text-[#3A2E21]/80 ${
                openSections.shop ? "block" : "hidden md:block"
              }`}
            >
              {footerLinks.shop.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[#907553] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP Column */}
          <div className="md:col-span-2 border-b md:border-b-0 border-[#D8C9B6]/40 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("help")}
              className="w-full flex items-center justify-between md:cursor-default text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#151007] mb-3 md:mb-4 cursor-pointer"
            >
              <span>HELP</span>
              <ChevronDown
                size={14}
                className={`md:hidden text-[#907553] transition-transform ${
                  openSections.help ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs font-sans text-[#3A2E21]/80 ${
                openSections.help ? "block" : "hidden md:block"
              }`}
            >
              {footerLinks.help.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[#907553] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ABOUT Column */}
          <div className="md:col-span-2 border-b md:border-b-0 border-[#D8C9B6]/40 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleSection("about")}
              className="w-full flex items-center justify-between md:cursor-default text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#151007] mb-3 md:mb-4 cursor-pointer"
            >
              <span>ABOUT</span>
              <ChevronDown
                size={14}
                className={`md:hidden text-[#907553] transition-transform ${
                  openSections.about ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul
              className={`space-y-2.5 text-xs font-sans text-[#3A2E21]/80 ${
                openSections.about ? "block" : "hidden md:block"
              }`}
            >
              {footerLinks.about.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[#907553] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* FOLLOW US Column */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#151007] mb-3 md:mb-4">
              FOLLOW US
            </h4>
            <div className="flex items-center gap-3 text-[#151007]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AOUJ on Instagram"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center hover:border-[#907553] hover:text-[#907553] transition-colors"
              >
                <InstagramIcon size={14} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AOUJ on Facebook"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center hover:border-[#907553] hover:text-[#907553] transition-colors"
              >
                <FacebookIcon size={14} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AOUJ on TikTok"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center hover:border-[#907553] hover:text-[#907553] transition-colors"
              >
                <TikTokIcon size={13} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AOUJ on YouTube"
                className="w-8 h-8 rounded-full border border-[#D8C9B6] flex items-center justify-center hover:border-[#907553] hover:text-[#907553] transition-colors"
              >
                <YoutubeIcon size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#3A2E21]/70">
          <p>© 2026 Aouj. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="#privacy"
              className="hover:text-[#907553] transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-[#D8C9B6]">•</span>
            <Link
              href="#terms"
              className="hover:text-[#907553] transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
