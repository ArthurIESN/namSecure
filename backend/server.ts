import dotenv from 'dotenv';
dotenv.config();

import '@/utils/logs/enhancedLogs';

import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

import router from '@/routes/router';

//import { initializeWebSocket } from './websocket/index.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // @todo move to env to be able to work in production
    credentials: true,
}));
app.use(express.json());
app.use('/api', router);

//initializeWebSocket(httpServer);
console.log("WebSocket initialized");


httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
