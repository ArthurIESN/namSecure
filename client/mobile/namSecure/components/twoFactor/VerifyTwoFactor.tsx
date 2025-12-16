import React, { ReactElement } from 'react';
import Text from '@/components/ui/Text';
import { useTheme } from '@/providers/ThemeProvider';
import { styles as createStyles } from '@/styles/screens/app/setup2fa';
import { ITwoFactorStepProps } from '@/types/components/twoFactor/twoFactor';

export const VerifyTwoFactor = (props: ITwoFactorStepProps): ReactElement =>
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    return (
        <>
            <Text style={styles.successText}>✓ Two-Factor Authentication Enabled</Text>
            <Text style={styles.descriptionText}>
                Your account is now protected with Two-Factor Authentication. You'll be asked to enter a code from your authenticator app each time you log in.
            </Text>
        </>
    );
};
