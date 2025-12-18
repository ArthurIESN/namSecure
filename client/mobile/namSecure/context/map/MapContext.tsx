import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import * as Location from 'expo-location';
import { Region} from 'react-native-maps';
import { useDispatch } from 'react-redux';
import { setAddress, setCoordinates, setError } from '@/store/locationSlice';
import { StyleSheet, ViewStyle } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface MapContextType {
  region: Region | null;
  coordinates: Coordinates | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  updateAddressFromCoordinates: (latitude: number, longitude: number) => Promise<void>;
}

interface Styles {
  map: ViewStyle;
}

const RETRO_THEME = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
];

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: ReactNode;
  theme?: 'default' | 'retro';
}

function MapContent({ theme = 'default' }: { theme?: 'default' | 'retro' }) {
  const { region } = useMap();
  const mapRef = useRef<RNMapView | null>(null);

  const handleRegionChangeComplete = (region: Region) => {
    console.log('Map center position:', {
      latitude: region.latitude,
      longitude: region.longitude,
    });
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
      onPanDrag={() => {}}
      onRegionChangeComplete={handleRegionChangeComplete}
      customMapStyle={theme === 'retro' ? RETRO_THEME : undefined}
    />
  );
}

export function MapProvider({ children, theme = 'default' }: MapProviderProps) {
  const dispatch = useDispatch();
  const [region, setRegion] = useState<Region | null>(null);
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(null);
  const [address, setAddressState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErrorState] = useState<string | null>(null);

  const updateAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<void> => {
    /*try {
      const reverseGeocode: Location.LocationGeocodedAddress[] =
        await Location.reverseGeocodeAsync({ latitude, longitude });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const loc: Location.LocationGeocodedAddress = reverseGeocode[0];
        const addressStr: string = `${loc.street || ''} ${loc.streetNumber || ''}, ${loc.city || ''}`.trim();

        if (addressStr) {
          setAddressState(addressStr);
          dispatch(setAddress(addressStr));
          console.log('Address: ' + addressStr);
        }
      }
    } catch (error: unknown) {
      console.error("Geocoding error:", error);
      dispatch(setError('Geocoding error'));
      setErrorState('Geocoding error');
    }*/
  };

  useEffect(() => {
    let isMounted: boolean = true;

    async function requestPermission(): Promise<void> {
      setLoading(true);
      try {
        const { status }: Location.PermissionResponse =
          await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.error('Location permission denied');
          setErrorState('Location permission denied');
          setLoading(false);
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
        setCoordinatesState({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        dispatch(setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));

        await updateAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );

        setLoading(false);
      } catch (err) {
        console.error('Error requesting location:', err);
        setErrorState('Error requesting location');
        setLoading(false);
      }
    }

    requestPermission();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const value: MapContextType = {
    region,
    coordinates,
    address,
    loading,
    error,
    updateAddressFromCoordinates,
  };

  return (
    <MapContext.Provider value={value}>
      {children}
      <MapContent theme={theme} />
    </MapContext.Provider>
  );
}

export function useMap(): MapContextType {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
}

const styles = StyleSheet.create<Styles>({
  map: {
    width: '100%',
    height: '100%',
  },
});
