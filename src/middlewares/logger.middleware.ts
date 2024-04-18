import { Context, Next } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { sql } from '../services/database.service.ts';

const requestLogger = async (ctx: Context, next: Next) => {
    await next();

    const requestUUID = crypto.randomUUID();
    const requestTimestamp = new Date().toISOString();
    const requestUseragent = ctx.request.userAgent;
    const requestMethod = ctx.request.method;
    const requestUrl = ctx.request.url;
    const requestHeaders = JSON.stringify(Object.fromEntries(ctx.request.headers));
    const requestIp = ctx.request.ip;

    const responseStatus = ctx.response.status;
    const responseBody = JSON.stringify(ctx.response.body);

    console.log(`(${requestTimestamp}) [${requestMethod}] ${requestUrl}`);

    const data = {
        requestId: requestUUID,
        requestTimestamp: requestTimestamp,
        requestMethod: requestMethod,
        requestUrl: requestUrl,
        requestHeaders: requestHeaders,
        requestIp: requestIp,
        requestUseragent: requestUseragent,

        responseStatus: responseStatus,
        responseBody: responseBody
    };

    try {
        await sql.begin(async sql => {
            await sql` INSERT INTO requests ${sql(data)} `;
        });
    } catch(err) {
        console.log(`Failed to save request data to database: ${err}`);
    }

    ctx.response.headers.set("x-request-id", requestUUID)
};

export { requestLogger };