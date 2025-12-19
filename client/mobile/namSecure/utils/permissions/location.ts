/**
 * Utilities for location permissions
 */
import * as Location from 'expo-location';

export interface PermissionResult {
  granted: boolean;
  error?: string;
}

export async function requestLocationPermissions(): Promise<PermissionResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.error('Foreground location permission denied');
      return { granted: false, error: 'Foreground permission denied' };
    }

    return { granted: true };
  } catch (error) {
    console.error('Location permission error', error);
    return { granted: false, error: 'Error requesting permission' };
  }
}

export async function checkLocationPermissions(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}