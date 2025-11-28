import {WebSocketServer, WebSocket} from 'ws';
import {Server as HttpServer} from 'http';
import {IncomingMessage} from "http";
import {authenticateWebSocket, AuthenticatedWebSocket} from "@/services/websocket/websocketAuth";



const rooms = new Map<string, Set<AuthenticatedWebSocket>>();

// Function pour ajouter un client a une room
const joinRoom = (roomName : string, ws : AuthenticatedWebSocket):void => {
    if(!rooms.has(roomName)){
        rooms.set(roomName, new Set());
    }

    rooms.get(roomName)?.add(ws);
    console.log(`Client ajouté a la room: ${roomName}`);
}

// Function pour supprimer un client d'une room
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
        // Vérifier que la connexion est ouverte
        if(client !== sender && client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    });
    console.log(`Message broadcasté à ${room.size} clients dans "${roomName}"`)
}

export const initializeWebSocketService = (server: HttpServer) => {
        // créé le websocket server
        const wss = new WebSocketServer({server,path: '/'});
        console.log('WebSocket server initialized');

        // connexion des clients
        wss.on('connection', async  (ws, request : IncomingMessage) => {
            console.log('Nouvelle connexion WebSocket');

            // Authentifier la connexion
            const authWs = await authenticateWebSocket(ws, request);
            if(!authWs){
                console.log('connexion non authentifiée, fermeture');
                return;
            }

            // Ajouter tout le monde dans la room publique
            joinRoom('public', authWs);

            // Ajouter l'utilisateur dans ses rooms d'équipes
            authWs.teamIds.forEach(teamId => {
                joinRoom(`team_${teamId}`, authWs);
            });

            console.log(`User ${authWs.memberId} dans ${authWs.teamIds.length + 1} rooms`)

            // Recevoir les messages
            authWs.on('message', (data: Buffer) => {
                try{
                    // Récupérer le message
                    const message = JSON.parse(data.toString());
                    console.log(`Message de User ${authWs.memberId}:`, message);
                    if(message.type === 'location'){
                        message.memberId = authWs.memberId;
                        // Broadcast à la room publique
                        authWs.teamIds.forEach(teamId => {
                            broadcastToRoom(`team_${teamId}`, JSON.stringify(message), authWs);
                        })
                    }/*else if(message.type === 'report'){
                        message.memberId = authWs.memberId;
                        if(message.isPublic){
                            broadcastToRoom('public', JSON.stringify(message), authWs);
                        }else{
                            authWs.teamIds.forEach(teamId => {
                                broadcastToRoom(`team_${teamId}`, JSON.stringify(message), authWs);
                            });
                        }
                    }*/ // @todo voir si on le gère ici ou via une API REST
                }catch (error){
                    console.error('Erreur parsing message:', error);
                }
            });

            // Déconnexion retirer de toutes les rooms
            authWs.on('close', () => {
                console.log(`User ${authWs.memberId} déconnecté`);
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
        broadcastLocationToTeam: (teamId: number, message: any) => {
            broadcastToRoom(`team:${teamId}`, JSON.stringify(message));
        },

        broadcastReportPublic: (message: any) => {
            broadcastToRoom('public', JSON.stringify(message));
        },

        broadcastReportToTeam: (teamId: number, message: any) => {
            broadcastToRoom(`team:${teamId}`, JSON.stringify(message));
        },

        getServer: () => wss,
    };
};

