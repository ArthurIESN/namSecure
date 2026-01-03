import {View, StyleSheet, TouchableOpacity} from "react-native";
import Text from "@/components/ui/Text";
import {SymbolView} from "expo-symbols";
import {INotification} from "@/types/components/notifications/INotification";

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
    console.log("Rendering NotificationItem:", {id, typeNotification, name, street, level, icon, date});
    const renderButton = () => {
        console.log(typeNotification)
        if(typeNotification === 'report') {
            return (
                <TouchableOpacity style={styles.button} onPress={() => vuFunction(id!)}>
                    <Text style={styles.buttonText}>Vu</Text>
                </TouchableOpacity>
            )
        }else{
            return(
            <View>
                <TouchableOpacity style={styles.button} onPress={() => acceptFunction?.(id)}>
                    <Text style={styles.buttonText}>Accepter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => rejectFunction?.(id)}>
                    <Text style={styles.buttonText}>Refuser</Text>
                </TouchableOpacity>
            </View>
            )
        }
    }

    return(
        <View style={styles.mainContainer}>
            <View style={styles.iconContainer}>
                <SymbolView name={icon}
                            size={32}
                />
            </View>
            <View style={styles.textContainer}>
                <View>
                    <Text style={styles.text}>{name}</Text>
                </View>
                {street && (
                    <View>
                        <Text style={styles.text}>{street}</Text>
                    </View>
                )}
            </View>
            <View style={styles.buttonContainer}>
                {renderButton()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: "auto",
        marginTop: 25,
    },
    iconContainer:{
        marginLeft : 10,
    },
    textContainer:{
        marginLeft : 20,
        marginTop: 3,
        width: 150,
    },
    text:{
        fontSize: 16,
    },
    buttonContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: "flex-end",
    },
    button: {
        backgroundColor: '#2F2F2F',
        paddingVertical: 7,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginRight:10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },

});