"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { useAuthModal } from "./AuthModalContext";
import { useToast } from "./SimpleToast";
import { usePendingPurchase } from "./PendingPurchaseContext";
import { useCart } from "./cart-context";

export default function useBuyNow() {
  const [loading, setLoading] = useState(false);
  const { session, user, loading: authLoading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const toast = useToast();
  const { pendingItem, setPendingItem } = usePendingPurchase();
  const { addItem } = useCart();
  const router = useRouter();
  const hasResumedCheckout = useRef(false);

  // Auto-resume checkout when user logs in and has a pending item
  useEffect(() => {
    console.log("useBuyNow useEffect triggered:", {
      hasToken: !!session?.access_token,
      hasUser: !!user,
      authLoading,
      hasResumed: hasResumedCheckout.current,
      pendingItemFromContext: pendingItem,
    });

    // Check if user just logged in (has access token)
    if (!session?.access_token) {
      console.log("No access token yet, cannot resume");
      hasResumedCheckout.current = false;
      return;
    }

    // Skip if we've already resumed checkout in this session
    if (hasResumedCheckout.current) {
      console.log("Already resumed checkout in this session, skipping");
      return;
    }

    // Try to restore pending item from localStorage (source of truth)
    let itemToUse = null;
    try {
      const stored = localStorage.getItem("pending-purchase-item");
      if (stored) {
        itemToUse = JSON.parse(stored);
        console.log("Found pending item in localStorage:", itemToUse);
      } else {
        console.log("No pending item in localStorage");
      }
    } catch (err) {
      console.warn("Failed to read from localStorage:", err);
    }

    // If no item in localStorage, check context
    if (!itemToUse && pendingItem) {
      itemToUse = pendingItem;
      console.log("Using pending item from context:", itemToUse);
    }

    if (!itemToUse) {
      console.log("No pending item found in localStorage or context, nothing to resume");
      return;
    }

    // Mark that we're attempting to resume checkout
    hasResumedCheckout.current = true;

    // User is now authenticated and has a pending purchase: go to checkout
    const resumeCheckout = () => {
      console.log("🚀 Resuming checkout with pending item:", itemToUse);
      addItem(itemToUse);
      setPendingItem(null);
      try {
        localStorage.removeItem("pending-purchase-item");
        console.log("✓ Cleared pending item from localStorage");
      } catch (err) {
        console.warn("Failed to clear pending item from localStorage:", err);
      }
      console.log("📍 Redirecting to /checkout");
      router.push("/checkout");
    };

    // Small delay to ensure modal is fully closed and state has settled
    const timer = setTimeout(() => {
      resumeCheckout();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [session?.access_token, addItem, setPendingItem, router]);

  async function buyNow(item: any) {
    console.log("buyNow called with item:", item);
    console.log("Current session:", session?.access_token ? "Has token" : "No token");
    
    if (!session?.access_token) {
      // User not authenticated: store the item and open auth modal
      console.log("Not authenticated, saving pending item and opening auth modal");
      setPendingItem(item);
      toast.show("Please log in or sign up to continue to purchase.");
      openAuthModal();
      return;
    }

    // User is authenticated: add to cart and go to checkout
    console.log("Already authenticated, adding to cart directly");
    setLoading(true);
    try {
      addItem(item);
      router.push("/checkout");
    } catch (err: any) {
      toast.show(err?.message || "Unable to proceed. Please try again.");
      setLoading(false);
    }
  }

  return { buyNow, loading } as const;
}
