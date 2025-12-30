import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
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
import { Colors } from '@/constants/theme';
import { lightMapStyle, darkMapStyle } from '@/constants/mapStyles';
import Loading from '@/components/ui/loading/Loading';
import { useMap } from "@/providers/MapProvider";
import { calculateDistance } from "@/utils/geo/geolocation";
import { requestLocationPermissions } from "@/utils/permissions/location";
import type { MemberLocation, Report, MapProps } from "@/types/components/map";

const CONFIG = {
  WEBSOCKET_SEND_INTERVAL_MS: 5000,
  WEBSOCKET_MIN_DISTANCE_METERS: 50,

  CAMERA_ANIMATION_INTERVAL_MS: 2500,
  CAMERA_MIN_DISTANCE_METERS: 20,

  REDUX_UPDATE_THROTTLE_MS: 3000,
  REDUX_MIN_DISTANCE_METERS: 10,

  GEOCODING_THROTTLE_MS: 60000,

  LOCATION_TIMEOUT_MS: 5 * 60 * 1000,

  MAP_FOLLOW_THRESHOLD_DEGREES: 0.0001,

  // Member location animation
  MEMBER_ANIMATION_DURATION_MS: 5500, // Slightly longer than WEBSOCKET_SEND_INTERVAL_MS
  MEMBER_ANIMATION_THROTTLE_MS: 500,  // Minimum time between updates to prevent excessive throttling
  MEMBER_ANIMATION_UPDATE_FPS: 60,     // Target 60fps for smooth animation

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

const DEFAULT_PROFILE_PHOTO = 'https://via.placeholder.com/40';

export default function Map({ isBackground = false, style, isInteractive = true }: MapProps): ReactElement {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);

  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  // Extract setter functions and refs from context to avoid dependency issues
  const {
    userPosition: contextUserPosition,
    memberLocations: contextMemberLocations,
    reports: contextReports,
    cameraPositionRef,
    mapZoomRef,
    altitudeRef,
    setUserPosition,
    setMemberLocations: setContextMemberLocations,
    setReports: setContextReports
  } = useMap();

  // Local state for interactive maps
  const [localReports, setLocalReports] = useState<{ [reportId: number]: Report }>({});
  const [localMemberLocations, setLocalMemberLocations] = useState<{ [memberId: number]: MemberLocation }>({});

  const userCoordinates = useSelector((state: RootState) => state.location.coordinates);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const [initialMapRegion, setInitialMapRegion] = useState<Region | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Refs for tracking state
  const hasFirstLocationUpdate = useRef(false);
  const isProgrammaticAnimation = useRef(false);
  const lastSentPosition = useRef<{ lat: number; lng: number } | null>(null);
  const lastSentTime = useRef<number>(0);
  const lastGeocodedTime = useRef<number>(0);
  const lastReduxUpdateTime = useRef<number>(0);
  const lastCameraAnimationTime = useRef<number>(0);

  // Refs for member location animation
  const memberLocationsRef = useRef<{ [memberId: number]: any }>({});
  const memberLocationTargetsRef = useRef<{ [memberId: number]: { lat: number; lng: number; timestamp: number } }>({});
  const locationUpdateTime = useRef<{ [memberId: number]: number }>({});

  // Refs for cleanup
  const animationTimerFirst = useRef<NodeJS.Timeout>();
  const animationTimerContinuous = useRef<NodeJS.Timeout>();
  const animationTimerRecenter = useRef<NodeJS.Timeout>();


  const displayMembers = useMemo(
    () => (isInteractive ? localMemberLocations : contextMemberLocations),
    [isInteractive, localMemberLocations, contextMemberLocations]
  );

  const displayReports = useMemo(
    () => (isInteractive ? localReports : contextReports),
    [isInteractive, localReports, contextReports]
  );

  // Save zoom during region change
  const handleRegionChange = useCallback((newRegion: Region) => {
    mapZoomRef.current = newRegion.latitudeDelta;
    // Calculate altitude from latitude delta
    const estimatedAltitude = newRegion.latitudeDelta * 250000;
    altitudeRef.current = estimatedAltitude;
  }, [mapZoomRef, altitudeRef]);

  // Detects manual map movement to disable auto-follow
  const handleRegionChangeComplete = useCallback((newRegion: Region) => {
    dispatch(setViewRegion(newRegion));

    // Save camera position to provider ref
    cameraPositionRef.current = newRegion;
    mapZoomRef.current = newRegion.latitudeDelta;

    if (!hasFirstLocationUpdate.current || isProgrammaticAnimation.current) {
      return;
    }

    if (isFollowing && userCoordinates) {
      const distanceLat = Math.abs(newRegion.latitude - userCoordinates.latitude);
      const distanceLng = Math.abs(newRegion.longitude - userCoordinates.longitude);
      if (distanceLat > CONFIG.MAP_FOLLOW_THRESHOLD_DEGREES || distanceLng > CONFIG.MAP_FOLLOW_THRESHOLD_DEGREES) {
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

    // Throttle: ignore updates too frequent
    const lastUpdate = locationUpdateTime.current[location.memberId] || 0;
    if (now - lastUpdate < CONFIG.MEMBER_ANIMATION_THROTTLE_MS) {
      return;
    }
    locationUpdateTime.current[location.memberId] = now;

    // Store target position without triggering state update
    // The animation loop will handle the interpolation
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

    // Update context after local state (separate setState calls)
    setContextReports(updated);
  }, [setContextReports]);

  const { sendLocation, onLocationReceived, onReportReceived } = useWebSocket();

  // Animation loop for smooth member location interpolation
  useEffect(() => {
    let animationId: number;
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 1000 / CONFIG.MEMBER_ANIMATION_UPDATE_FPS; // ~16.67ms for 60fps

    const animate = () => {
      const now = Date.now();

      // Limit updates to avoid excessive re-renders
      if (now - lastUpdateTime >= UPDATE_INTERVAL) {
        lastUpdateTime = now;

        // Process new target positions
        Object.entries(memberLocationTargetsRef.current).forEach(([memberId, target]) => {
          const id = Number(memberId);
          const existing = memberLocationsRef.current[id];

          if (!existing) {
            // First position: initialize without animation
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
            // New position: start animation from current position
            const currentLat = existing.lat;
            const currentLng = existing.lng;

            memberLocationsRef.current[id] = {
              ...existing,
              startLat: currentLat,
              startLng: currentLng,
              targetLat: target.lat,
              targetLng: target.lng,
              animationStartTime: now,
              animationDuration: CONFIG.MEMBER_ANIMATION_DURATION_MS,
              timestamp: target.timestamp,
            };
          }

          // Remove from targets once processed
          delete memberLocationTargetsRef.current[id];
        });

        // Update animated positions
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

            // Animation complete
            if (progress === 1) {
              updated[Number(id)].animationDuration = 0;
              updated[Number(id)].lat = location.targetLat;
              updated[Number(id)].lng = location.targetLng;
            }
          });

          // Only update state if something changed
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

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribeLocation = onLocationReceived(handleLocationReceived);
    const unsubscribeReport = onReportReceived(handleReportReceived);

    return () => {
      unsubscribeLocation();
      unsubscribeReport();
    };
  }, [handleLocationReceived, handleReportReceived, onLocationReceived, onReportReceived]);

  // Set initial map region when user coordinates are available
  useEffect(() => {
    if (!initialMapRegion && userCoordinates) {
      // Restore from saved camera position if available, otherwise use current coordinates
      const savedPosition = cameraPositionRef.current;

      if (savedPosition) {
        setInitialMapRegion(savedPosition);
      } else {
        setInitialMapRegion({
          latitude: userCoordinates.latitude,
          longitude: userCoordinates.longitude,
          latitudeDelta: CONFIG.INITIAL_MAP_DELTA.latitude,
          longitudeDelta: CONFIG.INITIAL_MAP_DELTA.longitude,
        });
      }
    }
  }, [userCoordinates, initialMapRegion, cameraPositionRef]);

  // Restore camera position when screen comes into focus
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

  // For background maps: animate to user position when context position updates
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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerFirst.current) clearTimeout(animationTimerFirst.current);
      if (animationTimerContinuous.current) clearTimeout(animationTimerContinuous.current);
      if (animationTimerRecenter.current) clearTimeout(animationTimerRecenter.current);
    };
  }, []);

  // Reverse geocoding to get address from coordinates
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
      console.error('Geocoding error:', error);
      dispatch(setLocationError('Geocoding error'));
    }
  }, [dispatch]);

  // Initialize map with location permissions and initial position
  useEffect(() => {
    if (hasInitialized) return;
    let isMounted = true;

    async function initializeRegion(): Promise<void> {
      try {
        const { granted, error } = await requestLocationPermissions();

        if (!granted) {
          console.error('Permission denied:', error);
          dispatch(setLocationError(error || 'Permission denied'));
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
        console.error('Map initialization error:', error);
        dispatch(setLocationError('Error retrieving position'));
      }
    }

    initializeRegion();

    return () => {
      isMounted = false;
    };
  }, [hasInitialized, dispatch, updateAddressFromCoordinates]);

  // Called on every user location update (sends WebSocket, animates camera, geocoding)
  const handleLocationChange = useCallback(
    async (event: any): Promise<void> => {
      if (isBackground || !event.nativeEvent.coordinate) return;

      const { latitude, longitude } = event.nativeEvent.coordinate;
      const now = Date.now();

      // First location update: center camera immediately
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

      // WebSocket: Send position if enough time has passed or distance is significant
      const shouldSend =
        !lastSentPosition.current ||
        (now - lastSentTime.current > CONFIG.WEBSOCKET_SEND_INTERVAL_MS) ||
        calculateDistance(
          lastSentPosition.current.lat,
          lastSentPosition.current.lng,
          latitude,
          longitude
        ) > CONFIG.WEBSOCKET_MIN_DISTANCE_METERS;

      if (shouldSend) {
        sendLocation(latitude, longitude);
        lastSentPosition.current = { lat: latitude, lng: longitude };
        lastSentTime.current = now;
      }

      // Camera animation: Smooth follow when in follow mode
      if (isFollowing && mapRef.current && userCoordinates && hasFirstLocationUpdate.current) {
        const timeSinceLastAnimation = now - lastCameraAnimationTime.current;
        const distanceFromCurrentView = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          latitude,
          longitude
        );

        const shouldAnimate =
          timeSinceLastAnimation > CONFIG.CAMERA_ANIMATION_INTERVAL_MS ||
          distanceFromCurrentView > CONFIG.CAMERA_MIN_DISTANCE_METERS;

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

      // Redux: Throttled updates to reduce re-renders
      const timeSinceLastReduxUpdate = now - lastReduxUpdateTime.current;
      const distanceSinceLastReduxUpdate = userCoordinates
        ? calculateDistance(userCoordinates.latitude, userCoordinates.longitude, latitude, longitude)
        : Infinity;

      const shouldUpdateRedux =
        lastReduxUpdateTime.current === 0 ||
        timeSinceLastReduxUpdate > CONFIG.REDUX_UPDATE_THROTTLE_MS ||
        distanceSinceLastReduxUpdate > CONFIG.REDUX_MIN_DISTANCE_METERS;

      if (shouldUpdateRedux) {
        dispatch(setCoordinates({ latitude, longitude }));
        lastReduxUpdateTime.current = now;

        // Update context (all maps update context)
        setUserPosition({ latitude, longitude });
      }

      // Geocoding: Very throttled to avoid too many API calls
      if (now - lastGeocodedTime.current > CONFIG.GEOCODING_THROTTLE_MS) {
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
      isInteractive,
      setUserPosition
    ]
  );

  // Don't render map until initial region is set
  if (!initialMapRegion) {
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  // Extracted marker components to reduce code duplication
  const memberMarkers = Object.values(displayMembers).map((location) => {
    const photoUri = user?.photoPath ?? DEFAULT_PROFILE_PHOTO;
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
      ]}>
        <Text style={markerStyles.reportIcon}>⚠️</Text>
      </View>
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
      onMapReady={() => setIsMapLoaded(true)}
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

      {/* Recenter button (only on interactive maps) */}
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

// Marker styles (extracted to avoid inline style creation)
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
  reportIcon: {
    fontSize: 20,
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