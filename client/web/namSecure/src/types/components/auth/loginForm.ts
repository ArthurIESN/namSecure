import type {HTMLAttributes} from 'react';

export interface ILoginFormProps extends HTMLAttributes<HTMLDivElement>
{
    className?: string;
    onLogin: (email: string, password: string) => void;
}