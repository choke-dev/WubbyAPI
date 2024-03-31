import { Context, Router } from "https://deno.land/x/oak@14.2.0/mod.ts"
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

import { auth } from './middlewares/auth.ts'

import { healthCheck } from './controllers/api.ts';
import { getWorldInfo, searchWorld, insertWorld, updateWorld } from './controllers/world.ts';
import { getUserInfo } from "./controllers/user.ts";


const env = await load();
const router = new Router();

router.get('/', healthCheck);

router.get('/v1/worldinfo/:worldid', getWorldInfo);
router.get('/v1/userinfo/:userid', getUserInfo);

router.get('/v1/searchworld', auth([ env["APIKEY_WUBBYGAME"] ]), searchWorld);
router.post('/v1/insertworld', auth([ env["APIKEY_WUBBYGAME"] ]), insertWorld);
router.put('/v1/updateworld', auth([ env["APIKEY_WUBBYGAME"] ]), updateWorld);

router.get("/(.*)", (context: Context) => {      
    context.response.status = 404;
    context.response.body = { errors: [{ message: 'Not Found' }] };
});

export default router