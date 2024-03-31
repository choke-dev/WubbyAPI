import { Context, Next } from "https://deno.land/x/oak@14.2.0/mod.ts"

const auth = (requiredApiKeys: string[]) => {
    return async (ctx: Context, next: Next) => {
        const apiKey = ctx.request.headers.get('Authorization');

        if (!apiKey) {
            ctx.response.status = 401;
            ctx.response.body = { errors: { message: 'Unauthorized' } }
            return;
        }

        if (!requiredApiKeys.includes(apiKey)) {
            ctx.response.status = 403;
            ctx.response.body = { errors: { message: 'Forbidden' } }
            return;
        }

        await next();
    };
};

export { auth }