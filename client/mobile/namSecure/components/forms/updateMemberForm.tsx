import {Controller, useForm} from "react-hook-form"
import {z} from 'zod';
import {useAuth} from "@/providers/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth";
import {useEffect, useState} from "react";
import {Alert, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import Text from '@/components/ui/Text';
import {api, EAPI_METHODS} from "@/utils/api/api";
import TextInputField from "@/components/ui/fields/TextInputField";

const updateSchema = z.object({
    email: z.string().email('invalid email'),
    address: z.string().min(10, 'address too short'),
    password: z.string().optional(),
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


interface UpdateMemberFormProps {
    profilePhoto: {uri: string, fileName: string, type: string, fileSize?: number, isExisting?: boolean} | null;
}

export default function UpdateMemberForm({profilePhoto}: UpdateMemberFormProps) {
    const {user, refreshUser, logout} : {user: IAuthUserInfo, refreshUser: () => Promise<void>, logout: () => Promise<void>} = useAuth()
    const[existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
    const[initialEmail, setInitialEmail] = useState<string>('');

    const{
        control,
        handleSubmit,
        formState: {errors},
        watch,
        reset
    } = useForm<UpdateMemberForm>({
        defaultValues : {
            email: '',
            address: '',
            profilePhoto: null,
        },
    });

    const currentEmail = watch('email');
    const emailHasChanged = currentEmail !== initialEmail && initialEmail !== '';

    useEffect(() => {
        setInitialEmail(user.email);
        reset({
            email: user.email,
            address: user.address,
            password: '',
        });

        if(user.photoPath){
            setExistingPhotoUrl(user.photoPath);
        }
    }, [user,reset]);

    const onSubmit = async (data: UpdateMemberForm) => {
        try{
            if(emailHasChanged){
                if(!data.password || data.password.trim() === ''){
                    Alert.alert('Info', 'Password is required to change your email');
                    return;
                }

                const response = await api('member/email', EAPI_METHODS.PUT, {
                    new_email: data.email,
                    password: data.password,
                });

                if(response.error){
                    console.error("Error changing email:", response.errorMessage);
                    Alert.alert('Error', response.errorMessage || 'Failed to change email. Please try again.');
                    return;
                }

                Alert.alert(
                    'Email Changed',
                    'Your email has been updated successfully. You will be logged out. Please log in again with your new email.',
                    [
                        {
                            text: 'OK',
                            onPress: async () => {
                                await  logout();
                            }
                        }
                    ]
                );
                return;
            }

            const formData = new FormData();
            formData.append('address', data.address);

            if(profilePhoto && !profilePhoto.isExisting){
                formData.append('profilePhoto', {
                    uri: profilePhoto.uri,
                    name: profilePhoto.fileName,
                    type: profilePhoto.type,
                } as any);

            }
            else if(profilePhoto === null && existingPhotoUrl){
                formData.append('removePhoto', 'true');
            }

            const response = await api('member/profile', EAPI_METHODS.PUT, formData);

            if(response.error){
                console.error("Error response from API:", response.errorMessage);
                Alert.alert('Erreur', response.errorMessage || 'An error occurred. Please try again.');
                return;
            }

            const result = response.data;

            await refreshUser();

            if(result.member.photoPath){
                setExistingPhotoUrl(`http://${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}${result.member.photo_path}`);
            }else{
                setExistingPhotoUrl(null);
            }

            Alert.alert('Success', 'Profile updated successfully!');

        }catch (error) {
            console.error("Error updating member:", error);
            Alert.alert('Erreur', 'Network error. Please try again.');
        }
    }

    return (
        <ScrollView style={{height:'70%'}}
                showsVerticalScrollIndicator={false}
            >
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Email</Text>
                            <TextInputField
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

                {emailHasChanged && (
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ marginBottom: 20 }}>
                                <Text style={styles.label}>Password (Required for email change)</Text>
                                <TextInputField
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    placeholder="Enter your password"
                                    style={{
                                        borderWidth: 1,
                                        borderColor: errors.password ? '#ef4444' : '#e5e7eb',
                                        borderRadius: 8,
                                        padding: 12,
                                    }}
                                />
                                {errors.password && (
                                    <Text style={styles.errorText}>{errors.password.message}</Text>
                                )}
                            </View>
                        )}
                    />
                )}

                <Controller
                    control={control}
                    name="address"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.label}>Adresse</Text>
                            <TextInputField
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
    label: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    errorText: { color: '#ef4444', fontSize: 14, marginTop: 8 },
    submitButton: {
        backgroundColor: '#53c978',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});