import { ReactNode } from "react";
import { ScrollViewProps,ViewStyle } from "react-native";

export interface SelectReportProps {
    children : ReactNode;
    useScroll?: boolean;
    scrollViewProps : ScrollViewProps;
}

export interface Styles {
    glassBox : ViewStyle,
    container : ViewStyle,
}