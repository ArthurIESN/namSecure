import React, {ReactElement, useEffect} from 'react';
import {Platform, Text, View, StyleSheet, TextInput} from "react-native";
import TextInputField from "@/components/ui/fields/TextInputField";
import Button from "@/components/ui/buttons/Button";
import Separator from "@/components/ui/separators/Separator";
import ButtonAppleConnect from "@/components/ui/buttons/ButtonAppleConnect";
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";

const CODE_FIELD_LENGTH = 6;

export default function EmailVerification(): ReactElement
{
    const [code, setCode] = React.useState<string>("");
    const [emailError, setEmailError] = React.useState<string | null>(null);

    const ref = useBlurOnFulfill({ value: code, cellCount: CODE_FIELD_LENGTH });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    useEffect((): void =>
    {
        if (code.length === CODE_FIELD_LENGTH)
        {
            handleVerify();
        }
    }, [code]);

    const handleVerify = async (): Promise<void> =>
    {
        // Implement verification logic here
        console.debug("Verifying code:", code);
    }

    return(
        <View style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.emailContainer}>
                <View style={styles.emailInfoContainer}>
                    <IconSymbol name={"envelope.fill"} size={192} color={"black"} />
                    <Text>Confirmation is required</Text>
                    <Text>A 6-digit code has been sent at example@mail.com </Text>
                    {emailError && (
                        <Text style={styles.errorText}>{emailError}</Text>
                    )}
                </View>
                <CodeField
                    ref={ref}
                    {...props}
                    value={code}
                    onChangeText={setCode}
                    InputComponent={TextInput}
                    cellCount={CODE_FIELD_LENGTH}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="default"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
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
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 16,
        marginHorizontal: 8,
    },
    namSecure: {
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        position: "absolute",
        top: 120,
        alignSelf: "center"
    },
    emailContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        bottom: 80
    },
    emailInfoContainer: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 60
    },
    emailText: {
        textAlign: "center",
        marginVertical: 5
    },
    errorText: {
        position: "absolute",
        top: 180,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "red",
        fontSize: 14
    },
    cell: {
        width: 40,
        height: 50,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 1,
        borderColor: '#00000030',
        textAlign: 'center',
        borderRadius: 8,
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    focusedCell: {
        borderColor: '#000',
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
    },
    codeFieldRoot: {
        marginTop: 20,
        width: 280,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});