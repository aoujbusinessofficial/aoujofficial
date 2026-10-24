"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      router.replace("/login");
      return;
    }
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#151007] flex items-center justify-center text-[#FAF7F2]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#907553] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-sans tracking-[0.2em] text-[#AF997E]">
            Authenticating Atelier Access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#211A12] flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-[#FAF7F2] border-b border-[#D8C9B6] px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-sans text-[#3A2E21]/80">
              Database: <strong className="text-[#151007]">Supabase Live</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-sans">
            <span className="px-2.5 py-1 bg-[#F7F1E8] border border-[#D8C9B6] text-[#907553] text-[10px] uppercase tracking-wider font-semibold">
              Admin Portal
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
