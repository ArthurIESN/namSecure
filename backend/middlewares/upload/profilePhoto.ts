import multer from "multer";
import path from "path";
import {Request} from "express";
import fs from "fs";

// create the uploads directory if it doesn't exist

const uploadDir = 'uploads/profiles/';
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (_req,file,cb) => {
        // Generate a unique filename using timestamp and original name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase(); // ← Convertir en minuscule
        cb(null, `profile-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'));
    }
}

export const uploadProfilePhoto = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});


