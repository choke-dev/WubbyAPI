import { Context, Next } from "https://deno.land/x/oak@14.2.0/mod.ts"

const validateWorldData = async (ctx: Context, next: Next) => {
        if (!ctx.request.hasBody) {
            ctx.response.body = { errors: [{ message: 'Missing world data in body' }] };
            ctx.response.status = 400;
            return;
        }
    
        // JSON Validator
        const requestBody = await ctx.request.body.json()
        .catch(err => {
            ctx.response.body = { errors: [{ message: String(err).replace('BadRequestError: ', "").replace("Unexpected end of JSON input", "Missing world data in body") }] };
            ctx.response.status = 400;
            return;
        });
        if (!requestBody) return;
    
        // JSON Key Check
        const requiredKeys = ["world_id", "world_name", "world_description"];
        const missingKeys = requiredKeys.filter(key => !(key in requestBody));
        if (missingKeys.length > 0) {
            ctx.response.body = { errors: [{ message: `Missing keys in body: ${missingKeys.join(", ")}` }] };
            ctx.response.status = 400;
            return;
        }

        // JSON Key Value Check
        const emptyKeys = requiredKeys.filter(key => !requestBody[key]);
        if (emptyKeys.length > 0) {
            ctx.response.body = { errors: [{ message: `Empty values for keys: ${emptyKeys.join(", ")}` }] };
            ctx.response.status = 400;
            return;
        }

        ctx.state.requestBody = requestBody;

        await next()
};

export { validateWorldData }