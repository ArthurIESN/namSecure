import {StyleSheet, View, Text} from 'react-native';

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
