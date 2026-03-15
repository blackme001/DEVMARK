"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

export function useStripeCheckout() {
    const [isLoading, setIsLoading] = useState(false);

    const initiateCheckout = async (options: {
        items: { name: string; description: string; price: number; image?: string; quantity?: number }[];
        customerEmail?: string;
        mode?: "payment" | "subscription";
        metadata?: Record<string, any>;
    }) => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...options,
                    successUrl: window.location.origin + "/dashboard?payment=success",
                    cancelUrl: window.location.origin + "/pricing?payment=cancelled",
                }),
            });

            const { sessionId, url, error } = await response.json();

            if (error) throw new Error(error);

            if (url) {
                window.location.href = url;
            } else {
                const stripe = await stripePromise;
                if (!stripe) throw new Error("Stripe failed to load");
                const { error: stripeError } = await (stripe as any).redirectToCheckout({ sessionId });
                if (stripeError) throw stripeError;
            }
        } catch (err: any) {
            console.error("Checkout Error:", err);
            toast.error(err.message || "Failed to initiate secure checkout.");
        } finally {
            setIsLoading(false);
        }
    };

    return { initiateCheckout, isLoading };
}
