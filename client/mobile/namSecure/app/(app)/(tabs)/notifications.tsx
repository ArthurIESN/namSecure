    import {View, StyleSheet, ScrollView} from 'react-native'
import Text from '@/components/ui/Text';
import {useState, useEffect, useCallback} from "react";
import {api, EAPI_METHODS} from "@/utils/api/api";
import NotificationItem from "@/components/notifications/notificationItem";
import {SafeAreaView} from "react-native-safe-area-context";
import {IReport} from "@namSecure/shared/types/report/report";
import {INotification} from "@/types/components/notifications/INotification";
import Maps from "@/components/map/Maps";
import {BlurView} from "expo-blur";
import {useFocusEffect} from "@react-navigation/native";
import Loading from "@/components/ui/loading/Loading";
import {useWebSocket} from "@/providers/WebSocketProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NotificationsTab() {

    const [datas, setDatas] = useState<IReport[]>([]);
    const [teamMemberInvitations, setTeamMemberInvitations] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { onReportReceived } = useWebSocket();

    const vuFunction = async (idReport: number) => {
        try{
            const reportsData = await getStoredReports();
            if (!reportsData) return;

            await storeData(reportsData, idReport);
            setNotifications(
                notifications.filter(notification => notification.id !== idReport)
            );
        }catch (error){
            console.error("Error marking notification as read:", error);
        }
    }

    const getStoredReports = async (): Promise<number[] | null> => {
        try{
            const reports = await AsyncStorage.getItem('reports');
            if(reports === null){
                await AsyncStorage.setItem('reports', JSON.stringify([]));
                return [];
            }
            return JSON.parse(reports);
        }catch(error){
            console.error("Error getting stored reports:", error);
            return null;
        }
    }


    const storeData = async (storedReportId: number[], idReport: number) => {
        storedReportId.push(idReport);
        try{
            await AsyncStorage.setItem('reports', JSON.stringify(storedReportId));
        }catch (error){
            console.error("Error storing report data:", error);
        }
    }

    const handleAcceptInvitation = async (id: number) => {
        try {
            const { data, error } = await api(
                `team-member/accept/${id}`,
                EAPI_METHODS.PUT
            );

            if (data) {
                setNotifications(prev => prev.filter(notif => notif.id !== id));
                setTeamMemberInvitations(prev => prev.filter(inv => inv.id !== id));
            } else {
                console.error('Erreur lors de l\'acceptation:', error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'acceptation de l\'invitation:', error);
        }
    };

    const handleRejectInvitation = async (id: number) => {
        try {
            const { data, error } = await api(
                `team-member/${id}`,
                EAPI_METHODS.DELETE
            );

            if (data) {
                setNotifications(prev => prev.filter(notif => notif.id !== id));
                setTeamMemberInvitations(prev => prev.filter(inv => inv.id !== id));
            } else {
                console.error('Erreur lors du refus:', error);
            }
        } catch (error) {
            console.error('Erreur lors du refus de l\'invitation:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async (): Promise<void> => {
                try {
                    setIsLoading(true);

                    const reportsResponse = await api(
                        'report/forUser',
                        EAPI_METHODS.GET,
                    );

                    if (reportsResponse.data) {
                        const reports = await getStoredReports();
                        if (reports) {
                            const filteredData = reportsResponse.data.filter((report: IReport) => !reports.includes(report.id));
                            setDatas(filteredData);
                        }
                    } else if (reportsResponse.error) {
                        console.error('Error fetching reports:', reportsResponse.error);
                    }

                    const invitationsResponse = await api(
                        'team-member/pending',
                        EAPI_METHODS.GET
                    );

                    if (invitationsResponse.data) {
                        setTeamMemberInvitations(invitationsResponse.data);
                    } else if (invitationsResponse.error) {
                        console.error('Error fetching invitations:', invitationsResponse.error);
                    }
                } catch (error) {
                    console.error('Error in fetchData:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    useEffect(() => {

        const reportNotifications: INotification[] = datas.map((report) => {
            const dateString = report.date instanceof Date ? report.date.toISOString() : String(report.date);

            return {
                id: report.id,
                type: 'report' as const,
                name: typeof report.type_danger === 'object' ? report.type_danger.name : '',
                street: report.street,
                level: report.level,
                icon: typeof report.type_danger === 'object' ? report.type_danger.icon : '',
                date: dateString,
            };
        });

        const invitationNotifications: INotification[] = teamMemberInvitations.map((invitation) => ({
            id: invitation.id,
            type: 'group' as const,
            name: `Invitation: ${invitation.team.name}`,
            icon: 'person.2.fill',
            date: new Date().toISOString(),
        }));

        setNotifications([...invitationNotifications, ...reportNotifications]);
    }, [datas, teamMemberInvitations]);

    useEffect(() => {
        const unsubscribe = onReportReceived(async (report) => {
            try {
                const { data, error } = await api(
                    `report/${report.id}`,
                    EAPI_METHODS.GET
                );

                if (data) {
                    const newNotification: INotification = {
                        id: data.id,
                        type: 'report',
                        name: typeof data.type_danger === 'object' ? data.type_danger.name : '',
                        street: data.street,
                        level: data.level,
                        icon: typeof data.type_danger === 'object' ? data.type_danger.icon : '',
                        date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
                    };

                    setNotifications(prev => [newNotification, ...prev]);
                } else if (error) {
                    console.error('Error fetching report from WebSocket:', error);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du report:', error);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [onReportReceived]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <Loading message="Chargement des notifications..." size="large" />
                </View>
            );
        }

        if (!notifications || notifications.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucune notification</Text>
                    <Text style={styles.emptySubtext}>
                        Vous n avez pas encore de notifications
                    </Text>
                </View>
            );
        }

        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        id={notification.id}
                        typeNotification={notification.type}
                        name={notification.name}
                        street={notification.street}
                        level={notification.level}
                        icon={notification.icon}
                        date={notification.date}
                        vuFunction={notification.type === 'report' ? (idReport:number) => vuFunction(idReport) : undefined}
                        acceptFunction={notification.type === 'group' ? handleAcceptInvitation : undefined}
                        rejectFunction={notification.type === 'group' ? handleRejectInvitation : undefined}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <BlurView intensity={25} style={styles.backgroundMap}>
                <Maps
                    style={styles.backgroundMap}
                />
            </BlurView>
            <SafeAreaView style={styles.contentContainer}>
                {renderContent()}
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
    contentContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
});