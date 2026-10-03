"use client";

import React, { useState } from "react";
import { ProductColor } from "@/data/products";

interface ColorSwatchesProps {
  colors: ProductColor[];
  onSelectColor?: (color: ProductColor) => void;
  className?: string;
}

export const ColorSwatches: React.FC<ColorSwatchesProps> = ({
  colors,
  onSelectColor,
  className = "",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!colors || colors.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="radiogroup" aria-label="Available colors">
      {colors.map((color, index) => {
        const isSelected = selectedIndex === index;
        return (
          <button
            key={color.name + index}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={color.name}
            title={color.name}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(index);
              onSelectColor?.(color);
            }}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 cursor-pointer p-[1px] ${
              isSelected ? "ring-1 ring-[#151007] scale-110" : "hover:scale-105"
            }`}
          >
            <span
              className="block w-full h-full rounded-full border border-black/10"
              style={{ backgroundColor: color.hex }}
            />
          </button>
        );
      })}
    </div>
  );
};
