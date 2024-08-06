import { UUID } from "node:crypto";

type CosmeticType = `C_${string}` | `H_${string}` | `A_${string}`;
type CosmeticKey = 
  | `C_${string}`
  | `H_${string}`
  | `A_${string}`;

type Inventory = {
  [key in CosmeticKey]?: number;
};

interface WubbyAPIWorldInfo {
  id: number;
  activePlayers: string[] | { username: string, displayName: string, permission: number }[];
  blocks: number;
  bannedPlayers: unknown[];
  creator: { id: number, name: string, displayName: string };
  description: string;
  favorites: number;
  isFeatured: boolean;
  maxPlayers: number;
  name: string;
  privateWhitelistedPlayers: number[];
  privacyState: number;
  serverJobId: UUID;
  thirdPartyWarpInfo: boolean;
  thirdPartyWarps: boolean;
  thumbnails: number | number[];
  visits: number;
  whitelistedPlayers: number[];
}

interface WubbyAPIUserInfo {
    bannedUntil: string | null;
    createdWorlds: number[];
    description: string;
    equippedCosmetics: CosmeticKey[];
    favoriteWorlds: number[];
    joinDate: string;
    lastBanReason: string;
    inventory: Inventory;
    pinnedWorld: number;
    playerStatus: number;
    recentWorlds: number[];
    wubbits: number;
}

interface RobloxUsersAPIInfo {
  description: string;
  created: string;
  isBanned: boolean;
  externalAppDisplayName: null;
  hasVerifiedBadge: boolean;
  id: number;
  name: string;
  displayName: string;
}