import {TextStyle, ViewStyle} from "react-native";

export interface IServerUnavailableStyle {
    container: ViewStyle;
    content: ViewStyle;
    iconContainer: ViewStyle;
    icon: TextStyle;
    brandName: TextStyle;
    title: TextStyle;
    messageContainer: ViewStyle;
    description: TextStyle;
    subdescription: TextStyle;
    retryInfo: ViewStyle;
}
