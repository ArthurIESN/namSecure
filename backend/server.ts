import dotenv from 'dotenv';
import '@/utils/logs/enhancedLogs';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import router from '@/routes/router';
import { createServer } from 'http';
import {initializeWebSocketService} from "@/services/websocket/websocket";

dotenv.config();

const app = express();
const server = createServer(app);  // ✅ Serveur HTTP

const PORT = process.env.SERVER_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cookieParser());
app.use('/uploads/profiles', express.static(path.join(__dirname, '/uploads/profiles')));
app.use(cors({
    origin: process.env.BACKOFFICE_URL,
    credentials: true,
}));
app.use(express.json());

app.use('/api', router);

const wsService = initializeWebSocketService(server);

declare global {
    var wsService: ReturnType<typeof initializeWebSocketService>;
}

global.wsService = wsService;

server.listen(PORT, () => {
    console.log(`Server rusunning on port ${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/`);
});

