import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useMap } from '@/providers/MapProvider';
import { showReportNotification, requestNotificationPermissions } from '@/utils/notifications';

interface LocationMessage {
  type: 'location';
  memberId: number;
  lat: number;
  lng: number;
  timestamp: number;
}

interface ReportMessage {
  type: 'report';
  id: number;
  street: string;
  icon: string;
  isPublic: boolean;
  teamId?: number;
  lat: number;
  lng: number;
  level: number;
  typeDanger: string;
  memberId: number;
  photoPath?: string;
  timestamp: number;
}

type WebSocketMessage = LocationMessage | ReportMessage;

interface WebSocketContextType {
  isConnected: boolean;
  sendLocation: (lat: number, lng: number) => void;
  joinTeam: (teamId: number) => void;
  leaveTeam: (teamId: number) => void;
  onLocationReceived: (callback: (location: LocationMessage) => void) => () => void;
  onReportReceived: (callback: (report: ReportMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { removeMembersFromTeam } = useMap();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const locationListeners = useRef<Set<(location: LocationMessage) => void>>(new Set());
  const reportListeners = useRef<Set<(report: ReportMessage) => void>>(new Set());
  const leaveTeamRef = useRef<((teamId: number) => void) | null>(null);
  const removeMembersFromTeamRef = useRef<((memberIds: number[]) => void) | null>(null);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const connect = useCallback(() => {
    if (!user?.id) return;

    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    ws.current = new WebSocket(`ws://${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}/`);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: any = JSON.parse(event.data);

        switch (message.type) {
          case 'location':
            if (message.memberId !== user.id) {
              locationListeners.current.forEach(listener => listener(message as LocationMessage));
            }
            break;

          case 'report':
            if (message.memberId !== user.id) {
              showReportNotification({
                id: message.id,
                street: message.street,
                icon: message.icon,
                level: message.level,
                typeDanger: message.typeDanger,
                lat: message.lat,
                lng: message.lng,
                isPublic: message.isPublic,
                teamId: message.teamId,
              });
            }

            reportListeners.current.forEach(listener => listener(message as ReportMessage));
            break;

          case 'kicked':
            console.log(`User kicked from team ${message.teamId}`);
            // Quitter automatiquement la room
            if (leaveTeamRef.current) {
              leaveTeamRef.current(message.teamId);
            }
            // Supprimer les membres du team de la carte
            if (removeMembersFromTeamRef.current && message.teamMemberIds) {
              removeMembersFromTeamRef.current(message.teamMemberIds);
            }
            break;

          case 'member-kicked':
            console.log(`Member ${message.kickedMemberId} kicked from team ${message.teamId}`);
            // Supprimer la personne kickée de la carte
            if (removeMembersFromTeamRef.current) {
              removeMembersFromTeamRef.current([message.kickedMemberId]);
            }
            break;

          case 'member-left':
            console.log(`Member ${message.leftMemberId} left team ${message.teamId}`, removeMembersFromTeamRef.current);
            // Supprimer la personne qui a quitté de la carte
            if (removeMembersFromTeamRef.current) {
              console.log('Calling removeMembersFromTeam with', message.leftMemberId);
              removeMembersFromTeamRef.current([message.leftMemberId]);
            } else {
              console.log('removeMembersFromTeamRef.current is null!');
            }
            break;

          default:
            console.warn('WebSocket: Message inconnu', message);
        }
      } catch (error) {
        console.error('WebSocket: Erreur parsing', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket: Erreur', error);
      setIsConnected(false);
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      reconnectTimeout.current = setTimeout(connect, 3000);
    };
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      connect();
    }

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      ws.current?.close();
    };
  }, [user?.id, connect]);

  const sendLocation = useCallback((lat: number, lng: number) => {
    if (ws.current?.readyState === WebSocket.OPEN && user?.id) {
      const message: LocationMessage = {
        type: 'location',
        memberId: user.id,
        lat,
        lng,
        timestamp: Date.now()
      };
      ws.current.send(JSON.stringify(message));
    }
  }, [user?.id]);

  const joinTeam = useCallback((teamId: number) => {
    if (ws.current?.readyState === WebSocket.OPEN && user?.id) {
      const message = {
        type: 'room:join',
        teamId
      };
      ws.current.send(JSON.stringify(message));
      console.log(`Sent room:join for team ${teamId}`);
    }
  }, [user?.id]);

  const leaveTeam = useCallback((teamId: number) => {
    if (ws.current?.readyState === WebSocket.OPEN && user?.id) {
      const message = {
        type: 'room:leave',
        teamId
      };
      ws.current.send(JSON.stringify(message));
      console.log(`Sent room:leave for team ${teamId}`);
    }
  }, [user?.id]);

  // Mettre à jour les refs pour utiliser dans les callbacks
  useEffect(() => {
    leaveTeamRef.current = leaveTeam;
  }, [leaveTeam]);

  useEffect(() => {
    removeMembersFromTeamRef.current = removeMembersFromTeam;
  }, [removeMembersFromTeam]);

  const onLocationReceived = useCallback((callback: (location: LocationMessage) => void) => {
    locationListeners.current.add(callback);

    return () => {
      locationListeners.current.delete(callback);
    };
  }, []);

  const onReportReceived = useCallback((callback: (report: ReportMessage) => void) => {
    reportListeners.current.add(callback);

    return () => {
      reportListeners.current.delete(callback);
    };
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    sendLocation,
    joinTeam,
    leaveTeam,
    onLocationReceived,
    onReportReceived
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket doit être utilisé dans un WebSocketProvider');
  }
  return context;
};






