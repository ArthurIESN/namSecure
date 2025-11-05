import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import {LocalAuthenticationResult} from "expo-local-authentication";

const BIOMETRIC_CREDENTIALS_KEY: string = 'biometric_credentials';

export const isBiometricAvailable = async (): Promise<boolean> =>
{
    try
    {
        const compatible: boolean = await LocalAuthentication.hasHardwareAsync();
        const enrolled: boolean = await LocalAuthentication.isEnrolledAsync();
        return compatible && enrolled;
    }
    catch (error: any)
    {
        console.error('Error checking biometric availability:', error);
        return false;
    }
};

export const enableBiometric = async (email: string, password: string): Promise<boolean> => {
    try
    {
        const available: boolean = await isBiometricAvailable();
        if (!available)
        {
            console.error('Biometric authentication not available');
            return false;
        }

        const result: LocalAuthenticationResult = await LocalAuthentication.authenticateAsync(
        {
            disableDeviceFallback: false,
        });

        if (!result.success)
        {
            return false;
        }

        const credentials: string = JSON.stringify({ email, password });
        await SecureStore.setItemAsync(BIOMETRIC_CREDENTIALS_KEY, credentials);

        return true;
    }
    catch (error: any)
    {
        console.error('Error enabling biometric authentication:', error);
        return false;
    }
};

export const disableBiometric = async (): Promise<boolean> => {
    try
    {
        await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
        return true;
    }
    catch (error: any)
    {
        console.error('Error disabling biometric authentication:', error);
        return false;
    }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
    try
    {
        const credentials: string | null = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
        return credentials !== null && credentials !== undefined;
    }
    catch (error: any)
    {
        console.error('Error checking if biometric is enabled:', error);
        return false;
    }
};

export const loginWithBiometric = async (): Promise<{ email: string; password: string } | null> => {
    try
    {
        const enabled: boolean = await isBiometricEnabled();
        if (!enabled)
        {
            console.error('Biometric authentication not enabled');
            return null;
        }

        const result: LocalAuthenticationResult = await LocalAuthentication.authenticateAsync(
        {
            disableDeviceFallback: false,
        });

        if (!result.success)
        {
            return null;
        }

        const credentials: string | null = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
        if (!credentials)
        {
            return null;
        }

        return JSON.parse(credentials);
    }
    catch (error: any)
    {
        console.error('Error logging in with biometric:', error);
        return null;
    }
};
