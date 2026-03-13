import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Plus, ArrowUpRight, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import ProjectForm, { type ProjectFormValues } from '@/components/projects/ProjectForm'
import { useCreateProjectMutation, useListProjectsQuery } from '@/api/projectsApi'
import { PROJECT_STATUS_VALUES, type ProjectStatus } from '@repo/shared-types'

const PAGE_SIZE = 6

export default function ProjectsListPage() {
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)

    const queryArgs = useMemo(() => {
        return {
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            page,
            limit: PAGE_SIZE,
        }
    }, [statusFilter, page])

    const { data, isLoading, isFetching, error, refetch } = useListProjectsQuery(queryArgs)
    const [createProject, createState] = useCreateProjectMutation()

    const totalPages = data ? Math.max(1, data.meta.totalPages ?? 1) : 1

    const handleCreate = async (values: ProjectFormValues) => {
        try {
            await createProject(values).unwrap()
            toast.success('Project created')
            setCreateOpen(false)
        } catch (err) {
            toast.error('Unable to create project')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Projects</p>
                    <h1 className="text-2xl font-semibold">Your projects</h1>
                    <p className="text-sm text-muted-foreground">
                        Track all active client work and keep milestones visible.
                    </p>
                </div>
                <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                    <SheetTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New project
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                        <SheetHeader>
                            <SheetTitle>Create project</SheetTitle>
                            <SheetDescription>Add a new project to your workspace.</SheetDescription>
                        </SheetHeader>
                        <div className="px-4 pb-4">
                            <ProjectForm
                                submitLabel="Create project"
                                isSubmitting={createState.isLoading}
                                onSubmit={handleCreate}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => {
                        setStatusFilter('ALL')
                        setPage(1)
                    }}
                >
                    All
                </Button>
                {PROJECT_STATUS_VALUES.map((status) => (
                    <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? 'default' : 'outline'}
                        onClick={() => {
                            setStatusFilter(status)
                            setPage(1)
                        }}
                    >
                        {status}
                    </Button>
                ))}
                <Button size="sm" variant="ghost" className="gap-2" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>

            {error && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Unable to load projects</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Please check your connection or try again.
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-5/6" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : data && data.data.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-start gap-4 py-10">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold">No projects yet</p>
                            <p className="text-sm text-muted-foreground">
                                Create your first project to start organizing tasks and milestones.
                            </p>
                        </div>
                        <Button onClick={() => setCreateOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create project
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {data?.data.map((project) => (
                            <Card key={project.id} className="flex h-full flex-col">
                                <CardHeader className="space-y-2">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <CardTitle className="text-base">{project.name}</CardTitle>
                                            <p className="text-xs text-muted-foreground">{project.status}</p>
                                        </div>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-base"
                                        >
                                            <span className='text-base'>View</span>
                                            <ArrowUpRight className="h-3.5 w-3.5 text-base" />
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                                    <p>
                                        {project.description?.trim() || 'No description yet. Add notes for the team.'}
                                    </p>
                                    <div className="mt-auto text-xs">
                                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Page {data?.meta.page ?? page} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page <= 1 || isFetching}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={page >= totalPages || isFetching}
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
