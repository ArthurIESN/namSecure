import {WebSocketServer, WebSocket} from 'ws';
import {Server as HttpServer} from 'http';
import {IncomingMessage} from "http";
import {authenticateWebSocket, AuthenticatedWebSocket} from "@/services/websocket/websocketAuth";



const rooms = new Map<string, Set<AuthenticatedWebSocket>>();

const joinRoom = (roomName : string, ws : AuthenticatedWebSocket):void => {
    if(!rooms.has(roomName)){
        rooms.set(roomName, new Set());
    }

    rooms.get(roomName)?.add(ws);
}

const leaveRoom = (roomName : string, ws : AuthenticatedWebSocket):void => {
    const room = rooms.get(roomName);
    if(room){
        room.delete(ws);
        if(room.size === 0){
            rooms.delete(roomName);
        }
    }
}

const broadcastToRoom = (roomName : string, message : string, sender?: AuthenticatedWebSocket):void => {
    const room = rooms.get(roomName);
    if(!room) return;

    room.forEach((client) => {
        if(client !== sender && client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    });
}

export const initializeWebSocketService = (server: HttpServer) => {
        const wss = new WebSocketServer({server,path: '/'});

        wss.on('connection', async  (ws, request : IncomingMessage) => {

            const authWs = await authenticateWebSocket(ws, request);
            if(!authWs){
                return;
            }

            joinRoom('public', authWs);

            // Ajouter l'utilisateur dans ses rooms d'équipes
            authWs.teamIds.forEach(teamId => {
                joinRoom(`team_${teamId}`, authWs);
            });

            // Quand le client envoie sa localisation
            authWs.on('message', (data: Buffer) => {
                const message = data.toString();
                authWs.teamIds.forEach(teamId => {
                    broadcastToRoom(`team_${teamId}`,message);
                })
            });

            // Déconnexion retirer de toutes les rooms
            authWs.on('close', () => {
                leaveRoom('public', authWs);
                authWs.teamIds.forEach(teamId => {
                    leaveRoom(`team_${teamId}`, authWs);
                });
            });

            authWs.on('error', (error) => {
                console.error(`Erreur WS User ${authWs.memberId}:`, error);
            });
        })

    return {

        broadcastReportPublic: (message: any) => {
            broadcastToRoom('public', JSON.stringify(message));
        },

        broadcastReportToTeam: (teamId: number, message: any) => {
            broadcastToRoom(`team_${teamId}`, JSON.stringify(message));
        },

        getServer: () => wss,
    };
};

