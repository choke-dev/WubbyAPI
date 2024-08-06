import { Application } from "https://deno.land/x/oak@14.2.0/mod.ts";

import { requestLogger } from "./middlewares/logger.middleware.ts";

import router from './routes.ts';
const port = Deno.env.get("PORT") || 5000;
const app = new Application({ proxy: true });

app.use(requestLogger);
app.use(async (ctx, next) => {
    if (ctx.request.method === "GET") {
        ctx.response.headers.set('Access-Control-Allow-Origin', '*');
        return await next();
    }
    return;
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Wubby API running on port ${port}`);

await app.listen({ port: +port });