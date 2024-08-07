import { Universe, DataStore, DataStoreKeyInfo } from "npm:@daw588/roblox.js";
import { Response } from "https://deno.land/x/oak@14.2.0/mod.ts";

import type { WubbyUserInfo } from '../types/user.types.ts'
import { getEnv } from "../services/env.service.ts";

const universeId = getEnv("UNIVERSE_ID");
const apiKey = getEnv("API_KEY");

if (!apiKey) {
    throw new Error("No open cloud API Key was found")
}
if (!universeId) {
    throw new Error("No universe ID was found")
}

const universe = new Universe(+universeId, apiKey);
const users = new DataStore(universe, "MyGames");

const numberRegex = /^\d+$/;

const getUserInfo = async ({ response, params }: { response: Response, params: { userid: string } }) => {
    const userId = params.userid
    response.headers.set("Access-Control-Allow-Origin", "*")

    if (!numberRegex.test(userId)) {
        response.body = { errors: [{ message: `Invalid user ID. (Received: ${userId})` }] };
        response.status = 400;
        return
    }

    try {
        const [data] = await users.GetAsync(userId) as [WubbyUserInfo, DataStoreKeyInfo];

        const banExpirationDate = (data["S"] ? new Date(data["S"] * 1000).toISOString() : null)

        const formattedData = {
            bannedUntil: banExpirationDate,
            createdWorlds: data["Mine"],
            description: data["Status"],
            equippedCosmetics: data["E"],
            favoriteWorlds: data["Favorites"],
            // isWubbyPlusMember: "C_Plus" in (data["Inventory"] || {}),
            joinDate: new Date(data["JoinDate"] * 1000).toISOString(),
            lastBanReason: data["Reason"],
            inventory: data["Inventory"],
            pinnedWorld: data["P"],
            playerStatus: data["DefaultRank"],
            recentWorlds: data["Recent"],
            wubbits: data["Wubbits"]
        }

        response.body = formattedData
        response.status = 200
    } catch (err) {
        response.body = { errors: [err] };
        response.status = err.status
    }
}

export { getUserInfo }