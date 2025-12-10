import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { Colors } from '@/constants/theme';

export default function Text(props: TextProps) {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme];

  return (
    <RNText
      {...props}
      style={[
        { color: themeColors.text },
        props.style
      ]}
    />
  );
}
