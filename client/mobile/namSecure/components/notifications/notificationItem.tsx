import {View, StyleSheet} from "react-native";
import Text from "@/components/ui/Text";
import {SymbolView} from "expo-symbols";
import {INotification} from "@/types/components/notifications/INotification";
import GlassedView from "@/components/glass/GlassedView";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import { useTheme } from "@/providers/ThemeProvider";

interface NotificationItemProps {
    typeNotification: 'report' | 'group';
    id: number;
    name : string;
    street? : string;
    level? : number;
    icon : string;
    date : string;
    vuFunction?: (idReport:number) => void;
    acceptFunction?: (id: number) => void;
    rejectFunction?: (id: number) => void;
}
export default function NotificationItem({id,typeNotification, name, street, level, icon, date, vuFunction, acceptFunction, rejectFunction}: NotificationItemProps) {
    const { colorScheme } = useTheme();

    const renderButton = () => {
        console.log(typeNotification)
        if(typeNotification === 'report') {
            return (
                <GlassedProfileButton
                    label="X"
                    onPress={() => vuFunction(id!)}
                    variant="secondary"
                />
            )
        }else{
            return(
                <View style={styles.buttonGroup}>
                    <GlassedProfileButton
                        label="Accepter"
                        onPress={() => acceptFunction?.(id)}
                        variant="success"
                    />
                    <GlassedProfileButton
                        label="Refuser"
                        onPress={() => rejectFunction?.(id)}
                        variant="danger"
                    />
                </View>
            )
        }
    }

    return(
        <View style={styles.mainContainer}>
            <GlassedView
                color={colorScheme === 'light' ? 'FFFFFF15' : 'FFFFFF10'}
                isInteractive={true}
                glassEffectStyle="clear"
                intensity={50}
                tint="default"
                style={styles.glassContainer}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.iconContainer}>
                        <SymbolView name={icon} size={32} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{name}</Text>
                        {street && (
                            <Text style={styles.subtitle}>{street}</Text>
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        {renderButton()}
                    </View>
                </View>
            </GlassedView>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        marginTop: 15,
        paddingHorizontal: 15,
    },
    glassContainer: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        gap: 12,
    },
    iconContainer:{
        minWidth: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer:{
        flex: 1,
        justifyContent: 'center',
    },
    title:{
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle:{
        fontSize: 13,
        fontWeight: '400',
        marginBottom: 3,
    },
    levelText:{
        fontSize: 12,
        fontWeight: '500',
        color: '#0088FF',
    },
    buttonContainer:{
        gap: 8,
    },
    buttonGroup: {
        gap: 8,
    },
});