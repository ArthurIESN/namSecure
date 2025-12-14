import {View, StyleSheet, ViewStyle, TouchableOpacity, AppState, Image} from 'react-native';
import Text from '@/components/ui/Text';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef, ReactElement, useCallback} from 'react';
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch,useSelector } from 'react-redux';
import { setAddress, setCoordinates, setError as setLocationError } from '@/store/locationSlice';
import {RootState} from "@/store/store";
import {setViewRegion} from "@/store/mapSlice";
import {useWebSocket} from "@/providers/WebSocketProvider";
import {useAuth} from "@/providers/AuthProvider";
import {useTheme} from "@/providers/ThemeProvider";
import {Colors} from '@/constants/theme';
import Loading from '@/components/ui/loading/Loading';


/*
@todo mettre la fonction de haversine dans utils
@todo modifier le style du marker pour qu'il colle avec le figma
@todo ajouter les report
@todo gérer le faite que quand l'appliction est en background les websocket doivent fonctionner normalement
 */

interface MemberLocation {
  memberId: number;
  lat: number
  lng: number;
  timestamp: number;
}

interface MapProps {
  isBackground?: boolean;
  style?: ViewStyle;
}

export default function Map({ isBackground = false, style }: MapProps): ReactElement {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);

  const {user} = useAuth();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const [reports, setReports] = useState<{
    [reportId: number]: any;
  }>({});
  const userCoordinates = useSelector((state: RootState) => state.location.coordinates);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [initialMapRegion, setInitialMapRegion] = useState<Region | null>(null);
  const hasFirstLocationUpdate = useRef(false);
  const isProgrammaticAnimation = useRef(false);
  const lastSentPosition = useRef<{ lat: number; lng: number } | null>(null);
  const lastSentTime = useRef<number>(0);
  const lastGeocodedTime = useRef<number>(0);
  const lastReduxUpdateTime = useRef<number>(0);
  const lastCameraAnimationTime = useRef<number>(0);

  // Refs pour nettoyer les setTimeout et éviter les fuites mémoire
  const animationTimerFirst = useRef<NodeJS.Timeout>();
  const animationTimerContinuous = useRef<NodeJS.Timeout>();
  const animationTimerRecenter = useRef<NodeJS.Timeout>();

  const [memberLocations, setMemberLocations] = useState<{
    [memberId: number]: MemberLocation;
  }>({});
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Détecte quand l'utilisateur déplace la map manuellement pour désactiver le suivi auto
  const handleRegionChangeComplete = (newRegion: Region) => {
    dispatch(setViewRegion(newRegion));

    // Ignorer les changements de région jusqu'à ce que la première position soit reçue
    if (!hasFirstLocationUpdate.current) {
      return;
    }

    // Ignorer les animations programmatiques (faites par le code)
    if (isProgrammaticAnimation.current) {
      return;
    }

    if (isFollowing && userCoordinates) {
      const distanceLat = Math.abs(newRegion.latitude - userCoordinates.latitude);
      const distanceLng = Math.abs(newRegion.longitude - userCoordinates.longitude);
      if (distanceLat > 0.0001 || distanceLng > 0.0001) {
        setIsFollowing(false);
      }
    }
  };

  // Recentre la map sur la position de l'utilisateur et réactive le suivi auto
  const handleRecenter = () => {
    if (userCoordinates && mapRef.current) {
      setIsFollowing(true);
      isProgrammaticAnimation.current = true;
      mapRef.current.animateCamera({
        center: userCoordinates,
      }, { duration: 500 });
      if (animationTimerRecenter.current) clearTimeout(animationTimerRecenter.current);
        animationTimerRecenter.current = setTimeout(() => {
        isProgrammaticAnimation.current = false;
      }, 600);
    }
  };

  // Reçoit et affiche les positions des autres membres de l'équipe (via WebSocket)
  const handleLocationReceived = useCallback((location: MemberLocation) => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    setMemberLocations(prev => {
      const updated = {
        ...prev,
        [location.memberId]: location
      };

      const filtered: { [key: number]: MemberLocation } = {};

      Object.entries(updated).forEach(([id, loc]) => {
        if (now - loc.timestamp <= fiveMinutes) {
          filtered[Number(id)] = loc;
        }
      });

      return filtered;
    });
  }, []);

  // Reçoit les signalements (reports) via WebSocket (à implémenter)
  const handleReportReceived = useCallback((message: any) => {
    console.log('Report reçu:', message);
    setReports(prev => ({
      ...prev,
      [message.id]: message
    }));
  }, []);

  const { sendLocation, isConnected, onLocationReceived, onReportReceived } = useWebSocket();

  useEffect(() => {
    const unsubscribeLocation = onLocationReceived(handleLocationReceived);
    const unsubscribeReport = onReportReceived(handleReportReceived);

    return () => {
      unsubscribeLocation();
      unsubscribeReport();
      unsubscribeReport();
    };
  }, []);


  useEffect(() => {
    if (!initialMapRegion && userCoordinates) {
      setInitialMapRegion({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  }, [userCoordinates, initialMapRegion]);

  useEffect(() => {
    return () => {
      if (animationTimerFirst.current) clearTimeout(animationTimerFirst.current);
      if (animationTimerContinuous.current) clearTimeout(animationTimerContinuous.current);
      if (animationTimerRecenter.current) clearTimeout(animationTimerRecenter.current);
    };
  }, []);

  // Note: La gestion du passage foreground <-> background est maintenant dans _layout.tsx
  // pour éviter d'avoir 3 listeners AppState (une par instance de Map)

  const updateAddressFromCoordinates = useCallback(async (latitude : number, longitude : number): Promise<void> => {
    try{
      const reverseGeocode = await Location.reverseGeocodeAsync({latitude, longitude});
      if(reverseGeocode && reverseGeocode.length > 0){
        const loc = reverseGeocode[0];
        const address = `${loc.street || ''} ${loc.streetNumber || ''}, ${loc.city || ''}`.trim();
        if(address){
            dispatch(setAddress(address));
        }
      }
    }catch (error){
      console.error('Erreur de géocodage',error);
      dispatch(setLocationError('Erreur de géocodage'));
    }
  },
    [dispatch]
  );
  useEffect(() => {
    if(hasInitialized) return;
    let isMounted = true;

    //@todo faut il garder la demande de permission ici ?
    async function requestAllLocationPermissions(): Promise<boolean> {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.error('Foreground location permission denied');
          dispatch(setLocationError('Foreground permission denied'));
          return false;
        }

        return true;
      } catch (error) {
        console.error('Location permission error', error);
        dispatch(setLocationError('Error requesting permission'));
        return false;
      }
    }

    // Initialise la position de départ de la map au premier chargement
    async function initializeRegion(): Promise<void> {
      try {
        const ok: boolean = await requestAllLocationPermissions();

        if (!ok) {
          console.error('Permission refusée, impossible d\'initialiser la carte');
          return;
        }

        if (!isMounted) return;

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        if (!isMounted) return;

        dispatch(setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));

        await updateAddressFromCoordinates(location.coords.latitude, location.coords.longitude);

        setHasInitialized(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de la carte:', error);
        dispatch(setLocationError('Erreur lors de la récupération de la position'));
      }
    }

    initializeRegion();

    return () => {
      isMounted = false;
    };
  }, [hasInitialized, dispatch, updateAddressFromCoordinates]);

  // Appelé à chaque changement de position de l'utilisateur (envoie position WebSocket, anime caméra, geocoding)
  const handleLocationChange = useCallback(
      async (event : any): Promise<void> => {
        if(isBackground) return;
        if(!event.nativeEvent.coordinate) return;

        const {latitude, longitude} = event.nativeEvent.coordinate;
        const now = Date.now();

        // Première mise à jour de position : centrer immédiatement la caméra
        if (!hasFirstLocationUpdate.current && mapRef.current) {
          isProgrammaticAnimation.current = true;
          mapRef.current.animateCamera({
            center: { latitude, longitude },
          }, { duration: 500 });
          hasFirstLocationUpdate.current = true;
          lastCameraAnimationTime.current = now;
          // Désactiver le flag après l'animation
          if (animationTimerFirst.current) clearTimeout(animationTimerFirst.current);
            animationTimerFirst.current = setTimeout(() => {
            isProgrammaticAnimation.current = false;
          }, 600);
        }

        const shouldSend =
            !lastSentPosition.current ||
            (now - lastSentTime.current > 5000) ||
            calculateDistance(
                lastSentPosition.current.lat,
                lastSentPosition.current.lng,
                latitude,
                longitude
            ) > 50;

        if (shouldSend) {
          sendLocation(latitude, longitude);
          lastSentPosition.current = { lat: latitude, lng: longitude };
          lastSentTime.current = now;
        }

        if (isFollowing && mapRef.current && userCoordinates && hasFirstLocationUpdate.current) {
          const timeSinceLastAnimation = now - lastCameraAnimationTime.current;
          const distanceFromCurrentView = calculateDistance(
            userCoordinates.latitude,
            userCoordinates.longitude,
            latitude,
            longitude
          );

          const shouldAnimate = timeSinceLastAnimation > 2500 || distanceFromCurrentView > 20;

          if (shouldAnimate) {
            isProgrammaticAnimation.current = true;
            mapRef.current.animateCamera({
              center: { latitude, longitude },
            }, { duration: 300 });
            lastCameraAnimationTime.current = now;
            // Désactiver le flag après l'animation
            if (animationTimerContinuous.current) clearTimeout(animationTimerContinuous.current);
            animationTimerContinuous.current = setTimeout(() => {
              isProgrammaticAnimation.current = false;
            }, 400);
          }
        }

        // Throttler les mises à jour Redux pour réduire les re-renders
        // Mettre à jour Redux seulement toutes les 3s ou si distance > 10m
        const REDUX_UPDATE_THROTTLE = 3000;
        const timeSinceLastReduxUpdate = now - lastReduxUpdateTime.current;
        const distanceSinceLastReduxUpdate = userCoordinates
          ? calculateDistance(userCoordinates.latitude, userCoordinates.longitude, latitude, longitude)
          : Infinity;

        const shouldUpdateRedux =
          lastReduxUpdateTime.current === 0 || // Première fois
          timeSinceLastReduxUpdate > REDUX_UPDATE_THROTTLE ||
          distanceSinceLastReduxUpdate > 10;

        if (shouldUpdateRedux) {
          dispatch(setCoordinates({latitude, longitude}));
          lastReduxUpdateTime.current = now;
        }

        const GEOCODE_THROTTLE = 60000;
        if (now - lastGeocodedTime.current > GEOCODE_THROTTLE) {
          await updateAddressFromCoordinates(latitude, longitude);
          lastGeocodedTime.current = now;
        }
      },
      [isBackground, sendLocation, dispatch, updateAddressFromCoordinates, isFollowing, userCoordinates]
  );


  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  // Ne pas rendre la map tant que la région initiale n'est pas définie
  if (!initialMapRegion) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </View>
    );
  }

  return (
      <View style={[styles.container, style]}>
        {!isMapLoaded && (
          <View style={[styles.mapLoadingOverlay, { backgroundColor: colors.background }]}>
            <Loading />
          </View>
        )}
        <MapView
            ref={mapRef}
            style={styles.map}
 //           provider={PROVIDER_GOOGLE}
            initialRegion={initialMapRegion}
            showsPointsOfInterest={false}
            showsUserLocation={true}
            onPanDrag={() => {}}
            onRegionChangeComplete={!isBackground ? handleRegionChangeComplete : undefined}
            onUserLocationChange={!isBackground ? handleLocationChange : undefined}
            loadingEnabled={false}
            onMapReady={() => setIsMapLoaded(true)}
        >
          {Object.values(memberLocations).map((location) => (
              <Marker
                  key={location.memberId}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng
                  }}
                  title={`Membre ${location.memberId}`}
                  description={`Vu il y a ${Math.floor((Date.now() - location.timestamp) / 1000)}s`}
                  pinColor="blue"
              >
                <View style={{
                  padding: 4,
                  borderRadius: 100,
                  width: 60,
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 237, 160, 0.4)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  overflow: 'hidden',
                }}>
                  <Image
                      style={{width: 40, height: 40, borderRadius: 20}}
                      source={{uri: user.photoPath}}
                  />
                </View>
              </Marker>
          ))}

          {Object.values(reports).map((report) => (
              <Marker
                  key={`report-${report.id}`}
                  coordinate={{
                    latitude: report.lat,
                    longitude: report.lng
                  }}
                  title={`Signalement niveau ${report.level}`}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: report.level >= 3 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(255, 165, 0, 0.7)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                }}>
                  <Text style={{ fontSize: 20 }}>⚠️</Text>
                </View>
              </Marker>
          ))}
        </MapView>

        {!isBackground && !isFollowing && (
          <TouchableOpacity
            style={styles.recenterButton}
            onPress={handleRecenter}
          >
            <Text style={styles.recenterButtonText}>📍</Text>
          </TouchableOpacity>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recenterButtonText: {
    fontSize: 24,
  },
});

