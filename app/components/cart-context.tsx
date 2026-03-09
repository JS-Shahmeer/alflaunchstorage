"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const toast = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("cart-items");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart-items", JSON.stringify(items));
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
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
