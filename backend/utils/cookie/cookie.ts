import { Response } from 'express';

export function setTokenCookie(res: Response , token: string): void
{
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30d
  });
}