import {View, StyleSheet, Image} from 'react-native';
import React, { useEffect, useRef } from 'react';
import BubbleMap from "@/components/map/BubbleMap";
import Maps from '@/components/map/Maps';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Colors } from '@/constants/theme';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useMap } from '@/providers/MapProvider';
import ViewShot from 'react-native-view-shot';

export default function HomeScreen() {

    const { logout, refreshUser } = useAuth();
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];
    const { mapScreenshotRef, mapScreenshot, captureMapScreenshot } = useMap();

    const address = useSelector((state: RootState) => state.location.address);
    console.log(address);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                // Capture screenshot when leaving this screen
                captureMapScreenshot();
            };
        }, [captureMapScreenshot])
    );

    useEffect(() => {}, [address]);

    const Logout = async () =>
    {
        await logout();
        await refreshUser();
    }

    return (
        <View style={styles.container}>
            <ViewShot ref={mapScreenshotRef} options={{ format: "jpg", quality: 0.9 }}>
                <Maps onMapReady={() => {
                    setTimeout(() => {
                        captureMapScreenshot();
                    }, 1500);
                }} />
            </ViewShot>
            <BubbleMap address={address} />
        </View>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  containerSelectReport:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
});
