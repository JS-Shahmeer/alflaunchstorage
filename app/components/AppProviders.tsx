"use client";
import { CartProvider } from "./cart-context";
import React from "react";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
