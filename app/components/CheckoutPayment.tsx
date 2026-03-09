"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutPaymentForm from "./CheckoutPaymentForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPayment({
  total,
  onSuccess,
  onBack,
  loading,
}: {
  total: number;
  onSuccess: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPaymentForm
        total={total}
        onSuccess={onSuccess}
        onBack={onBack}
        loading={loading}
      />
    </Elements>
  );
}
