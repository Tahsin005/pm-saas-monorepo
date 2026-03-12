import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, LayoutDashboard, FolderKanban, LogIn, UserPlus } from 'lucide-react'

const FOOTER_LINKS = [
    {
        heading: 'Product',
        links: [
            { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={13} /> },
            { label: 'Projects', to: '/projects', icon: <FolderKanban size={13} /> },
        ],
    },
    {
        heading: 'Account',
        links: [
            { label: 'Sign in', to: '/login', icon: <LogIn size={13} /> },
            { label: 'Get started', to: '/register', icon: <UserPlus size={13} /> },
        ],
    },
]

export default function Footer() {
    return (
        <footer className="border-t border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

                <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

                    <div className="col-span-2 sm:col-span-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-text-primary"
                        >
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
                                <Zap size={14} strokeWidth={2.5} />
                            </span>
                            TaskFlow
                        </Link>
                        <p className="mt-3 max-w-xs text-xs leading-relaxed text-text-muted">
                            A minimal project management tool built around how developers
                            actually work — projects, tasks, priorities, and nothing else.
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                                className="text-text-muted transition-colors hover:text-text-primary"
                            >
                                <Github size={16} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter / X"
                                className="text-text-muted transition-colors hover:text-text-primary"
                            >
                                <Twitter size={16} />
                            </a>
                        </div>
                    </div>

                    {FOOTER_LINKS.map(({ heading, links }) => (
                        <div key={heading}>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
                                {heading}
                            </p>
                            <ul className="space-y-2">
                                {links.map(({ label, to, icon }) => (
                                    <li key={to}>
                                        <Link
                                            to={to}
                                            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
                                        >
                                            {icon}
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-6 sm:flex-row">
                    <p className="text-xs text-text-muted">
                        © {new Date().getFullYear()} TaskFlow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" />
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    )
}
