import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import { useState, useEffect, useRef, ReactElement, useCallback, useMemo } from 'react';
import MapView, { Region, Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setCoordinates, setError as setLocationError } from '@/store/locationSlice';
import { RootState } from "@/store/store";
import { setViewRegion } from "@/store/mapSlice";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { EAuthState } from "@/types/auth/auth";
import { Colors } from '@/constants/theme';
import { lightMapStyle, darkMapStyle } from '@/constants/mapStyles';
import Loading from '@/components/ui/loading/Loading';
import { useMap } from "@/providers/MapProvider";
import { calculateDistance } from "@/utils/geo/geolocation";
import type { MemberLocation, Report, MapProps } from "@/types/components/map";

const CONFIG = {
  WS_SEND_INTERVAL: 5000,
  WS_SEND_DISTANCE: 50,
  CAMERA_ANIMATION_INTERVAL: 2500,
  CAMERA_MIN_DISTANCE: 20,
  REDUX_UPDATE_THROTTLE: 3000,
  REDUX_MIN_DISTANCE: 10,
  GEOCODING_THROTTLE: 60000,
  MAP_FOLLOW_THRESHOLD: 0.0001,
  MEMBER_ANIMATION_DURATION: 5500,
  MEMBER_ANIMATION_THROTTLE: 500,
  MEMBER_ANIMATION_UPDATE_FPS: 60,
  ANIMATION_DURATION: {
    FIRST_LOCATION: 500,
    CONTINUOUS: 300,
    RECENTER: 500,
  },
  ANIMATION_CLEANUP_DELAY: {
    FIRST_LOCATION: 600,
    CONTINUOUS: 400,
    RECENTER: 600,
  },
  INITIAL_MAP_DELTA: {
    latitude: 0.001,
    longitude: 0.001,
  },
} as const;

export default function Maps({ isBackground = false, style, isInteractive = true, onMapReady: onMapReadyCallback }: MapProps & { onMapReady?: () => void }): ReactElement {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);

  const { user, authState } = useAuth();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const {
    userPosition: contextUserPosition,
    memberLocations: contextMemberLocations,
    reports: contextReports,
    cameraPositionRef,
    mapZoomRef,
    altitudeRef,
    setUserPosition,
    setReports: setContextReports
  } = useMap();

  const [localReports, setLocalReports] = useState<{ [reportId: number]: Report }>({});
  const [localMemberLocations, setLocalMemberLocations] = useState<{ [memberId: number]: MemberLocation }>({});

  const userCoordinates = useSelector((state: RootState) => state.location.coordinates);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [initialMapRegion, setInitialMapRegion] = useState<Region | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const hasFirstLocationUpdate = useRef(false);
  const isProgrammaticAnimation = useRef(false);
  const lastSentPosition = useRef<{ lat: number; lng: number } | null>(null);
  const lastSentTime = useRef<number>(0);
  const lastGeocodedTime = useRef<number>(0);
  const lastReduxUpdateTime = useRef<number>(0);
  const lastCameraAnimationTime = useRef<number>(0);

  const memberLocationsRef = useRef<{ [memberId: number]: any }>({});
  const memberLocationTargetsRef = useRef<{ [memberId: number]: { lat: number; lng: number; timestamp: number } }>({});
  const locationUpdateTime = useRef<{ [memberId: number]: number }>({});

  const animationTimerFirst = useRef<number | undefined>(undefined);
  const animationTimerContinuous = useRef<number | undefined>(undefined);
  const animationTimerRecenter = useRef<number | undefined>(undefined);


  const displayMembers = useMemo(
    () => (isInteractive ? localMemberLocations : contextMemberLocations),
    [isInteractive, localMemberLocations, contextMemberLocations]
  );

  const displayReports = useMemo(
    () => (isInteractive ? localReports : contextReports),
    [isInteractive, localReports, contextReports]
  );

  const handleRegionChange = useCallback((newRegion: Region) => {
    mapZoomRef.current = newRegion.latitudeDelta;
    altitudeRef.current = newRegion.latitudeDelta * 250000;
  }, [mapZoomRef, altitudeRef]);

  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    dispatch(setViewRegion(newRegion));

    cameraPositionRef.current = newRegion;
    mapZoomRef.current = newRegion.latitudeDelta;

    if (!hasFirstLocationUpdate.current || isProgrammaticAnimation.current) {
      return;
    }

    if (isFollowing && userCoordinates) {
      const distanceLat = Math.abs(newRegion.latitude - userCoordinates.latitude);
      const distanceLng = Math.abs(newRegion.longitude - userCoordinates.longitude);
      if (distanceLat > CONFIG.MAP_FOLLOW_THRESHOLD || distanceLng > CONFIG.MAP_FOLLOW_THRESHOLD) {
        setIsFollowing(false);
      }
    }
  }, [dispatch, isFollowing, userCoordinates, cameraPositionRef, mapZoomRef]);

  const handleRecenter = useCallback(() => {
    if (userCoordinates && mapRef.current) {
      setIsFollowing(true);
      isProgrammaticAnimation.current = true;
      mapRef.current.animateCamera({
        center: userCoordinates,
      }, { duration: CONFIG.ANIMATION_DURATION.RECENTER });

      if (animationTimerRecenter.current) clearTimeout(animationTimerRecenter.current);
      animationTimerRecenter.current = setTimeout(() => {
        isProgrammaticAnimation.current = false;
      }, CONFIG.ANIMATION_CLEANUP_DELAY.RECENTER);
    }
  }, [userCoordinates]);

  const handleLocationReceived = useCallback((location: MemberLocation) => {
    const now = Date.now();

    const lastUpdate = locationUpdateTime.current[location.memberId] || 0;
    if (now - lastUpdate < CONFIG.MEMBER_ANIMATION_THROTTLE) {
      return;
    }
    locationUpdateTime.current[location.memberId] = now;

    memberLocationTargetsRef.current[location.memberId] = {
      lat: location.lat,
      lng: location.lng,
      timestamp: location.timestamp
    };
  }, []);

  const handleReportReceived = useCallback((message: Report) => {
    let updated: { [reportId: number]: Report } = {};

    setLocalReports(prev => {
      updated = {
        ...prev,
        [message.id]: message
      };

      return updated;
    });

    setContextReports(updated);
  }, [setContextReports]);

  const { sendLocation, onLocationReceived, onReportReceived } = useWebSocket();

  useEffect(() => {
    let animationId: number;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1000 / CONFIG.MEMBER_ANIMATION_UPDATE_FPS;

    const animate = () => {
      const now = Date.now();

      if (now - lastUpdateTime >= UPDATE_INTERVAL) {
        lastUpdateTime = now;

        Object.entries(memberLocationTargetsRef.current).forEach(([memberId, target]) => {
          const id = Number(memberId);
          const existing = memberLocationsRef.current[id];

          if (!existing) {
            memberLocationsRef.current[id] = {
              memberId: id,
              lat: target.lat,
              lng: target.lng,
              timestamp: target.timestamp,
              targetLat: target.lat,
              targetLng: target.lng,
              startLat: target.lat,
              startLng: target.lng,
              animationStartTime: now,
              animationDuration: 0,
            };
          } else {
            const currentLat = existing.lat;
            const currentLng = existing.lng;

            memberLocationsRef.current[id] = {
              ...existing,
              startLat: currentLat,
              startLng: currentLng,
              targetLat: target.lat,
              targetLng: target.lng,
              animationStartTime: now,
              animationDuration: CONFIG.MEMBER_ANIMATION_DURATION,
              timestamp: target.timestamp,
            };
          }

          delete memberLocationTargetsRef.current[id];
        });

        setLocalMemberLocations((prev) => {
          const updated = { ...memberLocationsRef.current };
          let hasChanges = false;

          Object.entries(updated).forEach(([id, location]) => {
            if (location.animationDuration === 0) return;

            const elapsed = now - location.animationStartTime;
            const progress = Math.min(elapsed / location.animationDuration, 1);

            const newLat = location.startLat + (location.targetLat - location.startLat) * progress;
            const newLng = location.startLng + (location.targetLng - location.startLng) * progress;

            updated[Number(id)].lat = newLat;
            updated[Number(id)].lng = newLng;
            hasChanges = true;

            if (progress === 1) {
              updated[Number(id)].animationDuration = 0;
              updated[Number(id)].lat = location.targetLat;
              updated[Number(id)].lng = location.targetLng;
            }
          });

          return hasChanges ? updated : prev;
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    const unsubscribeLocation = onLocationReceived(handleLocationReceived);
    const unsubscribeReport = onReportReceived(handleReportReceived);

    return () => {
      unsubscribeLocation();
      unsubscribeReport();
    };
  }, [handleLocationReceived, handleReportReceived, onLocationReceived, onReportReceived]);

  // Synchroniser localMemberLocations et memberLocationsRef quand contextMemberLocations change
  useEffect(() => {
    setLocalMemberLocations(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(memberId => {
        const id = Number(memberId);
        if (!contextMemberLocations[id]) {
          delete updated[id];
        }
      });
      return updated;
    });

    // Aussi nettoyer la ref pour éviter les incohérences
    Object.keys(memberLocationsRef.current).forEach(memberId => {
      const id = Number(memberId);
      if (!contextMemberLocations[id]) {
        delete memberLocationsRef.current[id];
      }
    });
  }, [contextMemberLocations]);

  useEffect(() => {
    if (initialMapRegion) return;

    const savedPosition = cameraPositionRef.current;
    if (savedPosition) {
      setInitialMapRegion(savedPosition);
      return;
    }

    if (userCoordinates) {
      setInitialMapRegion({
        latitude: userCoordinates.latitude,
        longitude: userCoordinates.longitude,
        latitudeDelta: CONFIG.INITIAL_MAP_DELTA.latitude,
        longitudeDelta: CONFIG.INITIAL_MAP_DELTA.longitude,
      });
      return;
    }

    setInitialMapRegion({
      latitude: 48.8566,
      longitude: 2.3522,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  }, [userCoordinates, initialMapRegion, cameraPositionRef]);

  useFocusEffect(
    useCallback(() => {
      if (mapRef.current && cameraPositionRef.current) {
        const camera = {
          center: {
            latitude: cameraPositionRef.current.latitude,
            longitude: cameraPositionRef.current.longitude,
          },
          zoom: cameraPositionRef.current.latitudeDelta,
          heading: 0,
          pitch: 0,
          altitude: altitudeRef.current,
        };
        altitudeRef.current = camera.altitude;
        mapRef.current.setCamera(camera);
      }
    }, [cameraPositionRef, altitudeRef])
  );

  useEffect(() => {
    if (!isInteractive && isMapLoaded && mapRef.current && contextUserPosition) {
      mapRef.current.animateToRegion({
        latitude: contextUserPosition.latitude,
        longitude: contextUserPosition.longitude,
        latitudeDelta: CONFIG.INITIAL_MAP_DELTA.latitude,
        longitudeDelta: CONFIG.INITIAL_MAP_DELTA.longitude,
      }, 500);
    }
  }, [isInteractive, isMapLoaded, contextUserPosition]);

  useEffect(() => {
    return () => {
      if (animationTimerFirst.current) clearTimeout(animationTimerFirst.current);
      if (animationTimerContinuous.current) clearTimeout(animationTimerContinuous.current);
      if (animationTimerRecenter.current) clearTimeout(animationTimerRecenter.current);
    };
  }, []);

  const updateAddressFromCoordinates = useCallback(async (latitude: number, longitude: number): Promise<void> => {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (reverseGeocode && reverseGeocode.length > 0) {
        const loc = reverseGeocode[0];
        const address = `${loc.street || ''} ${loc.streetNumber || ''}, ${loc.city || ''}`.trim();
        if (address) {
          dispatch(setAddress(address));
        }
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      dispatch(setLocationError('Erreur de géocodage'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasInitialized) return;

    if (authState !== EAuthState.FULLY_AUTHENTICATED) {
      return;
    }

    let isMounted = true;

    async function initializeLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Permission de localisation refusée');
          dispatch(setLocationError('Permission de localisation refusée'));
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
        console.error('Erreur initialisation localisation:', error);
        dispatch(setLocationError('Erreur lors de la récupération de la position'));
      }
    }

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, [hasInitialized, authState, dispatch, updateAddressFromCoordinates]);

  const handleLocationChange = useCallback(
    async (event: any): Promise<void> => {
      if (isBackground || !event.nativeEvent.coordinate) return;

      const { latitude, longitude } = event.nativeEvent.coordinate;
      const now = Date.now();

      if (!hasFirstLocationUpdate.current && mapRef.current) {
        isProgrammaticAnimation.current = true;
        mapRef.current.animateCamera({
          center: { latitude, longitude },
        }, { duration: CONFIG.ANIMATION_DURATION.FIRST_LOCATION });
        hasFirstLocationUpdate.current = true;
        lastCameraAnimationTime.current = now;

        if (animationTimerFirst.current) clearTimeout(animationTimerFirst.current);
        animationTimerFirst.current = setTimeout(() => {
          isProgrammaticAnimation.current = false;
        }, CONFIG.ANIMATION_CLEANUP_DELAY.FIRST_LOCATION);
      }

      const shouldSend =
        !lastSentPosition.current ||
        (now - lastSentTime.current > CONFIG.WS_SEND_INTERVAL) ||
        calculateDistance(
          lastSentPosition.current.lat,
          lastSentPosition.current.lng,
          latitude,
          longitude
        ) > CONFIG.WS_SEND_DISTANCE;

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

        const shouldAnimate =
          timeSinceLastAnimation > CONFIG.CAMERA_ANIMATION_INTERVAL ||
          distanceFromCurrentView > CONFIG.CAMERA_MIN_DISTANCE;

        if (shouldAnimate) {
          isProgrammaticAnimation.current = true;
          mapRef.current.animateCamera({
            center: { latitude, longitude },
          }, { duration: CONFIG.ANIMATION_DURATION.CONTINUOUS });
          lastCameraAnimationTime.current = now;

          if (animationTimerContinuous.current) clearTimeout(animationTimerContinuous.current);
          animationTimerContinuous.current = setTimeout(() => {
            isProgrammaticAnimation.current = false;
          }, CONFIG.ANIMATION_CLEANUP_DELAY.CONTINUOUS);
        }
      }

      const timeSinceLastReduxUpdate = now - lastReduxUpdateTime.current;
      const distanceSinceLastReduxUpdate = userCoordinates
        ? calculateDistance(userCoordinates.latitude, userCoordinates.longitude, latitude, longitude)
        : Infinity;

      const shouldUpdateRedux =
        lastReduxUpdateTime.current === 0 ||
        timeSinceLastReduxUpdate > CONFIG.REDUX_UPDATE_THROTTLE ||
        distanceSinceLastReduxUpdate > CONFIG.REDUX_MIN_DISTANCE;

      if (shouldUpdateRedux) {
        dispatch(setCoordinates({ latitude, longitude }));
        lastReduxUpdateTime.current = now;

        setUserPosition({ latitude, longitude });
      }

      if (now - lastGeocodedTime.current > CONFIG.GEOCODING_THROTTLE) {
        await updateAddressFromCoordinates(latitude, longitude);
        lastGeocodedTime.current = now;
      }
    },
    [
      isBackground,
      sendLocation,
      dispatch,
      updateAddressFromCoordinates,
      isFollowing,
      userCoordinates,
      setUserPosition
    ]
  );

  if (!initialMapRegion) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  const memberMarkers = Object.values(displayMembers).map((location) => {
    const photoUri = user?.photoPath ?? undefined;

    console.debug(displayMembers);

    return (
      <Marker
        key={location.memberId}
        coordinate={{
          latitude: location.lat,
          longitude: location.lng
        }}
        title={`Member ${location.memberId}`}
        description={`Seen ${Math.floor((Date.now() - location.timestamp) / 1000)}s ago`}
        pinColor="blue"
      >
        <View style={markerStyles.memberMarker}>
          <Image
            style={markerStyles.memberPhoto}
            source={{ uri: photoUri }}
          />
        </View>
      </Marker>
    );
  });

  const reportMarkers = Object.values(displayReports).map((report) => (
    <Marker
      key={`report-${report.id}`}
      coordinate={{
        latitude: report.lat,
        longitude: report.lng
      }}
      title={`Report level ${report.level}`}
    >
      <View style={[
        markerStyles.reportMarker,
        report.level >= 3 ? markerStyles.reportMarkerHigh : markerStyles.reportMarkerMedium
      ]} />
    </Marker>
  ));

  const mapView = (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={initialMapRegion}
      showsPointsOfInterest={false}
      showsUserLocation={true}
      scrollEnabled={isInteractive}
      zoomEnabled={isInteractive}
      pitchEnabled={isInteractive}
      rotateEnabled={isInteractive}
      onPanDrag={isInteractive ? () => {} : undefined}
      onRegionChange={handleRegionChange}
      onRegionChangeComplete={!isBackground && isInteractive ? handleRegionChangeComplete : undefined}
      onUserLocationChange={!isBackground && isInteractive ? handleLocationChange : undefined}
      loadingEnabled={false}
      customMapStyle={colorScheme === 'dark' ? darkMapStyle : lightMapStyle}
      onMapReady={() => {
        setIsMapLoaded(true);
        onMapReadyCallback?.();
      }}
    >
      {memberMarkers}
      {reportMarkers}
    </MapView>
  );

  return (
    <View style={[styles.container, style]}>
      {!isMapLoaded && (
        <View style={[styles.mapLoadingOverlay, { backgroundColor: colors.background }]}>
          <Loading />
        </View>
      )}
      {isBackground ? (
        <BlurView intensity={90} style={styles.map}>
          {mapView}
        </BlurView>
      ) : (
        mapView
      )}

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

const markerStyles = StyleSheet.create({
  memberMarker: {
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
  },
  memberPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reportMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  reportMarkerHigh: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
  },
  reportMarkerMedium: {
    backgroundColor: 'rgba(255, 165, 0, 0.7)',
  },
});

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