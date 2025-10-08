import argon2 from 'argon2';

const PEPPER = process.env.HASH_PEPPER;

if (!PEPPER)
{
    console.error('PEPPER environment variable is not set.');
    throw new Error('PEPPER environment variable is not set.');
}

export async function hashPassword(password: string): Promise<string>
{
    return await argon2.hash(password + PEPPER);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean>
{
    return await argon2.verify(hash, password + PEPPER);
}
