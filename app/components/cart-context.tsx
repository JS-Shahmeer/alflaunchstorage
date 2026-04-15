"use client";
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useToast } from "./SimpleToast";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  type?: string;
  state?: string;
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  loaded: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("cart-items");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [loaded, setLoaded] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const isHydrated = useRef(false);
  const toast = useToast();

  // Hydration marker for localStorage saves
  useEffect(() => {
    isHydrated.current = true;
    setLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes after hydration
  useEffect(() => {
    if (!isHydrated.current) return;
    window.localStorage.setItem("cart-items", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      let updated;
      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      setLastAdded(item.name);
      return updated;
    });
  }
  React.useEffect(() => {
    if (lastAdded) {
      toast.show(`${lastAdded} added to cart!`);
      setLastAdded(null);
    }
  }, [lastAdded, toast]);

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, loaded, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
