import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

// Paddle sends webhooks as JSON. In production, you should verify the signature
// using the Paddle-Signature header and your secret key.
export async function POST(req: NextRequest) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const body = await req.json();
        const eventType: string = body?.event_type;

        console.log("[Paddle Webhook] Received event:", eventType);

        if (eventType === "subscription.activated" || eventType === "subscription.updated") {
            const customerId: string = body?.data?.customer_id;
            const status: string = body?.data?.status; // "active", "past_due", "canceled"

            if (customerId && status === "active") {
                const { error } = await (supabaseAdmin as any)
                    .from("User")
                    .update({ subscriptionTier: "ELITE" })
                    .eq("paddleCustomerId", customerId);

                if (error) {
                    console.error("[Paddle Webhook] Error updating user tier:", error);
                }
            }
        }

        if (eventType === "subscription.canceled" || eventType === "subscription.paused") {
            const customerId: string = body?.data?.customer_id;

            if (customerId) {
                const { error } = await (supabaseAdmin as any)
                    .from("User")
                    .update({ subscriptionTier: "FREE" })
                    .eq("paddleCustomerId", customerId);

                if (error) {
                    console.error("[Paddle Webhook] Error downgrading user tier:", error);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("[Paddle Webhook] Failed to process event:", err);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
