import { headers } from "next/headers";
import { RateLimiterMemory } from "rate-limiter-flexible";




export const API_RateLimiter = new RateLimiterMemory({
    points: 150,
    duration: 30, // Per second
});

export const API_RateLimiter_Gemini = new RateLimiterMemory({
    points: 2,
    duration: 86400, // Per second
});


export async function getUserIPFromHeader(): Promise<string> {
    const headersList = await headers();

    const userIP =
        headersList.get('x-forwarded-for')?.split(",")[0] ||
        headersList.get('x-real-ip') ||
        '127.0.0.1' //Local dev fallback

    return userIP;
}