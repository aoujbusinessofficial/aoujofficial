export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "women" | "kids";
  collection?: string;
  badge?: "NEW" | "SALE" | "BEST SELLER";
  images: [string, string]; // Primary and hover image
  colors: ProductColor[];
  isWishlisted?: boolean;
}

export const newArrivalsProducts: Product[] = [
  {
    id: "aouj-na-01",
    name: "Embroidered Lawn Suit",
    price: 4990,
    category: "women",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Obsidian Onyx", hex: "#1A1510" },
      { name: "Warm Sand", hex: "#DBCEBD" },
      { name: "Ivory Silk", hex: "#F7F1E8" },
    ],
  },
  {
    id: "aouj-na-02",
    name: "Printed Co-Ord Set",
    price: 3990,
    category: "women",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Cream Petal", hex: "#F7F1E8" },
      { name: "Midnight Espresso", hex: "#151007" },
      { name: "Champagne Gold", hex: "#907553" },
    ],
  },
  {
    id: "aouj-na-03",
    name: "2 Piece Suit",
    price: 4490,
    category: "women",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Terracotta Rose", hex: "#9E5B4B" },
      { name: "Spiced Bark", hex: "#6A382A" },
      { name: "Desert Sand", hex: "#DBCEBD" },
    ],
  },
  {
    id: "aouj-na-04",
    name: "Girls Floral Dress",
    price: 3480,
    category: "kids",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Soft Teal Indigo", hex: "#2A3D45" },
      { name: "Blush Sand", hex: "#AF997E" },
      { name: "Butter Cream", hex: "#F2EAE0" },
    ],
  },
  {
    id: "aouj-na-05",
    name: "Embroidered Kurta",
    price: 4990,
    originalPrice: 5990,
    category: "women",
    badge: "SALE",
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Sage Forest", hex: "#556B5D" },
      { name: "Deep Moss", hex: "#2F3E34" },
    ],
  },
];

export const bestSellersProducts: Product[] = [
  {
    id: "aouj-bs-01",
    name: "Lawn Co-Ord Set",
    price: 4690,
    category: "women",
    badge: "BEST SELLER",
    images: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Olive Earth", hex: "#5A6B53" },
      { name: "Espresso", hex: "#151007" },
    ],
  },
  {
    id: "aouj-bs-02",
    name: "Embroidered Suit",
    price: 4890,
    category: "women",
    badge: "NEW",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Warm White", hex: "#FAF7F2" },
      { name: "Dark Walnut", hex: "#3A2E21" },
      { name: "Champagne", hex: "#907553" },
    ],
  },
  {
    id: "aouj-bs-03",
    name: "Printed Dress",
    price: 3590,
    category: "women",
    badge: "BEST SELLER",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Sunset Terracotta", hex: "#C78D6A" },
      { name: "Warm Sand", hex: "#DBCEBD" },
      { name: "Soft Ivory", hex: "#F7F1E8" },
    ],
  },
  {
    id: "aouj-bs-04",
    name: "Girls 2 Piece Set",
    price: 3490,
    category: "kids",
    images: [
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Blush Rose", hex: "#D8A3A8" },
      { name: "Warm White", hex: "#FAF7F2" },
      { name: "Light Champagne", hex: "#AF997E" },
    ],
  },
  {
    id: "aouj-bs-05",
    name: "Embroidered Kurta",
    price: 4590,
    category: "women",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Night Obsidian", hex: "#151007" },
      { name: "Champagne Gold", hex: "#907553" },
      { name: "Rich Bark", hex: "#3A2E21" },
    ],
  },
];
