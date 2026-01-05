import { ViewStyle } from 'react-native';

export interface MemberLocation {
  memberId: number;
  lat: number;
  lng: number;
  timestamp: number;
}

export interface Report {
  id: number;
  lat: number;
  lng: number;
  level: number;
  type_danger?: {
    name: string;
    icon: string;
  };
  street?: string;
  date?: string;
  [key: string]: any;
}
export interface UserPosition {
  latitude: number;
  longitude: number;
}

export interface MapProps {
  isBackground?: boolean;
  style?: ViewStyle;
  isInteractive?: boolean;
}