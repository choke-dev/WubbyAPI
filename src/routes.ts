import { Context, Router } from "https://deno.land/x/oak@14.2.0/mod.ts"
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

// controllers //
import { healthCheck } from './controllers/api.ts';
import { getWorldCount, getWorldInfo, searchWorld, insertWorld, updateWorld, getActiveWorlds } from './controllers/world.ts';
import { getUserInfo } from "./controllers/user.ts";

// middlewares //
import { auth } from './middlewares/auth.middleware.ts'
import { validateWorldData } from "./middlewares/world.middleware.ts";

// variables //
const env = await load();
const router = new Router();



router.get('/', healthCheck);

router.get('/v1/worldcount', getWorldCount)
router.get('/v1/worldinfo/:worldid', getWorldInfo);
router.get('/v1/userinfo/:userid', getUserInfo);

// router.get('/v1/searchworld', auth([ env["APIKEY_MASTER"], env["APIKEY_WUBBYGAME"] ]), searchWorld);
router.get('/v1/searchworld', searchWorld);
router.get('/v1/activeworlds', auth([ env["APIKEY_MASTER"], env["APIKEY_WUBBYGAME"] ]), getActiveWorlds);
router.post('/v1/insertworld', auth([ env["APIKEY_MASTER"], env["APIKEY_WUBBYGAME"] ]), validateWorldData, insertWorld);
router.patch('/v1/updateworld', auth([ env["APIKEY_MASTER"], env["APIKEY_WUBBYGAME"] ]), validateWorldData, updateWorld);

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
