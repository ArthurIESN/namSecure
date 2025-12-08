import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/provider/AuthProvider';
import { showReportNotification, requestNotificationPermissions } from '@/utils/notifications';

// Types
interface LocationMessage {
  type: 'location';
  memberId: number;
  lat: number;
  lng: number;
  timestamp: number;
}

interface ReportMessage {
  type: 'report';
  reportId: number;
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

// Context
interface WebSocketContextType {
  isConnected: boolean;
  sendLocation: (lat: number, lng: number) => void;
  // Pour s'abonner aux positions des autres membres
  onLocationReceived: (callback: (location: LocationMessage) => void) => () => void;
  // Pour s'abonner aux reports
  onReportReceived: (callback: (report: ReportMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Provider
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const [isConnected, setIsConnected] = useState(false);

  // Listeners pour les différents types de messages
  const locationListeners = useRef<Set<(location: LocationMessage) => void>>(new Set());
  const reportListeners = useRef<Set<(report: ReportMessage) => void>>(new Set());

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Fonction de connexion
  const connect = useCallback(() => {
    if (!user?.id) return;

    // Si déjà connecté, skip
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    ws.current = new WebSocket(`ws://${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}/`);

    ws.current.onopen = () => {
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        switch (message.type) {
          case 'location':
            // Ne pas traiter sa propre position
            if (message.memberId !== user.id) {
              // Notifier tous les listeners
              locationListeners.current.forEach(listener => listener(message));
            }
            break;

          case 'report':
            if (message.memberId !== user.id) {
              showReportNotification({
                reportId: message.reportId,
                level: message.level,
                typeDanger: message.typeDanger,
                lat: message.lat,
                lng: message.lng,
                isPublic: message.isPublic,
                teamId: message.teamId,
              });
            }

            // Notifier tous les listeners (comportement existant)
            reportListeners.current.forEach(listener => listener(message));
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

  // Connexion au montage quand user est disponible
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

  // Fonction pour envoyer sa position
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

  // Fonction pour s'abonner aux positions
  const onLocationReceived = useCallback((callback: (location: LocationMessage) => void) => {
    locationListeners.current.add(callback);

    // Retourner une fonction de cleanup
    return () => {
      locationListeners.current.delete(callback);
    };
  }, []);

  // Fonction pour s'abonner aux reports
  const onReportReceived = useCallback((callback: (report: ReportMessage) => void) => {
    reportListeners.current.add(callback);

    // Retourner une fonction de cleanup
    return () => {
      reportListeners.current.delete(callback);
    };
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    sendLocation,
    onLocationReceived,
    onReportReceived
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook pour utiliser le WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket doit être utilisé dans un WebSocketProvider');
  }
  return context;
};






