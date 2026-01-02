import {View, StyleSheet} from 'react-native';
import { useEffect } from 'react';
import BubbleMap from "@/components/map/BubbleMap";
import Maps from '@/components/map/Maps';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {

    const { logout, refreshUser } = useAuth();
    const { colorScheme } = useTheme();
    const colors = Colors[colorScheme];

  const address = useSelector((state: RootState) => state.location.address);
  console.log(address);

  useEffect(() => {}, [address]);

  const Logout = async () =>
  {
    await logout();
    await refreshUser();
  }


  return (
    <View style={styles.container}>
        <Maps />
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
