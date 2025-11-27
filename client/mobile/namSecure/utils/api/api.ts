import axios from "axios";

// local
const host = "localhost";

// local but build on real device
//const host = '172.20.10.4';

const API_BASE_URL = `http://${host}:3000/api/`; // @TODO URGENT move to env variable

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

    console.log("url" + `${API_BASE_URL}${endpoint}`);

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
