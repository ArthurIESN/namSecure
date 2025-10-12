import { Image } from 'expo-image';
import {Platform, StyleSheet, View, Text} from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { getToken } from "@/services/auth/authServices";

export default function TabTwoScreen() {

    const token = getToken();

    return (
        <View style={styles.titleContainer}>
            <Text>USER TOKEN</Text>
            <Text>{token}</Text>
        </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
      top:200,
      margin:20
  },
});
