import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

const localEnv = await load({
    allowEmptyValues: true
});

export function getEnv(key: string) {
    const keyvalue = localEnv[key] ?? Deno.env.get(key);
    return keyvalue
}