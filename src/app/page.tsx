import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
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
import { newArrivalsProducts, bestSellersProducts } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211A12]">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation */}
      <Header />

      <main className="flex-1 w-full">
        {/* 3. Hero Section */}
        <Hero />

        {/* 4. Shop By Category */}
        <CategorySection />

        {/* 5. New Arrivals */}
        <ProductSection
          id="new-arrivals"
          title="NEW ARRIVALS"
          subtitle="Fresh styles for a brighter you."
          actionText="VIEW ALL"
          actionHref="#new-arrivals-all"
          products={newArrivalsProducts}
        />

        {/* 6. Editorial Campaign / The Everyday Edit */}
        <EditorialBanner />

        {/* 7. Best Sellers */}
        <ProductSection
          id="best-sellers"
          title="BEST SELLERS"
          subtitle="Loved by many, for a reason."
          actionText="VIEW ALL"
          actionHref="#best-sellers-all"
          products={bestSellersProducts}
        />

        {/* 8. Women's Collection + Kids Collection */}
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
