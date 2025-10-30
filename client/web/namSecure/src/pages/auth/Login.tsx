import { useAuth } from "@/context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {type FormEvent, useState} from "react";


export function Login()
{
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<string | null>(null);

    async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void>
    {
        e.preventDefault();
        try
        {
            await login(email, password);
            navigate('/dashboard');
        }
        catch (error: any)
        {
            setLoginError(error.response?.data?.error);
        }
    }

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className={cn("flex flex-col gap-6")}>
                    <Card className="w-full max-w-6xll">
                        <CardHeader className="space-y-4">
                            <CardTitle className="text-3xl">Login to your account</CardTitle>
                        </CardHeader>
                        <CardContent className="text-red-600 text-center">
                            <p>{loginError}</p>
                        </CardContent>
                        <CardContent>
                            <form onSubmit={handleLogin}>
                                <FieldGroup className="space-y-8">
                                    <Field>
                                        <FieldLabel htmlFor="email" className="text-base">Email</FieldLabel>
                                        <Input
                                            className="h-12 text-base"
                                            id="email"
                                            type="email"
                                            placeholder="mail@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password" className="text-base">Password</FieldLabel>
                                        </div>
                                        <Input
                                            className="h-12 text-base"
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required />
                                    </Field>
                                    <Field>
                                        <Button type="submit" className="w-full h-14 text-lg">Login</Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}