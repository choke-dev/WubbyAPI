import { Universe, DataStore } from "npm:@daw588/roblox.js";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import { Context, Request, Response } from "https://deno.land/x/oak@14.2.0/mod.ts";
import postgres from 'https://deno.land/x/postgresjs/mod.js';

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
        response.body = { errors: { message: `Invalid world ID. (Received: ${worldID})` } };
        response.status = 400;
        return
    }

    try {
        const [featuredWorlds, worldInfo] = await Promise.all([
            worlds.GetAsync("FEATURED").then(response => response[0]),
            worlds.GetAsync(worldID).then(response => response[0])
        ]) as [number[], Record<string, unknown>];

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
        response.body = { errors: err };
        response.status = err.status;
    }
}

const searchWorld = async ({ request, response, params }: { request: Request, response: Response, params: { worldname: string } }) => {
    const limit: number = Number(request.url.searchParams.get('limit')) || 50

    const worldName = params.worldname

    if (worldName.length < 3) {
        response.body = { errors: "World name must be at least 3 characters long." };
        response.status = 400;
        return;
    }

    const queryResult = await sql`SELECT * FROM worlds WHERE world_name ~* ${worldName} LIMIT ${limit}`;
    console.log(`[SearchWorld] Fetched ${queryResult.length} results for "${worldName}".`)

    response.body = queryResult
    response.status = 200;
}

const insertWorld = async ({ request, response }: { request: Request, response: Response }) => {
    response.body = {
        errors: {
            message: "This endpoint is not yet implemented."
        }
    };
    response.status = 501;
}

const updateWorld = async ({ response }: { response: Response }) => {
    response.body = {
        errors: {
            message: "This endpoint is not yet implemented."
        }
    };
    response.status = 501;
}

export { getWorldInfo, searchWorld, insertWorld, updateWorld }