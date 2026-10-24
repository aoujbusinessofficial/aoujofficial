import React from "react";
import { ShieldCheck, Award, Sparkles } from "lucide-react";

interface FabricGuaranteeBadgeProps {
  variant?: "full" | "compact" | "badge";
  className?: string;
}

export function FabricGuaranteeBadge({
  variant = "full",
  className = "",
}: FabricGuaranteeBadgeProps) {
  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#FAF7F2] border border-[#D8C9B6] text-[#151007] text-[11px] font-sans ${className}`}
      >
        <Award size={15} className="text-[#907553] shrink-0" />
        <span className="font-medium tracking-wide">
          100% Pure Fabric &amp; Handcrafted Artisan Guarantee
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-[#F7F1E8] border border-[#D8C9B6] text-[#151007] space-y-2 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#907553]/15 flex items-center justify-center text-[#907553] shrink-0">
          <Award size={18} />
        </div>
        <div>
          <h4
            className="text-sm font-serif font-semibold tracking-wide text-[#151007]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            100% Pure Fabric &amp; Handcrafted Artisan Guarantee
          </h4>
          <p className="text-[10px] uppercase tracking-wider text-[#907553] font-sans">
            AOUJ Atelier Authenticity Seal
          </p>
        </div>
      </div>
      <p className="text-[11.5px] font-sans text-[#3A2E21]/85 leading-relaxed pl-10.5">
        Each creation is meticulously tailored using certified pure textiles and master Pakistani hand-embroidery. We guarantee no synthetic blends or imitation work.
      </p>
    </div>
  );
}
