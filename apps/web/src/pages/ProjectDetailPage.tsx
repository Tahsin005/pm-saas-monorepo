import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ArrowDown, ArrowLeft, ArrowUp, Pencil, Plus, Trash2 } from 'lucide-react'
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
import TaskForm, { type TaskFormValues } from '@/components/tasks/TaskForm'
import { useDeleteProjectMutation, useGetProjectQuery, useUpdateProjectMutation } from '@/api/projectsApi'
import {
    useCreateTaskMutation,
    useDeleteTaskMutation,
    useListTasksQuery,
    useUpdateTaskMutation,
    useUpdateTaskOrderMutation,
    useUpdateTaskStatusMutation,
} from '@/api/tasksApi'
import {
    TASK_PRIORITY_VALUES,
    TASK_STATUS_VALUES,
    type TaskPriority,
    type TaskSortField,
    type SortDir,
    type TaskStatus,
} from '@repo/shared-types'

export default function ProjectDetailPage() {
    const { projectId } = useParams()
    const navigate = useNavigate()
    const [editOpen, setEditOpen] = useState(false)
    const [createTaskOpen, setCreateTaskOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')
    const [tagFilter, setTagFilter] = useState('')
    const [overdueOnly, setOverdueOnly] = useState(false)
    const [sortField, setSortField] = useState<TaskSortField>('order')
    const [sortDir, setSortDir] = useState<SortDir>('asc')
    const [page, setPage] = useState(1)

    const { data, isLoading, error, refetch: refetchProject } = useGetProjectQuery(projectId ?? '', {
        skip: !projectId,
    })
    const [updateProject, updateState] = useUpdateProjectMutation()
    const [deleteProject, deleteState] = useDeleteProjectMutation()

    const taskQueryArgs = useMemo(() => {
        if (!projectId) return null
        return {
            projectId,
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
            tag: tagFilter.trim() || undefined,
            overdue: overdueOnly || undefined,
            sort: sortField,
            dir: sortDir,
            page,
            limit: 10,
        }
    }, [projectId, statusFilter, priorityFilter, tagFilter, overdueOnly, sortField, sortDir, page])

    const {
        data: taskData,
        isLoading: tasksLoading,
        isFetching: tasksFetching,
        error: tasksError,
    } = useListTasksQuery(taskQueryArgs ?? ({} as { projectId: string }), {
        skip: !taskQueryArgs,
    })

    const [createTask, createTaskState] = useCreateTaskMutation()
    const [updateTask, updateTaskState] = useUpdateTaskMutation()
    const [updateTaskStatus, updateTaskStatusState] = useUpdateTaskStatusMutation()
    const [updateTaskOrder, updateTaskOrderState] = useUpdateTaskOrderMutation()
    const [deleteTask, deleteTaskState] = useDeleteTaskMutation()

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

    const handleCreateTask = async (values: TaskFormValues) => {
        if (!projectId) return
        try {
            await createTask({
                projectId,
                data: {
                    title: values.title,
                    description: values.description ?? undefined,
                    status: values.status,
                    priority: values.priority,
                    dueAt: values.dueAt ?? undefined,
                    tags: values.tags,
                },
            }).unwrap()
            await refetchProject()
            toast.success('Task created')
            setCreateTaskOpen(false)
        } catch (err) {
            toast.error('Unable to create task')
        }
    }

    const handleUpdateTask = async (taskId: string, values: TaskFormValues) => {
        if (!projectId) return
        try {
            if (values.status) {
                await updateTaskStatus({ projectId, taskId, data: { status: values.status } }).unwrap()
            }
            await updateTask({
                projectId,
                taskId,
                data: {
                    title: values.title,
                    description: values.description ?? undefined,
                    priority: values.priority,
                    dueAt: values.dueAt ?? undefined,
                    tags: values.tags,
                },
            }).unwrap()
            await refetchProject()
            toast.success('Task updated')
        } catch (err) {
            toast.error('Unable to update task')
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        if (!projectId) return
        try {
            await deleteTask({ projectId, taskId }).unwrap()
            await refetchProject()
            toast.success('Task deleted')
        } catch (err) {
            toast.error('Unable to delete task')
        }
    }

    const handleStatusChange = async (taskId: string, status: TaskStatus) => {
        if (!projectId) return
        try {
            await updateTaskStatus({ projectId, taskId, data: { status } }).unwrap()
            await refetchProject()
        } catch (err) {
            toast.error('Unable to update status')
        }
    }

    const handleOrderChange = async (taskId: string, newOrder: number) => {
        if (!projectId) return
        try {
            await updateTaskOrder({ projectId, taskId, data: { order: newOrder } }).unwrap()
            await refetchProject()
        } catch (err) {
            toast.error('Unable to reorder task')
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
                    { label: 'To do', value: data.taskStats?.TODO ?? 0 },
                    { label: 'In progress', value: data.taskStats?.IN_PROGRESS ?? 0 },
                    { label: 'Done', value: data.taskStats?.DONE ?? 0 },
                    { label: 'Overdue', value: data.overdueCount ?? 0 },
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

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Completion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress</span>
                        <span>{data.completionPercent ?? 0}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                        <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${Math.min(100, Math.max(0, data.completionPercent ?? 0))}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle className="text-base">Tasks</CardTitle>
                            <p className="text-xs text-muted-foreground">Track the work happening in this project.</p>
                        </div>
                        <Sheet open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
                            <SheetTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    New task
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-md">
                                <SheetHeader>
                                    <SheetTitle>Create task</SheetTitle>
                                    <SheetDescription>Add a new task to this project.</SheetDescription>
                                </SheetHeader>
                                <div className="px-4 pb-4">
                                    <TaskForm
                                        submitLabel="Create task"
                                        isSubmitting={createTaskState.isLoading}
                                        onSubmit={handleCreateTask}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                size="sm"
                                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                                onClick={() => {
                                    setStatusFilter('ALL')
                                    setPage(1)
                                }}
                            >
                                All statuses
                            </Button>
                            {TASK_STATUS_VALUES.map((status) => (
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
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                size="sm"
                                variant={priorityFilter === 'ALL' ? 'default' : 'outline'}
                                onClick={() => {
                                    setPriorityFilter('ALL')
                                    setPage(1)
                                }}
                            >
                                All priorities
                            </Button>
                            {TASK_PRIORITY_VALUES.map((priority) => (
                                <Button
                                    key={priority}
                                    size="sm"
                                    variant={priorityFilter === priority ? 'default' : 'outline'}
                                    onClick={() => {
                                        setPriorityFilter(priority)
                                        setPage(1)
                                    }}
                                >
                                    {priority}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="task-tag" className="text-xs text-muted-foreground">Tag</label>
                            <input
                                id="task-tag"
                                value={tagFilter}
                                onChange={(event) => {
                                    setTagFilter(event.target.value)
                                    setPage(1)
                                }}
                                className="h-9 w-40 rounded-md border border-input bg-background px-3 text-sm"
                                placeholder="design"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input
                                type="checkbox"
                                checked={overdueOnly}
                                onChange={(event) => {
                                    setOverdueOnly(event.target.checked)
                                    setPage(1)
                                }}
                            />
                            Overdue only
                        </label>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Sort</label>
                            <select
                                value={sortField}
                                onChange={(event) => setSortField(event.target.value as TaskSortField)}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                {['order', 'priority', 'dueAt', 'createdAt', 'updatedAt'].map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-muted-foreground">Direction</label>
                            <select
                                value={sortDir}
                                onChange={(event) => setSortDir(event.target.value as SortDir)}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            >
                                <option value="asc">asc</option>
                                <option value="desc">desc</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {tasksError && (
                        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                            Unable to load tasks. Please try again.
                        </div>
                    )}

                    {tasksLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Skeleton key={index} className="h-20" />
                            ))}
                        </div>
                    ) : taskData && taskData.data.length === 0 ? (
                        <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-sm text-muted-foreground">
                            No tasks found for these filters. Create a task to get started.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {taskData?.data.map((task, index) => {
                                const prev = taskData.data[index - 1]
                                const next = taskData.data[index + 1]
                                const prevPrev = taskData.data[index - 2]
                                const nextNext = taskData.data[index + 2]
                                const isReordering =
                                    updateTaskOrderState.isLoading && updateTaskOrderState.originalArgs?.taskId === task.id

                                return (
                                    <div key={task.id} className="rounded-lg border border-border bg-background p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold">{task.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {task.description?.trim() || 'No description yet.'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                    <span>Status: {task.status}</span>
                                                    <span>Priority: {task.priority}</span>
                                                    {task.dueAt && (
                                                        <span>Due {new Date(task.dueAt).toLocaleDateString()}</span>
                                                    )}
                                                    {task.tags.length > 0 && (
                                                        <span>Tags: {task.tags.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        disabled={!prev || isReordering}
                                                        onClick={() => {
                                                            if (!prev) return
                                                            const newOrder = prevPrev
                                                                ? (prevPrev.order + prev.order) / 2
                                                                : prev.order - 1000
                                                            handleOrderChange(task.id, newOrder)
                                                        }}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        disabled={!next || isReordering}
                                                        onClick={() => {
                                                            if (!next) return
                                                            const newOrder = nextNext
                                                                ? (next.order + nextNext.order) / 2
                                                                : next.order + 1000
                                                            handleOrderChange(task.id, newOrder)
                                                        }}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {TASK_STATUS_VALUES.map((status) => (
                                                        <Button
                                                            key={status}
                                                            size="sm"
                                                            variant={task.status === status ? 'default' : 'outline'}
                                                            onClick={() => handleStatusChange(task.id, status)}
                                                            disabled={updateTaskStatusState.isLoading}
                                                        >
                                                            {status}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button size="sm" variant="outline">Edit</Button>
                                                    </SheetTrigger>
                                                    <SheetContent className="sm:max-w-md">
                                                        <SheetHeader>
                                                            <SheetTitle>Edit task</SheetTitle>
                                                            <SheetDescription>Update this task.</SheetDescription>
                                                        </SheetHeader>
                                                        <div className="px-4 pb-4">
                                                            <TaskForm
                                                                initialValues={{
                                                                    title: task.title,
                                                                    description: task.description ?? undefined,
                                                                    status: task.status,
                                                                    priority: task.priority,
                                                                    dueAt: task.dueAt ?? undefined,
                                                                    tags: task.tags,
                                                                }}
                                                                submitLabel="Save changes"
                                                                isSubmitting={updateTaskState.isLoading}
                                                                onSubmit={(values) => handleUpdateTask(task.id, values)}
                                                            />
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="text-destructive">
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete task?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the task.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteTask(task.id)}
                                                                disabled={deleteTaskState.isLoading}
                                                            >
                                                                {deleteTaskState.isLoading ? 'Deleting...' : 'Delete task'}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {taskData && taskData.meta.totalPages > 1 && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                Page {taskData.meta.page} of {taskData.meta.totalPages}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={taskData.meta.page <= 1 || tasksFetching}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                >
                                    Previous
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={taskData.meta.page >= taskData.meta.totalPages || tasksFetching}
                                    onClick={() => setPage((prev) => Math.min(taskData.meta.totalPages, prev + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
