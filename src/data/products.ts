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
  badge?: "NEW" | "BEST SELLER" | "SALE";
  images: string[];
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

// All demo/mock products removed. Products are loaded dynamically from Supabase database.
export const allProducts: Product[] = [];

// Fallbacks for homepage (empty by default until products are added in database)
export const newArrivalsProducts: Product[] = [];
export const bestSellersProducts: Product[] = [];
