import {Request, Response, NextFunction, RequestHandler} from "express";
import { upload } from "../../utils/upload/upload.js";
import multer from "multer";

const  handleUpload = async (req: Request, res: Response, next: NextFunction, fields: any[]): Promise<void> =>
{
    upload.fields(fields)(req, res, (error: any) =>
    {
       if(error instanceof multer.MulterError)
       {
            console.error('Multer error : ', error.message);
            res.status(400).send({ error: error.message });
            return;
       }

       if (error)
       {
            console.error('Unknown upload error : ', error);
            res.status(500).send({ error: 'An unknown error occurred during file upload.' });
            return;
       }

       next();
    });
}

export const uploadMiddleware = (fields: any[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        void handleUpload(req, res, next, fields);
    };
};