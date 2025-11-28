import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import Map from "@/components/map/Map";
import React, {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/provider/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth.ts";
import {BlurView} from "expo-blur";

const {width} = Dimensions.get("window");

type TabType = 'profil' | 'groups' | 'update';

export default function ProfilPage() {
    const {user, refreshUser, logout} = useAuth()
    const [activeTab, setActiveTab] =  useState<TabType>('profil');

    const tabs = [
        {id: 'profil', title: 'My profil'},
        {id: 'groups', title: 'Groups'},
    ];

    const handleLogout =  () =>
    {
        logout();
    }

    if(!user){
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profil':
                return (
                    <View>
                        <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10, width: width * 0.8}}>
                            <Text style={{fontWeight:'bold'}}>Email</Text>
                            <Text style={{paddingTop:5, color:'#797979'}}>{user.email}</Text>
                            <Text style={{fontWeight:'bold', paddingTop:15}}>Address</Text>
                            <Text style={{paddingTop:5}}>{user.address}</Text>
                        </View>

                        <TouchableOpacity style={{
                            width: 'auto',
                            borderRadius:5,
                            height:35,
                            justifyContent:'center',
                            backgroundColor:'white',
                            marginTop:10,
                        }}
                        key={'update'}
                        onPress={() => setActiveTab("update" as TabType)}
                        >
                            <Text style={{paddingLeft:10}}>Edit my profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            width: 'auto',
                            borderRadius:5,
                            height:35,
                            justifyContent:'center',
                            backgroundColor:'#EE5C63',
                            opacity:0.85,
                            marginTop:10,
                        }}
                        onPress={() => handleLogout()}
                        >
                            <Text style={{paddingLeft:10}}>Log Out</Text>
                        </TouchableOpacity>
                    </View>

                );
            case 'groups':
                const groupPicture = require('@/assets/images/groupFriendPictureHolder.jpg');
                const groups = [
                    {
                        id: 1,
                        name: 'Le copain d\'abord',
                        participants: [
                            { id: 1, photoUrl: groupPicture },
                            { id: 2, photoUrl: groupPicture },
                            { id: 3, photoUrl: groupPicture },
                            { id: 4, photoUrl: groupPicture },
                            { id: 5, photoUrl: groupPicture },
                        ],
                        hasQuitButton: true
                    },
                    {
                        id: 2,
                        name: 'Famille',
                        participants: [
                            { id: 1, photoUrl: groupPicture },
                            { id: 2, photoUrl: groupPicture },
                        ],
                        hasQuitButton: false
                    },
                ];

                const renderParticipants = (participants: any[]) => {
                    const maxVisible = 3;
                    const visibleParticipants = participants.slice(0, maxVisible);
                    const remainingCount = participants.length - maxVisible;

                    return (
                        <View style={styles.participantsContainer}>
                            {visibleParticipants.map((participant, index) => (
                                <Image
                                    key={participant.id}
                                    source={participant.photoUrl}
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
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}>
                            {groups.map((group) => (
                                <View key={group.id} style={styles.box}>
                                    <View style={styles.flexBox}>
                                        <Text style={styles.groupName}>{group.name}</Text>
                                        {renderParticipants(group.participants)}
                                    </View>
                                    <View style={styles.flexBox}>
                                        {group.hasQuitButton ? (
                                            <>
                                                <TouchableOpacity style={[styles.redButton, styles.redButtonDual]}>
                                                    <Text>Delete</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.blueButton, styles.redButtonDual]}>
                                                    <Text>Manage</Text>
                                                </TouchableOpacity>
                                            </>
                                        ) : (
                                            <TouchableOpacity style={[styles.redButton, styles.redButtonSolo]}>
                                                <Text>Quit</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                                <TouchableOpacity style={styles.createGroupButton}>
                                    <Text style={styles.createGroupButtonText}>Create New Group</Text>
                                </TouchableOpacity>
                        </ScrollView>
                    </View>
                );

            case 'update':
                return (
                    <View>
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
        width: '100%',
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