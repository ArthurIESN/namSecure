import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { useState, useEffect } from "react";
import CheckBox from "expo-checkbox";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { IMember } from "@namSecure/shared/types/member/member";
import type { ITeam } from "@namSecure/shared/types/team/team";
import type { ITeamMember } from "@namSecure/shared/types/team_member/team_member";
import { useAuth } from "@/providers/AuthProvider";
import { IAuthUserInfo } from "@/types/context/auth/auth";
import GlassedView from "@/components/glass/GlassedView";
import { router, useLocalSearchParams } from 'expo-router';

const PP_PLACEHOLDER = require('@/assets/images/PP_Placeholder.png');

export default function GroupManagement() {
    const { groupId } = useLocalSearchParams<{
        groupId?: string;
    }>();
    const { user }: { user: IAuthUserInfo } = useAuth();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [groupName, setGroupName] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [groupMembers, setGroupMembers] = useState<IMember[]>([]);
    const [searchResults, setSearchResults] = useState<IMember[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [finishButtonText, setFinishButtonText] = useState<string>("");

    const verifyGroupId = async (groupId?: string): Promise<boolean> => {
        if (!groupId){
            return false;
        }
        try {
            const response = await api(`team/${groupId}`, EAPI_METHODS.GET);
            const isValid = !response.error && response.data !== null;
            return isValid;
        } catch (err) {
            console.error("Error verifying group ID:", err);
            return false;
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            if (groupId) {
                const isValidGroup = await verifyGroupId(groupId);
                if (isValidGroup) {
                    setTitle("Manage your group");
                    setFinishButtonText("Modify");
                    fetchGroupData(groupId);
                } else {
                    setError("Invalid group ID");
                    setLoading(false);
                }
            } else {
                setTitle("New group");
                setFinishButtonText("Create");
                setLoading(false);
            }
        };

        initializePage();
    }, [groupId]);

    const fetchGroupData = async (groupId: string) => {
        try {
            setLoading(true);
            const teamResponse = await api<ITeam & { team_member: ITeamMember[] }>(
                `team/${groupId}`,
                EAPI_METHODS.GET
            );

            if (teamResponse.error) {
                setError(teamResponse.errorMessage || "Failed to load group data");
                return;
            }

            if (teamResponse.data) {
                setGroupName(teamResponse.data.name);

                const teamMembers = teamResponse.data.team_member || [];
                const membersList: IMember[] = teamMembers
                    .map((tm: any) => tm.member)
                    .filter((member: IMember) => member && member.id !== user.id);

                const selectedMemberIds = membersList.map((member: IMember) => member.id);

                setSelectedMembers(selectedMemberIds);
                setGroupMembers(membersList);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (photoPath: string | null) => {
        if (!photoPath) return null;
        if (photoPath.startsWith('http')) return photoPath;
        if (!user.photoPath) return null;

        // Extract base URL from user's photo path
        const baseUrl = user.photoPath.substring(0, user.photoPath.lastIndexOf('/'));
        return `${baseUrl}/${photoPath}`;
    };

    const searchMembers = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await api<IMember[]>(
                `member/search-for-team?search=${encodeURIComponent(query)}`,
                EAPI_METHODS.GET
            );

            if (response.error) {
                setError(response.errorMessage || "Failed to search members");
            } else if (response.data) {
                const membersWithoutCurrentUser = response.data
                    .filter(member => member.id !== user.id)
                    .slice(0, 5);
                setSearchResults(membersWithoutCurrentUser);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred");
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchMembers(searchQuery);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);


    const toggleMemberSelection = (memberId: number) => {
        setSelectedMembers(prev => {
            if (prev.includes(memberId)) {
                // Déselection : retirer de selectedMembers et de groupMembers
                setGroupMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));
                return prev.filter(id => id !== memberId);
            } else {
                // Sélection
                if (prev.length >= 4) {
                    setError("You can only select up to 4 members");
                    return prev;
                }
                setError(null);

                const memberToAdd = displayedMembers.find(m => m.id === memberId);
                if (memberToAdd && !groupMembers.some(m => m.id === memberId)) {
                    setGroupMembers(prevMembers => [...prevMembers, memberToAdd]);
                }

                return [...prev, memberId];
            }
        });
    };

    const handleGroupManage = async () => {
        if (!user?.id) {
            setError("User not authenticated");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            let response;
            if (groupId) {
                const updatePayload = {
                    id: parseInt(groupId),
                    name: groupName,
                    id_member: user.id,
                    id_report: null,
                    team_member: selectedMembers.map(id => ({
                        id_member: id,
                        accepted: false
                    }))
                };
                response = await api(
                    'team',
                    EAPI_METHODS.PUT,
                    updatePayload
                );
            } else {
                const createPayload = {
                    name: groupName,
                    id_member: user.id,
                    id_report: null,
                    team_member: selectedMembers.map(id => ({
                        id_member: id,
                        accepted: false
                    }))
                };
                response = await api(
                    'team',
                    EAPI_METHODS.POST,
                    createPayload
                );
            }

            if (response.error) {
                console.error("ERROR Response:", response.errorMessage);
                setError(response.errorMessage || `Failed to ${groupId ? 'update' : 'create'} group`);
            } else {
                setGroupName("");
                setSelectedMembers([]);
                router.replace('/(app)/(profil)/profil');
            }
        } catch (err: any) {
            console.error("Failed to save group:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };
    const displayedMembers = searchQuery.trim() ? searchResults : groupMembers;

    return(
        <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>

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
                ) : displayedMembers.length === 0 ? (
                    <Text style={styles.noResultsText}>
                        {searchQuery.trim() ? "No members found" : "Search members to add to your group"}
                    </Text>
                ) : (
                    displayedMembers.map((member) => {
                        const photoUrl = getPhotoUrl(member.photo_path);
                        return (
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
                                    source={photoUrl ? { uri: photoUrl } : PP_PLACEHOLDER}
                                    style={styles.memberPhoto}
                                />
                                <View style={styles.memberInfo}>
                                    <Text style={styles.memberName}>
                                        {member.first_name} {member.last_name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
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
                onPress={handleGroupManage}
                disabled={!groupName || selectedMembers.length === 0}
            >
                <Text style={styles.createButtonText}>{finishButtonText}</Text>
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
    noResultsText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});