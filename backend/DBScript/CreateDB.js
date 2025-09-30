import {readFileSync} from "node:fs";
import {pool} from "../database/database.js";

const requests = readFileSync(
    './DBScript/createDB.sql',
    {encoding: "utf-8"}
);


try {
    await pool.query(requests, []);
    console.log("Database and tables created successfully.");
} catch (e) {
    console.error(e);
}