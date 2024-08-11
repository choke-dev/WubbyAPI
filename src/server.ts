import { Application } from "https://deno.land/x/oak@14.2.0/mod.ts";

import router from './routes.ts';
const port = Deno.env.get("PORT") || 5000;
const app = new Application({ proxy: true });


app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Wubby API running on port ${port}`);

await app.listen({ port: +port });