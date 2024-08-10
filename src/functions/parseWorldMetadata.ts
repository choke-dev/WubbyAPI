import { Universe, DataStore } from "npm:@daw588/roblox.js";

const universeId = Deno.env.get("UNIVERSE_ID")
const apiKey =  Deno.env.get("API_KEY");

if (!apiKey) {
    throw new Error("No open cloud API Key was found")
}
if (!universeId) {
    throw new Error("No universe ID was found")
}

const universe = new Universe(+universeId, apiKey);
const worldStore = new DataStore(universe, "Games");  

import { RobloxUsersAPIInfo, WubbyAPIWorldInfo } from "../../index.d.ts";
import { WubbyWorldInfo } from "../types/world.types.ts";

/*

Fix data inconsistencies in WubbyWorldInfo

and return WubbyAPIWorldInfo



*/

export const parseWorldMetadata = async (world: WubbyWorldInfo) => {
    
    const requests = [
        fetch(`https://users.roblox.com/v1/users/${world["Owner"]}`).then(response => response.json()),
        worldStore.GetAsync("FEATURED").then(response => response[0])
    ];

    const [userResponse, featuredWorlds] = await Promise.all(requests) as [RobloxUsersAPIInfo, number[]];

    const creatorInfo = { id: world["Owner"], name: userResponse["name"], displayName: userResponse["displayName"] }
    const featuredStatus = featuredWorlds.includes(world["GameId"])
    const thumbnails = Array.isArray(world["Image"]) ? world["Image"].map(img => Number(img)) : typeof world["Image"] === "string" ? [Number(world["Image"])] : [world["Image"]];
    let activePlayers;

    if (Array.isArray(world["ActivePlayers"])) {
        activePlayers = world["ActivePlayers"].map(player => {
            return { username: player[0], displayName: player[1], permission: player[2] }
        })
    } else if (typeof world["ActivePlayers"] === "number") {
        activePlayers = Array.from({length: world["ActivePlayers"]}, (_, i) => ({ username: "Unknown player", displayName: "Unknown player", permission: -1 }))
    }

    const banned = world["Banned"].flat()
    const privateWhitelist = world["PWhitelist"].flat()
    const whitelist = world["Whitelisted"].flat()

    console.log(banned)
    
    return {
        activePlayers: activePlayers,
        bannedPlayers: banned,
        blocks: world["Blocks"],
        creator: creatorInfo,
        description: world["Description"],
        favorites: world["Favs"] || 0,
        id: world["GameId"],
        isFeatured: featuredStatus,
        maxPlayers: world["MaxPlayers"],
        name: world["Name"],
        privacyState: world["State"],
        privateWhitelistedPlayers: privateWhitelist,
        serverJobId: world["Server"],
        thumbnails: thumbnails,
        thirdPartyWarpInfo: world["WI"],
        thirdPartyWarps: world["AW"],
        visits: world["Visits"],
        whitelistedPlayers: whitelist,
      }
}