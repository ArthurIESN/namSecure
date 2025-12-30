import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Alert} from "react-native";
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/providers/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import UpdateMemberForm from "@/components/forms/updateMemberForm";
import { router } from "expo-router";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { ITeam } from "@namSecure/shared/types/team/team";
import type { ITeamMember } from "@namSecure/shared/types/team_member/team_member";
import LogoutButton from "@/components/profil/LogoutButton";
import BiometricButton from "@/components/profil/biometric/BiometricButton";
import TwoFactorButton from "@/components/profil/twoFactor/twoFactorButton";
import ChangePasswordButton from "@/components/profil/changePassword/ChangePasswordButton";
import Map from "@/components/map/Map";
import { BlurView } from "expo-blur";


const {width} = Dimensions.get("window");

type TabType = 'profil' | 'groups' | 'update';

export default function ProfilPage() {
    const {user} : {user: IAuthUserInfo} = useAuth()

    if(!user) return;

    const [activeTab, setActiveTab] =  useState<TabType>('profil');
    const [updateTab, setUpdateTab] = useState<boolean>(false);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);


    const tabs = [
        {id: 'profil', title: 'My profil'},
        {id: 'groups', title: 'Groups'},
    ];
    useEffect(() => {
        if (activeTab === 'groups') {
            fetchUserTeams();
        }
    }, [activeTab]);

    const fetchUserTeams = async () => {
        try {
            setLoadingTeams(true);
            const response = await api<ITeam[]>(
                'team/me?limit=50&offset=0',
                EAPI_METHODS.GET
            );

            if (!response.error && response.data) {
                setTeams(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch teams:", err);
        } finally {
            setLoadingTeams(false);
        }
    };


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

    const renderContent = () => {
        if(activeTab === 'profil'){
            if(updateTab){
                return (
                    <View style={{width: width * 0.8}}>
                        <View style={{width:'100%'}}>
                            <TouchableOpacity onPress={() => setUpdateTab(false)}>
                                <IconSymbol name={"chevron.left"} size={25} color={"black"}></IconSymbol>
                            </TouchableOpacity>
                            <UpdateMemberForm></UpdateMemberForm>
                        </View>
                    </View>

                )
            }
            return (
                <View>
                    <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10, width: width * 0.8}}>
                        <Text style={{fontWeight:'bold'}}>Email</Text>
                        <Text style={{paddingTop:5, color:'#797979'}}>{user.email}</Text>
                        <Text style={{fontWeight:'bold', paddingTop:15}}>Address</Text>
                        <Text style={{paddingTop:5}}>{user.address}</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: 20,
                            marginBottom: 10,
                            width: width * 0.8,
                            height: 40,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#0088FF',
                        }}
                        onPress={() => setUpdateTab(true)}
                    >
                        <Text style={{color: 'white', fontWeight: '600'}}>Update My Information</Text>
                    </TouchableOpacity>

                    <ChangePasswordButton />
                    <BiometricButton />
                    <TwoFactorButton />
                    <LogoutButton />
                </View>

            );
        }else {
            const renderGroupMembers = (teamMembers: any[]) => {
                const maxVisible = 3;
                const visibleParticipants = teamMembers.slice(0, maxVisible);
                const remainingCount = teamMembers.length - maxVisible;

                const getPhotoUrl = (photoPath: string | null) => {
                    //@todo mettre le placehoder de asset/image
                    if (!photoPath) return 'https://via.placeholder.com/30';
                    if (photoPath.startsWith('http')) return photoPath;
                    const baseUrl = user.photoPath.substring(0, user.photoPath.lastIndexOf('/uploads/profiles/'));
                    return `${baseUrl}/uploads/profiles/${photoPath}`;
                };

                return (
                    <View style={styles.participantsContainer}>
                        {visibleParticipants.map((teamMember, index) => {
                            const photoUrl = getPhotoUrl(teamMember.member?.photo_path);
                            return (
                                <Image
                                    key={teamMember.id}
                                    source={{ uri: photoUrl }}
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
                                    <View key={team.id} style={styles.box}>
                                        <View style={styles.flexBox}>
                                            <Text style={styles.groupName}>{team.name}</Text>
                                            {team.team_member && renderGroupMembers(team.team_member)}
                                        </View>
                                        <View style={styles.flexBox}>
                                            {isAdmin ? (
                                                <>
                                                    <TouchableOpacity
                                                        style={[styles.redButton, styles.redButtonDual]}
                                                        onPress={() => handleDeleteTeam(team.id, team.name)}
                                                    >
                                                        <Text>Delete</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.blueButton, styles.redButtonDual]}
                                                        onPress={() => router.push(`/(app)/(profil)/groupManagement?groupId=${team.id}`)}
                                                    >
                                                        <Text>Manage</Text>
                                                    </TouchableOpacity>
                                                </>
                                            ) : (
                                                <TouchableOpacity
                                                    style={[styles.redButton, styles.redButtonSolo]}
                                                    onPress={() => handleQuitTeam(team.id, team.name)}
                                                >
                                                    <Text>Quit</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                            <TouchableOpacity
                                style={[
                                    styles.createGroupButton,
                                    !canCreateGroup && styles.createGroupButtonDisabled
                                ]}
                                onPress={() => canCreateGroup && router.push('/(app)/(profil)/groupManagement')}
                                disabled={!canCreateGroup}
                            >
                                <Text style={[
                                    styles.createGroupButtonText,
                                    !canCreateGroup && styles.createGroupButtonTextDisabled
                                ]}>
                                    {canCreateGroup ? 'Create New Group' : 'Maximum groups reached (2/2)'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            );
        }
    }


    return (
        <View style={styles.mainContainer}>
            <BlurView intensity={25} style={styles.backgroundMap}>
                <Map
                    style={styles.backgroundMap}
                />
            </BlurView>
            <SafeAreaView style={styles.contentContainer}>
                <Image
                    style={{marginTop : 20,width: 225, height: 225, borderRadius: 112.5}}
                    source={{uri: user.photoPath}}
                />
                <Text style={{marginTop : 15, fontWeight: "bold"}}>{user.firstName} {user.lastName}</Text>

                <View style={{
                    flexDirection: 'row',
                    width : '80%',
                    borderBottomWidth: 2,
                    borderBottomColor: '#E0E0E0',
                }}>
                    {
                        tabs.map(tab => (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                    borderBottomWidth: 2,
                                    borderBottomColor: activeTab === tab.id ? '#0088FF' : 'transparent',
                                    marginBottom: -2
                                }}
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id as TabType)}
                            >
                                <Text style={{
                                    fontWeight: activeTab === tab.id ? "bold" : "normal"
                                }}>
                                    {tab.title}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
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

    box: {
        width: 300,
        height: 125,
        marginTop: 20,
        borderRadius: 15,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    flexBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },

    blueButton: {
        borderWidth: 2,
        padding: 7,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        margin: 10,
        borderColor: '#0088FF',
    },

    redButtonDual: {
        width: 120,
    },

    redButtonSolo: {
        width: 250,
    },

    redButton: {
        width: 120,
        borderWidth: 2,
        padding: 7,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        margin: 10,
        borderColor: '#ff4747',
    },

    groupName: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        marginLeft : 15,
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

    createGroupButton: {
        marginTop: 20,
        width: 300,
        height: 35,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0088FF',
    },

    createGroupButtonDisabled: {
        backgroundColor: '#CCCCCC',
        opacity: 0.6,
    },

    createGroupButtonText: {
        color: 'white',
        fontWeight: '600',
    },

    createGroupButtonTextDisabled: {
        color: '#666666',
    }

});

