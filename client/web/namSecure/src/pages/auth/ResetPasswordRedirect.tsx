import {type ReactElement, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';

export function ResetPasswordRedirect(): ReactElement
{
    const [searchParams] = useSearchParams();
    const token: string | null = searchParams.get('token');

    useEffect(() =>
    {
        if (token)
        {
            window.location.href = `namsecure://ResetPassword?token=${token}`;
        }
    }, [token]);

    if(!token)
    {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Invalid token.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Redirecting to the app...</p>
        </div>
    );
}
