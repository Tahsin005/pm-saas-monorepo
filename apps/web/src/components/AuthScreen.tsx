import { useMemo, useState } from 'react'
import { useLoginMutation, useRegisterMutation } from '@/api/authApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

function getErrorMessage(error: unknown) {
    const baseError = error as FetchBaseQueryError | undefined
    if (!baseError) return null
    if ('data' in baseError && baseError.data && typeof baseError.data === 'object') {
        const data = baseError.data as { error?: { message?: string } }
        return data?.error?.message ?? 'Something went wrong. Please try again.'
    }
    return 'Something went wrong. Please try again.'
}

export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [loginValues, setLoginValues] = useState({ email: '', password: '' })
    const [registerValues, setRegisterValues] = useState({ email: '', password: '' })
    const [login, loginState] = useLoginMutation()
    const [register, registerState] = useRegisterMutation()

    const errorMessage = useMemo(() => {
        return getErrorMessage(loginState.error) ?? getErrorMessage(registerState.error)
    }, [loginState.error, registerState.error])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome to TaskFlow</CardTitle>
                    <CardDescription>Sign in or create an account to continue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Sign in</TabsTrigger>
                            <TabsTrigger value="register">Create account</TabsTrigger>
                        </TabsList>

                        {errorMessage && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}

                        <TabsContent value="login" className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={loginValues.email}
                                    onChange={(event) =>
                                        setLoginValues((prev) => ({ ...prev, email: event.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    value={loginValues.password}
                                    onChange={(event) =>
                                        setLoginValues((prev) => ({ ...prev, password: event.target.value }))
                                    }
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => login(loginValues)}
                                disabled={loginState.isLoading}
                            >
                                {loginState.isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </TabsContent>

                        <TabsContent value="register" className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="register-email">Email</Label>
                                <Input
                                    id="register-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={registerValues.email}
                                    onChange={(event) =>
                                        setRegisterValues((prev) => ({ ...prev, email: event.target.value }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="register-password">Password</Label>
                                <Input
                                    id="register-password"
                                    type="password"
                                    value={registerValues.password}
                                    onChange={(event) =>
                                        setRegisterValues((prev) => ({ ...prev, password: event.target.value }))
                                    }
                                />
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => register(registerValues)}
                                disabled={registerState.isLoading}
                            >
                                {registerState.isLoading ? 'Creating account...' : 'Create account'}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
