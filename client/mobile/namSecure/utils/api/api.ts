import axios from "axios";

const API_BASE_URL = `http://${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}/api/`;

// local but build on real device

export enum EAPI_METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export interface IApiResponse<T> {
    data?: T;
    error?: any;
    errorMessage?: string;
}

export async function api<T = any>
(
    endpoint: string,
    method: EAPI_METHODS = EAPI_METHODS.GET,
    payload?: any
): Promise<IApiResponse<T>> {
    let data: T | undefined = undefined;
    let error: any = undefined;
    let errorMessage: string | undefined = undefined;

    try
    {
        const response = await axios(
        {
            url: `${API_BASE_URL}${endpoint}`,
            method,
            data: payload,
        });

        data = response.data;
    } catch (err: any)
    {
        error = err;
        errorMessage = error.response?.data?.error || error.message || "An error occurred";
    } finally
    {
        // Delay de 2 secondes pour tester
        //await new Promise(resolve => setTimeout(resolve, 5000));
    }

    return { data, error, errorMessage };
}
