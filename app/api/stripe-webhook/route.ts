import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/utils/supabase-server";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    })
  : null;

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!);
    } catch (err: any) {
      console.error(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    // Log the webhook event
    await supabase.from('webhooks').insert({
      stripe_event_id: event.id,
      event_type: event.type,
      event_data: event.data,
    });

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent, supabase);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  try {
    const userId = session.metadata?.user_id;
    
    if (!userId) {
      console.error('No user_id in session metadata - checkout requires authentication');
      return;
    }

    const discountCode = session.metadata?.discount_code || '';
    const discountPercent = parseFloat(session.metadata?.discount_percent || '0');
    const taxAmount = parseFloat(session.metadata?.tax_amount || '0');
    const subtotal = parseFloat(session.metadata?.subtotal || '0');
    const total = parseFloat(session.metadata?.total || '0');
    const customerInfo = JSON.parse(session.metadata?.customer_info || '{}');
    const items = JSON.parse(session.metadata?.items || '[]');

    const enrichedItems: any[] = [];

    for (const item of items) {
      const quantity = item.quantity || 1;
      const unitAmount = item.price || 0;
      const lineTotal = unitAmount * quantity;

      let product: any = null;
      const watchFields: string[] = [];
      if (item.product_slug) watchFields.push(`product_slug.eq.${item.product_slug}`);
      if (item.name) watchFields.push(`name.eq.${item.name}`);
      if (item.stripe_price_id) watchFields.push(`stripe_price_id.eq.${item.stripe_price_id}`);

      if (watchFields.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('id, product_slug, name, stripe_product_id, stripe_price_id, skool_group_id, skool_course_id, ghl_tag')
          .or(watchFields.join(','))
          .maybeSingle();

        product = data;
      }

      enrichedItems.push({
        product_slug: item.product_slug || null,
        name: item.name || null,
        quantity,
        unit_amount: unitAmount,
        line_total: lineTotal,
        stripe_price_id: product?.stripe_price_id || item.stripe_price_id || null,
        stripe_product_id: product?.stripe_product_id || null,
        skool_group_id: product?.skool_group_id || null,
        skool_course_id: product?.skool_course_id || null,
        ghl_tag: product?.ghl_tag || null,
        product_id: product?.id || null,
      });
    }

    // Update or create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .upsert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: total,
        discount_code: discountCode,
        discount_amount: (subtotal * discountPercent) / 100,
        tax_amount: taxAmount,
        status: 'completed',
        metadata: {
          customer_info: customerInfo,
          items: enrichedItems,
          stripe_session: session,
        },
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
      return;
    }

    // Grant product access
    for (const enrichedItem of enrichedItems) {
      if (!enrichedItem.product_id) continue;

      await supabase
        .from('user_products')
        .upsert({
          user_id: userId,
          product_id: enrichedItem.product_id,
          purchase_id: purchase.id,
          granted_at: new Date().toISOString(),
          is_active: true,
        });
    }

    // Update profile with customer info if provided
    if (customerInfo.firstName || customerInfo.lastName || customerInfo.company || customerInfo.phone) {
      await supabase
        .from('profiles')
        .update({
          first_name: customerInfo.firstName,
          last_name: customerInfo.lastName,
          company: customerInfo.company,
          phone: customerInfo.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);
    }

    // Send data to Zapier webhook
    await sendToZapier({
      event: 'checkout.session.completed',
      user_id: userId,
      purchase_id: purchase.id,
      customer_email: session.customer_details?.email || customerInfo.email,
      customer_first_name: session.customer_details?.name?.split(' ')[0] || customerInfo.firstName || null,
      customer_last_name: session.customer_details?.name?.split(' ').slice(1).join(' ') || customerInfo.lastName || null,
      customer_name: session.customer_details?.name || `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
      products: enrichedItems,
      total_amount: total,
      currency: session.currency || 'usd',
      discount_code: discountCode || null,
      discount_percent: discountPercent,
      tax_amount: taxAmount,
      subtotal: subtotal,
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      stripe_customer_id: session.customer as string,
      purchase_date: new Date().toISOString(),
    });

    // Mark webhook as processed
    await supabase
      .from('webhooks')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('stripe_event_id', session.id);

  } catch (error) {
    console.error('Error handling checkout session completed:', error);

    // Mark webhook as failed
    await supabase
      .from('webhooks')
      .update({
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('stripe_event_id', session.id);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  // Update purchase status to failed
  await supabase
    .from('purchases')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id);
}

async function sendToZapier(data: any) {
  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;

  if (!zapierUrl) {
    console.warn('Zapier webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(zapierUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Failed to send data to Zapier:', response.statusText);
    } else {
      console.log('Successfully sent data to Zapier');
    }
  } catch (error) {
    console.error('Error sending data to Zapier:', error);
  }
}