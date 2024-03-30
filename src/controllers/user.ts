import { Universe, DataStore } from "npm:@daw588/roblox.js";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";
import { Response } from "https://deno.land/x/oak@14.2.0/mod.ts";

const env = await load();
const universeId = +env["UNIVERSE_ID"];
const apiKey = env["API_KEY"];

const universe = new Universe(universeId, apiKey);
const users = new DataStore(universe, "MyGames");

const numberRegex = /^\d+$/;

// @desc    Get detailed information about a user on wubby.
// @route   GET /api/v1/userinfo/:userid
const getUserInfo = async ({ response, params }: { response: Response, params: { userid: string } }) => {
    const userId = params.userid

    // idk how to use middlewares
    if (!numberRegex.test(userId)) {
        response.body = { errors: { message: `Invalid user ID. (Received: ${userId})` } };
        response.status = 400;
        return
    }

    try {
        const [data]: any = await users.GetAsync(userId);

        const formattedData = {
            bannedUntil: data["S"],
            createdWorlds: data["Mine"],
            description: data["Status"],
            equippedCosmetics: data["E"],
            favoriteWorlds: data["Favorites"],
            joinDate: new Date(parseInt(data["JoinDate"]) * 1000).toISOString(),
            lastBanReason: data["Reason"],
            inventory: data["Inventory"],
            pinnedWorld: data["P"],
            playerStatus: data["DefaultRank"],
            recentWorlds: data["Recent"],
            wubbits: data["Wubbits"]
        }

        console.log(data)

        response.body = formattedData
        response.status = 200
    } catch (err) {
        response.body = {
            errors: err
        }
        response.status = err.status
    }
}

export { getUserInfo }