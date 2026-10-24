"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#151007] flex items-center justify-center text-[#FAF7F2]">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#907553] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase font-sans tracking-[0.2em] text-[#AF997E]">
          Redirecting to Atelier Sign In...
        </p>
      </div>
    </div>
  );
}
