import multer from 'multer';
import sharp, {SharpOptions} from 'sharp';

const storage = multer.memoryStorage();
export const upload = multer(
{
    limits:
    {
        fileSize: parseInt(process.env.FILE_UPLOAD_SIZE_LIMIT || '10485760') // Default to 10MB
    },
    storage
});

export const saveImage = async (buffer: Buffer, name: string, dest: string): Promise<SharpOptions> =>
{
    return sharp(buffer)
        .jpeg()
        .toFile(`${dest}/${name}.jpeg`);
}

