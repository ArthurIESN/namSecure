import { IConfirmationCodeFieldProps } from "@/types/components/ui/fields/confirmationCodeField";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
import React, { ReactElement, useEffect, useState } from "react";
import {Text, TextInput, View} from "react-native";
import { styles } from "@/styles/components/ui/fields/confirmationCodeField";

export default function ConfirmationCodeField(props: IConfirmationCodeFieldProps)
{
    const [code, setCode] = useState<string>("");

    const codeRef = useBlurOnFulfill({ value: code, cellCount: props.length });
    const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    const onCodeChange = (): void =>
    {
        if (code.length === props.length)
        {
            props.onComplete(code);
        }
    }

    const resetCode = (): void =>
    {
        setCode("");
    }

    useEffect((): void =>
    {
        onCodeChange();
    }, [code]);

    useEffect((): void =>
    {
        console.log(props.length);
        if(props.resetTrigger)
        {
            resetCode();
        }
    }, [props.resetTrigger]);

    return(
        <CodeField
            ref={codeRef}
            {...props}
            value={code}
            onChangeText={setCode}
            InputComponent={TextInput}
            cellCount={props.length}
            rootStyle={styles.codeFieldRoot}
            keyboardType="default"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }: {index: number, symbol: string, isFocused: boolean}): ReactElement  => (
                <View
                    key={index}
                    style={[styles.cell, isFocused && styles.focusedCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                >
                    <Text style={styles.cellText}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                </View>
            )}
        />
    )
}