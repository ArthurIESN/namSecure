import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {setGlobalNetworkErrorCallback, setGlobalNetworkSuccessCallback, setGlobalRetryCountCallback} from "@/utils/api/api";

interface IServerStatusContextType
{
    serverUnavailable: boolean;
    retryCount: number;
}

const ServerStatusContext = createContext<IServerStatusContextType | undefined>(undefined);

export const ServerStatusProvider = ({ children }: { children: ReactNode }) =>
{
    const [serverUnavailable, setServerUnavailable] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleGlobalNetworkError = () =>
    {
        setServerUnavailable(true);
    };

    const handleGlobalNetworkSuccess = () =>
    {
        setServerUnavailable(false);
        setRetryCount(0);
    };

    const handleRetryCount = (count: number) =>
    {
        setRetryCount(count);
    };

    useEffect(() =>
    {
        setGlobalNetworkErrorCallback(handleGlobalNetworkError);
        setGlobalNetworkSuccessCallback(handleGlobalNetworkSuccess);
        setGlobalRetryCountCallback(handleRetryCount);

        return () =>
        {
            setGlobalNetworkErrorCallback(null);
            setGlobalNetworkSuccessCallback(null);
            setGlobalRetryCountCallback(null);
        };
    }, []);

    return (
        <ServerStatusContext.Provider value={{
            serverUnavailable,
            retryCount
        }}>
            {children}
        </ServerStatusContext.Provider>
    )
}

export const useServerStatus = (): IServerStatusContextType =>
{
    const context = useContext(ServerStatusContext);
    if (!context)
    {
        throw new Error('useServerStatus must be used within a ServerStatusProvider');
    }
    return context;
};
