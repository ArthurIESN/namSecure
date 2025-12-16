import React, { createContext, useContext, useState } from 'react';

interface Setup2FAContextType
{
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
    disable: boolean;
    setDisable: (disable: boolean) => void;
}

export const Setup2FAContext = createContext<Setup2FAContextType | undefined>(undefined);

export function Setup2FAProvider({ children }: { children: React.ReactNode })
{
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [disable, setDisable] = useState<boolean>(false);

    return (
        <Setup2FAContext.Provider value={{ isVisible, setIsVisible, disable, setDisable }}>
            {children}
        </Setup2FAContext.Provider>
    );
}

export function useSetup2FA()
{
    const context = useContext(Setup2FAContext);
    if (!context)
    {
        throw new Error('useSetup2FA must be used within Setup2FAProvider');
    }
    return context;
}
