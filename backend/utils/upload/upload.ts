import multer, {Multer, StorageEngine} from 'multer';
import sharp, {SharpOptions} from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

const ROOT_DIRECTORY: string = path.resolve('.');

const storage: StorageEngine = multer.memoryStorage();

export const FILE_UPLOAD_SIZE_LIMIT: number = parseInt(process.env.FILE_UPLOAD_SIZE_LIMIT || '10485760'); // Default to 10MB

export const upload: Multer = multer(
{
    limits:
    {
        fileSize: FILE_UPLOAD_SIZE_LIMIT
    },
    storage
});

export const saveImage = async (buffer: ArrayBuffer, name: string, dest: string): Promise<SharpOptions> =>
{
    const fullPath: string = path.join(ROOT_DIRECTORY, dest);

    await fs.mkdir(fullPath, { recursive: true });

    console.debug(`Saving image to ${fullPath}/${name}.jpeg`);

    return sharp(Buffer.from(buffer))
        .jpeg()
        .toFile(`${fullPath}/${name}.jpeg`);
}

