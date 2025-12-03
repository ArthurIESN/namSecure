import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { useState, useEffect } from "react";
import CheckBox from "expo-checkbox";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { IMember } from "@namSecure/shared/types/member/member";
import { useAuth } from "@/provider/AuthProvider";
import { IAuthUserInfo } from "@/types/context/auth/auth";
import { router } from "expo-router";
import GlassedView from "@/components/glass/GlassedView";

export default function GroupManagement() {
    const { user }: { user: IAuthUserInfo } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [members, setMembers] = useState<IMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const response = await api<IMember[]>('member?limit=50&offset=0',
                EAPI_METHODS.GET);

            if (response.error) {
                setError(response.errorMessage || "Failed to load members");
            } else if (response.data) {
                // Exclure admin de la liste
                const membersWithoutCurrentUser = response.data.filter(member => member.id !== user.id);
                setMembers(membersWithoutCurrentUser);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const toggleMemberSelection = (memberId: number) => {
        setSelectedMembers(prev => {
            if (prev.includes(memberId)) {
                return prev.filter(id => id !== memberId);
            } else {
                if (prev.length >= 4) {
                    setError("You can only select up to 4 members");
                    return prev;
                }
                setError(null);
                return [...prev, memberId];
            }
        });
    };

    const handleCreateGroup = async () => {
        if (!user?.id) {
            setError("User not authenticated");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const teamPayload = {
                name: groupName,
                id_member: user.id,
                team_member: selectedMembers.map(id => ({
                    id_member: id,
                    accepted: false
                }))
            };

            const response = await api(
                'team',
                EAPI_METHODS.POST,
                teamPayload
            );

            if (response.error) {
                console.error("ERROR Response:", response.errorMessage);
                setError(response.errorMessage || "Failed to create group");
            } else {
                setGroupName("");
                setSelectedMembers([]);
                router.replace('/(app)/(profil)/profil');
            }
        } catch (err: any) {
            console.error("Failed to create group:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = members.filter(member =>
        `${member.first_name} ${member.last_name} ${member.address}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return(
        <View style={styles.content}>
            <Text style={styles.title}>New group</Text>

            <Text style={styles.memberCount}>
                {selectedMembers.length}/4 members selected
            </Text>

            {error && (
                <GlassedView
                    color={"FF232370"}
                    isInteractive={false}
                    glassEffectStyle={"regular"}
                    intensity={50}
                    tint={"default"}
                    style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{error}</Text>
                </GlassedView>
            )}

            <View style={styles.searchContainer}>
                <IconSymbol name="magnifyingglass" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search members..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView style={styles.membersList}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0088FF" style={{ marginTop: 20 }} />
                ) : filteredMembers.length === 0 ? (
                    <Text style={styles.noResultsText}>No members found</Text>
                ) : (
                    filteredMembers.map((member) => (
                        <TouchableOpacity
                            key={member.id}
                            style={styles.memberItem}
                            onPress={() => toggleMemberSelection(member.id)}
                        >
                            <CheckBox
                                value={selectedMembers.includes(member.id)}
                                onValueChange={() => toggleMemberSelection(member.id)}
                                color={selectedMembers.includes(member.id) ? '#0088FF' : undefined}
                            />
                            <Image
                                source={{ uri: member.photo_path }}
                                style={styles.memberPhoto}
                            />
                            <View style={styles.memberInfo}>
                                <Text style={styles.memberName}>
                                    {member.first_name} {member.last_name}
                                </Text>
                                <Text style={styles.memberAddress}>{member.address}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
            <View style={styles.groupNameContainer}>
                <Text style={styles.groupNameLabel}>Name:</Text>
                <TextInput
                    style={styles.groupNameInput}
                    placeholder="Enter group name"
                    value={groupName}
                    onChangeText={setGroupName}
                />
            </View>
            <TouchableOpacity
                style={[styles.createButton, (!groupName || selectedMembers.length === 0) && styles.createButtonDisabled]}
                onPress={handleCreateGroup}
                disabled={!groupName || selectedMembers.length === 0}
            >
                <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20,
        marginTop: 120,
        marginLeft: 20,
        marginRight: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    memberCount: {
        fontSize: 16,
        color: '#0088FF',
        marginBottom: 10,
        fontWeight: '600',
    },
    errorBanner: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    errorBannerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        padding: 5,
    },
    membersList: {
        maxHeight: 350,
        marginBottom: 20,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    memberPhoto: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 12,
    },
    memberInfo: {
        marginLeft: 12,
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    memberAddress: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    groupNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
    },
    groupNameLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    groupNameInput: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 5,
        fontSize: 16,
    },
    createButton: {
        backgroundColor: '#0088FF',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonDisabled: {
        backgroundColor: '#ccc',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    noResultsText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});