import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useSearchQuery } from '@/api/searchApi'

export default function SearchResultsPage() {
    const [params] = useSearchParams()
    const query = useMemo(() => params.get('q')?.trim() ?? '', [params])

    const { data, isLoading, error } = useSearchQuery(query, {
        skip: query.length < 2,
    })

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Search</p>
                <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Results for "{query || '...'}"</h1>
                </div>
                <p className="text-sm text-muted-foreground">Search projects and tasks across your workspace.</p>
            </div>

            {query.length < 2 && (
                <Card>
                    <CardContent className="py-8 text-sm text-muted-foreground">
                        Enter at least 2 characters to search.
                    </CardContent>
                </Card>
            )}

            {query.length >= 2 && isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-20" />
                    ))}
                </div>
            )}

            {query.length >= 2 && (error || !data) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Unable to load search results</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Try again or adjust your search.
                    </CardContent>
                </Card>
            )}

            {query.length >= 2 && data && (
                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Projects</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.projects.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No projects found.</p>
                            ) : (
                                data.projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">{project.name}</p>
                                            <p className="text-xs text-muted-foreground">Status: {project.status}</p>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link to={`/projects/${project.id}`}>Open</Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tasks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {data.tasks.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No tasks found.</p>
                            ) : (
                                data.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Status: {task.status} · Priority: {task.priority}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link to={`/projects/${task.projectId}`}>View project</Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
