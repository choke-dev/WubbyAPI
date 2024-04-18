import { Universe, DataStore } from "npm:@daw588/roblox.js";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import { Request, Response, State } from "https://deno.land/x/oak@14.2.0/mod.ts";
import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

import { WubbyAPI_WorldInfo } from '../types/world.types.ts'

const env = await load();

const universeId = +env["UNIVERSE_ID"];
const apiKey = env["API_KEY"];

const universe = new Universe(universeId, apiKey);
const worlds = new DataStore(universe, "Games");
const sql = postgres({
  host     : env["DATABASE_HOST"],
  port     : 5432,
  database : env["DATABASE_NAME"],
  username : env["DATABASE_USER"],
  password : env["DATABASE_PASSWORD"],
})

const numberRegex = /^\d+$/;

const getWorldInfo = async ({ response, params }: { response: Response, params: { worldid: string } }) => {
    const worldID = params.worldid

    // idk how to use middlewares
    if (!numberRegex.test(worldID)) {
        response.body = { errors: [{ message: `Invalid world ID. (Received: ${worldID})` }] };
        response.status = 400;
        return
    }

    try {
        const [featuredWorlds, worldInfo] = await Promise.all([
            worlds.GetAsync("FEATURED").then(response => response[0]),
            worlds.GetAsync(worldID).then(response => response[0])
        ]) as [number[], WubbyAPI_WorldInfo];

        const data = {
            activePlayers: worldInfo["ActivePlayers"],
            bannedPlayers: worldInfo["Banned"],
            blocks: worldInfo["Blocks"],
            creator: worldInfo["Owner"],
            description: worldInfo["Description"],
            favorites: worldInfo["Favs"],
            isFeatured: featuredWorlds.includes(Number(worldID)),
            maxPlayers: worldInfo["MaxPlayers"],
            name: worldInfo["Name"],
            privateWhitelistedPlayers: worldInfo["PWhitelist"],
            privacyState: worldInfo["State"],
            serverJobId: worldInfo["Server"],
            thumbnails: worldInfo["Image"],
            thirdPartyWarpInfo: worldInfo["WI"],
            thirdPartyWarps: worldInfo["AW"],
            visits: worldInfo["Visits"],
            worldId: worldInfo["GameId"],
            whitelistedPlayers: worldInfo["Whitelisted"],
        }

        response.body = data
        response.status = 200
    } catch (err) {
        response.body = { errors: [err] };
        response.status = err.status;
    }
}

const searchWorld = async ({ request, response }: { request: Request, response: Response }) => {
    const queryParams = request.url.searchParams
    const worldName: string | null = queryParams.get('query')
    const limit: number = Number(request.url.searchParams.get('limit')) || 50

    if (!worldName) {
        response.body = { errors: [{ message: 'Missing "query" parameter value' }] };
        response.status = 400;
        return; 
    }

    if (worldName.length < 3) {
        response.body = { errors: [{ message: 'Search query must be at least 3 characters long' }] };
        response.status = 400;
        return;
    }

    const queryResult = await sql`SELECT * FROM worlds WHERE world_name ~* ${worldName} LIMIT ${limit}`;

    response.body = queryResult
    response.status = 200;
}

const insertWorld = async ({ response, state }: { response: Response, state: State }) => {
    const requestBody = state.requestBody

    try {
        await sql.begin(async sql => {
            await sql`
                INSERT INTO worlds 
                ${sql(requestBody, "world_id", "world_name", "world_description")}
            `
        })
        response.body = { message: "OK" }
        response.status = 200;
    } catch(err) {
        response.body = { errors: [{ message: err.message }] };
        response.status = 500   
    }
}

const updateWorld = async ({ response, state }: { response: Response, state: State }) => {
    const requestBody = state.requestBody

    try {
        await sql.begin(async sql => {
            await sql`
                UPDATE worlds 
                SET 
                world_name = ${requestBody.world_name}, 
                world_description = ${requestBody.world_description} 
                WHERE 
                world_id = ${requestBody.world_id}
            `
        })
        response.body = { message: "OK" }
        response.status = 200;
    } catch(err) {
        response.body = { errors: [{ message: err.message }] };
        response.status = 500   
    }
}

export { getWorldInfo, searchWorld, insertWorld, updateWorld }