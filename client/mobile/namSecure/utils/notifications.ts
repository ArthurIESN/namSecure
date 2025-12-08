import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';


Notifications.setNotificationHandler({
    handleNotification: async (notification: Notifications.Notification) => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


export async function requestNotificationPermissions(): Promise<boolean> {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Notifications: Permission denied by the user');
            return false;
        }

        console.log('Notifications: Permissions granted');
        return true;
    } catch (error) {
        console.error('Notifications: Error requesting permissions', error);
        return false;
    }
}

export type DangerLevel = 1 | 2 | 3 | 4 | 5;

function getDangerInfo(level: DangerLevel): { emoji: string; label: string; color: string } {
    const mapping = {
        1: { emoji: '🟢', label: 'Faible', color: '#4CAF50' },
        2: { emoji: '🟡', label: 'Modéré', color: '#FFC107' },
        3: { emoji: '🟠', label: 'Élevé', color: '#FF9800' },
        4: { emoji: '🔴', label: 'Critique', color: '#F44336' },
        5: { emoji: '🆘', label: 'Urgence', color: '#D32F2F' },
    };
    return mapping[level] || mapping[1];
}

export interface ReportNotificationData {
    reportId: number;
    level: DangerLevel;
    typeDanger: string;
    lat: number | string;
    lng: number | string;
    isPublic: boolean;
    teamId?: number;
}

export async function showReportNotification(
    report: ReportNotificationData
): Promise<string | null> {
    try {
        const dangerInfo = getDangerInfo(report.level);

        const lat = typeof report.lat === 'number' ? report.lat : parseFloat(report.lat);
        const lng = typeof report.lng === 'number' ? report.lng : parseFloat(report.lng);

        const title = `${dangerInfo.emoji} Nouveau rapport ${dangerInfo.label}`;
        const body = `${report.typeDanger}\nLocalisation : ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        if (report.level >= 4) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else if (report.level >= 3) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: {
                    reportId: report.reportId,
                    level: report.level,
                    type: 'new_report',
                },
                sound: true,
                priority: report.level >= 4 ? 'high' : 'default',
            },
            trigger: null,
        });

        console.log(`Notification affichée pour report #${report.reportId}`);
        return notificationId;
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la notification', error);
        return null;
    }
}


export async function cancelNotification(notificationId: string): Promise<void> {
    await Notifications.dismissNotificationAsync(notificationId);
}


export async function cancelAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
}

export function setupNotificationClickListener(
    handler: (response: Notifications.NotificationResponse) => void
): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener(handler);

    return () => {
        subscription.remove();
    };
}