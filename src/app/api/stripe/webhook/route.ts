import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder"
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object as any;
            const metadata = session.metadata;

            // Fullfill the purchase in Supabase
            if (metadata.type === "PROJECT_PURCHASE") {
                const { error } = await (supabaseAdmin
                    .from("Purchase") as any)
                    .insert({
                        id: crypto.randomUUID(),
                        projectId: metadata.projectId,
                        buyerId: metadata.buyerId,
                        amount: session.amount_total / 100,
                        status: "SUCCESS",
                        stripeSessionId: session.id,
                    });

                if (error) {
                    console.error("Failed to record purchase in Supabase:", error);
                }
            } else if (metadata.type === "SUBSCRIPTION") {
                // Update user role to SELLER/Elite status
                const { error } = await (supabaseAdmin
                    .from("User") as any)
                    .update({
                        role: "SELLER",
                        // Store the subscription info in metadata if needed
                        user_metadata: {
                            isElite: true,
                            stripeSubscriptionId: session.subscription,
                            planName: metadata.planName
                        }
                    })
                    .eq("id", session.client_reference_id || metadata.userId);

                if (error) {
                    console.error("Failed to update user subscription status:", error);
                }
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
