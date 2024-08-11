import { Context, Router } from "https://deno.land/x/oak@14.2.0/mod.ts"
import { oakCors } from "https://deno.land/x/cors/mod.ts";

// controllers //
import { healthCheck, statistics } from './controllers/api.ts';
import * as worldcontroller from './controllers/world.ts';
import { getUserInfo } from "./controllers/user.ts";

// middlewares //
import { auth } from './middlewares/auth.middleware.ts'
import { validateWorldData } from "./middlewares/world.middleware.ts";
import { rateLimiter } from "./middlewares/ratelimiter.middleware.ts";

// variables //
const router = new Router();


router.get('/', oakCors(), rateLimiter({ windowMs: 60 * 1000, maxRequests: 1 }), healthCheck);
router.get('/statistics', oakCors(), statistics)

router.get('/v1/worldinfo/:worldid', oakCors(), worldcontroller.getWorldInfo);
router.get('/v1/userinfo/:userid', oakCors(), getUserInfo);

router.post('/v1/worldinfo', oakCors(), rateLimiter({ windowMs: 60 * 1000, maxRequests: 25 }), worldcontroller.batchGetWorldInfo);

router.get('/v1/searchworld', oakCors(), rateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }), worldcontroller.searchWorld);
router.post('/v1/insertworld', auth([Deno.env.get("APIKEY_LOCKED")!]), validateWorldData, worldcontroller.insertWorld);
router.patch('/v1/updateworld', auth([Deno.env.get("APIKEY_LOCKED")!]), validateWorldData, worldcontroller.updateWorld);

router.get("/(.*)", (context: Context) => {
    if (context.request.url.pathname.startsWith("/favicon.ico")) {
        const faviconImg = Deno.readFileSync(`${Deno.cwd()}/src/public/favicon.ico`);
        context.response.body = faviconImg;
        context.response.status = 200;
        context.response.headers.set('Content-Type', 'image/x-icon');
        return;
    }

    context.response.status = 404;
    context.response.body = { errors: [{ message: 'Not Found' }] };
});

export default router
