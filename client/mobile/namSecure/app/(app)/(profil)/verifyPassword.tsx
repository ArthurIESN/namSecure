import {View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from "react-native";
import Text from "@/components/ui/Text";
import TextInputField from "@/components/ui/fields/TextInputField";
import Button from "@/components/ui/buttons/Button";
import ErrorMessageContainer from "@/components/ui/error/ErrorMessageContainer";
import {useTheme} from "@/providers/ThemeProvider";
import {Colors} from "@/constants/theme";
import {useState} from "react";
import {api, EAPI_METHODS} from "@/utils/api/api";
import {router, useLocalSearchParams} from "expo-router";


export default function VerifyPassword()
{
    const {colorScheme} = useTheme();
    const colors = Colors[colorScheme];

    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();

    console.log("params", params);

    const handleVerify = async () => {
        setError(null);

        if (!password.trim())
        {
            setError("Password is required");
            return;
        }

        setIsLoading(true);

        try
        {
            const response = await api("member/password/verify", EAPI_METHODS.POST,
            {
                password
            });

            setIsLoading(false);

            if (response.error)
            {
                setError(response.errorMessage || "Invalid password");
                return;
            }

            router.push(
            {
                pathname: (params.fromURL as string),
                params: { passwordVerified: "true", password: password }
            });

        } catch (err) {
            setIsLoading(false);
            setError("An error occurred. Please try again.");
            console.error("Password verification error:", err);
        }
    };

    const handleCancel = () => {
        router.back();
        // Return false (cancelled)
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Text style={[styles.backButtonText, {color: colors.text}]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.title, {color: colors.text}]}>Verify Password</Text>
                <View style={{width: 40}} />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            >
                <View style={styles.formContainer}>
                    <Text style={[styles.subtitle, {color: colors.text}]}>
                        Enter your password to enable biometric authentication
                    </Text>

                    <TextInputField
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        editable={!isLoading}
                    />

                    {error && <ErrorMessageContainer message={error} />}

                    <Button
                        title="Verify"
                        onPress={handleVerify}
                        loading={isLoading}
                        loadingText="Verifying..."
                        disabled={isLoading}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    formContainer: {
        gap: 16,
    },
    subtitle: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
});
