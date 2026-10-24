import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { allProducts as mockProducts } from "@/data/products";

export interface AdminProductInput {
  id?: string;
  sku: string;
  slug: string;
  name: string;
  subtitle?: string;
  description?: string;
  categorySlug: "women" | "girls" | "family";
  price: number;
  compareAtPrice?: number;
  stock: number;
  colorName?: string;
  colorHex?: string;
  fabric?: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  images: string[];
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  isGuest: boolean;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    productImage: string | null;
    unitPrice: number;
    quantity: number;
    selectedWomanSize: string | null;
    selectedGirlSize: string | null;
    isCustomSize: boolean;
    customMeasurements: any;
    lineTotal: number;
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
  avatarUrl?: string;
  createdAt: string;
  measurements?: {
    bust?: string;
    waist?: string;
    hip?: string;
    shirtLength?: string;
  };
}

// -----------------------------------------------------------------------------
// ADMIN AUTH VERIFICATION (Check if user is ADMIN in database)
// -----------------------------------------------------------------------------
export const verifyAdminUser = async (
  email: string
): Promise<{ isAdmin: boolean; profile?: AdminUser; error?: string }> => {
  if (!isSupabaseConfigured) {
    // If running in development fallback without live DB connection, allow admin login
    if (email.toLowerCase().includes("admin")) {
      return {
        isAdmin: true,
        profile: {
          id: "local-admin",
          email,
          fullName: "Atelier Administrator",
          phone: "+92 300 0000000",
          role: "ADMIN",
          createdAt: new Date().toISOString(),
        },
      };
    }
    return { isAdmin: false, error: "Database not configured" };
  }

  const supabase = createClient();
  if (!supabase) return { isAdmin: false, error: "Database client unavailable" };

  try {
    const { data, error } = await (supabase as any)
      .from("profiles")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error || !data) {
      return {
        isAdmin: false,
        error: "No account found with this email in the database.",
      };
    }

    if (data.role !== "ADMIN") {
      return {
        isAdmin: false,
        error: "Access Denied: Your account role is 'CUSTOMER'. Please change your role to 'ADMIN' in the Supabase profiles table.",
      };
    }

    return {
      isAdmin: true,
      profile: {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        phone: data.phone,
        role: data.role,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
      },
    };
  } catch (err: any) {
    return { isAdmin: false, error: err.message || "Verification failed" };
  }
};

// -----------------------------------------------------------------------------
// ORDERS MANAGEMENT
// -----------------------------------------------------------------------------
export const fetchAllOrders = async (): Promise<AdminOrder[]> => {
  if (!isSupabaseConfigured) {
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
      return local.map((o: any, idx: number) => ({
        id: o.orderNumber || `local-${idx}`,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerEmail: o.customerEmail || null,
        customerPhone: o.customerPhone,
        shippingAddress: o.customerAddress,
        city: o.customerCity || "Lahore",
        paymentMethod: o.paymentMethod || "COD",
        paymentStatus: "PENDING",
        orderStatus: o.orderStatus || "PENDING",
        subtotal: o.subtotal || 0,
        shippingFee: o.shippingFee || 0,
        discountAmount: o.discountAmount || 0,
        grandTotal: o.grandTotal || 0,
        isGuest: o.isGuest ?? true,
        createdAt: o.createdAt || new Date().toISOString(),
        items: (o.items || []).map((it: any) => ({
          id: it.id || Math.random().toString(),
          productName: it.name,
          productImage: it.image,
          unitPrice: it.price,
          quantity: it.quantity,
          selectedWomanSize: it.womanSize || null,
          selectedGirlSize: it.girlSize || null,
          isCustomSize: Boolean(it.isCustomSize),
          customMeasurements: it.customMeasurements || null,
          lineTotal: it.price * it.quantity,
        })),
      }));
    } catch {
      return [];
    }
  }

  const supabase = createClient();
  if (!supabase) return [];

  try {
    const { data: orders, error: orderErr } = await (supabase as any)
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (orderErr) {
      console.error("Fetch orders error:", orderErr);
      return [];
    }

    return (orders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      customerPhone: o.customer_phone,
      shippingAddress: o.shipping_address,
      city: o.city,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      subtotal: Number(o.subtotal),
      shippingFee: Number(o.shipping_fee),
      discountAmount: Number(o.discount_amount),
      grandTotal: Number(o.grand_total),
      isGuest: o.is_guest,
      createdAt: o.created_at,
      items: (o.order_items || []).map((it: any) => ({
        id: it.id,
        productName: it.product_name,
        productImage: it.product_image,
        unitPrice: Number(it.unit_price),
        quantity: it.quantity,
        selectedWomanSize: it.selected_woman_size,
        selectedGirlSize: it.selected_girl_size,
        isCustomSize: it.is_custom_size,
        customMeasurements: it.custom_measurements,
        lineTotal: Number(it.line_total),
      })),
    }));
  } catch (e) {
    console.error("Supabase fetch orders exception:", e);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  newStatus: string
): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
      const updated = local.map((o: any) =>
        o.orderNumber === orderId || o.id === orderId
          ? { ...o, orderStatus: newStatus }
          : o
      );
      localStorage.setItem("aouj_local_orders", JSON.stringify(updated));
      return true;
    } catch {
      return false;
    }
  }

  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await (supabase as any)
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", orderId);

    return !error;
  } catch {
    return false;
  }
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
  if (!isSupabaseConfigured) {
    try {
      const local = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
      const filtered = local.filter(
        (o: any) => o.orderNumber !== orderId && o.id !== orderId
      );
      localStorage.setItem("aouj_local_orders", JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await (supabase as any)
      .from("orders")
      .delete()
      .eq("id", orderId);
    return !error;
  } catch {
    return false;
  }
};

// -----------------------------------------------------------------------------
// PRODUCTS MANAGEMENT
// -----------------------------------------------------------------------------
export const fetchAllAdminProducts = async () => {
  if (!isSupabaseConfigured) {
    return mockProducts.map((p) => ({
      id: p.id,
      sku: p.id.toUpperCase(),
      name: p.name,
      subtitle: p.badge || "Luxury Pret",
      price: p.price,
      compareAtPrice: p.originalPrice || null,
      stock: 35,
      categorySlug: p.category,
      fabric: p.fabric,
      isOnSale: false,
      isNewArrival: p.badge === "NEW",
      isBestSeller: true,
      images: p.images,
    }));
  }

  const supabase = createClient();
  if (!supabase) return [];

  try {
    const { data: products, error } = await (supabase as any)
      .from("products")
      .select("*, categories(slug, name), product_images(url, display_order)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Products fetch error:", error);
      return [];
    }

    return (products || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
      stock: p.stock,
      categorySlug: p.categories?.slug || "women",
      categoryName: p.categories?.name || "Women",
      colorName: p.color_name,
      colorHex: p.color_hex,
      fabric: p.fabric,
      isOnSale: p.is_on_sale,
      isNewArrival: p.is_new_arrival,
      isBestSeller: p.is_best_seller,
      images: (p.product_images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.url),
    }));
  } catch (e) {
    console.error("Supabase fetch products exception:", e);
    return [];
  }
};

export const createOrUpdateProduct = async (
  input: AdminProductInput
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient();
  if (!supabase) return { success: false, error: "Database not connected" };

  try {
    // 1. Get category ID
    const { data: catData, error: catErr } = await (supabase as any)
      .from("categories")
      .select("id")
      .eq("slug", input.categorySlug)
      .single();

    if (catErr || !catData) {
      return { success: false, error: "Invalid category selected" };
    }

    const category_id = catData.id;

    // 2. Upsert product
    const productPayload = {
      sku: input.sku.trim(),
      slug: input.slug.trim().toLowerCase(),
      name: input.name.trim(),
      subtitle: input.subtitle || null,
      description: input.description || null,
      category_id,
      price: input.price,
      compare_at_price: input.compareAtPrice || null,
      stock: input.stock,
      color_name: input.colorName || "Ivory Sand",
      color_hex: input.colorHex || "#F7F1E8",
      fabric: input.fabric || "Pure Combed Cotton",
      is_new_arrival: Boolean(input.isNewArrival),
      is_best_seller: Boolean(input.isBestSeller),
      is_on_sale: Boolean(input.isOnSale),
    };

    let productId = input.id;
    if (productId) {
      const { error: updErr } = await (supabase as any)
        .from("products")
        .update(productPayload)
        .eq("id", productId);
      if (updErr) return { success: false, error: updErr.message };
    } else {
      const { data: newProd, error: insErr } = await (supabase as any)
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();
      if (insErr) return { success: false, error: insErr.message };
      productId = newProd.id;
    }

    // 3. Upsert Images
    if (productId && input.images && input.images.length > 0) {
      await (supabase as any)
        .from("product_images")
        .delete()
        .eq("product_id", productId);

      const imgRows = input.images.map((url, idx) => ({
        product_id: productId,
        url: url.trim(),
        display_order: idx,
        is_primary: idx === 0,
      }));

      await (supabase as any).from("product_images").insert(imgRows);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await (supabase as any)
      .from("products")
      .delete()
      .eq("id", productId);
    return !error;
  } catch {
    return false;
  }
};

// -----------------------------------------------------------------------------
// CLIENT PROFILES MANAGEMENT
// -----------------------------------------------------------------------------
export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const supabase = createClient();
  if (!supabase) return [];

  try {
    const { data: users, error } = await (supabase as any)
      .from("profiles")
      .select("*, user_measurements(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Users fetch error:", error);
      return [];
    }

    return (users || []).map((u: any) => {
      const m = u.user_measurements?.[0];
      return {
        id: u.id,
        email: u.email,
        fullName: u.full_name,
        phone: u.phone,
        role: u.role,
        createdAt: u.created_at,
        measurements: m
          ? {
              bust: m.bust,
              waist: m.waist,
              hip: m.hip,
              shirtLength: m.shirt_length,
            }
          : undefined,
      };
    });
  } catch {
    return [];
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: "CUSTOMER" | "ADMIN"
): Promise<boolean> => {
  const supabase = createClient();
  if (!supabase) return false;

  try {
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    return !error;
  } catch {
    return false;
  }
};

// -----------------------------------------------------------------------------
// DYNAMIC PROMO CODE VALIDATION
// -----------------------------------------------------------------------------
export interface PromoValidationResult {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  error?: string;
}

export const validatePromoCode = async (
  inputCode: string,
  subtotal: number
): Promise<PromoValidationResult> => {
  const cleaned = inputCode.trim().toUpperCase();
  if (!cleaned) {
    return { valid: false, error: "Please enter a promotional privilege code." };
  }

  // 1. Query Supabase promo_codes table
  const supabase = createClient();
  if (supabase && isSupabaseConfigured) {
    try {
      const { data, error } = await (supabase as any)
        .from("promo_codes")
        .select("*")
        .ilike("code", cleaned)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        const percent = Number(data.discount_percent) || 0;
        const minOrder = Number(data.min_order_amount) || 0;

        if (subtotal < minOrder) {
          return {
            valid: false,
            error: `Minimum order of Rs. ${minOrder.toLocaleString()} required to apply code ${data.code}.`,
          };
        }

        const discountAmount = Math.round(subtotal * (percent / 100));
        return {
          valid: true,
          code: data.code,
          discountPercent: percent,
          discountAmount,
          minOrderAmount: minOrder,
        };
      }
    } catch (e) {
      console.error("Supabase promo validation error:", e);
    }
  }

  // 2. Check Local Storage fallback (aouj_local_promos)
  try {
    if (typeof window !== "undefined") {
      const localPromos = JSON.parse(localStorage.getItem("aouj_local_promos") || "[]");
      const found = localPromos.find(
        (p: any) => p.code?.toUpperCase() === cleaned && p.is_active !== false
      );
      if (found) {
        const percent = Number(found.discount_percent) || 0;
        const minOrder = Number(found.min_order_amount) || 0;
        if (subtotal < minOrder) {
          return {
            valid: false,
            error: `Minimum order of Rs. ${minOrder.toLocaleString()} required to apply code ${found.code}.`,
          };
        }
        const discountAmount = Math.round(subtotal * (percent / 100));
        return {
          valid: true,
          code: found.code,
          discountPercent: percent,
          discountAmount,
          minOrderAmount: minOrder,
        };
      }
    }
  } catch {
    // ignore
  }

  // 3. Dynamic numeric pattern in code (e.g. AOUJ25 -> 25%, AOUJ50 -> 50%, SALE15 -> 15%)
  const numberMatch = cleaned.match(/(\d+)/);
  if (numberMatch) {
    const parsedPercent = parseInt(numberMatch[1], 10);
    if (parsedPercent > 0 && parsedPercent <= 90) {
      const discountAmount = Math.round(subtotal * (parsedPercent / 100));
      return {
        valid: true,
        code: cleaned,
        discountPercent: parsedPercent,
        discountAmount,
        minOrderAmount: 0,
      };
    }
  }

  // 4. Default fallback
  if (cleaned === "AOUJ10" || cleaned === "WELCOME10") {
    const discountAmount = Math.round(subtotal * 0.1);
    return {
      valid: true,
      code: cleaned,
      discountPercent: 10,
      discountAmount,
      minOrderAmount: 0,
    };
  }

  return {
    valid: false,
    error: `Invalid privilege code "${cleaned}". Please check the code and try again.`,
  };
};
