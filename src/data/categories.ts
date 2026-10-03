export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export const categoriesData: CategoryItem[] = [
  {
    id: "women",
    title: "WOMEN",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
    href: "#women",
  },
  {
    id: "kids",
    title: "KIDS",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=900&auto=format&fit=crop",
    href: "#kids",
  },
  {
    id: "new-in",
    title: "NEW IN",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop",
    href: "#new-arrivals",
  },
  {
    id: "sale",
    title: "SALE",
    subtitle: "EXPLORE",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop",
    href: "#sale",
  },
];
