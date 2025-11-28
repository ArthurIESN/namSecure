import { Response } from 'express';

interface ICookieOptions
{
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge?: number;
    path?: string;
    domain?: string;
}

const cookieOptions: ICookieOptions =
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // @todo CHECK IF WORKS IN PRODUCTION
        maxAge: 30 * 24 * 60 * 60 * 1000,// 30d
        path: '/',
        ...(process.env.DOMAIN && { domain: process.env.DOMAIN }),
    }

export function setTokenCookie(res: Response , token: string): void
{
  res.cookie('token', token,
  {
    ...cookieOptions,
  });
}

export function clearTokenCookie(res: Response): void
{
    const { maxAge, ...clearOptions } = cookieOptions;
    res.clearCookie('token',
    {
        ...clearOptions,
    });
}