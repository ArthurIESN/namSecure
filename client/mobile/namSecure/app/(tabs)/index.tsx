import { useState,useEffect } from 'react';
import { View,Platform, StyleSheet, useWindowDimensions,Text} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location'
import { BottomSheet, Host } from '@expo/ui/swift-ui';




export default function HomeScreen() {
  const {width} =  useWindowDimensions();  
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
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== 'granted'){
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
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
    <View style={styles.container}>
      <Host style={styles.host}>
        
        <BottomSheet isOpened={isOpened} onIsOpenedChange={e => setIsOpened(e)}>
          <View style={styles.view}>
          <Text style={styles.font}>Hello, world!</Text>
          </View>
        </BottomSheet>
        </Host>
     <MapView style={styles.map} provider={PROVIDER_GOOGLE} region={region} showsUserLocation={true} showsMyLocationButton={true} followsUserLocation={true}></MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view :{
    height : 300
  },
  font:{
    fontSize : 20,
  },
  host: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    height: 300,
    zIndex: 1, // Pour s'assurer qu'il passe au-dessus des autres éléments
  },
 
  map: {
    width: '100%',
    height: '100%',
  },
});
