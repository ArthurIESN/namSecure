import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, Alert} from "react-native";
import Map from "@/components/map/Map";
import {useState, useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/providers/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth";
import {BlurView} from "expo-blur";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import UpdateMemberForm from "@/components/forms/updateMemberForm";
import { router } from "expo-router";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { ITeam } from "@namSecure/shared/types/team/team";
import LogoutButton from "@/components/profil/LogoutButton";
import BiometricButton from "@/components/profil/biometric/BiometricButton";
import TwoFactorButton from "@/components/profil/twoFactor/twoFactorButton";


const {width} = Dimensions.get("window");

type TabType = 'profil' | 'groups' | 'update';

export default function ProfilPage() {
    const {user} : {user: IAuthUserInfo} = useAuth()

    if(!user) return;

    const [activeTab, setActiveTab] =  useState<TabType>('profil');
    const [updateTab, setUpdateTab] = useState<boolean>(false);
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [loadingTeams, setLoadingTeams] = useState(false);

    console.log("Ceci est l'image : ",user.photoPath);
    console.log(user.photoName);
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
                'team/me/teams?limit=50',
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
                                `teamMember/${teamId}/${user.id}`,
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

                return (
                    <View style={styles.participantsContainer}>
                        {visibleParticipants.map((teamMember, index) => (
                            <Image
                                key={teamMember.id}
                                source={{ uri: teamMember.member?.photo_path || 'https://via.placeholder.com/30' }}
                                style={[styles.participantImage, { marginLeft: index > 0 ? -10 : 0 }]}
                            />
                        ))}
                        {remainingCount > 0 && (
                            <View style={[styles.remainingCount, { marginLeft: -10 }]}>
                                <Text style={styles.remainingCountText}>+{remainingCount}</Text>
                            </View>
                        )}
                    </View>
                );
            };

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
                                style={styles.createGroupButton}
                                onPress={() => router.push('/(app)/(profil)/groupManagement')}
                            >
                                <Text style={styles.createGroupButtonText}>Create New Group</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            );
        }
    }


    return (
        <View style={styles.container}>
            <BlurView intensity={25} style={styles.backgroundMap}>
                <Map
                    isBackground={true}
                    style={styles.backgroundMap}
                />
            </BlurView>
            <SafeAreaView style={styles.content}>
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
    container: {
        flex: 1,
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

    content :  {
        flex : 1,
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

    group: {
        alignItems: 'center',
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

    createGroupButtonText: {
        color: 'white',
        fontWeight: '600',
    }

});

