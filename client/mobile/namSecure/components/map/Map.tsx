import { Image } from 'expo-image';
import { View, Platform, StyleSheet, Text, useWindowDimensions, ViewStyle } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef, ReactElement } from 'react';
import MapView, { Region} from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import { setAddress, setCoordinates, setError } from '@/store/locationSlice';
import { Dispatch } from '@reduxjs/toolkit';

// Interfaces
interface Styles {
  map: ViewStyle;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapProps {
  // Props futures si nécessaire
}

interface LocationEvent {
  nativeEvent: {
    coordinate?: {
      latitude: number;
      longitude: number;
    };
  };
}

// Composant
export default function Map({}: MapProps): ReactElement {
  // Hooks avec typage
  const dispatch: Dispatch = useDispatch();
  const [region, setRegion] = useState<Region | null>(null);
  const mapRef = useRef<MapView | null>(null);

  // Fonction de mise à jour d'adresse typée
  const updateAddressFromCoordinates = async (
    latitude: number, 
    longitude: number
  ): Promise<void> => {
    try {
      const reverseGeocode: Location.LocationGeocodedAddress[] = 
        await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const loc: Location.LocationGeocodedAddress = reverseGeocode[0];
        const address: string = `${loc.street || ''} ${loc.streetNumber || ''}, ${loc.city || ''}`.trim();
        
        if (address) {
          dispatch(setAddress(address));
          console.log('c est l adresse : ' + address);
        }
      }
    } catch (error: unknown) {
      console.error("Erreur géocodage:", error);
      dispatch(setError('Erreur de géocodage'));
    }
  };

  // useEffect avec types
  useEffect(() => {
    let isMounted: boolean = true;

    async function requestPermission(): Promise<void> {
      const { status }: Location.PermissionResponse = 
        await Location.requestForegroundPermissionsAsync();
        
      if (status !== 'granted') {
        console.error('Permission de localisation refusée');
        return;
      }

      const location: Location.LocationObject = 
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });

      if (!isMounted) return;

      const initialRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setRegion(initialRegion);
      dispatch(setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
      
      await updateAddressFromCoordinates(
        location.coords.latitude, 
        location.coords.longitude
      );
    }

    requestPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler de changement de position typé
  const handleLocationChange = async (event: LocationEvent): Promise<void> => {
    if (event.nativeEvent.coordinate) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      
      const newRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
      dispatch(setCoordinates({ latitude, longitude }));
      await updateAddressFromCoordinates(latitude, longitude);
    }
  };

  return (
    <MapView 
      ref={mapRef}
      style={styles.map} 
      provider={PROVIDER_GOOGLE}   
      showsUserLocation={true}
      showsMyLocationButton={true}
      region={region || undefined}  
      loadingEnabled={true}
      onUserLocationChange={handleLocationChange}
    />
  );
}

// Styles typés
const styles = StyleSheet.create<Styles>({
  map: {
    width: '100%',
    height: '100%',
  },
});