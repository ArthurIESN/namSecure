import dotenv from 'dotenv';
import '@/utils/logs/enhancedLogs';
import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from '@/routes/router';
import { createServer } from 'http';
import {initializeWebSocketService} from "@/services/websocket/websocket";
import path from "path";

dotenv.config();

const app: Express = express();
const server = createServer(app);

const PORT: string | 3000 = process.env.SERVER_PORT || 3000;

app.use(cookieParser());
app.use(express.static(path.resolve('./uploads')));
app.use(cors({
    origin: process.env.BACKOFFICE_URL,
    credentials: true,
}));
app.use(express.json());

app.use('/api/v1', router);

const wsService = initializeWebSocketService(server);

//@todo
declare global {
    var wsService: ReturnType<typeof initializeWebSocketService>;
}


// log every 5 seconds each room and its clients
setInterval(() => {
    const rooms = wsService.getRooms();
    console.log('Current WebSocket Rooms and Clients:');


    rooms.forEach((clients, roomId) =>
    {
        // if room is public, pass
        if(roomId === 'public') return;

        console.log(`Room ID: ${roomId}, Clients: `);
        clients.forEach((client) => {
            console.log(` - Client ID: ${client.memberId}`);
        });
    });
}, 5000);

global.wsService = wsService;

server.listen(PORT, () => {
    console.log(`Server rusunning on port ${PORT}`);
    console.log(`WebSocket available at ws://localhost:${PORT}/`);
});

