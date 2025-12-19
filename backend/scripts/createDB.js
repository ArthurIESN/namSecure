import {readFileSync} from "node:fs";
import {pool} from "../database/database.js";

console.log("Starting database initialization...");

try {
    const requests = readFileSync(
        './scripts/createDB.sql',
        {encoding: "utf-8"}
    );

    await pool.query(requests, []);
    await pool.end();
    process.exit(0);
} catch (e) {
    console.error("✖ Error creating database:");
    console.error(e);
    await pool.end();
    process.exit(1);
}