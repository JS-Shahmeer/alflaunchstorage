"use client";
import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, ChevronLeft, Loader } from "lucide-react";

export default function CheckoutPaymentForm({ 
  total, 
  onSuccess, 
  onBack,
  loading: parentLoading 
}: {
  total: number;
  onSuccess: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "usd",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent");
        }

        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment. Please try again.");
      }
    };

    if (total > 0) {
      createPaymentIntent();
    }
  }, [total]);

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not initialized. Please refresh and try again.");
      return;
    }

    if (cardError) {
      setError("Please fix the card error before proceeding.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      // Payment successful
      onSuccess();
      setLoading(false);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 lg:p-8 shadow-md w-full lg:max-w-xl">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black">Payment</h2>

      {/* Stripe Card Box */}
      {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 bg-gray-50 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-300 text-gray-600 rounded-lg p-3">
            💳
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Stripe Payment Integration</h3>
        <p className="text-gray-600 text-sm">Enter your card details below to complete your order securely.</p>
      </div> */}

      {/* Card Element */}
      <form onSubmit={handlePayment} className="space-y-3 md:space-y-4">
        <div className="border border-gray-300 rounded-lg p-3 md:p-4 bg-white">
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                },
              },
            }}
          />
        </div>
        {cardError && <p className="text-red-500 text-xs md:text-sm">{cardError}</p>}

        {/* Security Message */}
        <div className="flex items-center gap-2 text-green-800 mb-3 md:mb-4">
          <Lock size={14} className="md:w-4 md:h-4" />
          <span className="text-xs md:text-sm font-medium">Your payment information is secure and encrypted</span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
            <p className="text-red-700 text-xs md:text-sm">{error}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <p className="text-xs text-orange-800">
            <span className="font-semibold">Disclaimer:</span> This product is an informational resource designed to assist with the licensing and startup process for care facilities. It does not constitute legal, financial, or professional compliance advice. The purchaser is solely responsible for verifying all information with applicable state and local regulatory agencies. Care Licensing Solutions makes no guarantees regarding licensing approval or business outcomes. All sales are final.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center gap-3 flex-col sm:flex-row">
          <button
            type="button"
            className="text-green-700 font-semibold cursor-pointer hover:text-green-900 flex items-center gap-1 text-sm md:text-base"
            onClick={onBack}
            disabled={loading || parentLoading}
          >
            <ChevronLeft size={16} />
            Back to Information
          </button>
          <button
            type="submit"
            className={`bg-green-800 hover:bg-green-900 text-white font-semibold py-2 md:py-3 px-4 md:px-8 rounded-lg flex items-center gap-2 transition text-sm md:text-base w-full sm:w-auto justify-center ${ 
              loading || parentLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading || parentLoading || !stripe}
          >
            {loading ? <Loader className="animate-spin" size={16} /> : null}
            Pay ${total.toFixed(2)}
          </button>
        </div>
      </form>
    </div>
  );
}
