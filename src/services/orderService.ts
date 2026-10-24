import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CartItem } from "@/context/CartContext";

export interface CreateOrderParams {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerCity: string;
  customerProvince?: string;
  customerPostalCode?: string;
  customerAddress: string;
  orderNotes?: string;
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
        // 1. Insert into orders table with 100% complete customer & address details
        const { data: orderData, error: orderError } = await (supabase as any)
          .from("orders")
          .insert({
            order_number: orderNumber,
            user_id: params.userId || null,
            is_guest: params.isGuest,
            customer_name: params.customerName.trim(),
            customer_email: params.customerEmail?.trim() || null,
            customer_phone: params.customerPhone.trim(),
            shipping_address: params.customerAddress.trim(),
            city: params.customerCity.trim(),
            province: params.customerProvince || "Punjab",
            postal_code: params.customerPostalCode || null,
            order_notes: params.orderNotes || null,
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

        // 2. Insert into order_items table with full size specifications & bespoke measurements
        const orderId = orderData?.id;
        if (orderId) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

          const orderItemsData = params.items.map((item) => {
            const hasValidUuid = item.productId && uuidRegex.test(item.productId);

            return {
              order_id: orderId,
              product_id: hasValidUuid ? item.productId : null,
              product_name: item.name,
              product_image: item.image || null,
              unit_price: item.price,
              quantity: item.quantity,
              selected_woman_size:
                item.womanSize || (item.category === "women" ? item.sizeDescription : null),
              selected_girl_size:
                item.girlSize || (item.category === "girls" ? item.sizeDescription : null),
              is_custom_size: Boolean(item.isCustomSize),
              custom_measurements: item.customMeasurements ? item.customMeasurements : null,
              line_total: item.price * item.quantity,
            };
          });

          const { error: itemsError } = await (supabase as any)
            .from("order_items")
            .insert(orderItemsData);

          if (itemsError) {
            console.error("Supabase order_items error:", itemsError);
          }
        }

        // 3. Dispatch Real Order Confirmation Receipt Email
        if (params.customerEmail) {
          try {
            await fetch("/api/send-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                to: params.customerEmail.trim(),
                type: "ORDER_CONFIRMATION",
                data: {
                  orderNumber,
                  customerName: params.customerName,
                  shippingAddress: params.customerAddress,
                  city: params.customerCity,
                  paymentMethod: params.paymentMethod,
                  grandTotal: params.grandTotal,
                  items: params.items,
                },
              }),
            });
          } catch (mailErr) {
            console.warn("Order confirmation email notice:", mailErr);
          }
        }

        return { success: true, orderNumber, orderId };
      } catch (err: any) {
        console.error("Failed to place order in Supabase:", err);
        return { success: false, orderNumber, error: err.message };
      }
    }
  }

  // Local storage fallback
  try {
    const localOrders = JSON.parse(localStorage.getItem("aouj_local_orders") || "[]");
    localOrders.unshift({
      orderNumber,
      createdAt: new Date().toISOString(),
      ...params,
    });
    localStorage.setItem("aouj_local_orders", JSON.stringify(localOrders));

    if (params.customerEmail) {
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: params.customerEmail.trim(),
            type: "ORDER_CONFIRMATION",
            data: {
              orderNumber,
              customerName: params.customerName,
              shippingAddress: params.customerAddress,
              city: params.customerCity,
              paymentMethod: params.paymentMethod,
              grandTotal: params.grandTotal,
              items: params.items,
            },
          }),
        });
      } catch {}
    }
  } catch (e) {
    console.error("Local storage order save error", e);
  }

  return { success: true, orderNumber };
};
