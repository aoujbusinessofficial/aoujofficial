import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CartItem } from "@/context/CartContext";

export interface CreateOrderParams {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  grandTotal: number;
  isGuest: boolean;
  userId?: string | null;
  items: CartItem[];
}

export interface PlacedOrderResult {
  success: boolean;
  orderNumber: string;
  orderId?: string;
  error?: string;
}

export const generateOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `AOUJ-${dateStr}-${randomPart}`;
};

export const placeOrder = async (
  params: CreateOrderParams
): Promise<PlacedOrderResult> => {
  const orderNumber = generateOrderNumber();

  // If Supabase is configured, persist to live PostgreSQL database
  if (isSupabaseConfigured) {
    const supabase = createClient();
    if (supabase) {
      try {
        // 1. Insert into orders table
        const { data: orderData, error: orderError } = await (supabase as any)
          .from("orders")
          .insert({
            order_number: orderNumber,
            user_id: params.userId || null,
            is_guest: params.isGuest,
            customer_name: params.customerName,
            customer_email: params.customerEmail || null,
            customer_phone: params.customerPhone,
            shipping_address: params.customerAddress,
            city: params.customerCity,
            payment_method: params.paymentMethod,
            payment_status: "PENDING",
            order_status: "PENDING",
            subtotal: params.subtotal,
            shipping_fee: params.shippingFee,
            discount_amount: params.discountAmount,
            grand_total: params.grandTotal,
          })
          .select("id")
          .single();

        if (orderError) {
          console.error("Supabase order creation error:", orderError);
          return { success: false, orderNumber, error: orderError.message };
        }

        // 2. Insert into order_items table
        const orderId = orderData?.id;
        if (orderId) {
          const orderItemsData = params.items.map((item) => ({
            order_id: orderId,
            product_name: item.name,
            product_image: item.image || null,
            unit_price: item.price,
            quantity: item.quantity,
            selected_woman_size: item.womanSize || null,
            selected_girl_size: item.girlSize || null,
            is_custom_size: Boolean(item.isCustomSize),
            custom_measurements: item.customMeasurements ? item.customMeasurements : null,
            line_total: item.price * item.quantity,
          }));

          const { error: itemsError } = await (supabase as any)
            .from("order_items")
            .insert(orderItemsData);

          if (itemsError) {
            console.error("Supabase order_items error:", itemsError);
          }
        }

        return { success: true, orderNumber, orderId };
      } catch (err: any) {
        console.error("Failed to place order in Supabase:", err);
        return { success: false, orderNumber, error: err.message };
      }
    }
  }

  // Graceful fallback for local development before Supabase keys are pasted
  try {
    const localOrders = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
    localOrders.unshift({
      orderNumber,
      createdAt: new Date().toISOString(),
      ...params,
    });
    localStorage.setItem("aouj_local_orders", JSON.stringify(localOrders));
  } catch (e) {
    console.error("Local storage order save error", e);
  }

  return { success: true, orderNumber };
};
