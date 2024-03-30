type WubbyAPI_UserInfo = {
    /**
     * Determines if the player is banned / staff member / etc.
     */
    DefaultRank: number,
    /**
     * Array of equipped cosmetics the player has
     */
    E: string[],
    /**
     * ??? Unsure...
     */
    F: number,
    /**
     * Array of the player's favorite world IDs
     */
    Favorites: number[],
    /**
     * Object of user's inventory, key is cosmetic, value is quantity
     */
    Inventory: { [key: string]: number },
    /**
     * Unix timestamp of when the user joined the site
     */
    JoinDate: number,
    /**
     * Object of the player's last login to the game [timestamp, daily login multiplier]
     */
    LR: [number, number][],
    /**
     * Array of world IDs that the player has created
     */
    Mine: number[],
    /**
     * The player's pinned world on their profile
     */
    P: number,
    /**
     * Reason for the player's last ban
     */
    Reason: string,
    /**
     * Array of world IDs the player has recently joined
     */
    Recent: number[],
    /**
     * Timestamp in the future that determines the player's ban expiration
     */
    S: number,
    /**
     * ??? Unsure...
     */
    Set: [number, number][],
    /**
     * The player's description on their profile
     */
    Status: string,
    /**
     * Number of wubbits the player has
     */
    Wubbits: number,
}

export type { WubbyAPI_UserInfo }