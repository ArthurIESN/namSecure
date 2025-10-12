import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/"; // @TODO URGENT move to env variable

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
    isLoading: boolean;
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
    let isLoading = true;

    console.log("url" + `${API_BASE_URL}${endpoint}`);

    try {
        const response = await axios({
            url: `${API_BASE_URL}${endpoint}`,
            method,
            data: payload,
        });
        data = response.data;
    } catch (err) {
        error = err;
        errorMessage = error.response?.data?.error || error.message || "An error occurred";
    } finally {
        isLoading = false;
    }

    return { data, error, errorMessage,  isLoading };
}
