import React from "react";
import { Truck, PackageCheck, ShieldCheck, Headphones } from "lucide-react";
import { benefitsData } from "@/data/content";

export const Benefits: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Truck":
        return <Truck size={24} strokeWidth={1.25} className="text-[#151007]" />;
      case "PackageCheck":
        return <PackageCheck size={24} strokeWidth={1.25} className="text-[#151007]" />;
      case "ShieldCheck":
        return <ShieldCheck size={24} strokeWidth={1.25} className="text-[#151007]" />;
      case "Headphones":
        return <Headphones size={24} strokeWidth={1.25} className="text-[#151007]" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAF7F2] border-t border-b border-[#D8C9B6]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:divide-x lg:divide-[#D8C9B6]/60">
          {benefitsData.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`flex flex-col items-center text-center px-3 sm:px-4 ${
                index !== 0 ? "lg:pl-8" : ""
              }`}
            >
              <div className="mb-3 p-2.5 rounded-full bg-[#F2EAE0] text-[#151007]">
                {getIcon(benefit.iconName)}
              </div>
              <h4 className="text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#151007]">
                {benefit.title}
              </h4>
              <p className="text-xs font-sans font-light text-[#3A2E21]/70 mt-1 max-w-[200px]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
