import { Universe, DataStore } from "npm:@daw588/roblox.js";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import { Response } from "https://deno.land/x/oak@14.2.0/mod.ts";

const env = await load();
const universeId = Number(env["UNIVERSE_ID"]);
const apiKey = env["API_KEY"];

const universe = new Universe(universeId, apiKey);
const worlds = new DataStore(universe, "Games");

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

const searchWorld = async ({ response, params }: { response: Response, params: { worldname: string } }) => {
    const _worldId = params.worldname

    response.body = {
        errors: {
            message: "This endpoint is not yet implemented."
        }
    };
    response.status = 501;
}

const insertWorld = async ({ response }: { response: Response }) => {
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