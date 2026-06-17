import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/utils/supabase-server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const supabase = createServerSupabaseClient();

    const authHeader = request.headers.get('authorization') || '';
    const accessToken = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Get user if authenticated, but allow guest checkout
    let userId: string | null = null;
    if (accessToken) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
      if (!authError && user) {
        userId = user.id;
      }
    }

    const {
      items,
      successUrl,
      cancelUrl,
      discountCode,
      customerEmail,
      customerInfo
    } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * (item.quantity || 1), 0);
    const discountPercent = getDiscountPercent(discountCode);
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxRate = 0.08; // 8% tax
    const taxAmount = (subtotal - discountAmount) * taxRate;
    const total = subtotal - discountAmount + taxAmount;

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || `Product: ${item.name}`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    // Add tax as a separate line item if needed
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax (8%)',
            description: 'Sales tax',
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    // Apply discount if any
    const discounts = discountPercent > 0 ? [{
      coupon: await createOrGetCoupon(discountPercent),
    }] : [];

    // Create checkout session with optional user_id (for guest checkout support)
    const metadata: any = {
      discount_code: discountCode || '',
      discount_percent: discountPercent.toString(),
      tax_amount: taxAmount.toString(),
      subtotal: subtotal.toString(),
      total: total.toString(),
      customer_info: JSON.stringify(customerInfo),
      customer_first_name: customerInfo.firstName || '',
      customer_last_name: customerInfo.lastName || '',
      items: JSON.stringify(items.map((item: any) => ({
        product_slug: item.id || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      }))),
    };

    // Add user_id if authenticated
    if (userId) {
      metadata.user_id = userId;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      discounts,
      mode: 'payment',
      customer_email: customerEmail,
      metadata,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

function getDiscountPercent(code: string): number {
  const validCodes: { [key: string]: number } = {
    SAVE10: 10,
    SAVE15: 15,
    LAUNCH20: 20,
    WELCOME5: 5,
  };

  if (!code) return 0;
  return validCodes[code.toUpperCase()] || 0;
}

async function createOrGetCoupon(percent: number): Promise<string> {
  if (!stripe) throw new Error("Stripe not configured");

  const couponId = `discount_${percent}`;

  try {
    // Try to get existing coupon
    const coupon = await stripe.coupons.retrieve(couponId);
    return coupon.id;
  } catch {
    // Create new coupon if it doesn't exist
    const coupon = await stripe.coupons.create({
      id: couponId,
      percent_off: percent,
      duration: 'once',
    });
    return coupon.id;
  }
}