import argon2 from 'argon2';

const PEPPER: string = process.env.HASH_PEPPER || '';

if (!PEPPER)
{
    console.error('PEPPER environment variable is not set.');
    throw new Error('PEPPER environment variable is not set.');
}

const PEPPER_BUFFER: Buffer<ArrayBuffer> = Buffer.from(PEPPER);

export async function hash(value: string): Promise<string>
{
    return await argon2.hash(value, {secret: PEPPER_BUFFER});
}

export async function verifyHash(hash: string, value: string): Promise<boolean>
{
    return await argon2.verify(hash, value, {secret: PEPPER_BUFFER});
}
