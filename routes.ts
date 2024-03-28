import { Router } from "https://deno.land/x/oak@14.2.0/mod.ts"
import { getWorldInfo, searchWorld, insertWorld, updateWorld } from './controllers/world.ts'
import { getUserInfo } from "./controllers/user.ts"

const router = new Router()

// router.get('/api/v1/products', getProducts)
// .get('/api/v1/products/:id', getProduct)
// .post('/api/v1/products', addProduct)
// .put('/api/v1/products/:id', updateProduct)
// .delete('/api/v1/products/:id', deleteProduct)

router.get('/api/v1/worldinfo/:worldid', getWorldInfo)
router.get('/api/v1/userinfo/:userid', getUserInfo)

router.get('/api/v1/searchworld/:worldname', searchWorld)
router.post('/api/v1/insertworld', insertWorld)
router.put('/api/v1/updateworld', updateWorld)

export default router