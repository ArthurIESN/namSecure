import { Response } from 'express';

export function setTokenCookie(res: Response , token: string): void
{
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // @todo CHECK IF WORKS IN PRODUCTION
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30d
  });
}