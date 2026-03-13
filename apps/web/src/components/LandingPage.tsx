import { Button } from '@/components/ui/button'
import AuthScreen from '@/components/AuthScreen'
import { ArrowRight, Sparkles } from 'lucide-react'

const features = [
    'Plan sprints, milestones, and releases in one place.',
    'Keep every project update visible to the whole team.',
    'Stay on track with lightweight, real-time progress reports.',
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                    </span>
                    TaskFlow
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost">Features</Button>
                    <Button variant="outline">Contact</Button>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-6xl gap-12 px-6 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        Launching your next project
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                            Ship client projects faster with a calm, focused workspace.
                        </h1>
                        <p className="text-base text-muted-foreground sm:text-lg">
                            TaskFlow keeps your team aligned with planning, visibility, and streamlined execution —
                            everything you need to deliver on time.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" className="gap-2">
                            Get started
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            View demo
                        </Button>
                    </div>

                    <div className="grid gap-3 rounded-2xl border border-border/60 bg-card p-6">
                        <p className="text-sm font-semibold">Why teams pick TaskFlow</p>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card/40 p-6 shadow-sm">
                    <div className="mb-4 space-y-1">
                        <p className="text-sm font-semibold">Sign in to continue</p>
                        <p className="text-xs text-muted-foreground">
                            Create an account in seconds, then jump into your dashboard.
                        </p>
                    </div>
                    <AuthScreen layout="embedded" />
                </div>
            </main>
        </div>
    )
}
