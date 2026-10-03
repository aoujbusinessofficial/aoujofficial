"use client";

import React from "react";
import Image from "next/image";
import { instagramData } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/ui/SocialIcons";

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Header */}
        <SectionHeading
          eyebrow="@AOUJ"
          title="On Instagram"
          subtitle="Follow us for daily inspiration."
          actionText="FOLLOW ON INSTAGRAM"
          actionHref="https://instagram.com"
        />

        {/* 6 Tiles: 3 cols on mobile, 6 cols on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5">
          {instagramData.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Instagram post: ${post.alt}`}
              className="group relative aspect-square w-full overflow-hidden bg-[#F2EAE0] select-none block"
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
              />

              {/* Hover Overlay with Instagram Icon */}
              <div className="absolute inset-0 bg-[#151007]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-1 scale-90 group-hover:scale-100 transition-transform duration-300">
                  <InstagramIcon size={22} className="text-[#FAF7F2]" />
                  <span className="text-[10px] font-sans tracking-widest text-[#FAF7F2]/90">
                    {post.likes}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
