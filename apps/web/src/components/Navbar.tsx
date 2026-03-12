import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    FolderKanban,
    Menu,
    X,
    LogIn,
    UserPlus,
    Zap,
    LogOut,
    User,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store'
import { clearCredentials, selectCurrentUser, selectIsAuthenticated } from '@/store/authSlice'
import { useLogoutMutation } from '@/api/authApi'
import { toast } from 'react-hot-toast'

interface NavLink {
    label: string
    to: string
    icon: React.ReactNode
}

const NAV_LINKS: NavLink[] = [
    { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={15} /> },
    { label: 'Projects', to: '/projects', icon: <FolderKanban size={15} /> },
]

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [logout] = useLogoutMutation()
    const isAuthenticated = useAppSelector(selectIsAuthenticated)
    const currentUser = useAppSelector(selectCurrentUser)

    const isActive = (to: string) => pathname === to

    async function handleLogout() {
        try {
            await logout().unwrap()
        } catch {
            // ignore errors, still clear local state
        } finally {
            dispatch(clearCredentials())
            toast.success('Logged out')
            setMobileOpen(false)
            navigate('/', { replace: true })
        }
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-base/80 backdrop-blur-md">
            <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">

                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-bold text-text-primary"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
                        <Zap size={14} strokeWidth={2.5} />
                    </span>
                    TaskFlow
                </Link>

                <ul className="hidden items-center gap-1 sm:flex">
                    {isAuthenticated && NAV_LINKS.map(({ label, to, icon }) => (
                        <li key={to}>
                            <Link
                                to={to}
                                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    isActive(to)
                                        ? 'bg-elevated text-text-primary'
                                        : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                                }`}
                            >
                                {icon}
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-2 sm:flex">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-text-secondary">
                                <User size={14} />
                                <span className="max-w-[160px] truncate">
                                    {currentUser?.email ?? 'Signed in'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                            >
                                <LogIn size={15} />
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                            >
                                <UserPlus size={15} />
                                Get started
                            </Link>
                        </>
                    )}
                </div>

                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary sm:hidden"
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </nav>

            {mobileOpen && (
                <div className="border-t border-border bg-surface px-4 pb-4 pt-3 sm:hidden">
                    <ul className="space-y-1">
                        {isAuthenticated && NAV_LINKS.map(({ label, to, icon }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                        isActive(to)
                                            ? 'bg-elevated text-text-primary'
                                            : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
                                    }`}
                                >
                                    {icon}
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text-secondary">
                                    <User size={14} />
                                    <span className="truncate">
                                        {currentUser?.email ?? 'Signed in'}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                                >
                                    <LogIn size={14} />
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                                >
                                    <UserPlus size={14} />
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
