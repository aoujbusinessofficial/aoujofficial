import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Heart,
  Feather,
  Scissors,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Compass,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Our Story & Philosophy | AOUJ",
  description:
    "Discover the story of AOUJ (اوج). A luxury Pakistani fashion house honoring artisanal heritage, slow fashion, bespoke fit, and heirloom garments for women and children.",
};

export default function AboutPage() {
  const brandPillars = [
    {
      number: "01",
      title: "Women's Pret & Couture",
      subtitle: "Effortless Grace for the Modern Soul",
      description:
        "Every piece is sculpted to move effortlessly with the woman who wears it. From hand-embellished formal kurtas to breathable everyday cotton-lawn coords, our silhouettes celebrate quiet luxury and understated power.",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=85&w=800&auto=format&fit=crop",
      link: "/products?category=women",
      linkText: "Explore Women's Pret",
    },
    {
      number: "02",
      title: "Little Petals (Girls' Couture)",
      subtitle: "Gentle Comfort for Cherished Moments",
      description:
        "Childhood is filled with innocent wonders. We design children's festive wear with skin-gentle mulmul linings, non-scratch seams, and playful traditional silhouettes from newborns to teenage years.",
      image:
        "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=85&w=800&auto=format&fit=crop",
      link: "/products?category=girls",
      linkText: "Explore Girls' Collection",
    },
    {
      number: "03",
      title: "Family Heirloom Edits",
      subtitle: "Honoring Generational Bonds",
      description:
        "There is nothing more evocative than a mother and daughter stepping into a celebration dressed in shared colors and complimentary motifs. Our family collections create keepsake memories destined for photo albums.",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=85&w=800&auto=format&fit=crop",
      link: "/products?category=family",
      linkText: "Explore Family Edits",
    },
  ];

  const craftPrinciples = [
    {
      icon: <Scissors className="w-5 h-5 text-[#907553]" />,
      title: "Master Karigari",
      description:
        "Each embroidery motif is drawn by hand, interpreting ancestral subcontinental florals through resham threads, shadow work, and delicate gota accents.",
    },
    {
      icon: <Feather className="w-5 h-5 text-[#907553]" />,
      title: "Pure, Breathable Fibres",
      description:
        "We source combed pima lawn, pure raw silk, and handloom cottons suited for the climate—soft against sensitive skin and gracefully enduring.",
    },
    {
      icon: <Compass className="w-5 h-5 text-[#907553]" />,
      title: "Bespoke Custom Tailoring",
      description:
        "We reject rigid sizing standardizations. Every customer can provide exact custom measurements for a bespoke fit that flatters individual beauty.",
    },
    {
      icon: <Heart className="w-5 h-5 text-[#907553]" />,
      title: "Mindful, Conscious Craft",
      description:
        "Produced in intentional small batches. We ensure safe, respectful working conditions and fair living wages for our master artisans and tailors.",
    },
  ];

  const milestones = [
    {
      metric: "100%",
      label: "Artisanal Craftsmanship",
      detail: "Hand-finished borders, intricate needlework, and bespoke cutwork.",
    },
    {
      metric: "0–15 Y",
      label: "Inclusive Sizing",
      detail: "From newborn infants to teen extra-large and women's custom fit.",
    },
    {
      metric: "Pure",
      label: "Gentle Fabrics",
      detail: "Zero synthetic skin-irritants, breathable cottons and rich festive silks.",
    },
    {
      metric: "1-on-1",
      label: "Bespoke Fitting",
      detail: "Made-to-order options tailored to your personal measurements.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Header */}
      <Header />

      <main className="flex-1 w-full">
        {/* Breadcrumb Navigation */}
        <section className="bg-[#FAF7F2] border-b border-[#D8C9B6]/40 py-3.5">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center gap-2 text-xs font-sans text-[#3A2E21]/70">
            <Link href="/" className="hover:text-[#907553] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#907553]" />
            <span className="text-[#151007] font-medium tracking-wide">
              Our Story & Philosophy
            </span>
          </div>
        </section>

        {/* 1. Hero Section / Editorial Prelude */}
        <section className="relative overflow-hidden bg-[#F7F1E8] border-b border-[#D8C9B6]/60 py-16 sm:py-24 lg:py-28">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Text Block */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#FAF7F2] border border-[#D8C9B6] text-[11px] font-sans uppercase tracking-[0.22em] text-[#907553]">
                  <Sparkles size={12} />
                  <span>The Story of AOUJ</span>
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl text-[#151007] font-normal leading-[1.08] tracking-tight uppercase"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Rise in Your <br />
                  <span className="italic font-light text-[#907553]">Own Way</span>
                </h1>

                <p className="text-base sm:text-lg font-sans font-light text-[#3A2E21] leading-relaxed max-w-xl">
                  AOUJ (<span className="font-serif italic font-normal">اوج</span>) represents the highest pinnacle—the zenith of grace, individuality, and achievement. We craft garments that don’t ask you to fit in, but empower you to ascend on your own terms.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="md" href="/products" withArrow>
                    EXPLORE THE ATELIER
                  </Button>
                  <Button variant="outline" size="md" href="#philosophy">
                    OUR PHILOSOPHY
                  </Button>
                </div>
              </div>

              {/* Right Editorial Hero Portrait */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden bg-[#D8C9B6] border border-[#D8C9B6] shadow-xl shadow-[#151007]/5">
                  <Image
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=85&w=1000&auto=format&fit=crop"
                    alt="AOUJ Editorial Fashion Craft"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151007]/40 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-[#FAF7F2] font-serif text-sm italic tracking-wide">
                    &ldquo;Heirloom fashion created with heartfelt reverence for Eastern beauty.&rdquo;
                  </div>
                </div>

                {/* Decorative floating badge */}
                <div className="absolute -bottom-6 -left-4 sm:left-4 bg-[#FAF7F2] border border-[#D8C9B6] p-4 shadow-lg hidden sm:block">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-sans font-medium text-[#907553]">
                    HANDCRAFTED IN GUJRAT, PUNJAB
                  </p>
                  <p
                    className="text-lg text-[#151007] font-normal leading-tight"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    Pakistani Heritage Couture
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Brand Genesis / The Meaning of AOUJ */}
        <section id="philosophy" className="py-20 sm:py-28 bg-[#FAF7F2]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] font-sans text-[#907553] font-medium">
                THE GENESIS
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#151007] font-normal uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                The Meaning of اوج
              </h2>
              <div className="w-16 h-[1.5px] bg-[#907553] mx-auto my-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-6 text-[#3A2E21] font-sans font-light text-sm sm:text-base leading-relaxed">
                <p>
                  In the poetic traditions of Urdu and Arabic, the word <strong className="font-serif text-[#151007] font-normal italic text-lg">Aouj</strong> denotes the highest point in celestial heavens—the zenith, the apex of grace, and the absolute peak of refinement.
                </p>
                <p>
                  We founded <strong>AOUJ</strong> because modern retail had grown hasty, generic, and detached from the soul of our textile legacy. We sought to build an atelier that breathes with deliberateness: honoring the centuries-old embroidery techniques of Multan, Lahore, and Karachi while infusing them with clean, modern architectural cuts.
                </p>
                <p className="border-l-2 border-[#907553] pl-4 italic text-[#151007]">
                  &ldquo;We don’t believe women or their daughters should be constrained by passing trends. Clothing should be an extension of your quiet strength, your gentleness, and your personal triumph.&rdquo;
                </p>
              </div>

              <div className="relative aspect-[3/4] w-full bg-[#E5DACE] overflow-hidden border border-[#D8C9B6]">
                <Image
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=900&auto=format&fit=crop"
                  alt="AOUJ Textile Artistry"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Three Pillars of Our Collection */}
        <section className="py-20 sm:py-28 bg-[#F7F1E8] border-y border-[#D8C9B6]/60">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] font-sans text-[#907553] font-medium">
                OUR DESIGN ETHOS
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#151007] font-normal uppercase tracking-wide"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                The Three Pillars of AOUJ
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 max-w-lg mx-auto">
                Thoughtfully curated to accompany every stage of life and familial celebration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {brandPillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-[#FAF7F2] border border-[#D8C9B6] flex flex-col justify-between group hover:border-[#907553] transition-all duration-300"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#D8C9B6]">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4 bg-[#151007] text-[#FAF7F2] text-[11px] font-sans font-medium px-2.5 py-1 tracking-widest">
                      {pillar.number}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                    <div className="space-y-3 mb-6">
                      <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#907553]">
                        {pillar.subtitle}
                      </p>
                      <h3
                        className="text-2xl text-[#151007] font-normal"
                        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                      >
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] font-sans font-light text-[#3A2E21]/80 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    <Link
                      href={pillar.link}
                      className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#151007] group-hover:text-[#907553] transition-colors"
                    >
                      <span>{pillar.linkText}</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Atelier & Craftsmanship */}
        <section id="craft" className="py-20 sm:py-28 bg-[#FAF7F2]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Details */}
              <div className="lg:col-span-5 space-y-6">
                <p className="text-xs uppercase tracking-[0.25em] font-sans text-[#907553] font-medium">
                  ATELIER STANDARDS
                </p>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl text-[#151007] font-normal uppercase leading-[1.1]"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  Artisanal Integrity in Every Thread
                </h2>
                <p className="text-sm font-sans font-light text-[#3A2E21] leading-relaxed">
                  Fast fashion discards craft. At AOUJ, we collaborate directly with master craftsmen (<span className="italic font-serif">ustad karigars</span>) whose families have dedicated generations to perfecting traditional needlework, tilla, and fine finishings.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  {craftPrinciples.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <div className="w-9 h-9 rounded-full bg-[#F7F1E8] border border-[#D8C9B6] flex items-center justify-center">
                        {item.icon}
                      </div>
                      <h4 className="text-xs font-sans font-medium uppercase tracking-[0.16em] text-[#151007]">
                        {item.title}
                      </h4>
                      <p className="text-xs font-sans text-[#3A2E21]/75 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Atelier Visual Grid */}
              <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#D8C9B6] border border-[#D8C9B6]">
                  <Image
                    src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
                    alt="Intricate embroidery detail"
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#D8C9B6] border border-[#D8C9B6] mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop"
                    alt="Fine textile texture and handloom weave"
                    fill
                    sizes="(max-width: 1024px) 50vw, 30vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Metrics & Milestones */}
        <section className="bg-[#151007] text-[#FAF7F2] py-16 sm:py-20 border-y border-[#3A2E21]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#3A2E21]/60">
              {milestones.map((item, idx) => (
                <div key={item.label} className={`pt-6 lg:pt-0 ${idx > 0 ? "lg:pl-8" : ""}`}>
                  <p
                    className="text-4xl sm:text-5xl text-[#AF997E] font-normal mb-2"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {item.metric}
                  </p>
                  <p className="text-xs font-sans font-medium uppercase tracking-[0.2em] text-[#FAF7F2] mb-1">
                    {item.label}
                  </p>
                  <p className="text-[11px] font-sans text-[#FAF7F2]/60 max-w-[220px] mx-auto leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Editorial Quote */}
        <section className="py-20 sm:py-24 bg-[#F2EAE0] text-center border-b border-[#D8C9B6]/60">
          <div className="max-w-3xl mx-auto px-4 sm:px-8">
            <span className="text-4xl text-[#907553] font-serif block mb-2">&ldquo;</span>
            <blockquote
              className="text-2xl sm:text-3xl lg:text-4xl text-[#151007] font-normal leading-snug tracking-wide italic"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              We do not create fashion to dictate who you should be. We tailor garments so you may rise in your own way.
            </blockquote>
            <p className="text-xs uppercase tracking-[0.25em] font-sans text-[#3A2E21] font-medium mt-6">
              — The Founders of AOUJ
            </p>
          </div>
        </section>

        {/* 7. Call To Action (Explore the Collections) */}
        <section className="py-16 sm:py-20 bg-[#FAF7F2]">
          <div className="max-w-[1000px] mx-auto px-4 sm:px-8 text-center space-y-6">
            <h3
              className="text-3xl sm:text-4xl text-[#151007] font-normal uppercase tracking-wide"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Step Into the World of AOUJ
            </h3>
            <p className="text-xs sm:text-sm font-sans font-light text-[#3A2E21] max-w-md mx-auto leading-relaxed">
              Explore our latest pret, curated kids’ festive ensembles, and heirloom matching family coordinates.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
              <Button variant="primary" size="md" href="/products?category=women" withArrow>
                WOMEN&apos;S PRET
              </Button>
              <Button variant="secondary" size="md" href="/products?category=girls">
                GIRLS&apos; COLLECTION
              </Button>
              <Button variant="outline" size="md" href="/products?category=family">
                FAMILY EDITS
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
