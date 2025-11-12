import {ErrorRequestHandler, RequestHandler, Router} from "express";

export interface IRouter
{
    route: string,
    router: Router,
    middleware?: (RequestHandler | ErrorRequestHandler)[];
}