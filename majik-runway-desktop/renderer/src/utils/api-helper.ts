import axios from "axios";
import { isDevEnvironment } from "../utils/helper";



/**
 * Configuration options for the `retryWithBackoff` utility.
 */
export interface RetryOptions {
    /**
     * Maximum number of retry attempts.
     * @default 5
     */
    maxAttempts?: number;

    /**
     * Initial delay before the first retry (in milliseconds).
     * @default 1000
     */
    initialDelayMs?: number;

    /**
     * Jitter factor to randomize delay between retries.
     * @example 0.4 means ±40% randomness
     * @default 0.4
     */
    jitterFactor?: number;

    /**
     * Maximum delay between retries (in milliseconds).
     * @default 10000
     */
    capDelayMs?: number;

    /**
     * Description of the process being retried (for logging and error messages).
     * @default "process"
     */
    description?: string;
}




/**
 * Retries a promise-returning function with exponential backoff and optional jitter.
 *
 * @template T - Return type of the async function.
 * @param fn - The asynchronous function to retry.
 * @param options - Optional retry configuration.
 * @returns Result of the function or throws if all attempts fail.
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 5,
        initialDelayMs = 1000,
        jitterFactor = 0.4,
        capDelayMs = 10000,
        description = "process"
    } = options;

    let attempts = 0;
    let delay = initialDelayMs;

    while (attempts < maxAttempts) {
        try {
            return await fn();
        } catch (error) {
            attempts++;

            const shouldRetry =
                axios.isAxiosError(error) &&
                (!error.response || error.response.status >= 500);

            if (!shouldRetry || attempts >= maxAttempts) {
                throw error;
            }

            if (isDevEnvironment()) {
                console.warn(`Retry attempt ${attempts}, retrying in ${delay}ms...`);
            }

            await sleep(delay);
            delay = Math.min(
                Math.round(delay * (1.5 + Math.random() * jitterFactor)),
                capDelayMs
            );
        }
    }

    throw new Error(`Failed to ${description.toLowerCase()} after ${maxAttempts} attempts.`);
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
