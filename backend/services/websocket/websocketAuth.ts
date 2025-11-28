import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '@/database/databasePrisma.js';

/**
 * Interface pour le WebSocket authentifié
 */
export interface AuthenticatedWebSocket extends WebSocket {
    memberId: number;
    teamIds: number[];
}

/**
 * Fonction pour parser les cookies depuis le header
 */
function parseCookies(cookieHeader?: string): { [key: string]: string } {
    if (!cookieHeader) return {};

    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, ...rest] = cookie.split('=');
        const value = rest.join('=').trim();
        if (name && value) {
            cookies[name.trim()] = decodeURIComponent(value);
        }
        return cookies;
    }, {} as { [key: string]: string });
}

/**
 * Authentifier la connexion WebSocket et récupérer les teams
 */
export async function authenticateWebSocket(
    ws: WebSocket,
    request: IncomingMessage
): Promise<AuthenticatedWebSocket | null> {
    try {
        // 1. Récupérer le token depuis les cookies
        const cookies = parseCookies(request.headers.cookie);
        const token = cookies.token;

        if (!token) {
            console.log('Pas de token dans les cookies');
            ws.close(1008, 'Token manquant');
            return null;
        }

        // 2. Vérifier le JWT
        const JWT_SECRET = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, JWT_SECRET) as { authUser: { id: number } };
        const memberId = decoded.authUser.id;

        // 3. Récupérer les teams du membre depuis la DB
        const teamMembers = await prisma.team_member.findMany({
            where: {
                id_member: memberId,
                accepted: true  // Seulement les teams acceptées
            },
            select: {
                id_team: true
            },
            distinct: ['id_team']
        });

        // Extraire les IDs des teams (déjà uniques grâce à distinct)
        const teamIds = teamMembers.map(tm => tm.id_team);

        console.log(`User ${memberId} authentifié, teams: [${teamIds.join(', ')}]`);

        // 4. Attacher les infos au WebSocket
        const authWs = ws as AuthenticatedWebSocket;
        authWs.memberId = memberId;
        authWs.teamIds = teamIds;

        return authWs;

    } catch (error) {
        console.error('Erreur authentification WebSocket:', error);
        ws.close(1008, 'Authentification échouée');
        return null;
    }
}