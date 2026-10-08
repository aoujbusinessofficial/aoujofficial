export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductCategory = "women" | "girls" | "family";

export const standardWomenSizes = [
  "Small (S)",
  "Medium (M)",
  "Large (L)",
  "Extra Large (XL)",
  "Customized Size",
];

export const standardGirlsSizes = [
  "New Born (0-3 Months)",
  "3-6 Months",
  "6-12 Months",
  "1 Year",
  "2 Years",
  "2-3 Years",
  "3-4 Years",
  "4-5 Years",
  "5-6 Years",
  "7-8 Years",
  "9-10 Years",
  "11-12 Years",
  "13-14 Years (Teen S)",
  "15-16 Years (Teen M)",
  "Extra Large (Teen XL)",
  "Customized Size",
];

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  collection?: string;
  badge?: "NEW" | "BEST SELLER";
  images: [string, string]; // Primary and hover/alternate image
  colors: ProductColor[];
  sizes: string[];
  sizeType: "age" | "standard" | "family";
  womenSizes?: string[];
  girlsSizes?: string[];
  description: string;
  fabric: string;
  details: string[];
  isWishlisted?: boolean;
}

export const allProducts: Product[] = [
  // ==========================================
  // WOMEN'S PRODUCTS (Small to Extra Large)
  // ==========================================
  {
    id: "aouj-w-01",
    name: "Embroidered Lawn Suit",
    price: 4990,
    category: "women",
    badge: "NEW",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "Crafted from premium 100% combed organic lawn, adorned with delicate thread embroidery on the neckline, sleeves, and daman. Paired with a featherlight digital printed chiffon dupatta and tailored trousers.",
    fabric: "Pure Organic Lawn with Chiffon Dupatta",
    details: [
      "Embroidered lawn front and back: 2.5 meters",
      "Embroidered lawn sleeves: 0.65 meters",
      "Digital printed chiffon dupatta: 2.5 meters",
      "Dyed cotton cambric trousers: 2.25 meters",
      "Available in Small (S) to Extra Large (XL) & bespoke custom sizing",
    ],
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
    id: "aouj-w-02",
    name: "Printed Co-Ord Set",
    price: 3990,
    category: "women",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "Contemporary straight-silhouette tunic featuring minimalist botanical hand-block inspired motifs. Paired with coordinating wide-leg trousers for effortless day-to-evening transition.",
    fabric: "Breathable Slub Cotton & Linen Blend",
    details: [
      "Mandarin collar with champagne mother-of-pearl buttons",
      "Relaxed drop-shoulder tailoring",
      "Elasticated waistband with functional side pockets",
      "Sizes: Small (S), Medium (M), Large (L), Extra Large (XL) & Custom",
    ],
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
    id: "aouj-w-03",
    name: "2 Piece Terracotta Suit",
    price: 4490,
    category: "women",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "Rich terracotta earth tone embellished with subtle zari needlework along the sleeve borders and hem. A quintessential wardrobe staple designed for timeless grace.",
    fabric: "Soft Handloom Khaddar Silk",
    details: [
      "Subtle zari embroidery along hems",
      "Straight cut silhouette with side slits",
      "Includes matched straight-leg pants",
      "Available from Small to Extra Large & Custom Tailored",
    ],
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
    id: "aouj-w-04",
    name: "Lawn Co-Ord Set",
    price: 4690,
    category: "women",
    badge: "BEST SELLER",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "An understated luxury piece in olive sage, highlighted by tonal stitching and tailored cuffed sleeves. Designed for women who value minimalist sophistication.",
    fabric: "Premium Combed Lawn 80s",
    details: [
      "Relaxed tunic silhouette",
      "Full sleeves with subtle button accents",
      "Tapered ankle-cut matching trousers",
      "Sizes: Small, Medium, Large, Extra Large & Custom",
    ],
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
    id: "aouj-w-05",
    name: "Embroidered Raw Silk Suit",
    price: 4890,
    category: "women",
    badge: "NEW",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "A classic warm white pure raw silk three-piece ensemble, intricately accented with gold tilla work and soft pastel florals.",
    fabric: "Pure Raw Silk with Organza Borders",
    details: [
      "Tilla embroidered neckline plaque",
      "Embroidered organza sleeve cuffs",
      "Dyed silk pants included",
      "Sizes: Small, Medium, Large, Extra Large & Custom",
    ],
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
    id: "aouj-w-06",
    name: "Embroidered Kurta",
    price: 4590,
    category: "women",
    sizeType: "standard",
    sizes: standardWomenSizes,
    description:
      "Dark espresso festive kurta adorned with hand-stitched sequin accents and geometric Kashmiri floral borders.",
    fabric: "Viscose Jacquard & Silk Cotton",
    details: [
      "Full embroidered front panel",
      "Subtle gold sheen in fabric weave",
      "Sizes: Small, Medium, Large, Extra Large & Custom",
    ],
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

  // ==========================================
  // GIRLS PRODUCTS (New Born to Extra Large)
  // ==========================================
  {
    id: "aouj-g-01",
    name: "Girls Floral Dress",
    price: 3480,
    category: "girls",
    badge: "BEST SELLER",
    sizeType: "age",
    sizes: standardGirlsSizes,
    description:
      "Delicate hand-sketched floral print on ultra-soft pure mulmul cotton, lined with gentle breathable lawn so children stay comfortable all day. Available from New Born (0-3 Months) to Extra Large (Teen).",
    fabric: "100% Breathable Mulmul Cotton (Hypoallergenic)",
    details: [
      "Pre-washed chemical-free fabric gentle on sensitive child skin",
      "Full size spectrum: New Born (0-3 M) through Extra Large (Teen XL)",
      "Double stitched seams for active playtime durability",
      "Customized measurements available upon request",
    ],
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
    id: "aouj-g-02",
    name: "Girls 2 Piece Festive Set",
    price: 3490,
    category: "girls",
    badge: "NEW",
    sizeType: "age",
    sizes: standardGirlsSizes,
    description:
      "Charming blush pink traditional festive ensemble with lightweight gotta patti border accents, soft flared tulip pants, and a delightful airy kurti.",
    fabric: "Soft Organic Lawn with Lurex Thread Border",
    details: [
      "Gentle elastic waistband pants with no pinching",
      "Soft gotta ribbon detail along the neckline and hem",
      "Comprehensive sizes: New Born to Extra Large",
      "Hand wash recommended",
    ],
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
    id: "aouj-g-03",
    name: "Girls Embroidered Angrakha Frock",
    price: 3890,
    category: "girls",
    badge: "NEW",
    sizeType: "age",
    sizes: standardGirlsSizes,
    description:
      "A classic Mughal-inspired Angrakha wrap frock tailored with golden thread tassels and gentle pastel embroidery. Designed for celebratory events, Eid, and weddings.",
    fabric: "Woven Cotton Jacquard with Soft Voile Lining",
    details: [
      "Functional side-tie with handcrafted silk tassels",
      "Flared twirl-worthy hem with gold borders",
      "Sizes range from New Born (0-3 Months) to Extra Large Teen",
      "Full soft cotton inner lining",
    ],
    images: [
      "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Ivory Cream", hex: "#F7F1E8" },
      { name: "Golden Sand", hex: "#DBCEBD" },
    ],
  },
  {
    id: "aouj-g-04",
    name: "Girls Cotton Pret Kurti",
    price: 2790,
    category: "girls",
    sizeType: "age",
    sizes: standardGirlsSizes,
    description:
      "Everyday casual comfort in lightweight pure lawn. Hand-printed subtle motifs, easy-on boat neck, and breezy relaxed cut.",
    fabric: "100% Combed Lawn",
    details: [
      "Casual daywear for warmer seasons",
      "Soft breathable natural dyes",
      "Sizes: New Born to Extra Large",
      "Easy machine wash",
    ],
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Terracotta Peach", hex: "#E89B88" },
      { name: "Warm Ivory", hex: "#FAF7F2" },
    ],
  },

  // ==========================================
  // FAMILY PRODUCTS (Both Woman & Girl Sizes)
  // ==========================================
  {
    id: "aouj-f-01",
    name: "Mother & Daughter Matching Lawn Set",
    price: 7990,
    category: "family",
    badge: "BEST SELLER",
    sizeType: "family",
    womenSizes: standardWomenSizes,
    girlsSizes: standardGirlsSizes,
    sizes: [
      "Mother (Small) + Girl (Choose Size)",
      "Mother (Medium) + Girl (Choose Size)",
      "Mother (Large) + Girl (Choose Size)",
      "Mother (Extra Large) + Girl (Choose Size)",
      "Customized Family Sizing",
    ],
    description:
      "A heartwarming coordinated heirloom edit: matching mother & daughter ensembles. You can choose the Woman's size (Small to Extra Large) and optionally select the Daughter's size from New Born to Extra Large.",
    fabric: "Premium Organic Lawn & Matching Handwoven Dupattas",
    details: [
      "Dual Sizing: Select Woman's Size (S to XL) & Girl's Size (New Born to XL)",
      "Includes complete 2-piece set for Mother (Tunic + Trousers)",
      "Includes complete 2-piece set for Daughter (Frock/Kurti + Pant)",
      "Option to order only for Woman or add matching Daughter piece",
      "Bespoke custom tailored measurements supported",
    ],
    images: [
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Ivory & Sand Heirloom", hex: "#FAF7F2" },
      { name: "Rose Blush Match", hex: "#D8A3A8" },
      { name: "Sage Forest Harmony", hex: "#556B5D" },
    ],
  },
  {
    id: "aouj-f-02",
    name: "Festive Family Heirloom Coordinate",
    price: 11490,
    category: "family",
    badge: "NEW",
    sizeType: "family",
    womenSizes: standardWomenSizes,
    girlsSizes: standardGirlsSizes,
    sizes: [
      "Mother (Small) + Girl (Choose Size)",
      "Mother (Medium) + Girl (Choose Size)",
      "Mother (Large) + Girl (Choose Size)",
      "Mother (Extra Large) + Girl (Choose Size)",
      "Customized Family Sizing",
    ],
    description:
      "Designed for grand celebrations and Eid family portraits. Features coordinated luxury raw silk ensembles with independent size selections for both Mother and Daughter.",
    fabric: "Raw Silk Blend with Cotton Cambric Linings",
    details: [
      "Choose Woman's size (Small to Extra Large) & Daughter's size (New Born to Extra Large)",
      "Fully coordinated color palates and embroidery motifs",
      "Kids pieces lined with ultra-soft cotton for comfort",
      "Personalized sizing consultation available after order",
    ],
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Antique Ivory & Gold", hex: "#F7F1E8" },
      { name: "Walnut Brown Harmony", hex: "#3A2E21" },
    ],
  },
  {
    id: "aouj-f-03",
    name: "Mother & Daughter Coordinated Kurta Edit",
    price: 6990,
    category: "family",
    sizeType: "family",
    womenSizes: standardWomenSizes,
    girlsSizes: standardGirlsSizes,
    sizes: [
      "Mother (Small) + Girl (Choose Size)",
      "Mother (Medium) + Girl (Choose Size)",
      "Mother (Large) + Girl (Choose Size)",
      "Mother (Extra Large) + Girl (Choose Size)",
      "Customized Family Sizing",
    ],
    description:
      "Understated elegance for mother and daughter: matching minimal collar embroidery on breathable crisp cotton lawn. Select size for both woman and daughter independently.",
    fabric: "100% Breathable Egyptian Lawn Cotton",
    details: [
      "Woman's Size: Small, Medium, Large, Extra Large & Custom",
      "Girl's Size: New Born through Extra Large & Custom",
      "Option to include or skip Daughter's piece",
      "Hand wash or dry clean",
    ],
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=800&auto=format&fit=crop",
    ],
    colors: [
      { name: "Cream & Slate", hex: "#F2EAE0" },
      { name: "Espresso & Sand", hex: "#151007" },
    ],
  },
];

// New Arrivals curated for the homepage
export const newArrivalsProducts: Product[] = [
  allProducts[0], // Embroidered Lawn Suit (women)
  allProducts[6], // Girls Floral Dress (girls)
  allProducts[10], // Mother & Daughter Matching Set (family)
  allProducts[2], // 2 Piece Terracotta Suit (women)
  allProducts[7], // Girls 2 Piece Festive Set (girls)
];

// Best Sellers curated for the homepage
export const bestSellersProducts: Product[] = [
  allProducts[3], // Lawn Co-Ord Set (women)
  allProducts[6], // Girls Floral Dress (girls)
  allProducts[10], // Mother & Daughter Matching Set (family)
  allProducts[4], // Embroidered Raw Silk Suit (women)
  allProducts[11], // Festive Family Heirloom Coordinate (family)
];
