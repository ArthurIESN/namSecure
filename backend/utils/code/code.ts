import crypto from 'crypto';
import { hash as hashCode } from '../hash/hash.js';

export interface IVerificationCode
{
    code: string;
    hash: string;
    expires: Date;
}

export async function generateVerificationCode(): Promise<IVerificationCode>
{
    // random alphanumeric code of 6 characters
    const code: string = crypto.randomBytes(3).toString('hex').toUpperCase(); // 3 bytes = 6 hex characters
    const hash: string = await hashCode(code);
    const expires: Date = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {code, hash, expires};
}