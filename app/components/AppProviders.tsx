"use client";
import { CartProvider } from "./cart-context";
import React from "react";
import { ToastProvider } from "./SimpleToast";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ToastProvider>
  );
}
