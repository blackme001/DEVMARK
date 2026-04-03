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
            const customerId = body.data.customer_id;
            const status = body.data.status;
            const userId = body.data.custom_data?.userId;

            if (userId && status === "active") {
                const { error } = await (supabaseAdmin as any)
                    .from("User")
                    .update({ 
                        subscriptionTier: "ELITE",
                        paddleCustomerId: customerId 
                    })
                    .eq("id", userId);

                if (error) {
                    console.error("[Paddle Webhook] Error updating user tier:", error);
                } else {
                    console.log(`[Paddle Webhook] Successfully upgraded user ${userId} to ELITE`);
                }
            }
        }

        if (eventType === "subscription.canceled") {
            const userId = body.data.custom_data?.userId;

            if (userId) {
                const { error } = await (supabaseAdmin as any)
                    .from("User")
                    .update({ subscriptionTier: "FREE" })
                    .eq("id", userId);

                if (error) {
                    console.error("[Paddle Webhook] Error downgrading user:", error);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error("[Paddle Webhook] Failed to process event:", err);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
