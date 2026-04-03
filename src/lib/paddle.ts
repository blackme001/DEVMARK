"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
    if (paddleInstance) return paddleInstance;

    // The user provided this live token directly
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_7781a8cb7a8910212a14de32d2e';

    try {
        paddleInstance = await initializePaddle({
            environment: 'production',
            token: token
        });
        return paddleInstance;
    } catch (e) {
        console.error("Failed to initialize Paddle:", e);
        return undefined;
    }
}

export function usePaddle() {
    const [paddle, setPaddle] = useState<Paddle | undefined>();

    useEffect(() => {
        getPaddle().then(setPaddle);
    }, []);

    return paddle;
}
