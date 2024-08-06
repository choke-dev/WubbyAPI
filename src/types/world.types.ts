import { UUID } from "node:crypto";

/**
 * The response from the Wubby API when requesting a world's information.
 */
type WubbyWorldInfo = {
    /**
     * Determines if the world allows third party warps to other wubby worlds.
     */
    AW: boolean;

    /**
     * An array of active players in the world in the form of tuples with
     * [username, displayname, permissionlevel].
     */
    ActivePlayers: [string, string, number][];

    /**
     * An array of banned player userids.
     */
    Banned: any[];

    /**
     * The total number of blocks in the world.
     */
    Blocks: number;

    /**
     * The world's description.
     */
    Description: string;

    /**
     * The total number of favorites this world has.
     */
    Favs: number;

    /**
     * The world's id.
     */
    GameId: number;

    /**
     * The world's thumbnail id or an array of thumbnail ids if the world has
     * multiple thumbnails.
     */
    Image: string | string[];

    /**
     * The max number of players allowed in the world.
     */
    MaxPlayers: number;

    /**
     * The world's name.
     */
    Name: string;

    /**
     * The userid of the world's owner.
     */
    Owner: number;

    /**
     * An array of player userids that are whitelisted to join the world when it is set to private.
     */
    PWhitelist: number[];

    /**
     * The roblox server jobid that the world is hosted on.
     */
    Server: UUID;

    /**
     * The world's privacy state.
     * 
     * 0: Safe mode
     * 1: Public
     * 2: Private
     * 3: Whitelist
     * 4: Taken Down
     */
    State: number;

    /**
     * The total number of visits this world has.
     */
    Visits: number;

    /**
     * Determines if the world allows third party wubby worlds to query this
     * world's information.
     */
    WI: boolean;

    /**
     * An array of player userids that are whitelisted to join the world when it is set to whitelist.
     */
    Whitelisted: number[];
}

export type { WubbyWorldInfo }