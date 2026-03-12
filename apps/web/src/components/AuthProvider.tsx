import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { useAppDispatch } from '@/store/index'
import { clearCredentials, setUser, setHydrating } from '@/store/authSlice'
import { useLazyGetMeQuery } from '@/api/authApi'

interface AuthProviderProps {
    children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const dispatch = useAppDispatch()
    const [getMe] = useLazyGetMeQuery()
    const [hydrating, setLocalHydrating] = useState(true)

    useEffect(() => {
        async function hydrate() {
            dispatch(setHydrating(true))
            try {
                // Attempt /me; baseQuery handles refresh on 401 and will retry.
                const user = await getMe().unwrap()
                dispatch(setUser(user))
            } catch {
                dispatch(clearCredentials())
            } finally {
                dispatch(setHydrating(false))
                setLocalHydrating(false)
            }
        }
        hydrate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (hydrating) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base">
                <div className="absolute inset-0 opacity-60">
                    <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                    <div className="absolute -right-20 bottom-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
                </div>

                <div className="relative flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl border border-border bg-surface/80 px-8 py-10 text-center shadow-lg">
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-md">
                        <span className="absolute inset-0 animate-ping rounded-2xl bg-accent/40" />
                        <Zap size={22} strokeWidth={2.5} className="relative" />
                    </span>

                    <div className="space-y-1">
                        <h2 className="text-base font-semibold text-text-primary">Warming up your workspace</h2>
                        <p className="text-sm text-text-muted">Syncing your latest projects and tasks…</p>
                    </div>

                    <div className="flex w-full items-center gap-1.5">
                        <span className="h-1 w-1/5 rounded-full bg-accent" />
                        <span className="h-1 w-1/5 rounded-full bg-accent/60" />
                        <span className="h-1 w-1/5 rounded-full bg-accent/40" />
                        <span className="h-1 w-1/5 rounded-full bg-accent/30" />
                        <span className="h-1 w-1/5 rounded-full bg-accent/20" />
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
