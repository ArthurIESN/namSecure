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




export default function HomeScreen() {
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
