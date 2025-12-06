import {default as swaggerJSDoc} from "swagger-jsdoc";
import * as fs from "node:fs";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "namSecure API", // Title (required)
            version: "1.0.0", // Version (required)
        },
    },
    // Path to the API docs
    apis: [
        "./controllers/**/*.ts",
        "./middlewares/**/*.ts",
        "./models/**/*.ts",
        "./routes/**/*.ts",
    ],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);
fs.writeFileSync("./swagger/spec.json", JSON.stringify(swaggerSpec));