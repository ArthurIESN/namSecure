import {View, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Alert} from "react-native";
import Text from '@/components/ui/Text';
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/providers/AuthProvider";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import UpdateMemberForm from "@/components/forms/updateMemberForm";
import { router } from "expo-router";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { ITeam } from "@namSecure/shared/types/team/team";
import type { ITeamMember } from "@namSecure/shared/types/team_member/team_member";
import LogoutButton from "@/components/profil/LogoutButton";
import ProfileButton from "@/components/profil/ProfileButton";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import BiometricButton from "@/components/profil/biometric/BiometricButton";
import TwoFactorButton from "@/components/profil/twoFactor/twoFactorButton";
import { BlurView } from "expo-blur";
import { useMap } from '@/providers/MapProvider';
import { useWebSocket } from '@/providers/WebSocketProvider';
import * as ImagePicker from 'expo-image-picker';
import GlassedView from "@/components/glass/GlassedView";
import { Host, Picker } from '@expo/ui/swift-ui';

const PP_PLACEHOLDER = require('@/assets/images/PP_Placeholder.png');

const {width} = Dimensions.get("window");

type TabType = 'profil' | 'groups' | 'update';

export default function ProfilPage() {
    const {user} = useAuth()
    const { mapScreenshot } = useMap();
    const { leaveTeam } = useWebSocket();

    const [activeTab, setActiveTab] =  useState<TabType>('profil');
    const [updateTab, setUpdateTab] = useState<boolean>(false);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState<{uri: string, fileName: string, type: string, fileSize?: number, isExisting?: boolean} | null>(null);

    const fetchUserTeams = async () => {
        if (!user) return;

        try {
            setLoadingTeams(true);
            const response = await api<ITeam[]>(
                'team/me?limit=50&offset=0',
                EAPI_METHODS.GET
            );

            if (!response.error && response.data) {
                const teamsWithMembers = await Promise.all(
                    response.data.map(async (team) => {
                        const detailResponse = await api<ITeam & { team_member: ITeamMember[] }>(
                            `team/${team.id}`,
                            EAPI_METHODS.GET
                        );
                        return {
                            ...team,
                            team_member: detailResponse.error ? [] : detailResponse.data?.team_member || []
                        };
                    })
                );
                const acceptedTeams = teamsWithMembers.filter(team => {
                    const currentUserMembership = team.team_member?.find(
                        (tm: ITeamMember) => tm.id_member === user.id
                    );
                    return currentUserMembership?.accepted === true;
                });

                setTeams(acceptedTeams);
            }
        } catch (err) {
            console.error("Failed to fetch teams:", err);
        } finally {
            setLoadingTeams(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'groups') {
            fetchUserTeams();
        }
    }, [activeTab]);

    if(!user) return null;

    const handleDeleteTeam = (teamId: number, teamName: string) => {
        Alert.alert(
            "Delete Group",
            `Are you sure you want to delete the group "${teamName}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoadingTeams(true);
                            const response = await api(
                                `team/${teamId}`,
                                EAPI_METHODS.DELETE
                            );

                            if (response.error) {
                                Alert.alert("Error", `Failed to delete group: ${response.errorMessage}`);
                            } else {
                                setTeams(teams.filter(team => team.id !== teamId));
                                leaveTeam(teamId);
                                Alert.alert("Success", "Group deleted successfully!");
                            }
                        } catch (err: any) {
                            console.error("Failed to delete team:", err);
                            Alert.alert("Error", err.message || "An unexpected error occurred");
                        } finally {
                            setLoadingTeams(false);
                        }
                    }
                }
            ]
        );
    };

    const handleQuitTeam = (teamId: number, teamName: string) => {
        const team = teams.find(t => t.id === teamId);
        const teamMember = team?.team_member?.find(
            (tm: ITeamMember) => tm.id_member === user.id
        );

        if (!teamMember || !teamMember.id) {
            Alert.alert("Error", "Unable to find your membership in this group");
            return;
        }
        Alert.alert(
            "Quit Group",
            `Are you sure you want to quit the group "${teamName}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setLoadingTeams(true);
                            const response = await api(
                                `team-member/${teamMember.id}`,
                                EAPI_METHODS.DELETE
                            );

                            if (response.error) {
                                Alert.alert("Error", `Failed to quit group: ${response.errorMessage}`);
                            } else {
                                setTeams(teams.filter(team => team.id !== teamId));
                                leaveTeam(teamId);
                                Alert.alert("Success", "You have left the group!");
                            }
                        } catch (err: any) {
                            console.error("Failed to quit team:", err);
                            Alert.alert("Error", err.message || "An unexpected error occurred");
                        } finally {
                            setLoadingTeams(false);
                        }
                    }
                }
            ]
        );
    };

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
                    `La photo fait ${(asset.fileSize / 1024 / 1024).toFixed(2)} MB. Maximum autorisé : 5 MB`
                );
                return;
            }

            setProfilePhoto({
                uri: asset.uri,
                fileName: asset.fileName || `photo-${Date.now()}.jpg`,
                type: asset.mimeType || 'image/jpeg',
                fileSize: asset.fileSize || 0,
                isExisting: false,
            });
        }
    };

    const getPhotoUrl = (photoPath: string | null) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http')) return photoPath;
        if (!user.photoPath) return null;

        const baseUrl = user.photoPath.substring(0, user.photoPath.lastIndexOf('/'));
        return `${baseUrl}/${photoPath}`;
    };

    const renderContent = () => {
        if(activeTab === 'profil'){
            if(updateTab){
                return (
                    <View style={{width: width * 0.8}}>
                        <View style={{width:'100%'}}>
                            <TouchableOpacity onPress={() => setUpdateTab(false)}>
                                <IconSymbol name={"chevron.left"} size={25} color={"black"}></IconSymbol>
                            </TouchableOpacity>
                            <UpdateMemberForm profilePhoto={profilePhoto}></UpdateMemberForm>
                        </View>
                    </View>

                )
            }
            return (
                <View>
                    <TouchableOpacity onPress={() => setUpdateTab(true)} style={{borderRadius: 10, overflow: 'hidden', width: width * 0.8, marginBottom: 20}}>
                        <GlassedView
                            color="FFFFFF10"
                            isInteractive={true}
                            glassEffectStyle="clear"
                            intensity={50}
                            tint="default"
                            style={{padding: 20, borderRadius: 10}}
                        >
                            <View style={{marginBottom: 18}}>
                                <Text style={{fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5}}>Email</Text>
                                <Text style={{paddingTop: 8, fontSize: 15, fontWeight: '500'}}>{user.email}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 12, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5}}>Address</Text>
                                <Text style={{paddingTop: 8, fontSize: 15, fontWeight: '500'}}>{user.address}</Text>
                            </View>
                        </GlassedView>
                    </TouchableOpacity>

                    <BiometricButton />
                    <TwoFactorButton />
                    <View style={{ marginTop: 60 }}>
                        <LogoutButton />
                    </View>
                </View>

            );
        }else {
            const renderGroupMembers = (teamMembers: any[]) => {
                const maxVisible = 3;
                const visibleParticipants = teamMembers.slice(0, maxVisible);
                const remainingCount = teamMembers.length - maxVisible;

                return (
                    <View style={styles.participantsContainer}>
                        {visibleParticipants.map((teamMember, index) => {
                            const photoUrl = getPhotoUrl(teamMember.member?.photo_path);
                            return (
                                <Image
                                    key={teamMember.id}
                                    source={photoUrl ? { uri: photoUrl } : PP_PLACEHOLDER}
                                    style={[styles.participantImage, { marginLeft: index > 0 ? -10 : 0 }]}
                                />
                            );
                        })}
                        {remainingCount > 0 && (
                            <View style={[styles.remainingCount, { marginLeft: -10 }]}>
                                <Text style={styles.remainingCountText}>+{remainingCount}</Text>
                            </View>
                        )}
                    </View>
                );
            };

            const canCreateGroup = teams.length < 2;

            return (
                <View>
                    {loadingTeams ? (
                        <ActivityIndicator size="large" color="#0088FF" style={{ marginTop: 20 }} />
                    ) : (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}>
                            {teams.map((team) => {
                                const isAdmin = team.id_admin === user.id;
                                return (
                                    <View key={team.id} style={styles.cardContainer}>
                                        <GlassedView
                                            color="FFFFFF15"
                                            isInteractive={true}
                                            glassEffectStyle="regular"
                                            intensity={50}
                                            tint="default"
                                            style={styles.box}
                                        >
                                            <View style={styles.flexBox}>
                                                <Text style={styles.groupName}>{team.name}</Text>
                                                {team.team_member && renderGroupMembers(team.team_member)}
                                            </View>
                                            <View style={styles.flexBox}>
                                                {isAdmin ? (
                                                    <>
                                                        <View style={styles.groupButtonContainer}>
                                                            <GlassedProfileButton
                                                                label="Delete"
                                                                onPress={() => handleDeleteTeam(team.id, team.name)}
                                                                variant="danger"
                                                            />
                                                        </View>
                                                        <View style={styles.groupButtonContainer}>
                                                            <GlassedProfileButton
                                                                label="Manage"
                                                                onPress={() => router.push(`/(app)/(profil)/groupManagement?groupId=${team.id}`)}
                                                                variant="primary"
                                                            />
                                                        </View>
                                                    </>
                                                ) : (
                                                    <View style={{flex: 1}}>
                                                        <GlassedProfileButton
                                                            label="Quit Group"
                                                            onPress={() => handleQuitTeam(team.id, team.name)}
                                                            variant="danger"
                                                        />
                                                    </View>
                                                )}
                                            </View>
                                        </GlassedView>
                                    </View>
                                );
                            })}
                            <GlassedProfileButton
                                label={canCreateGroup ? 'Create New Group' : 'Maximum groups reached (2/2)'}
                                onPress={() => router.push('/(app)/(profil)/groupManagement')}
                                variant="success"
                                disabled={!canCreateGroup}
                            />
                        </ScrollView>
                    )}
                </View>
            );
        }
    }

    return (
        <View style={styles.mainContainer}>
            {mapScreenshot && (
                <BlurView intensity={25} style={styles.backgroundMap}>
                    <Image source={{ uri: mapScreenshot }} style={styles.backgroundMap} />
                </BlurView>
            )}
            <SafeAreaView style={styles.contentContainer}>
                <TouchableOpacity
                    disabled={!updateTab}
                    onPress={updateTab ? pickImage : undefined}
                    style={{position: 'relative', marginTop: 20}}
                >
                    <Image
                        style={{width: 225, height: 225, borderRadius: 112.5}}
                        source={profilePhoto ? {uri: profilePhoto.uri} : (user.photoPath ? {uri: user.photoPath} : PP_PLACEHOLDER)}
                    />
                    {updateTab && (
                        <View style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            backgroundColor: '#0088FF',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 3,
                            borderColor: 'white',
                        }}>
                            <IconSymbol name="camera.fill" size={24} color="white" />
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={{marginTop : 15, fontWeight: "bold"}}>{user.firstName} {user.lastName}</Text>

                <View style={{ width: '80%', marginVertical: 15 }}>
                    <Host matchContents>
                        <Picker
                            options={['My Profile', 'Groups']}
                            selectedIndex={activeTab === 'profil' ? 0 : 1}
                            onOptionSelected={({ nativeEvent: { index } }) => {
                                setActiveTab(index === 0 ? 'profil' : 'groups');
                            }}
                            variant="segmented"
                        />
                    </Host>
                </View>

                <View style={{marginTop : 20}}>
                    {renderContent()}
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%'
    },

    backgroundMap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 1,
        zIndex: -1,
    },

    contentContainer :  {
        flex: 1,
        alignItems: 'center',
    },

    cardContainer: {
        marginTop: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },

    box: {
        width: 300,
        height: 125,
        borderRadius: 15,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    flexBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },

    groupButtonContainer: {
        flex: 1,
        marginHorizontal: 5,
    },

    groupName: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        marginLeft : 15,
        color: '#ffffff',
    },

    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    participantImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'white',
    },

    remainingCount: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#0088FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    remainingCountText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0088FF',
    },


});

