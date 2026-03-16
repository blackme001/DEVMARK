"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
    if (paddleInstance) return paddleInstance;

    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) {
        console.error("Paddle client token is not configured.");
        return undefined;
    }

    paddleInstance = await initializePaddle({
        token,
        environment: "production",
    });

    return paddleInstance;
}

export function usePaddle() {
    const [paddle, setPaddle] = useState<Paddle | undefined>();

    useEffect(() => {
        getPaddle().then(setPaddle);
    }, []);

    return paddle;
}
