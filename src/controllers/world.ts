import { Request, Response, State } from "https://deno.land/x/oak@14.2.0/mod.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { Universe, DataStore } from "npm:@daw588/roblox.js";

/////////////////////////////////////////////////////////////////////////////////////

import { WubbyWorldInfo } from '../types/world.types.ts'
import { getEnv } from "../services/env.service.ts";
import { WubbyAPIWorldInfo } from "../../index.d.ts";
import { parseWorldMetadata } from "../functions/parseWorldMetadata.ts";

const universeId = Deno.env.get("UNIVERSE_ID")
const apiKey =  Deno.env.get("API_KEY");
const numberRegex = /^\d+$/;

/// CONFIG ///
const MAX_QUERY_LIMIT: number = 100;
const MIN_QUERY_LIMIT: number = 1;

/////////////////////////////////////////////////////////////////////////////////////

if (!apiKey) {
  throw new Error("No open cloud API Key was found")
}
if (!universeId) {
  throw new Error("No universe ID was found")
}

const universe = new Universe(+universeId, apiKey);
const worlds = new DataStore(universe, "Games");

/////////////////////////////////////////////////////////////////////////////////////

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_KEY")!);

/////////////////////////////////////////////////////////////////////////////////////

const getWorldInfo = async ({ response, params }: { response: Response, params: { worldid: string } }) => {
  const worldID = params?.worldid
  
  
  if (!numberRegex.test(worldID)) {
    response.body = { errors: [{ message: `Invalid world ID. (Received: ${worldID})` }] };
    response.status = 400;
    return
  }
  
  try {
    const [worldInfo] = await Promise.all([
      worlds.GetAsync(worldID).then(response => response[0]),
    ]) as [WubbyWorldInfo];

    const data = await parseWorldMetadata(worldInfo)
    
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
  const limit: number = Math.min(Number(request.url.searchParams.get('limit')) || MIN_QUERY_LIMIT, MAX_QUERY_LIMIT)
  
  
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
  
  // const queryResult = await sql`SELECT * FROM worlds WHERE world_name ~* ${worldName} LIMIT ${limit}`;
  
  let { data, error } = await supabase
  .from('worlds')
  .select('*')
  .ilike('name', `%${worldName}%`)
  .limit(limit)
  
  if (error) {
    response.body = { errors: [error] }
    response.status = 500
    return
  } 
  
  data = data?.map((world: Partial<WubbyAPIWorldInfo>) => {
    return {
      ...world,
      thumbnails: world.thumbnails?.map(thumbnail => Number(thumbnail)) || []
    }
  }) || [];

  data = data?.map((world: Partial<WubbyAPIWorldInfo>) => {
    return Object.keys(world).sort().reduce((acc, key) => {
      //@ts-ignore dont care
      acc[key] = world[key]
      return acc
    }, {} as Partial<WubbyAPIWorldInfo>) as WubbyAPIWorldInfo
  }) || [];

  response.body = data
  response.status = 200;
}

const insertWorld = async ({ response, state }: { response: Response, state: State }) => {
  const requestBody = state.requestBody
  
  try {
    // await sql.begin(async sql => {
    //   await sql`
    //             INSERT INTO worlds 
    //             ${sql(requestBody, "world_id", "world_name", "world_description")}
    //         `
    // })
    await supabase.from("worlds").insert(requestBody)
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
    // await sql.begin(async sql => {
    //   await sql`
    //             UPDATE worlds 
    //             SET 
    //             world_name = ${requestBody.world_name}, 
    //             world_description = ${requestBody.world_description} 
    //             WHERE 
    //             world_id = ${requestBody.world_id}
    //         `
    // })
    await supabase.from("worlds").update(requestBody).eq("world_id", requestBody.world_id)
    response.body = { message: "OK" }
    response.status = 200;
  } catch(err) {
    response.body = { errors: [{ message: err.message }] };
    response.status = 500   
  }
}

export { getWorldInfo, searchWorld, insertWorld, updateWorld }