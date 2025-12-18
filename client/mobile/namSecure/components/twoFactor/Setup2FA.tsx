import React, {useEffect, useState} from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ErrorMessageContainer from '@/components/ui/error/ErrorMessageContainer';
import NativeBottomSheet from '@/components/ui/bottomSheet/NativeBottomSheet';
import { useSetup2FA } from '@/context/2fa/Setup2FAContext';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles } from '@/styles/screens/app/setup2fa';
import { SetupTwoFactor } from './SetupTwoFactor';
import { VerifyTwoFactor } from './VerifyTwoFactor';
import { DisableTwoFactor } from './DisableTwoFactor';
import { DisabledTwoFactor } from './DisabledTwoFactor';
import { useAuth } from '@/providers/AuthProvider';
import {ITwoFactorStepProps, TwoFactorStep} from '@/types/components/twoFactor/twoFactor';

interface ITwoFactorStep
{
    step: TwoFactorStep,
    component: React.ReactNode;
}

export default function Setup2FAScreen() {
    const [step, setStep] = useState<TwoFactorStep>('init');
    const [error, setError] = useState<string | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true);

    const { user } = useAuth();
    const { setIsVisible, disable, setDisable } = useSetup2FA();
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    const handleNextStep = (nextStep: TwoFactorStep) =>
    {
        setStep(nextStep)
        setError(null);
    };

    const handleShowError = (message: string) =>
    {
        setError(message);
    };

    const handleCancel = () => {
        setIsBottomSheetOpen(false);
        setIsVisible(false);
        setDisable(false);
        setStep('init');
        setError(null);
    };

    useEffect(() =>
    {
        if(user?.twoFactorEnabled && !disable)
        {
            setStep('verify');
        }
        else if(disable)
        {
            setStep('disable');
        }
    }, []);

    const steps: ITwoFactorStep[] = [
        {
            step: 'init',
            component: <SetupTwoFactor nextStep={handleNextStep} showError={handleShowError} />
        },
        {
            step: 'verify',
            component: <VerifyTwoFactor nextStep={handleNextStep} showError={handleShowError} />
        },
        {
            step: 'disable',
            component: <DisableTwoFactor nextStep={handleNextStep} showError={handleShowError} />
        },
        {
            step: 'disabled',
            component: <DisabledTwoFactor nextStep={handleNextStep} showError={handleShowError} />
        }
    ];

    const currentStepComponent = steps.find(s => s.step === step)?.component;

    return (
        <NativeBottomSheet isOpen={isBottomSheetOpen} onClose={handleCancel}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={true}>
                    <ErrorMessageContainer message={error} />
                    <View style={styles.setupContainer}>
                        {currentStepComponent}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeBottomSheet>
    );
}
