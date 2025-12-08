import axios from "axios";
import axiosRetry from 'axios-retry';
import {calculateExponentialDelay} from "@/utils/retry/retryDelay";

const API_BASE_URL = `http://${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}/api/v1`;

export enum EAPI_METHODS
{
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

let globalNetworkErrorCallback: ((error: any) => void) | null = null;
let globalNetworkSuccessCallback: (() => void) | null = null;
let globalRetryCountCallback: ((count: number) => void) | null = null;
let hasShownError = false;

export const setGlobalNetworkErrorCallback = (callback: ((error: any) => void) | null) =>
{
    globalNetworkErrorCallback = callback;
};

export const setGlobalNetworkSuccessCallback = (callback: (() => void) | null) =>
{
    globalNetworkSuccessCallback = callback;
};

export const setGlobalRetryCountCallback = (callback: ((count: number) => void) | null) =>
{
    globalRetryCountCallback = callback;
};

export interface IApiResponse<T>
{
    data?: T;
    error?: any;
    errorMessage?: string;
}

const axiosInstance = axios.create(
{
    baseURL: API_BASE_URL,
    timeout: 0, // Pas de timeout - retry à l'infini
});

interface IApiOptions
{
    retries?: number;
}

axiosRetry(axiosInstance,
{
    retries: 999,
    retryDelay: calculateExponentialDelay,
    retryCondition: (error): boolean =>
    {
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    },
    onRetry: (retryCount, error, requestConfig) =>
    {
        // Notifier le ServerStatusProvider après 3 échecs pour afficher l'écran
        console.log(`Retry attempt #${retryCount} for ${requestConfig.url}`);

        // Mettre à jour le retry count
        if (globalRetryCountCallback) {
            globalRetryCountCallback(retryCount);
        }

        if (retryCount === 3 && globalNetworkErrorCallback && !hasShownError)
        {
            hasShownError = true;
            globalNetworkErrorCallback(error);
        }
    }
});

export async function api<T = any>
(
    endpoint: string,
    method: EAPI_METHODS = EAPI_METHODS.GET,
    payload?: any,
    options?: IApiOptions
): Promise<IApiResponse<T>> {
    let data: T | undefined = undefined;
    let error: any = undefined;
    let errorMessage: string | undefined = undefined;

    try
    {
        const response = await axiosInstance(
        {
            url: endpoint,
            method,
            data: payload,
            'axios-retry':
                {
                    retries: options?.retries ?? 999
                }
        });

        data = response.data;

        // Si on avait affiché l'erreur et que maintenant ça marche, notifier le succès
        if (hasShownError && globalNetworkSuccessCallback) {
            hasShownError = false;
            globalNetworkSuccessCallback();
        }

        return { data };
    }
    catch (err: any)
    {
        error = err;
        errorMessage = error.response?.data?.error || error.message || "An error occurred";

        return { error, errorMessage };
    }
}
