import {WebSocketServer, WebSocket} from 'ws';
import {Server as HttpServer} from 'http';
import {IncomingMessage} from "http";
import {authenticateWebSocket, AuthenticatedWebSocket} from "@/services/websocket/websocketAuth";

//@todo missing a lot of types
//@todo rename this file or create a new one to handle rooms and broadcasting

const rooms = new Map<string, Set<AuthenticatedWebSocket>>();
const memberConnections = new Map<number, Set<AuthenticatedWebSocket>>();

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

const sendToMember = (memberId: number, message: string):void => {
    const connections = memberConnections.get(memberId);
    if(!connections) return;

    connections.forEach((client) => {
        if(client.readyState === WebSocket.OPEN){
            client.send(message);
        }
    });
}

export const getRooms = (): Map<string, Set<AuthenticatedWebSocket>> => {
    return rooms;
}

export const initializeWebSocketService = (server: HttpServer) => {
        const wss = new WebSocketServer({server,path: '/'});

        wss.on('connection', async  (ws, request : IncomingMessage) => {

            const authWs = await authenticateWebSocket(ws, request);
            if(!authWs){
                return;
            }

            joinRoom('public', authWs);

            // Ajouter la connexion du membre
            if (!memberConnections.has(authWs.memberId)) {
                memberConnections.set(authWs.memberId, new Set());
            }
            memberConnections.get(authWs.memberId)?.add(authWs);

            // Ajouter l'utilisateur dans ses rooms d'équipes
            authWs.teamIds.forEach(teamId => {
                joinRoom(`team_${teamId}`, authWs);
            });

            // Quand le client envoie sa localisation ou rejoint/quitte une room
            authWs.on('message', (data: Buffer) => {
                const message = data.toString();
                try {
                    const parsedMessage = JSON.parse(message);

                    // Gestion du jointure de room
                    if (parsedMessage.type === 'room:join') {
                        const teamId = parsedMessage.teamId;
                        if (teamId && !authWs.teamIds.includes(teamId)) {
                            authWs.teamIds.push(teamId);
                            joinRoom(`team_${teamId}`, authWs);
                            console.log(`User ${authWs.memberId} joined team ${teamId} via room:join`);
                        }
                        return;
                    }

                    // Gestion de la sortie de room
                    if (parsedMessage.type === 'room:leave') {
                        const teamId = parsedMessage.teamId;
                        if (teamId) {
                            // Broadcaster à tout le monde que quelqu'un a quitté
                            const leaveMessage = JSON.stringify({
                                type: 'member-left',
                                teamId,
                                leftMemberId: authWs.memberId
                            });
                            broadcastToRoom(`team_${teamId}`, leaveMessage);
                            // Aussi envoyer à la personne qui quitte
                            authWs.send(leaveMessage);

                            authWs.teamIds = authWs.teamIds.filter(id => id !== teamId);
                            leaveRoom(`team_${teamId}`, authWs);
                            console.log(`User ${authWs.memberId} left team ${teamId} via room:leave`);
                        }
                        return;
                    }
                } catch (e) {
                    // Si ce n'est pas du JSON valide, traiter comme un message de localisation
                }

                // Broadcast de localisation aux rooms d'équipes
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

                // Retirer la connexion du membre
                const memberConns = memberConnections.get(authWs.memberId);
                if (memberConns) {
                    memberConns.delete(authWs);
                    if (memberConns.size === 0) {
                        memberConnections.delete(authWs.memberId);
                    }
                }
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

        notifyUserKicked: (memberId: number, teamId: number, teamMemberIds: number[] = []) => {
            // Envoyer un message à la personne kickée pour qu'elle quitte la room
            const kickedMessage = JSON.stringify({
                type: 'kicked',
                teamId,
                teamMemberIds
            });
            sendToMember(memberId, kickedMessage);

            // Broadcaster un message à tous les autres members du team pour qu'ils suppriment la personne
            const broadcastMessage = JSON.stringify({
                type: 'member-kicked',
                teamId,
                kickedMemberId: memberId
            });
            broadcastToRoom(`team_${teamId}`, broadcastMessage);
        },

        getServer: () => wss,

        getRooms: () => rooms,
    };
};

