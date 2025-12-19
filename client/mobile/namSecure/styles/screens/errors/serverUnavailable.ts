import { StyleSheet } from 'react-native';
import {IServerUnavailableStyle} from "@/types/screens/errors/serverUnavailable";

export const styles: IServerUnavailableStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 24,
    },
    icon: {
        fontSize: 64,
    },
    brandName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 32,
    },
    messageContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: '#374151',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 24,
        fontWeight: '500',
    },
    subdescription: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },
    retryInfo: {
        marginBottom: 24,
        alignItems: 'center',
    }
});
