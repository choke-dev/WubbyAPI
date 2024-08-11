import { Context, Middleware } from "https://deno.land/x/oak@14.2.0/mod.ts";

interface RateLimiterOptions {
    /**
     * Time window in milliseconds.
     */
    windowMs: number;

    /**
     * Allowed number of requests within the time window.
     */
    maxRequests: number;

    /**
     * Optional custom error message.
     * Defaults to "Too many requests. Please try again later."
     */
    errorMessage?: string;
}

const rateLimiter = (options: RateLimiterOptions): Middleware => {
    const { windowMs, maxRequests, errorMessage = "Too many requests. Please try again later." } = options;
    const clients: Map<string, { requests: number; timestamp: number }> = new Map();
    
    return async (ctx: Context, next) => {
        const now = Date.now();
        const clientIp = ctx.request.ip;
        const clientData = clients.get(clientIp) || { requests: 0, timestamp: now };
        
        if (now - clientData.timestamp > windowMs) {
            clientData.requests = 0;
            clientData.timestamp = now;
        }
        
        clientData.requests += 1;
        
        if (clientData.requests > maxRequests) {
            const retryAfterTimestamp = clientData.timestamp + windowMs;
            ctx.response.status = 429;
            ctx.response.headers.set("Retry-After", retryAfterTimestamp.toString());
            ctx.response.body = { errors: [{ message: errorMessage }] };
            return;
        }
        
        clients.set(clientIp, clientData);
        await next();
    };
};

export { rateLimiter };
