import { ComponentType, ReactElement, ReactNode } from "react";
import GlassedView from "../glass/GlassedView";
import { SelectReportProps,Styles } from "@/types/selectReport/selectReport";

import { Dimensions, StyleSheet,View, ViewStyle,ScrollView, ViewProps, ScrollViewProps} from "react-native";



export default function SelectReport({children,useScroll = false, scrollViewProps}: SelectReportProps) : ReactElement{    
    const Container : ComponentType<ViewProps | ScrollViewProps> = useScroll ? ScrollView : View;
    return(
        <GlassedView 
        glassEffectStyle="clear"
        isInteractive={true}
        color="FFFFFF1A"
        intensity={12}
        tint={"default"}
        style={[styles.glassBox]}
        >
            <Container style={styles.container} {...(useScroll ? scrollViewProps : {})}>
                {children}
            </Container>
        </GlassedView>
    );
}

const styles = StyleSheet.create<Styles>({
    glassBox : {
        width: Dimensions.get('window').width,
        height: 300,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    container : {
        width : '100%',
        height : '100%',
    }

})
    


