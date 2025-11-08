import React, {ReactElement, useEffect, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import * as ImagePicker from 'expo-image-picker';
import Button from "@/components/ui/buttons/Button";
import {api, EAPI_METHODS} from "@/utils/api/api";
import { IIdValidationStatus } from "@namSecure/shared/types/auth/auth";

export default function EmailValidation(): ReactElement
{

    const [idError, setIdError] = useState<string | null>(null);
    const [idStatus, setIdStatus] = useState<IIdValidationStatus | null>(null);
    const [frontImage, setFrontImage] = useState<string | null>(null);
    const [backImage, setBackImage] = useState<string | null>(null);

    const pickImage = async (imageType: 'front' | 'back') =>
    {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled)
        {
            if (imageType === 'front')
            {
                setFrontImage(result.assets[0].uri);
            } else
            {
                setBackImage(result.assets[0].uri);
            }
            setIdError(null);
        }
    };

    const uploadImages = async () =>
    {
        if (!frontImage || !backImage)
        {
            setIdError("Please select both front and back images.");
            return;
        }

        try
        {
            const formData = new FormData();
            formData.append('front_id_card',
            {
                uri: frontImage,
                name: 'front_id_card.jpg',
                type: 'image/jpeg'
            } as any);

            formData.append('back_id_card',
            {
                uri: backImage,
                name: 'back_id_card.jpg',
                type: 'image/jpeg'
            } as any);

            const response = await api('auth/register/id-validation', EAPI_METHODS.POST, formData);

            if (response.error)
            {
                setIdError(response.errorMessage || 'ID upload failed');
                return;
            }

            // refresh status
            void loadIDStatus();
        } catch (error)
        {
            setIdError('An unexpected error occurred during upload.');
            console.error(error);
        }
    }

    const loadIDStatus = async() =>
    {
        const response = await api('auth/register/id-validation', EAPI_METHODS.GET);

        if (response.error)
        {
            setIdError(response.errorMessage || 'Failed to load ID validation status');
            return;
        }

        setIdStatus(response.data);
    }


    useEffect(() =>
    {
        void loadIDStatus();
    }, []);

    useEffect(() =>
    {

        if(idStatus && idStatus.isRejected)
        {
            setIdError(idStatus.message);
        }
    }, [idStatus]);

    if(!idStatus)
    {
        return(
            <SafeAreaView style={styles.container}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    function renderIdPending()
    {
        return(
            <View style={styles.container}>
                <Text>Your ID validation is pending. Please wait for approval.</Text>
            </View>
        );
    }

    function renderIdRequest()
    {
        return(
            <View style={styles.imagesContainer}>
                <Text style={styles.instructionText}>Upload both front and back of your ID Card</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={() => pickImage('front')}
                    >
                        {frontImage ? (
                            <Image source={{ uri: frontImage }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <IconSymbol name="camera" size={60} color="#666" />
                                <Text style={styles.placeholderText}>Front</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.imageButton}
                        onPress={() => pickImage('back')}
                    >
                        {backImage ? (
                            <Image source={{ uri: backImage }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <IconSymbol name="camera" size={60} color="#666" />
                                <Text style={styles.placeholderText}>Back</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                <View style={{marginTop: 20 }}>
                    <Button
                        onPress={uploadImages}
                        title={"Upload ID Card"}
                        disabled={!frontImage || !backImage}
                    />
                </View>

            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.namSecure}>NamSecure</Text>
            </View>
            <View style={styles.emailContainer}>
                <View style={styles.idInfoContainer}>
                    <IconSymbol name={"person.text.rectangle"} size={192} color={"black"} />
                    {idError && (
                        <Text style={styles.errorText}>{idError}</Text>
                    )}
                    <Text style={styles.confirmation}>ID card is required</Text>

                    {idStatus.isPending && renderIdPending()}
                    {!idStatus.isPending && renderIdRequest()}
                </View>
            </View>
        </SafeAreaView>
    )
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
        marginBottom: 32,
        alignSelf: "center"
    },
    emailContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    confirmation: {
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 20,
        textAlign: "center"
    },
    idInfoContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    imagesContainer: {
        alignItems: "center",
        width: '100%',
    },
    instructionText: {
        textAlign: "center",
        marginVertical: 15,
        fontSize: 16,
    },
    imageButton: {
        width: 250,
        height: 180,
        borderWidth: 2,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    scrollContainer: {
        paddingHorizontal: 10,
        gap: 20,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 8,
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    uploadButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
    },
    uploadButtonDisabled: {
        backgroundColor: '#ccc',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    errorText: {
        textAlign: "center",
        color: "red",
        fontSize: 14
    },
});