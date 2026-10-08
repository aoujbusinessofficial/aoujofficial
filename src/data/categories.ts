export interface CategoryItem {
  id: "women" | "girls" | "family";
  title: string;
  subtitle: string;
  image: string;
  href: string;
  description?: string;
}

export const categoriesData: CategoryItem[] = [
  {
    id: "women",
    title: "WOMEN",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
    href: "/products?category=women",
    description: "Handcrafted lawn, raw silk, and embroidered ensembles designed with timeless grace.",
  },
  {
    id: "girls",
    title: "GIRLS",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=900&auto=format&fit=crop",
    href: "/products?category=girls",
    description: "Charming traditional silhouettes, cotton frocks, and festive ghararas for ages 1 to 10.",
  },
  {
    id: "family",
    title: "FAMILY",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=900&auto=format&fit=crop",
    href: "/products?category=family",
    description: "Harmonious coordinated ensembles for mother & daughter, siblings, and festive family moments.",
  },
];
