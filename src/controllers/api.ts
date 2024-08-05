import { Response } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { Universe, DataStore } from "npm:@daw588/roblox.js";
import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_KEY")!);
const universeId = Deno.env.get("UNIVERSE_ID")
const apiKey =  Deno.env.get("API_KEY")

if (!apiKey || !universeId) throw new Error("No open cloud API Key / Universe ID was found");
const universe = new Universe(+universeId, apiKey);
const worlds = new DataStore(universe, "Games");

type FunctionType<T> = () => T | Promise<T>;
function batchPromise<T>(functions: FunctionType<T>[]): Promise<T[]> {
    const promises = functions.map(func => {
      return new Promise<T>((resolve, reject) => {
        try {
          const result = func();
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  
    return Promise.all(promises);
  }

const healthCheck = async ({ response }: { response: Response }) => {
    response.body = {
        message: 'OK'
    };
    response.status = 200;
}

const statistics = async ({ response }: { response: Response }) => {
    const [totalWorldCount, totalFeaturedWorldCount, activeWorlds, totalBlockCount] = await batchPromise([
        () => supabase.from('worlds').select('id', { count: 'exact', head: true }).then(response => response.count),
        // @ts-ignore i offer you: number[], take it or leave it
        () => worlds.GetAsync("FEATURED").then((response: number[]) => response[0].length),
        () => worlds.GetAsync("ACTIVES").then(response => response[0]) as unknown as Record<string, { Blocks: number, ActivePlayers: number, GameId: number, MaxPlayers: number, Name: string, Owner: number, Image: string, State: number }>,
        () => supabase.rpc('sum_blocks').then(response => response.data)
    ]);

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.body = {
        worlds: {
            active: Object.keys(activeWorlds).length || 0,
            total: totalWorldCount || 0,
            featured: totalFeaturedWorldCount || 0
        },
        blocks: totalBlockCount
    };
    response.status = 200;
}

export { healthCheck, statistics };