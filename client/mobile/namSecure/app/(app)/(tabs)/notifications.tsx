import {Text, View} from 'react-native'
import NotificationItem from "@/components/notifications/notificationItem";
import {SafeAreaView} from "react-native-safe-area-context";
export default function NotificationsTab() {

    const items = [];
    for(let i = 0; i < 10; i++) {
        items.push(<NotificationItem key={i}/>);
    }

    return (
        <SafeAreaView>
            <Text>Notifications Tab</Text>
            {items}
        </SafeAreaView>
    )
}