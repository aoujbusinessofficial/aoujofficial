export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: "CUSTOMER" | "ADMIN";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: "CUSTOMER" | "ADMIN";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: "CUSTOMER" | "ADMIN";
          updated_at?: string;
        };
      };
      user_measurements: {
        Row: {
          id: string;
          user_id: string;
          bust: string | null;
          waist: string | null;
          hip: string | null;
          shirt_length: string | null;
          notes: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bust?: string | null;
          waist?: string | null;
          hip?: string | null;
          shirt_length?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
        Update: {
          bust?: string | null;
          waist?: string | null;
          hip?: string | null;
          shirt_length?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          display_order?: number;
          is_active?: boolean;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          slug: string;
          name: string;
          subtitle: string | null;
          description: string | null;
          category_id: string;
          price: number;
          compare_at_price: number | null;
          stock: number;
          color_name: string | null;
          color_hex: string | null;
          fabric: string | null;
          is_new_arrival: boolean;
          is_best_seller: boolean;
          is_on_sale: boolean;
          sale_discount_percent: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          slug: string;
          name: string;
          subtitle?: string | null;
          description?: string | null;
          category_id: string;
          price: number;
          compare_at_price?: number | null;
          stock?: number;
          color_name?: string | null;
          color_hex?: string | null;
          fabric?: string | null;
          is_new_arrival?: boolean;
          is_best_seller?: boolean;
          is_on_sale?: boolean;
          sale_discount_percent?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sku?: string;
          slug?: string;
          name?: string;
          subtitle?: string | null;
          description?: string | null;
          category_id?: string;
          price?: number;
          compare_at_price?: number | null;
          stock?: number;
          color_name?: string | null;
          color_hex?: string | null;
          fabric?: string | null;
          is_new_arrival?: boolean;
          is_best_seller?: boolean;
          is_on_sale?: boolean;
          sale_discount_percent?: number;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          display_order: number;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
        Update: {
          url?: string;
          alt_text?: string | null;
          display_order?: number;
          is_primary?: boolean;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          is_guest: boolean;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string;
          shipping_address: string;
          city: string;
          province: string | null;
          postal_code: string | null;
          payment_method: string;
          payment_status: "PENDING" | "PAID" | "REFUNDED";
          order_status:
            | "PENDING"
            | "CONFIRMED"
            | "PROCESSING"
            | "DISPATCHED"
            | "DELIVERED"
            | "CANCELLED";
          subtotal: number;
          shipping_fee: number;
          discount_amount: number;
          grand_total: number;
          order_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          is_guest?: boolean;
          customer_name: string;
          customer_email?: string | null;
          customer_phone: string;
          shipping_address: string;
          city?: string;
          province?: string | null;
          postal_code?: string | null;
          payment_method?: string;
          payment_status?: "PENDING" | "PAID" | "REFUNDED";
          order_status?:
            | "PENDING"
            | "CONFIRMED"
            | "PROCESSING"
            | "DISPATCHED"
            | "DELIVERED"
            | "CANCELLED";
          subtotal: number;
          shipping_fee?: number;
          discount_amount?: number;
          grand_total: number;
          order_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          payment_status?: "PENDING" | "PAID" | "REFUNDED";
          order_status?:
            | "PENDING"
            | "CONFIRMED"
            | "PROCESSING"
            | "DISPATCHED"
            | "DELIVERED"
            | "CANCELLED";
          order_notes?: string | null;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_image: string | null;
          unit_price: number;
          quantity: number;
          selected_woman_size: string | null;
          selected_girl_size: string | null;
          is_custom_size: boolean;
          custom_measurements: Json | null;
          line_total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_image?: string | null;
          unit_price: number;
          quantity?: number;
          selected_woman_size?: string | null;
          selected_girl_size?: string | null;
          is_custom_size?: boolean;
          custom_measurements?: Json | null;
          line_total: number;
        };
        Update: {
          quantity?: number;
          line_total?: number;
        };
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_percent: number;
          min_order_amount: number;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_percent?: number;
          min_order_amount?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          discount_percent?: number;
          min_order_amount?: number;
          is_active?: boolean;
          expires_at?: string | null;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
        };
        Update: {
          email?: string;
        };
      };
    };
  };
}
