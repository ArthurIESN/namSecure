import {Text, View, StyleSheet, ScrollView} from 'react-native'
import {useState, useEffect, useCallback} from "react";
import {api, EAPI_METHODS} from "@/utils/api/api";
import NotificationItem from "@/components/notifications/notificationItem";
import {SafeAreaView} from "react-native-safe-area-context";
import {IReport} from "@namSecure/shared/types/report/report";
import {INotification} from "@/types/components/notifications/INotification";
import Map from "@/components/map/Map";
import {BlurView} from "expo-blur";
import {useFocusEffect} from "@react-navigation/native";
import Loading from "@/components/ui/loading/Loading";
import {useWebSocket} from "@/providers/WebSocketProvider";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NotificationsTab() {

    const [datas, setDatas] = useState<IReport[]>([]);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { onReportReceived } = useWebSocket();

    const vuFunction = async (idReport: number) => {
        console.log("Report vu :", idReport);
        try{
            const reportsData = await getStoredReports();
            await storeData(reportsData,idReport);
        }catch (error){
            console.log("Error in vuFunction", error);
        }
        setNotifications(
            notifications.filter(notification => notification.id !== idReport)
        );

        const test = await getStoredReports();
        console.log("Ceci est un test", test);
    }

    const getStoredReports = async () => {
        try{
            const reports = await AsyncStorage.getItem('reports');
            if(reports === null){
                await AsyncStorage.setItem('reports', JSON.stringify([]));
                return [];
            }
            return JSON.parse(reports);

        }catch(error){
            console.log("Error getting stored reports", error);
        }
    }


    const storeData = async (storedReportId: number[],idReport: number) => {
        storedReportId.push(idReport);
        console.log("Ceci est stored",storedReportId);
        try{
            await AsyncStorage.setItem('reports', JSON.stringify(storedReportId));
        }catch (error){
            console.log("Error storing data", error);
        }
    }

    useFocusEffect(
        useCallback(() => {
            const fetchReports = async (): Promise<void> => {
                setIsLoading(true);
                const { data, error } = await api(
                    'report/forUser',
                    EAPI_METHODS.GET,
                );

                if (data) {
                    const reports = await getStoredReports();
                    const filteredData = data.filter(report => !reports.includes(report.id));
                    setDatas(filteredData);
                }
                setIsLoading(false);
            };
            fetchReports();
        }, [])
    );

    useEffect(() => {
        console.log(datas);
        const newNotifications = datas.map((report) => ({
            id: report.id,
            name : report.type_danger.name,
            street : report.street,
            level : report.level,
            icon : report.type_danger.icon,
            date : report.date,
        }));
        setNotifications(newNotifications);
    }, [datas]);

    useEffect(() => {
        const unsubscribe = onReportReceived(async (report) => {
            try {
                const { data, error } = await api(
                    `report/${report.id}`,
                    EAPI_METHODS.GET
                );

                console.log("NOUVEAU REPORT RECU VIA WEBSOCKET :", data);

                if (data) {
                    const newNotification: INotification = {
                        id: data.id,
                        name: data.type_danger.name,
                        street: data.street,
                        level: data.level,
                        icon: data.type_danger.icon,
                        date: data.date,
                    };

                    setNotifications(prev => [newNotification, ...prev]);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du report:', error);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

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
                        typeNotification="report"
                        name={notification.name}
                        street={notification.street}
                        level={notification.level}
                        icon={notification.icon}
                        date={notification.date}
                        vuFunction={(idReport:number) => vuFunction(idReport)}
                    />
                ))}
            </ScrollView>
        );
    };

    return (
        <View style={styles.mainContainer}>
            <BlurView intensity={25} style={styles.backgroundMap}>
                <Map
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
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6B7280',
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