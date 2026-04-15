import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/utils/supabase-server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

export async function GET(request: NextRequest) {
  try {
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

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get purchase details by session ID and verify it belongs to the current user
    let { data: purchase, error: purchaseError }:
      { data: any | null; error: any } = await supabase
      .from('purchases')
      .select(`
        id,
        amount,
        status,
        created_at,
        user_id,
        user_products (
          product_id,
          products (
            name,
            type
          )
        )
      `)
      .eq('stripe_session_id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (purchaseError || !purchase) {
      if (!stripe) {
        return NextResponse.json(
          { error: "Purchase not found" },
          { status: 404 }
        );
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session || session.payment_status !== 'paid' || session.metadata?.user_id !== user.id) {
        return NextResponse.json(
          { error: "Purchase not found" },
          { status: 404 }
        );
      }

      const customerInfo = JSON.parse(session.metadata?.customer_info || '{}');
      const items = JSON.parse(session.metadata?.items || '[]');
      const discountPercent = parseFloat(session.metadata?.discount_percent || '0');
      const taxAmount = parseFloat(session.metadata?.tax_amount || '0');
      const subtotal = parseFloat(session.metadata?.subtotal || '0');
      const total = parseFloat(session.metadata?.total || '0');
      const discountCode = session.metadata?.discount_code || '';

      const { data: insertedPurchase, error: insertError } = await supabase
        .from('purchases')
        .upsert({
          user_id: user.id,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: total,
          discount_code: discountCode,
          discount_amount: (subtotal * discountPercent) / 100,
          tax_amount: taxAmount,
          status: 'completed',
          metadata: {
            customer_info: customerInfo,
            items,
            stripe_session: session,
          },
        })
        .select()
        .single();

      if (insertError || !insertedPurchase) {
        console.error('Error creating fallback purchase record:', insertError);
        return NextResponse.json(
          { error: "Purchase not found" },
          { status: 404 }
        );
      }

      purchase = insertedPurchase;
    }

    if (purchase.status !== 'completed') {
      return NextResponse.json(
        { error: "Purchase is not completed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      purchase_id: purchase.id,
      amount: purchase.amount,
      status: purchase.status,
      created_at: purchase.created_at,
      products: purchase.user_products?.map((up: any) => up.products) || [],
    });
  } catch (error: any) {
    console.error("Purchase verification failed:", error);
    return NextResponse.json(
      { error: "Failed to verify purchase" },
      { status: 500 }
    );
  }
}