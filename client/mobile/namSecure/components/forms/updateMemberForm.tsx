import {useForm, SubmitHandler, Controller} from "react-hook-form"
import { z } from 'zod';
import {useAuth} from "@/providers/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth.ts";
import {useEffect, useState} from "react";
import * as ImagePicker from 'expo-image-picker';
import {Alert, View,Text,Image,TouchableOpacity,StyleSheet,TextInput, ScrollView,SafeAreaView} from "react-native";

const updateSchema = z.object({
    email: z.string().email('invalid email'),
    address: z.string().min(10, 'address too short'),
    profilePhoto: z.object({
        uri: z.string(),
        fileName: z.string(),
        type: z.string(),
        fileSize: z.number().optional(),
        isExisting: z.boolean().optional(),
    }).nullable().refine(
        (photo) => !photo || !photo.fileSize || photo.fileSize <= 5
            * 1024 * 1024,
        { message: 'La photo ne doit pas dépasser 5 MB' }
    ),
});

type UpdateMemberForm = z.infer<typeof updateSchema>;


export default function UpdateMemberForm() {
    const {user} : {user: IAuthUserInfo} = useAuth()
    const[existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);

    const{
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        watch,
        reset
    } = useForm<UpdateMemberForm>({
        defaultValues : {
            email: '',
            address: '',
            profilePhoto: null,
        },
    });

    const profilePhoto = watch('profilePhoto');

    useEffect(() => {
        reset({
            email: user.email,
            address: user.address,
            profilePhoto: user.photoPath ? {
                uri : user.photoPath || '',
                fileName: user.photoName || '',
                type: 'image/jpeg',
                isExisting: true,
            } : null,
        });

        if(user.photoPath){
            setExistingPhotoUrl(user.photoPath);
        }
    }, []);

    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(status !== 'granted'){
            Alert.alert('Permission denied', 'Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if(!result.canceled){
            const asset = result.assets[0];
            const maxSize = 5 * 1024 * 1024;
            if (asset.fileSize && asset.fileSize > maxSize) {
                Alert.alert(
                    'Fichier trop volumineux',
                    `La photo fait ${(asset.fileSize / 1024 /
                        1024).toFixed(2)} MB. Maximum autorisé : 5 MB`
                );
                return;
            }

            setValue('profilePhoto', {
                uri: asset.uri,
                fileName: asset.fileName || `photo-${Date.now()}.jpg`,
                type: asset.mimeType || 'image/jpeg',
                fileSize: asset.fileSize || 0,
                isExisting:false,
            }, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: UpdateMemberForm) => {
        try{
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('address', data.address);
            if(data.profilePhoto && !data.profilePhoto.isExisting){
                formData.append('profilePhoto', {
                    uri: data.profilePhoto.uri,
                    name: data.profilePhoto.fileName,
                    type: data.profilePhoto.type,
                } as any);
            }
            console.log(formData); // @todo faire l'appel API pour mettre à jour le membre
        }catch (error) {
            console.error("Error updating member:", error);
        }
    }

    return (

            <ScrollView style={{height:'70%'}}
                showsVerticalScrollIndicator={false}
            >
                <Controller
                    control={control}
                    name="profilePhoto"
                    render={({ field }) => (
                        <View style={styles.photoContainer}>
                            <Text style={styles.label}>Photo de profil</Text>

                            {profilePhoto ? (
                                <View style={styles.imagePreview}>
                                    <Image source={{ uri: profilePhoto.uri }}
                                           style={styles.image} />
                                    <TouchableOpacity
                                        style={styles.removeButton}
                                        onPress={() => setValue('profilePhoto',
                                            null)}
                                    >
                                        <Text style={styles.removeButtonText}>✕</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.fileSizeText}>
                                        {(profilePhoto.fileSize / 1024 /
                                            1024).toFixed(2)} MB
                                    </Text>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.placeholder}
                                                  onPress={pickImage}>
                                    <Text style={styles.placeholderText}>+ Ajouter
                                        une photo</Text>
                                </TouchableOpacity>
                            )}

                            {errors.profilePhoto && (
                                <Text
                                    style={styles.errorText}>{errors.profilePhoto.message}</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{
                                    borderWidth: 1,
                                    borderColor: errors.email ? '#ef4444' : '#e5e7eb',
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            />
                            {errors.email && (
                                <Text style={styles.errorText}>{errors.email.message}</Text>
                            )}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Adresse</Text>
                            <TextInput
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                style={{
                                    borderWidth: 1,
                                    borderColor: errors.address ? '#ef4444' : '#e5e7eb',
                                    borderRadius: 8,
                                    padding: 12,
                                }}
                            />
                            {errors.address && (
                                <Text style={styles.errorText}>{errors.address.message}</Text>
                            )}
                        </View>
                    )}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles.submitButtonText}>Update</Text>
                </TouchableOpacity>
            </ScrollView>


    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    photoContainer: { marginBottom: 30, alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    imagePreview: { position: 'relative' },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 8
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ef4444',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: { color: 'white', fontSize: 18, fontWeight:
            'bold' },
    fileSizeText: { fontSize: 12, color: '#6b7280', textAlign:
            'center' },
    placeholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderStyle: 'dashed',
    },
    placeholderText: { color: '#9ca3af', fontSize: 14 },
    errorText: { color: '#ef4444', fontSize: 14, marginTop: 8 },
    submitButton: {
        backgroundColor: '#53c978',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight:
            '600' },
});