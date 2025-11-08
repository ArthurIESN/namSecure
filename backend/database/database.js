import pg from "pg";
import "dotenv/config";

const pgPool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const pool =
    {
        connect: async () => {
            try {
                const client = await pgPool.connect();
                return {
                    query : async (query, params) => {
                        try {
                            return await client.query(query, params);
                        } catch (e) {
                            console.error(e);
                            throw e;
                        }
                    },
                    release : () => {
                        return client.release();
                    }
                };
            } catch (e){
                console.error(e);
                throw e;
            }
        },
        query: async (query, params) => {
            try {
                return await pgPool.query(query, params);
            } catch (e) {
                console.error(e);
                throw e;
            }
        },
        end : () => {
            return pgPool.end();
        }
    };

process.on("exit", () => {
    pgPool.end().then(() => console.log("pool closed"));
});