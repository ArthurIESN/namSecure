import { ViewStyle } from 'react-native';

/**
 * Represents a member's location on the map
 */
export interface MemberLocation {
  memberId: number;
  lat: number;
  lng: number;
  timestamp: number;
}

/**
 * Represents a report/danger on the map
 */
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

/**
 * Represents a user's current position
 */
export interface UserPosition {
  latitude: number;
  longitude: number;
}

/**
 * Props for the Map component
 */
export interface MapProps {
  /** Whether the map is displayed as a background (non-interactive by default) */
  isBackground?: boolean;
  /** Custom styles for the map container */
  style?: ViewStyle;
  /** Whether the map is interactive (zoom, pan, etc.) */
  isInteractive?: boolean;
}