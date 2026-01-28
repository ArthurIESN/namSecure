import React, { ReactElement } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import GlassedView from '@/components/glass/GlassedView';
import { useTheme } from '@/providers/ThemeProvider';

interface GlassedInputProps {
    label?: string;
    value: string;
    onBlur: () => void;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function GlassedInput({
    label,
    value,
    onBlur,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
}: GlassedInputProps): ReactElement {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';
    const dynamicStyles = createStyles(colorScheme);

    return (
        <View style={{ marginBottom: 20 }}>
            <GlassedView
                color={isDark ? "FFFFFF15" : "00000010"}
                isInteractive={false}
                glassEffectStyle="clear"
                intensity={40}
                tint="default"
                style={{ borderRadius: 8, overflow: 'hidden' }}
            >
                <TextInput
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? "#ffffff80" : "#00000050"}
                    secureTextEntry={secureTextEntry}
                    style={dynamicStyles.input}
                    cursorColor={'red'}
                    selectionColor={isDark ? "#ffffff40" : "#00000020"}
                />
            </GlassedView>
        </View>
    );
}

const createStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
    input: {
        padding: 12,
        fontSize: 15,
        color: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
});
