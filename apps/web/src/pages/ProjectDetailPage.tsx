import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import ProjectForm, { type ProjectFormValues } from '@/components/projects/ProjectForm'
import { useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from '@/api/projectsApi'

export default function ProjectDetailPage() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const [editOpen, setEditOpen] = useState(false)

    const { data, isLoading, error } = useGetProjectQuery(projectId ?? '', {
        skip: !projectId,
    })
    const [updateProject, updateState] = useUpdateProjectMutation()
    const [deleteProject, deleteState] = useDeleteProjectMutation()

    const initialValues = useMemo<ProjectFormValues | undefined>(() => {
        if (!data) return undefined
        return {
            name: data.name,
            description: data.description ?? undefined,
            status: data.status,
        }
    }, [data])

    const handleUpdate = async (values: ProjectFormValues) => {
        if (!projectId) return
        try {
            await updateProject({ id: projectId, data: values }).unwrap()
            toast.success('Project updated')
            setEditOpen(false)
        } catch (err) {
            toast.error('Unable to update project')
        }
    }

    const handleDelete = async () => {
        if (!projectId) return
        try {
            await deleteProject(projectId).unwrap()
            toast.success('Project deleted')
            navigate('/projects')
        } catch (err) {
            toast.error('Unable to delete project')
        }
    }

    if (!projectId) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Project not found</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link to="/projects">
                            Back to projects
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-40" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Unable to load project</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                    <p>Check your connection or try again later.</p>
                    <Button asChild variant="outline">
                        <Link to="/projects">Back to projects</Link>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                    <Link to="/projects" className="inline-flex items-center gap-2 text-xs">
                        <ArrowLeft className="h-4 w-4 text-base" />
                        <span className='text-base'>Back to projects</span>
                    </Link>
                    <h1 className="text-2xl font-semibold">{data.name}</h1>
                    <p className="text-sm text-muted-foreground">Status: {data.status}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="gap-2 text-destructive hover:text-destructive"
                                disabled={deleteState.isLoading}
                            >
                                <Trash2 className="h-4 w-4" />
                                {deleteState.isLoading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete project?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this project and its data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={deleteState.isLoading}>
                                    {deleteState.isLoading ? 'Deleting...' : 'Delete project'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Sheet open={editOpen} onOpenChange={setEditOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-md">
                            <SheetHeader>
                                <SheetTitle>Edit project</SheetTitle>
                                <SheetDescription>Update project details and status.</SheetDescription>
                            </SheetHeader>
                            <div className="px-4 pb-4">
                                <ProjectForm
                                    initialValues={initialValues}
                                    submitLabel="Save changes"
                                    isSubmitting={updateState.isLoading}
                                    onSubmit={handleUpdate}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Project overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{data.description?.trim() || 'Add a description to share context with the team.'}</p>
                    <div className="text-xs">Last updated {new Date(data.updatedAt).toLocaleString()}</div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: 'Total tasks', value: data.stats?.totalTasks ?? 0 },
                    { label: 'Completed', value: data.stats?.completedTasks ?? 0 },
                    { label: 'Overdue', value: data.stats?.overdueTasks ?? 0 },
                    { label: 'High priority', value: data.stats?.highPriorityTasks ?? 0 },
                ].map((item) => (
                    <Card key={item.label}>
                        <CardHeader>
                            <CardTitle className="text-sm text-muted-foreground">{item.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
