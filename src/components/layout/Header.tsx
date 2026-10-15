"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu } from "lucide-react";
import { navigationData, NavItem } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const { totalCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavMouseEnter = (item: NavItem) => {
    if (item.hasDropdown && item.megaMenu) {
      setActiveItem(item);
      setIsMenuOpen(true);
    } else {
      setActiveItem(null);
      setIsMenuOpen(false);
    }
  };

  const handleNavMouseLeave = () => {
    setIsMenuOpen(false);
    setActiveItem(null);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D8C9B6]/60 transition-all duration-300 ${
        isScrolled ? "shadow-sm py-2" : "py-3 sm:py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 -ml-2 text-[#211A12] hover:text-[#907553] cursor-pointer"
            >
              <Menu size={22} strokeWidth={1.75} />
            </button>
          </div>

          {/* Left Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8 flex-1">
            {navigationData.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => handleNavMouseEnter(item)}
                className="relative py-2"
              >
                <Link
                  href={item.href}
                  className="text-[12px] xl:text-[13px] font-sans font-medium uppercase tracking-[0.18em] text-[#211A12] hover:text-[#907553] transition-colors duration-200 relative pb-1 group"
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#907553] transition-all duration-300 group-hover:w-full ${
                      activeItem?.label === item.label && isMenuOpen ? "w-full" : ""
                    }`}
                  />
                </Link>
              </div>
            ))}
          </nav>

          {/* Center Brand Logo */}
          <div className="flex items-center justify-center shrink-0 px-4">
            <Logo size="md" />
          </div>

          {/* Right Actions (Search + Icons) */}
          <div className="flex items-center justify-end gap-3 sm:gap-5 lg:gap-6 flex-1">
            {/* Desktop Minimal Search Bar */}
            <div className="hidden xl:flex items-center relative w-48 2xl:w-56">
              <Search
                size={14}
                className="absolute left-2.5 text-[#3A2E21]/50 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-[#FAF7F2] border-b border-[#D8C9B6] text-[11px] font-sans py-1.5 pl-7 pr-2 text-[#211A12] placeholder:text-[#3A2E21]/50 focus:outline-none focus:border-[#907553] transition-colors"
              />
            </div>

            {/* Mobile / Tablet Search Icon */}
            <button
              type="button"
              aria-label="Search catalog"
              className="xl:hidden p-2 text-[#211A12] hover:text-[#907553] cursor-pointer"
              onClick={() => setIsMobileDrawerOpen(true)}
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="#wishlist"
              aria-label="Wishlist items"
              className="p-2 text-[#211A12] hover:text-[#907553] transition-colors"
            >
              <Heart size={19} strokeWidth={1.5} />
            </Link>

            {/* Account Icon */}
            <Link
              href="/account"
              aria-label={isAuthenticated ? `Account for ${user?.name}` : "Customer account (Login/Signup/Guest)"}
              className="hidden sm:inline-flex items-center p-2 text-[#211A12] hover:text-[#907553] transition-colors relative"
            >
              <User size={19} strokeWidth={1.5} />
              {isAuthenticated && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#907553] absolute top-2 right-1.5" />
              )}
            </Link>

            {/* Shopping Bag Icon with Live Badge */}
            <Link
              href="/cart"
              aria-label={`Shopping bag with ${totalCount} items`}
              className="relative p-2 text-[#211A12] hover:text-[#907553] transition-colors"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              <span className="absolute top-1 right-0 min-w-[16px] h-4 rounded-full bg-[#151007] text-[#FAF7F2] text-[9px] font-sans font-medium flex items-center justify-center px-1 border border-[#FAF7F2]">
                {totalCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <div onMouseLeave={handleNavMouseLeave}>
        <MegaMenu
          item={activeItem}
          isOpen={isMenuOpen}
          onMouseEnter={() => setIsMenuOpen(true)}
          onMouseLeave={handleNavMouseLeave}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
    </header>
  );
};
