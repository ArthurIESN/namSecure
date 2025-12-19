import React, {useState, useEffect, ReactElement} from 'react';
import { View } from 'react-native';
import Text from '@/components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui/buttons/Button';
import Loading from '@/components/ui/loading/Loading';
import { useServerStatus } from '@/providers/ServerStatusProvider';
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import {calculateExponentialDelay} from "@/utils/retry/retryDelay";
import {styles} from '@/styles/screens/errors/serverUnavailable';

export default function ServerUnavailableScreen(): ReactElement
{
    const { retryCount } = useServerStatus();
    const [countdown, setCountdown] = useState<number>(0);

    useEffect(() =>
    {
        const nextRetryDelay: number = calculateExponentialDelay(retryCount);
        const nextRetrySeconds: number = Math.ceil(nextRetryDelay / 1000);
        setCountdown(nextRetrySeconds);

        const interval: number = setInterval(() =>
        {
            setCountdown((prev: number): number =>
            {
                if (prev <= 1) return nextRetrySeconds;
                return prev - 1;
            });
        }, 1000);

        return (): void => clearInterval(interval);
    }, [retryCount]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <IconSymbol name={"wifi.slash"} color={"black"} size={96} />
                </View>

                <Text style={styles.brandName}>NamSecure is not available</Text>

                <View style={styles.messageContainer}>
                    <Text style={styles.description}>
                        We cannot establish a connection with NamSecure's servers.
                    </Text>
                    <Text style={styles.subdescription}>
                        Please check your internet connection and try again.
                    </Text>
                </View>

                <View style={styles.retryInfo}>
                    <Loading
                        size="small"
                        message={`Trying to reconnect... (Next retry in ${countdown}s)`}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
