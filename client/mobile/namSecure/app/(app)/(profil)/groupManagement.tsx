import {View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, Dimensions} from "react-native";
import { IconSymbol } from "@/components/ui/symbols/IconSymbol";
import { useState, useEffect } from "react";
import Text from "@/components/ui/Text";
import CheckBox from "expo-checkbox";
import { api, EAPI_METHODS } from "@/utils/api/api";
import type { IMember } from "@namSecure/shared/types/member/member";
import type { ITeam } from "@namSecure/shared/types/team/team";
import type { ITeamMember } from "@namSecure/shared/types/team_member/team_member";
import { useAuth } from "@/providers/AuthProvider";
import { IAuthUserInfo } from "@/types/context/auth/auth";
import GlassedView from "@/components/glass/GlassedView";
import GlassedInput from "@/components/ui/fields/GlassedInput";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from "@/providers/ThemeProvider";
import { BlurView } from "expo-blur";
import { useMap } from "@/providers/MapProvider";
import { useHeader } from "@/context/HeaderContext";

const { width } = Dimensions.get("window");

const PP_PLACEHOLDER = require('@/assets/images/PP_Placeholder.png');

export default function GroupManagement() {
    const { groupId } = useLocalSearchParams<{
        groupId?: string;
    }>();
    const { user }: { user: IAuthUserInfo } = useAuth();
    const { colorScheme } = useTheme();
    const { mapScreenshot } = useMap();
    const { setShowHeader } = useHeader();

    useEffect(() => {
        // Cacher le header parent et montrer le header du groupManagement
        setShowHeader(false);
        return () => {
            // Afficher le header parent quand on quitte
            setShowHeader(true);
        };
    }, [setShowHeader]);
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
                    setFinishButtonText("Update");
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

        // Si on a une photoPath relative, essayer de construire l'URL avec user.photoPath
        if (user?.photoPath) {
            const baseUrl = user.photoPath.substring(0, user.photoPath.lastIndexOf('/'));
            return `${baseUrl}/${photoPath}`;
        }

        // Si pas de user.photoPath, retourner null pour afficher le placeholder
        return null;
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
        <View style={styles.mainContainer}>
            {mapScreenshot && (
                <BlurView intensity={25} style={styles.backgroundMap}>
                    <Image source={{ uri: mapScreenshot }} style={styles.backgroundMap} />
                </BlurView>
            )}
            <SafeAreaView style={styles.contentContainer}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.memberCount}>
                        {selectedMembers.length}/4 members selected
                    </Text>

                    {error && (
                        <GlassedView
                            color={"FF232370"}
                            isInteractive={false}
                            glassEffectStyle="clear"
                            intensity={50}
                            tint="default"
                            style={styles.errorBanner}>
                            <Text style={styles.errorBannerText}>{error}</Text>
                        </GlassedView>
                    )}

                    <View style={styles.searchContainer}>
                        <GlassedInput
                            placeholder="Search members..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            icon="magnifyingglass"
                        />
                    </View>

                    <View style={styles.membersList}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0088FF" style={{ marginTop: 20 }} />
                        ) : displayedMembers.length === 0 ? (
                            <Text style={styles.noResultsText}>
                                {searchQuery.trim() ? "No members found" : "Search members to add"}
                            </Text>
                        ) : (
                            displayedMembers.map((member) => {
                                const photoUrl = getPhotoUrl(member.photo_path);
                                return (
                                    <GlassedView
                                        key={member.id}
                                        color={colorScheme === 'light' ? 'FFFFFF15' : 'FFFFFF08'}
                                        isInteractive={true}
                                        glassEffectStyle="clear"
                                        intensity={50}
                                        tint="default"
                                        style={styles.memberItemGlass}>
                                        <TouchableOpacity
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
                                    </GlassedView>
                                );
                            })
                        )}
                    </View>

                    <View style={styles.groupNameContainer}>
                        <Text style={styles.groupNameLabel}>Group Name</Text>
                        <GlassedInput
                            placeholder="Enter group name"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <GlassedProfileButton
                            label={finishButtonText}
                            onPress={handleGroupManage}
                            variant={(!groupName || selectedMembers.length === 0) ? 'secondary' : 'primary'}
                            disabled={!groupName || selectedMembers.length === 0}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    backgroundMap: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 10,
    },
    memberCount: {
        fontSize: 14,
        color: '#0088FF',
        marginBottom: 20,
        fontWeight: '600',
    },
    errorBanner: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },
    errorBannerText: {
        fontSize: 13,
        fontWeight: '500',
    },
    searchContainer: {
        marginBottom: 20,
    },
    glassedSearchInput: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    searchInputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        padding: 0,
    },
    membersList: {
        marginBottom: 20,
    },
    memberItemGlass: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 10,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
    },
    memberPhoto: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 15,
        fontWeight: '600',
    },
    groupNameContainer: {
        marginBottom: 25,
    },
    groupNameLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    glassedNameInput: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    groupNameInput: {
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 15,
    },
    buttonContainer: {
        marginBottom: 40,
        width: width * 0.8,
        alignSelf: 'center',
    },
    noResultsText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 15,
        fontWeight: '500',
    },
});