import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { items, customerEmail, successUrl, cancelUrl, mode, metadata } = await req.json();

        // Create a Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        description: item.description,
                        images: item.image ? [item.image] : [],
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects cents
                    ...(mode === "subscription" && {
                        recurring: {
                            interval: (metadata?.billingCycle === "yearly" ? "year" : "month") as "year" | "month",
                        },
                    }),
                },
                quantity: item.quantity || 1,
            })),
            mode: mode || "payment", // "payment" or "subscription"
            customer_email: customerEmail,
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                ...metadata,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error("Stripe Checkout Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
