import React, { ReactElement } from 'react';
import Text from '@/components/ui/Text';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles } from '@/styles/screens/app/setup2fa';
import {ITwoFactorStepProps} from "@/types/components/twoFactor/twoFactor";

export const DisabledTwoFactor = (props: ITwoFactorStepProps): ReactElement =>
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    return (
        <>
            <Text style={styles.successText}>✓ Two-Factor Authentication Disabled</Text>
            <Text style={styles.descriptionText}>
                Two-Factor Authentication has been successfully disabled on your account. You'll no longer need to enter a code when logging in.
            </Text>
        </>
    );
};
