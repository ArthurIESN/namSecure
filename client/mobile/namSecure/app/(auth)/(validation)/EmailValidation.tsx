import React, {ReactElement, useEffect} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import ConfirmationCodeField from "@/components/ui/fields/ConfirmationCodeField";
import {api, EAPI_METHODS} from "@/utils/api/api";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/provider/AuthProvider";

const CODE_FIELD_LENGTH = 6;

export default function EmailValidation(): ReactElement
{
    const [emailError, setEmailError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const { refreshUser, user } = useAuth();

    const handleVerify = async (code: string): Promise<void> =>
    {
        setEmailError(null);
        const response = await api('auth/register/email-validation', EAPI_METHODS.POST, { code });
        if (response.error)
        {
            setEmailError(response.errorMessage || 'Email verification failed');
            return;
        }

        await refreshUser();
    }

    useEffect(() =>
    {
            loadEmail();
    }, []);

    const loadEmail = async() =>
    {
        const response = await api('auth/register/email-validation', EAPI_METHODS.GET);
        if (response.error)
        {
            setEmailError(response.errorMessage || 'Failed to load email validation status');
            return;
        }

        setIsLoading(false);
    }

    if(isLoading)
    {
        return(
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.emailContainer}>
                <View style={styles.emailInfoContainer}>
                    <IconSymbol name={"envelope.fill"} size={192} color={"black"} />
                    <Text style={styles.confirmation}>Confirmation is required</Text>
                    <View>
                        <View style={styles.emailTextContainer}>
                            <Text>A 6-digit code has been sent at</Text>
                            <Text style={ styles.emailAddress}>{user!.email}</Text>
                        </View>
                        {emailError && (
                            <Text style={styles.errorText}>{emailError}</Text>
                        )}
                    </View>

                </View>
                <ConfirmationCodeField
                    length={6}
                    onComplete={handleVerify}
                    resetTrigger={emailError !== null}
                />
            </View>
        </SafeAreaView>
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
        top: 30,
        alignSelf: "center"
    },
    emailContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        bottom: 80
    },
    confirmation:
        {
            fontSize: 20,
            fontWeight: "600",
            marginVertical: 20,
            textAlign: "center"
        },
    emailTextContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    emailAddress: {
        fontWeight: 'bold',
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
        top: 60,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "red",
        fontSize: 14
    },


});