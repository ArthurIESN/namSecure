import crypto from 'crypto';
import bcrypt from "bcrypt";

export interface IVerificationCode
{
    code: string;
    hash: string;
}

export async function generateVerificationCode(): Promise<IVerificationCode>
{
    // random alphanumeric code of 6 characters
    const code: string = crypto.randomBytes(3).toString('hex').toUpperCase(); // 3 bytes = 6 hex characters
    const hash: string = await bcrypt.hash(code, 12);

    return {code, hash};
}

async function sendVerificationCode(email: string, code: string): Promise<void> {
    // Simulate sending an email by logging to the console
    console.log(`Sending verification code ${code} to email: ${email}`);
}