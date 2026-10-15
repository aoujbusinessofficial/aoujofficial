"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Orders", href: "/admin/orders", icon: <ShoppingBag size={18} /> },
    { label: "Products", href: "/admin/products", icon: <Package size={18} /> },
    { label: "Clients", href: "/admin/users", icon: <Users size={18} /> },
    { label: "Promos & Sale", href: "/admin/promos", icon: <Tag size={18} /> },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#151007] text-[#FAF7F2] border-b border-[#3A2E21]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 text-[#AF997E] hover:text-[#FAF7F2]"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span
            className="font-serif text-lg tracking-widest text-[#FAF7F2]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            AOUJ <span className="text-xs uppercase text-[#907553] font-sans tracking-normal">ADMIN</span>
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-sans text-[#AF997E] hover:text-[#FAF7F2] flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#151007] text-[#FAF7F2] border-r border-[#3A2E21] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Brand */}
          <div className="p-6 border-b border-[#3A2E21]/80 flex items-center justify-between">
            <div>
              <Link href="/admin" className="block">
                <span
                  className="font-serif text-2xl tracking-[0.2em] text-[#FAF7F2] font-medium block"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  AOUJ
                </span>
                <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#907553] block mt-0.5">
                  ATELIER MANAGEMENT
                </span>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-[#AF997E] hover:text-[#FAF7F2]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Admin User Badge */}
          <div className="px-6 py-4 bg-[#1A140A] border-b border-[#3A2E21]/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#907553] text-[#FAF7F2] font-serif text-sm flex items-center justify-center font-medium">
              {admin?.fullName?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-sans font-medium text-[#FAF7F2] truncate">
                {admin?.fullName || "Administrator"}
              </p>
              <p className="text-[10px] font-sans text-[#907553] flex items-center gap-1">
                <ShieldCheck size={11} /> Master Admin
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-sans tracking-wide transition-all ${
                    isActive
                      ? "bg-[#907553] text-[#FAF7F2] font-medium shadow-sm"
                      : "text-[#DBCEBD]/80 hover:text-[#FAF7F2] hover:bg-[#3A2E21]/40"
                  }`}
                >
                  <span className={isActive ? "text-[#FAF7F2]" : "text-[#907553]"}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#3A2E21] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-sans text-[#DBCEBD]/70 hover:text-[#FAF7F2] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>Live Storefront</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#907553] px-1.5 py-0.5 border border-[#907553]/40">
              OPEN
            </span>
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 w-full px-3.5 py-2 text-xs font-sans text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
