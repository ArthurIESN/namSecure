import React, { useState,useEffect } from 'react';
import {View, Platform, StyleSheet, useWindowDimensions, Text, TouchableOpacity, Animated} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons';
import ScrollView = Animated.ScrollView;
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
        <View style={styles.wrapper}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
                followsUserLocation={true}
            />

            {/* Éléments additionel a la carte */}
            <View style={styles.overlay}>
                <View style={styles.bubble}>
                    <Text>Select the category of your report</Text>
                </View>

                <View style={styles.box}>
                    <ScrollView contentContainerStyle={styles.buttonGrid}
                                showsVerticalScrollIndicator={false}>
                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="alert-circle" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Accident</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="walk" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Stalker</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="skull" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Combat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="wallet" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Vol</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="alert-circle" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Alert</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="car" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Vehicle</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="home" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Ionicons name="leaf" size={28} color="#333" />
                            <Text style={styles.buttonLabel}>Nature</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject, // occupe tout l’écran
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 16, // ou juste paddingVertical: 16
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        position: 'absolute',
        padding: 15,
        borderRadius: 25,
        marginBottom: 16,
        bottom: 350,
    },
    box: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 25,
        height: 350,
        padding: 0,
        alignItems: 'center',
        position: 'absolute',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    button: {
        backgroundColor: 'rgba(225,225,225,0.7)',
        borderRadius: 16,
        width: '48%', // 2 par ligne
        height: 100,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
    },
});