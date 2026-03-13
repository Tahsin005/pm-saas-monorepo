import { Search, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLogoutMutation } from '@/api/authApi'
import { useAppSelector } from '@/store'
import { selectCurrentUser } from '@/store/authSlice'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export default function Navbar() {
    const [logout, logoutState] = useLogoutMutation()
    const user = useAppSelector(selectCurrentUser)
    const navigate = useNavigate()
    const location = useLocation()
    const [params] = useSearchParams()
    const [query, setQuery] = useState('')

    useEffect(() => {
        if (location.pathname !== '/search') return
        setQuery(params.get('q') ?? '')
    }, [location.pathname, params])

    useEffect(() => {
        if (location.pathname !== '/search') {
            setQuery('')
        }
    }, [location.pathname])

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
            <div className="flex h-14 items-center gap-4 px-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <SidebarTrigger className="md:hidden" />
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Zap size={16} />
                    </span>
                    TaskFlow
                </div>

                <div className="flex flex-1 items-center gap-2">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    const term = query.trim()
                                    if (term.length >= 2) {
                                        navigate(`/search?q=${encodeURIComponent(term)}`)
                                    }
                                }
                            }}
                            className="pl-9"
                            placeholder="Search projects and tasks"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                        <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-foreground">
                            {user?.email?.split('@')[0] ?? 'User'}
                        </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => logout()} disabled={logoutState.isLoading}>
                        {logoutState.isLoading ? 'Signing out...' : 'Sign out'}
                    </Button>
                </div>
            </div>
        </header>
    )
}