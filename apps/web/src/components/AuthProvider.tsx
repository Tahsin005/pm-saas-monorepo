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
            <div className="flex min-h-screen items-center justify-center bg-base">
                <div className="flex flex-col items-center gap-4">
                    <span className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-accent text-white">
                        <Zap size={20} strokeWidth={2.5} />
                    </span>
                    <p className="text-sm text-text-muted">Loading…</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
