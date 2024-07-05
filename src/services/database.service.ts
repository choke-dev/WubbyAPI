import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";
import { getEnv } from "./env.service.ts";

let sql: unknown;

if (!getEnv("DATABASE_HOST")) {
    console.log("[WARN] No database host found, database service is unavailable.");
    sql = () => {
        throw new Error("Attempted to use a database, but there were no connections found to a database.")
    }
} else {
    sql = postgres({
        host     : getEnv("DATABASE_HOST"),
        port     : 5432,
        database : getEnv("DATABASE_NAME"),
        username : getEnv("DATABASE_USER"),
        password : getEnv("DATABASE_PASSWORD"),
    });
}

export { sql }