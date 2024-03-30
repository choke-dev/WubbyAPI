import { Request, Response } from "https://deno.land/x/oak@14.2.0/mod.ts";

const healthCheck = async ({ request, response }: { request: Request, response: Response }) => {
    response.body = {
        message: 'OK'
    };
    response.status = 200;
}

export { healthCheck };