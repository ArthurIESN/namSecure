import axios, {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import axiosRetry, {type AxiosRetry} from 'axios-retry';
import { triggerGlobalError } from '@/context/ErrorDialogContext';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const apiClient: AxiosInstance = axios.create(
{
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers:
    {
        'Content-Type': 'application/json'
    }
});

let hasShownLongLoadingDialog = false;

axiosRetry(apiClient, {
    retries: 999,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
    {
        return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
    },
    onRetry: (retryCount) =>
    {
        if(retryCount === 4 && !hasShownLongLoadingDialog)
        {
            hasShownLongLoadingDialog = true;
            triggerGlobalError(
                "The server is taking longer than expected to respond. We'll keep trying in the background...",
                "Loading...",
                undefined
            );
        }

        if (retryCount === 1)
        {
            hasShownLongLoadingDialog = false;
        }
    }
});

export interface IApiResponse<T>
{
    data: T;
    status: number;
}

export async function apiCall<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<IApiResponse<T>>
{
    try
    {
        const response: AxiosResponse<T> = await apiClient.request({
            method,
            url: endpoint,
            data,
            ...config
        });

        return {
            data: response.data,
            status: response.status
        };
    } catch (error)
    {
        throw error;
    }
}

export const api =
{
    get: <T = any>(endpoint: string, config?: AxiosRequestConfig) =>
        apiCall<T>('GET', endpoint, undefined, config),

    post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        apiCall<T>('POST', endpoint, data, config),

    put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        apiCall<T>('PUT', endpoint, data, config),

    delete: <T = any>(endpoint: string, config?: AxiosRequestConfig) =>
        apiCall<T>('DELETE', endpoint, undefined, config),

    patch: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) =>
        apiCall<T>('PATCH', endpoint, data, config)
};
