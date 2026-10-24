"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CustomMeasurements {
  ageOrHeight?: string;
  chest?: string;
  shirtLength?: string;
  waistOrTrouser?: string;
  notes?: string;
}

export interface CartItem {
  id: string; // unique item id = `${productId}-${color}-${sizeDescription}`
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  colorHex?: string;
  category: "women" | "girls" | "family";
  sizeDescription: string;
  womanSize?: string;
  girlSize?: string;
  includeGirlPiece?: boolean;
  isCustomSize: boolean;
  customMeasurements?: CustomMeasurements;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, deltaOrValue: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "aouj_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    const uniqueId = `${newItem.productId}-${newItem.color}-${newItem.sizeDescription}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === uniqueId);
      if (existingIndex > -1) {
        // Increment quantity of existing item
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      } else {
        // Add as new item
        return [...prevItems, { ...newItem, id: uniqueId }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, deltaOrValue: number, isAbsolute = false) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQuantity = isAbsolute ? deltaOrValue : item.quantity + deltaOrValue;
            return { ...item, quantity: Math.max(1, nextQuantity) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Fixed shipping charges of PKR 350 for every order
  const shippingFee = subtotal === 0 ? 0 : 350;
  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        shippingFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
