export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductCategory = "women" | "girls" | "family";

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
  description: string;
  fabric: string;
  details: string[];
  isWishlisted?: boolean;
}

export const allProducts: Product[] = [
  // --- WOMEN PRODUCTS ---
  {
    id: "aouj-w-01",
    name: "Embroidered Lawn Suit",
    price: 4990,
    category: "women",
    badge: "NEW",
    sizeType: "standard",
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "Crafted from premium 100% combed organic lawn, adorned with delicate thread embroidery on the neckline, sleeves, and daman. Paired with a featherlight digital printed chiffon dupatta and tailored trousers.",
    fabric: "Pure Organic Lawn with Chiffon Dupatta",
    details: [
      "Embroidered lawn front and back: 2.5 meters",
      "Embroidered lawn sleeves: 0.65 meters",
      "Digital printed chiffon dupatta: 2.5 meters",
      "Dyed cotton cambric trousers: 2.25 meters",
      "Dry clean recommended for first wash",
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
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "Contemporary straight-silhouette tunic featuring minimalist botanical hand-block inspired motifs. Paired with coordinating wide-leg trousers for effortless day-to-evening transition.",
    fabric: "Breathable Slub Cotton & Linen Blend",
    details: [
      "Mandarin collar with champagne mother-of-pearl buttons",
      "Relaxed drop-shoulder tailoring",
      "Elasticated waistband with functional side pockets",
      "Machine wash gentle on cold",
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
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "Rich terracotta earth tone embellished with subtle zari needlework along the sleeve borders and hem. A quintessential wardrobe staple designed for timeless grace.",
    fabric: "Soft Handloom Khaddar Silk",
    details: [
      "Subtle zari embroidery along hems",
      "Straight cut silhouette with side slits",
      "Includes matched straight-leg pants",
      "Pre-shrunk fabric",
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
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "An understated luxury piece in olive sage, highlighted by tonal stitching and tailored cuffed sleeves. Designed for women who value minimalist sophistication.",
    fabric: "Premium Combed Lawn 80s",
    details: [
      "Relaxed tunic silhouette",
      "Full sleeves with subtle button accents",
      "Tapered ankle-cut matching trousers",
      "Hand wash or dry clean",
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
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "A classic warm white pure raw silk three-piece ensemble, intricately accented with gold tilla work and soft pastel florals.",
    fabric: "Pure Raw Silk with Organza Borders",
    details: [
      "Tilla embroidered neckline plaque",
      "Embroidered organza sleeve cuffs",
      "Dyed silk pants included",
      "Dry clean only",
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
    sizes: ["XS", "S", "M", "L", "XL", "Customized Size"],
    description:
      "Dark espresso festive kurta adorned with hand-stitched sequin accents and geometric Kashmiri floral borders.",
    fabric: "Viscose Jacquard & Silk Cotton",
    details: [
      "Full embroidered front panel",
      "Subtle gold sheen in fabric weave",
      "Easy breathable fit",
      "Dry clean only",
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

  // --- GIRLS PRODUCTS (Age-Based Sizing) ---
  {
    id: "aouj-g-01",
    name: "Girls Floral Dress",
    price: 3480,
    category: "girls",
    badge: "BEST SELLER",
    sizeType: "age",
    sizes: [
      "1 Year",
      "2 Years",
      "2-3 Years",
      "3-4 Years",
      "4-5 Years",
      "5-6 Years",
      "7-8 Years",
      "9-10 Years",
      "Customized Size",
    ],
    description:
      "Delicate hand-sketched floral print on ultra-soft pure mulmul cotton, lined with gentle breathable lawn so children stay comfortable all day. Features gentle gathered flare and soft coconut-shell buttons.",
    fabric: "100% Breathable Mulmul Cotton (Hypoallergenic)",
    details: [
      "Pre-washed chemical-free fabric gentle on sensitive child skin",
      "Age-appropriate comfortable room for growth",
      "Double stitched seams for active playtime durability",
      "Machine washable with cold water",
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
    sizes: [
      "1 Year",
      "2 Years",
      "2-3 Years",
      "3-4 Years",
      "4-5 Years",
      "5-6 Years",
      "7-8 Years",
      "9-10 Years",
      "Customized Size",
    ],
    description:
      "Charming blush pink traditional festive ensemble with lightweight gotta patti border accents, soft flared tulip pants, and a delightful airy kurti.",
    fabric: "Soft Organic Lawn with Lurex Thread Border",
    details: [
      "Gentle elastic waistband pants with no pinching",
      "Soft gotta ribbon detail along the neckline and hem",
      "Available across ages 1 to 10 years",
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
    sizes: [
      "1 Year",
      "2 Years",
      "2-3 Years",
      "3-4 Years",
      "4-5 Years",
      "5-6 Years",
      "7-8 Years",
      "9-10 Years",
      "Customized Size",
    ],
    description:
      "A classic Mughal-inspired Angrakha wrap frock tailored with golden thread tassels and gentle pastel embroidery. Designed for celebratory events, Eid, and weddings.",
    fabric: "Woven Cotton Jacquard with Soft Voile Lining",
    details: [
      "Functional side-tie with handcrafted silk tassels",
      "Flared twirl-worthy hem with gold borders",
      "Full soft cotton inner lining",
      "Custom sizes available for unique heights",
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
    sizes: [
      "1 Year",
      "2 Years",
      "2-3 Years",
      "3-4 Years",
      "4-5 Years",
      "5-6 Years",
      "7-8 Years",
      "Customized Size",
    ],
    description:
      "Everyday casual comfort in lightweight pure lawn. Hand-printed subtle motifs, easy-on boat neck, and breezy relaxed cut.",
    fabric: "100% Combed Lawn",
    details: [
      "Casual daywear for warmer seasons",
      "Soft breathable natural dyes",
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

  // --- FAMILY PRODUCTS (Coordinated & Matching Sets) ---
  {
    id: "aouj-f-01",
    name: "Mother & Daughter Matching Lawn Set",
    price: 7990,
    category: "family",
    badge: "BEST SELLER",
    sizeType: "family",
    sizes: [
      "Mother (S) + Daughter (1-2 Yrs)",
      "Mother (M) + Daughter (2-3 Yrs)",
      "Mother (M) + Daughter (3-4 Yrs)",
      "Mother (L) + Daughter (4-5 Yrs)",
      "Mother (L) + Daughter (6-7 Yrs)",
      "Mother (Any) + 2 Daughters",
      "Customized Family Sizing",
    ],
    description:
      "A heartwarming coordinated heirloom edit: matching mother & daughter ensembles crafted in harmony with complementary floral embroideries, premium lawn weave, and bespoke sizing tailored to each family member.",
    fabric: "Premium Organic Lawn & Matching Handwoven Dupattas",
    details: [
      "Includes complete 2-piece set for Mother (Tunic + Trousers)",
      "Includes complete 2-piece set for Daughter (Frock + Tulip Pant)",
      "Option to specify exact daughter age or provide bespoke measurements",
      "Gift packaging included",
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
    sizes: [
      "Mother & 1 Child Set",
      "Mother & 2 Children Set",
      "Full Family Trio (Mom, Dad, Child)",
      "Full Family Quartet (Mom, Dad, 2 Kids)",
      "Customized Family Sizing",
    ],
    description:
      "Designed for grand celebrations and Eid family portraits. Harmonized in tones of antique ivory, brushed champagne zari, and comfortable heirloom cotton-silk.",
    fabric: "Raw Silk Blend with Cotton Cambric Linings",
    details: [
      "Fully coordinated color palates and embroidery motifs",
      "Kids pieces lined with ultra-soft cotton for comfort",
      "Personalized sizing consultation available after order",
      "Includes protective garment bags",
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
    name: "Mother & Son Coordinated Kurta Edit",
    price: 6990,
    category: "family",
    sizeType: "family",
    sizes: [
      "Mother (S) + Son (1-2 Yrs)",
      "Mother (M) + Son (2-3 Yrs)",
      "Mother (M) + Son (3-4 Yrs)",
      "Mother (L) + Son (5-6 Yrs)",
      "Customized Family Sizing",
    ],
    description:
      "Understated elegance for mother and son: matching minimal collar embroidery on breathable crisp cotton lawn with relaxed trousers.",
    fabric: "100% Breathable Egyptian Lawn Cotton",
    details: [
      "Matched collar and placket threadwork",
      "Includes boy's kurta pajama set",
      "Comfort fit for growing boys",
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
