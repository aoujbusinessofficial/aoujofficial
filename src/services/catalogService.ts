import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Product } from "@/data/products";

export function mapDbProductToProduct(p: any): Product {
  const images =
    p.product_images && p.product_images.length > 0
      ? p.product_images
          .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
          .map((img: any) => img.url)
      : p.images && p.images.length > 0
      ? p.images
      : [
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        ];

  const category = (p.categories?.slug || p.categorySlug || "women") as
    | "women"
    | "girls"
    | "family";

  const colorName = p.color_name || p.colorName || "Ivory Sand";
  const colorHex = p.color_hex || p.colorHex || "#F7F1E8";

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.compare_at_price
      ? Number(p.compare_at_price)
      : p.compareAtPrice
      ? Number(p.compareAtPrice)
      : undefined,
    category,
    sizeType: category === "girls" ? "age" : category === "family" ? "family" : "standard",
    images,
    colors: [
      {
        name: colorName,
        hex: colorHex,
      },
    ],
    sizes:
      category === "women"
        ? ["Small (S)", "Medium (M)", "Large (L)", "Extra Large (XL)", "Customized Size"]
        : category === "girls"
        ? [
            "New Born (0-3 Months)",
            "1 Year",
            "2-3 Years",
            "3-4 Years",
            "5-6 Years",
            "7-8 Years",
            "9-10 Years",
            "Extra Large (Teen XL)",
            "Customized Size",
          ]
        : [
            "Mother Small + Daughter 2-3Y",
            "Mother Medium + Daughter 4-5Y",
            "Mother Large + Daughter 7-8Y",
            "Customized Family Sizing",
          ],
    womenSizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra Large (XL)", "Customized Size"],
    girlsSizes: [
      "New Born (0-3 Months)",
      "3-6 Months",
      "6-12 Months",
      "1 Year",
      "2-3 Years",
      "3-4 Years",
      "4-5 Years",
      "5-6 Years",
      "7-8 Years",
      "9-10 Years",
      "11-12 Years",
      "Extra Large (Teen XL)",
      "Customized Size",
    ],
    fabric: p.fabric || "Pure Lawn & Organza",
    badge: p.is_on_sale || p.isOnSale
      ? "SALE"
      : p.is_new_arrival || p.isNewArrival
      ? "NEW"
      : p.is_best_seller || p.isBestSeller
      ? "BEST SELLER"
      : undefined,
    description:
      p.description ||
      p.subtitle ||
      "Artisanal luxury handcrafted in Pakistan by AOUJ master couturiers.",
    details: p.details && Array.isArray(p.details) && p.details.length > 0
      ? p.details
      : [
          `Fabric: ${p.fabric || "Pure Combed Lawn"}`,
          p.description
            ? p.description.slice(0, 80) + (p.description.length > 80 ? "..." : "")
            : "Handcrafted traditional embroidery & finishing",
          "Complete stitched set with tailored finishing",
          "Dry clean or gentle hand wash recommended",
        ],
  };
}

/**
 * Fetch all customer-facing products from Supabase.
 * Returns empty array if none are published yet (NO mock fallback on customer side).
 */
export async function fetchCustomerProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const supabase = createClient();
  if (!supabase) return [];

  try {
    const { data, error } = await (supabase as any)
      .from("products")
      .select("*, categories(slug, name), product_images(url, display_order, is_primary)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customer catalog:", error);
      return [];
    }

    return (data || []).map(mapDbProductToProduct);
  } catch (err) {
    console.error("fetchCustomerProducts exception:", err);
    return [];
  }
}

/**
 * Fetch a single product by UUID or slug from Supabase.
 */
export async function fetchProductByIdOrSlug(idOrSlug: string): Promise<Product | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = createClient();
  if (!supabase) return null;

  try {
    // Try query by ID first if UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

    let query = (supabase as any)
      .from("products")
      .select("*, categories(slug, name), product_images(url, display_order, is_primary)");

    if (isUuid) {
      query = query.eq("id", idOrSlug);
    } else {
      query = query.or(`slug.eq.${idOrSlug},sku.eq.${idOrSlug}`);
    }

    const { data, error } = await query.single();
    if (error || !data) {
      // If not found by primary query, try fallback id lookup
      if (!isUuid) {
        const { data: secondTry } = await (supabase as any)
          .from("products")
          .select("*, categories(slug, name), product_images(url, display_order, is_primary)")
          .eq("id", idOrSlug)
          .single();

        if (secondTry) return mapDbProductToProduct(secondTry);
      }
      return null;
    }

    return mapDbProductToProduct(data);
  } catch (e) {
    console.error("fetchProductByIdOrSlug exception:", e);
    return null;
  }
}

/**
 * Live search auto-suggestions across published store collection products.
 * Strictly queries Supabase database so only your real listed collection items appear.
 * ZERO mock or demo products will ever appear in suggestions.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const resultsMap = new Map<string, Product>();

  // 1. Search only in Supabase Database products (real atelier collection)
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        const { data, error } = await (supabase as any)
          .from("products")
          .select("*, categories(slug, name), product_images(url, display_order, is_primary)")
          .or(`name.ilike.%${clean}%,description.ilike.%${clean}%,fabric.ilike.%${clean}%`)
          .limit(8);

        if (!error && data && data.length > 0) {
          data.forEach((item: any) => {
            const mapped = mapDbProductToProduct(item);
            resultsMap.set(mapped.id, mapped);
          });
        }
      } catch (e) {
        console.error("searchProducts Supabase exception:", e);
      }
    }
  }

  // NO demo/mock fallback allowed: only real store collection items returned
  return Array.from(resultsMap.values()).slice(0, 6);
}
