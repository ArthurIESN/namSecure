import { ReactElement } from "react";
import GlassedView from "../glass/GlassedView";
import { StyleSheet,Dimensions, View, Text } from "react-native";

export default function Report () : ReactElement{
    return (
       

        <View>
             <GlassedView
                glassEffectStyle="clear"
                isInteractive={true}
                color="4287f540"
                intensity={12}
                tint={"default"}
                style={[styles.glassBox]}>
                

               </GlassedView>
        </View>
    );
}

const styles =  StyleSheet.create({
    glassBox : {
        width: '20%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'centser',
        overflow: 'hidden',
    },
});