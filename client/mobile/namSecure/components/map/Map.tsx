import { Image } from 'expo-image';
import {View, Platform, StyleSheet, Text,useWindowDimensions, ViewStyle} from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState,useEffect, FC, ReactElement } from 'react';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location'


interface Styles {
    map: ViewStyle;
}


export default function Map() : ReactElement {
  const {width} : {width : number} =  useWindowDimensions();  
  const [location,setLocation] = useState<Location.LocationObject | null>(null);
  const [region,setRegion] = useState<Region>({
    latitude : 50.8503,
    longitude : 4.3517,
    latitudeDelta : 0.01,
    longitudeDelta : 0.01,
  })
  const[errorMsg,setErrorMsg] = useState<string | null>(null);
  const [isOpened,setIsOpened] = useState(true);

  useEffect(() => {
    async function getCurrentLocation(){
      let {status} : {status : string}= await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location  : Location.LocationObject = await Location.getCurrentPositionAsync({
        accuracy : Location.Accuracy.High,
      });
      setLocation(location);

      // Centrer la carte sur la position de l'utilisateur 
      setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
      });
    }
    getCurrentLocation();
  },[])

  return (
    <MapView style={styles.map} provider={PROVIDER_GOOGLE}   showsUserLocation={true}
    showsMyLocationButton={true}
    followsUserLocation={true}
    region={region}></MapView>
  );
}

const styles = StyleSheet.create<Styles>({
    map: {
        width: '100%',
        height: '100%',
      },
})

