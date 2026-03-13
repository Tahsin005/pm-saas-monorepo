import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useGetDashboardQuery } from '@/api/dashboardApi'

export default function DashboardPage() {
    const { data, isLoading, error } = useGetDashboardQuery()

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-48" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Unable to load dashboard</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    Please check your connection and try again.
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Overview</p>
                <h1 className="text-2xl font-semibold">Your workspace at a glance</h1>
                <p className="text-sm text-muted-foreground">Keep tabs on projects and tasks across the week.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: 'Total projects', value: data.projects.total },
                    { label: 'Active projects', value: data.projects.ACTIVE },
                    { label: 'Overdue tasks', value: data.tasks.overdue },
                    { label: 'Completed this week', value: data.tasks.completedThisWeek },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: 'To do', value: data.tasks.TODO },
                    { label: 'In progress', value: data.tasks.IN_PROGRESS },
                    { label: 'Done', value: data.tasks.DONE },
                ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs font-semibold text-muted-foreground">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Across all projects</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold">Quick links</p>
                        <p className="text-xs text-muted-foreground">Jump back into your most important work.</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <Link to="/projects">View projects</Link>
                    </Button>
                </div>
                <Separator />
                <div className="space-y-4 p-4">
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2">
                        <div>
                            <p className="text-sm font-semibold">Recent project</p>
                            <p className="text-xs text-muted-foreground">
                                {data.recentProject ? data.recentProject.name : 'No projects yet'}
                            </p>
                        </div>
                        {data.recentProject ? (
                            <Button size="sm" asChild>
                                <Link to={`/projects/${data.recentProject.id}`}>Open</Link>
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" asChild>
                                <Link to="/projects">Create</Link>
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2">
                        <div>
                            <p className="text-sm font-semibold">Task focus</p>
                            <p className="text-xs text-muted-foreground">
                                {data.tasks.overdue > 0
                                    ? `${data.tasks.overdue} overdue tasks need attention`
                                    : 'No overdue tasks right now'}
                            </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                            <Link to="/projects">Review</Link>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2">
                        <div>
                            <p className="text-sm font-semibold">Projects by status</p>
                            <p className="text-xs text-muted-foreground">
                                {data.projects.ACTIVE} active · {data.projects.COMPLETED} completed
                            </p>
                        </div>
                        <Button size="sm" variant="outline" asChild>
                            <Link to="/projects">View</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
