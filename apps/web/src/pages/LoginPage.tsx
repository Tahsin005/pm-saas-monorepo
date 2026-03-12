import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '@/store/index'
import { setCredentials } from '@/store/authSlice'
import { useLoginMutation } from '@/api/authApi'

export default function LoginPage() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [login, { isLoading, error }] = useLoginMutation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

    const serverError = error
        ? ((error as { data?: { message?: string } }).data?.message ?? 'Login failed')
        : null

    function validate() {
        const errors: typeof fieldErrors = {}
        if (!email) errors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email'
        if (!password) errors.password = 'Password is required'
        return errors
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errors = validate()
        if (Object.keys(errors).length) {
            setFieldErrors(errors)
            return
        }
        setFieldErrors({})
        try {
            const data = await login({ email, password }).unwrap()
            dispatch(setCredentials(data))
            toast.success('Welcome back!')
            navigate('/dashboard', { replace: true })
        } catch {
            toast.error(serverError ?? 'Login failed')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-base px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center gap-3">
                    <Link
                        to="/"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white"
                    >
                        <Zap size={20} strokeWidth={2.5} />
                    </Link>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-text-primary">Welcome back</h1>
                        <p className="mt-1 text-sm text-text-muted">Sign in to your TaskFlow account</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-surface p-6">
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        {serverError && (
                            <div className="rounded-lg border border-danger bg-danger-subtle px-3 py-2.5 text-sm text-danger">
                                {serverError}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-xs font-medium text-text-secondary"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                                />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className={`w-full rounded-lg border bg-elevated py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent ${
                                        fieldErrors.email ? 'border-danger focus:ring-danger' : 'border-border'
                                    }`}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-xs font-medium text-text-secondary"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                                />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full rounded-lg border bg-elevated py-2.5 pl-9 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent ${
                                        fieldErrors.password ? 'border-danger focus:ring-danger' : 'border-border'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-danger">{fieldErrors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                <LogIn size={15} />
                            )}
                            {isLoading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-accent-text hover:text-accent-hover">
                        Create one free
                    </Link>
                </p>
            </div>
        </div>
    )
}
