// Priority badge styles — matches TaskPriority enum: LOW | MEDIUM | HIGH | URGENT
const priorityStyle: Record<string, string> = {
    LOW: 'text-text-muted  border-border-subtle',
    MEDIUM: 'text-info        border-info',
    HIGH: 'text-warning     border-warning',
    URGENT: 'text-danger      border-danger',
}

export default function HeroSection() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base px-6 text-center">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent opacity-10 blur-[120px]" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-info opacity-10 blur-[100px]" />
            </div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-4 py-1.5 text-xs font-medium text-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Projects · Tasks · Priorities · Subtasks — all in one place
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl lg:text-7xl">
                From <span className="text-accent-text">TODO</span> to{' '}
                <span className="text-success">DONE</span>, without the noise
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                Organise work into projects, break them down into tasks with priorities and due
                dates, and track every sprint — all in a fast, distraction-free interface.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                    href="/register"
                    className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    Start a project free
                </a>
                <a
                    href="/login"
                    className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-elevated hover:text-text-primary"
                >
                    Sign in →
                </a>
            </div>

            <p className="mt-8 text-xs text-text-muted">
                Projects stay active, archived, or completed &nbsp;·&nbsp; Subtasks supported
                &nbsp;·&nbsp; Overdue tracking built-in
            </p>

            <div className="mt-16 w-full max-w-3xl rounded-xl border border-border bg-surface p-6 text-left shadow-2xl">
                <div className="mb-5 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-danger" />
                    <span className="h-3 w-3 rounded-full bg-warning" />
                    <span className="h-3 w-3 rounded-full bg-success" />
                    <span className="ml-3 flex-1 rounded-md bg-elevated px-3 py-1 text-xs text-text-muted">
                        taskflow.app/dashboard
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'To do', value: '12', color: 'text-text-primary' },
                        { label: 'In progress', value: '5', color: 'text-warning' },
                        { label: 'Done', value: '38', color: 'text-success' },
                        { label: 'Overdue', value: '2', color: 'text-danger' },
                    ].map(({ label, value, color }) => (
                        <div
                            key={label}
                            className="rounded-lg border border-border-subtle bg-elevated p-4"
                        >
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            <p className="mt-1 text-xs text-text-muted">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-5 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-success" />
                        <span className="text-sm font-semibold text-text-primary">
                            API Redesign
                        </span>
                        <span className="rounded-full border border-border-subtle bg-base px-2 py-0.5 text-xs text-text-muted">
                            ACTIVE
                        </span>
                    </div>
                    <span className="text-xs text-text-muted">3 of 4 tasks done this week</span>
                </div>

                <div className="space-y-2">
                    {[
                        {
                            title: 'Define project schema & Prisma models',
                            status: 'DONE',
                            priority: 'HIGH',
                            tags: ['backend'],
                        },
                        {
                            title: 'Implement JWT auth with refresh tokens',
                            status: 'DONE',
                            priority: 'URGENT',
                            tags: ['auth', 'security'],
                        },
                        {
                            title: 'Build task status + order endpoints',
                            status: 'IN_PROGRESS',
                            priority: 'HIGH',
                            tags: ['api'],
                        },
                        {
                            title: 'Write integration tests for projects',
                            status: 'TODO',
                            priority: 'MEDIUM',
                            tags: ['testing'],
                        },
                    ].map(({ title, status, priority, tags }) => (
                        <div
                            key={title}
                            className="flex items-start gap-3 rounded-md border border-border-subtle bg-base px-3 py-2.5"
                        >
                            <span
                                className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                                    status === 'DONE'
                                        ? 'border-success bg-success'
                                        : status === 'IN_PROGRESS'
                                          ? 'border-warning bg-transparent'
                                          : 'border-border bg-transparent'
                                }`}
                            />
                            <span
                                className={`flex-1 text-sm leading-snug ${
                                    status === 'DONE'
                                        ? 'text-text-muted line-through'
                                        : 'text-text-primary'
                                }`}
                            >
                                {title}
                            </span>
                            <div className="flex shrink-0 items-center gap-1.5">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-border-subtle bg-elevated px-2 py-0.5 text-xs text-text-muted"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                <span
                                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyle[priority]}`}
                                >
                                    {priority}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
