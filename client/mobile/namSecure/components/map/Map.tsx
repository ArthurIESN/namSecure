import { View,StyleSheet,ViewStyle } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef, ReactElement,useCallback } from 'react';
import MapView, {Region,Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch,useSelector } from 'react-redux';
import { setAddress, setCoordinates, setError as setLocationError } from '@/store/locationSlice';
import {useMapState} from "@/hooks/use-map-state";
import {RootState} from "@/store/store";
import {setViewRegion} from "@/store/mapSlice";

// Interfaces
interface Styles {
  map: ViewStyle;
}

interface MapProps {
  isBackground?: boolean;
  style?: ViewStyle;
}


export default function Map({ isBackground = false, style }: MapProps): ReactElement {
  const dispatch = useDispatch();
  const mapRef = useRef<MapView | null>(null);
  console.log("test");
  const{
    region,
    viewRegion,
    setUserMapRegion,
    addMapMarker,
    updateMapMarker,
  } = useMapState();


    const handleRegionChangeComplete = (newRegion: Region) => {
      dispatch(setViewRegion(newRegion));
      console.log(newRegion);
    };

  const userCoordinates = useSelector((state: RootState) => state.location.coordinates);

  const [hasInitialized, setHasInitialized] = useState(false);

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



    async function requestPermission(): Promise<boolean> {
      try {
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission de localisation refusée');
          dispatch(setLocationError('Permission refusée'));
          return false;
        }
        return true;
      } catch (error) {
        console.error('Erreur localisation', error);
        dispatch(setLocationError('Erreur lors de la récupération de la position'));
        return false;
      }
    }

    async function initializeRegion(): Promise<void> {
      const ok: boolean= await requestPermission();
      if(ok) {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        const initialRegion: Region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }

        console.log(initialRegion);

        setUserMapRegion(initialRegion);

        dispatch(setCoordinates({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));


        await updateAddressFromCoordinates(location.coords.latitude, location.coords.longitude);

        setHasInitialized(true);
      }
    }
    if (!isMounted) return;



    initializeRegion();


    return () => {
      console.log("eazeazeazezaeazeaz");
      isMounted = false;
    };
  }, [hasInitialized,setUserMapRegion,dispatch,addMapMarker,updateAddressFromCoordinates]);

  const handleLocationChange = useCallback(
      async (event : any): Promise<void> => {
        if(isBackground) return;

        if(!event.nativeEvent.coordinate) return;

        const {latitude, longitude} = event.nativeEvent.coordinate;

        const newRegion: Region = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

        setUserMapRegion(newRegion);

        dispatch(setCoordinates({latitude, longitude}));


        await  updateAddressFromCoordinates(latitude, longitude);
      },
        [isBackground,setUserMapRegion,dispatch,updateMapMarker,updateAddressFromCoordinates]
  );

  console.log(`Region : ${viewRegion}`);
  return (
      <View style={[styles.container, style]}>
        <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={isBackground ? region : viewRegion || region}
            //onRegionChangeComplete={handleRegionChangeComplete}
            showsUserLocation={true}
            showsMyLocationButton={!isBackground}
           // zoomEnabled={!isBackground}
            //scrollEnabled={!isBackground}
            //rotateEnabled={!isBackground}
            //pitchEnabled={!isBackground}
            onUserLocationChange={!isBackground ? handleLocationChange : undefined}
            loadingEnabled={true}
        >
        </MapView>
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
});

