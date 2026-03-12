import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Menu, X, LogIn, UserPlus, Zap } from 'lucide-react'

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

    const isActive = (to: string) => pathname === to

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
                    {NAV_LINKS.map(({ label, to, icon }) => (
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
                        {NAV_LINKS.map(({ label, to, icon }) => (
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

                    <div className="mt-3 flex gap-2 border-t border-border pt-3">
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
                </div>
            )}
        </header>
    )
}
