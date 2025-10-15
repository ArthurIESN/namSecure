import { Image } from 'expo-image';
import {View, Platform, StyleSheet, Text,useWindowDimensions} from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {GlassContainer, GlassView} from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import darkMapStyle from './darkMapStyle.json';
import { LinearGradient } from 'expo-linear-gradient';
import GlassedView from "@/components/glass/GlassedView";
import { useState,useEffect } from 'react';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location'




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
        <GlassContainer spacing={16} style={styles.glassContainer}>
            <GlassedView
                glassEffectStyle="clear"
                isInteractive={true}
                color="4287f540"
                intensity={12}
                tint={"default"}
                style={[styles.glassBox, { marginTop: 16 }]}
            >
                <LinearGradient
                    colors={['#ffffff10', '#ffffff05']}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.viewContent}>
                    <Ionicons name="location-sharp" size={24} color="white" />
                    <Text style={styles.text}>Current Location</Text>
                    <Ionicons name="person-circle" size={46} color="white" style={{ marginLeft: 'auto' }} />
                </View>
            </GlassedView>
        </GlassContainer>
      <MapView style={styles.map} provider={PROVIDER_GOOGLE} customMapStyle={ darkMapStyle }></MapView>
      </View>

  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    glassContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        //justifyContent: 'center',
        alignItems: 'center',
      zIndex: 9999,
    },
  view :{
    height : 300
  },
  font:{
    fontSize : 20,
  },
 
  map: {
    width: '100%',
    height: '100%',
  },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    glassView: {
        position: 'absolute',
        top: 100,
        left: 50,
        width: 100,
        height: 100,
        borderRadius: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 10000,
    },
    glassBox: {
        width: 353,
        height: 66,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    viewContent:
    {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: '100%',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
    },


});
