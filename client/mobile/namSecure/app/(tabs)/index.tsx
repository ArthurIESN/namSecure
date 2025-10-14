import { Image } from 'expo-image';
import {View, Platform, StyleSheet, Text} from 'react-native';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import MapView from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {GlassContainer, GlassView} from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import darkMapStyle from './darkMapStyle.json';
import { LinearGradient } from 'expo-linear-gradient';
import GlassedView from "@/components/glass/GlassedView";
import { useState,useEffect } from 'react';
import { View,Platform, StyleSheet, useWindowDimensions,Text} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
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
      <Host style={styles.host}>
        
        <BottomSheet isOpened={isOpened} onIsOpenedChange={e => setIsOpened(e)}>
            <View style={styles.view}>
            <Text style={styles.font}>Hello, world!</Text>
            </View>
          </BottomSheet>
      </Host>
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
