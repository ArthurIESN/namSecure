import { Request, Response} from 'express';
import {ITypeDanger} from "@namSecure/shared/types/type_danger/type_danger.js";
import * as typeDangerModel from "../../models/type_danger/type_danger.js";

export const getTypeDangers = async (req: Request, res: Response) : Promise<void> =>
{
    try
    {
        const { limit, offset, search } = req.validated;
        const typeDangers : ITypeDanger[]= await typeDangerModel.getTypeDangers(limit, offset, search);
        res.status(200).send(typeDangers);
    }
    catch (error)
    {
        console.error("Error in getTypeDangers controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

