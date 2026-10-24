import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { CategorySection } from "@/components/home/CategorySection";
import { ProductSection } from "@/components/home/ProductSection";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { CollectionSplit } from "@/components/home/CollectionSplit";
import { Benefits } from "@/components/home/Benefits";
import { InstagramSection } from "@/components/home/InstagramSection";
import { Newsletter } from "@/components/home/Newsletter";
import { Footer } from "@/components/layout/Footer";
import { fetchCustomerProducts } from "@/services/catalogService";
import { Sparkles, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function Home() {
  const products = await fetchCustomerProducts();
  const newArrivals = products.filter((p) => p.badge === "NEW");
  const bestSellers = products.filter((p) => p.badge === "BEST SELLER");

  const displayNew = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);
  const displayBest = bestSellers.length > 0 ? bestSellers : products.slice(4, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      {/* Main Navigation */}
      <Header />

      <main className="flex-1 w-full">
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. Shop By Category (Women, Girls, Family) */}
        <CategorySection />

        {/* 5. New Arrivals (Only from database) */}
        {displayNew.length > 0 ? (
          <ProductSection
            id="new-arrivals"
            title="NEW ARRIVALS"
            subtitle="Fresh styles for women, little girls, and matching families."
            actionText="VIEW ALL"
            actionHref="/products"
            viewAllHref="/products"
            products={displayNew}
          />
        ) : (
          <section className="py-16 px-4 sm:px-8 border-y border-[#D8C9B6]/40 bg-[#F7F1E8]/50 text-center">
            <div className="max-w-xl mx-auto space-y-4">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#907553] font-semibold flex items-center justify-center gap-1.5">
                <Sparkles size={13} /> ATELIER ARCHIVE PREVIEW
              </span>
              <h3
                className="text-2xl sm:text-3xl font-serif text-[#151007]"
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                Couture Capsules in Curation
              </h3>
              <p className="text-xs sm:text-sm font-sans text-[#3A2E21]/80 leading-relaxed">
                Our artisans are tailoring bespoke heirlooms and seasonal pret. New pieces published in the Atelier Portal will appear here live.
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-[#151007] border-b border-[#151007] pb-1 hover:text-[#907553] hover:border-[#907553] transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 6. Editorial Campaign / The Everyday Edit */}
        <EditorialBanner />

        {/* 7. Best Sellers (Only from database) */}
        {displayBest.length > 0 && (
          <ProductSection
            id="best-sellers"
            title="BEST SELLERS"
            subtitle="Loved by many, for a reason."
            actionText="VIEW ALL"
            actionHref="/products"
            viewAllHref="/products"
            products={displayBest}
          />
        )}

        {/* 8. Women's + Girls & Family Collection */}
        <CollectionSplit />

        {/* 9. Service Benefits */}
        <Benefits />

        {/* 10. Instagram / Social Section */}
        <InstagramSection />

        {/* 11. Newsletter / Community Section */}
        <Newsletter />
      </main>

      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
