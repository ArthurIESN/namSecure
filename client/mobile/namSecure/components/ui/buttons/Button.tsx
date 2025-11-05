import React, { ReactElement } from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {IButtonProps} from "@/types/components/ui/button/button";
import {styles} from "@/styles/components/ui/buttons/button";



export default function Button(props: IButtonProps): ReactElement
{
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: props.backgroundColor ? props.backgroundColor : '#000' },
                props.disabled && styles.buttonDisabled
            ]}
            onPress={props.disabled ? undefined : props.onPress}
            disabled={props.disabled}
        >
            <Text
                style={[
                    styles.text,
                    { color: props.textColor ? props.textColor : '#fff' },
                    props.disabled && styles.textDisabled
                ]}
            >{props.title}</Text>
        </TouchableOpacity>
    );
}

